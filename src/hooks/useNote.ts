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

  // Initialize new note
  useEffect(() => {
    if (!noteId) return;

    const initializeNote = async () => {
      try {
        const noteRef = ref(database, `notes/${noteId}`);
        await set(noteRef, '');
      } catch (error) {
        const errorMsg = `Error al crear la nota: ${error instanceof Error ? error.message : 'Error desconocido'}`;
        console.error('Error initializing note:', error);
        setState(prev => ({
          ...prev,
          error: errorMsg,
          isLoading: false
        }));
      }
    };

    initializeNote();
  }, [noteId]);

  // Subscribe to note changes
  useEffect(() => {
    if (!noteId) return;
    
    const noteRef = ref(database, `notes/${noteId}`);
    
    const unsubscribe = onValue(noteRef, (snapshot) => {
      try {
        const data = snapshot.val();
        setState(prev => ({
          ...prev,
          content: data ?? '', // Use nullish coalescing to handle null/undefined
          isLoading: false,
          error: null
        }));
      } catch (error) {
        const errorMsg = `Error al cargar la nota: ${error instanceof Error ? error.message : 'Error desconocido'}`;
        console.error('Error loading note:', error);
        setState(prev => ({
          ...prev,
          error: errorMsg,
          isLoading: false
        }));
      }
    }, (error) => {
      console.error('Error subscribing to note:', error);
      setState(prev => ({
        ...prev,
        error: `Error al conectar con la nota: ${error.message}`,
        isLoading: false
      }));
    });

    return () => {
      unsubscribe();
    };
  }, [noteId]);

  // Save note with debounce
  useEffect(() => {
    if (!noteId || state.isLoading) return;
    
    const timeoutId = setTimeout(async () => {
      if (state.content === undefined) return;

      setState(prev => ({ ...prev, isSaving: true, error: null }));
      
      try {
        const noteRef = ref(database, `notes/${noteId}`);
        await set(noteRef, state.content);
      } catch (error) {
        const errorMsg = `Error al guardar la nota: ${error instanceof Error ? error.message : 'Error desconocido'}`;
        console.error('Error saving note:', error);
        setState(prev => ({
          ...prev,
          error: errorMsg
        }));
      } finally {
        setState(prev => ({ ...prev, isSaving: false }));
      }
    }, 750);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [noteId, state.content]);

  const updateContent = (newContent: string) => {
    if (state.isLoading) return;
    setState(prev => ({ 
      ...prev, 
      content: newContent,
      error: null
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