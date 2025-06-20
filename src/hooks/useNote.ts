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

  // Load or initialize note
  useEffect(() => {
    if (!noteId) return;

    console.log('Attempting to load or initialize note:', noteId);
    const noteRef = ref(database, `notes/${noteId}`);
    
    // Subscribe to real-time updates
    const unsubscribe = onValue(noteRef, async (snapshot) => {
      try {
        console.log('Received database update for note:', noteId);
        const data = snapshot.val();
        
        if (!snapshot.exists()) {
          console.log('Note does not exist, initializing:', noteId);
          // Initialize new note with empty content
          await set(noteRef, '');
          setState(prev => ({
            ...prev,
            content: '',
            isLoading: false,
            error: null
          }));
        } else {
          console.log('Note loaded successfully:', noteId);
          setState(prev => ({
            ...prev,
            content: data || '',
            isLoading: false,
            error: null
          }));
        }
      } catch (error) {
        console.error('Firebase operation error:', error);
        setState(prev => ({
          ...prev,
          error: `Error al acceder a la nota: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          isLoading: false
        }));
      }
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
      if (state.content === undefined) return; // Don't save if content is undefined

      try {
        console.log('Attempting to save note:', noteId);
        setState(prev => ({ ...prev, isSaving: true }));
        
        const noteRef = ref(database, `notes/${noteId}`);
        await set(noteRef, state.content);
        
        console.log('Note saved successfully:', noteId);
        setState(prev => ({ ...prev, isSaving: false, error: null }));
      } catch (error) {
        console.error('Firebase write error:', error);
        setState(prev => ({
          ...prev,
          error: `Error al guardar la nota: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          isSaving: false
        }));
      }
    }, 750); // 750ms debounce

    return () => clearTimeout(timeoutId);
  }, [noteId, state.content]);

  const updateContent = (newContent: string) => {
    if (state.isLoading) return; // Don't update while loading
    console.log('Updating note content, length:', newContent.length);
    setState(prev => ({ 
      ...prev, 
      content: newContent,
      error: null // Clear any previous errors
    }));
  };

  return {
    content: state.content,
    isLoading: state.isLoading,
    isSaving: state.isSaving,
    error: state.error,
    updateContent
  };
} 