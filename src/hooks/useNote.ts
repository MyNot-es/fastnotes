import { useState, useEffect } from 'react';
import { ref, onValue, set, Database } from 'firebase/database';
import { db } from '../lib/firebase';

interface NoteState {
  content: string;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
}

// Ensure db is properly typed
const database: Database = db;

export function useNote(noteId: string | undefined) {
  const [state, setState] = useState<NoteState>({
    content: '',
    isLoading: Boolean(noteId),
    error: null,
    isSaving: false
  });

  // Load note
  useEffect(() => {
    if (!noteId) return;

    console.log('Attempting to load note:', noteId);
    const noteRef = ref(database, `notes/${noteId}`);
    
    // Subscribe to real-time updates
    const unsubscribe = onValue(noteRef, (snapshot) => {
      console.log('Received database update for note:', noteId);
      const data = snapshot.val();
      setState(prev => ({
        ...prev,
        content: data || '',
        isLoading: false,
        error: !data && prev.content === '' ? 'Nota no encontrada' : null
      }));
    }, (error) => {
      console.error('Firebase read error:', error);
      setState(prev => ({
        ...prev,
        error: `Error al cargar la nota: ${error.message}`,
        isLoading: false
      }));
    });

    return () => {
      console.log('Cleaning up note subscription:', noteId);
      unsubscribe();
    };
  }, [noteId]);

  // Save note with debounce
  useEffect(() => {
    if (!noteId || state.isLoading || state.error) return;

    const timeoutId = setTimeout(async () => {
      try {
        console.log('Attempting to save note:', noteId);
        setState(prev => ({ ...prev, isSaving: true }));
        
        const noteRef = ref(database, `notes/${noteId}`);
        await set(noteRef, state.content);
        
        console.log('Note saved successfully:', noteId);
        setState(prev => ({ ...prev, isSaving: false }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Firebase write error:', error);
        setState(prev => ({
          ...prev,
          error: `Error al guardar la nota: ${errorMessage}`,
          isSaving: false
        }));
      }
    }, 750); // 750ms debounce

    return () => clearTimeout(timeoutId);
  }, [noteId, state.content, state.isLoading]);

  const updateContent = (newContent: string) => {
    console.log('Updating note content, length:', newContent.length);
    setState(prev => ({ ...prev, content: newContent }));
  };

  return {
    content: state.content,
    isLoading: state.isLoading,
    isSaving: state.isSaving,
    error: state.error,
    updateContent
  };
} 