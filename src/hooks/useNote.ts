import { useState, useEffect } from 'react';
import { ref, onValue, set, Database } from 'firebase/database';
import { validate as uuidValidate } from 'uuid';
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

  // Validate noteId before using it
  const isValidNoteId = noteId && uuidValidate(noteId);

  // Initialize new note
  useEffect(() => {
    if (!isValidNoteId) {
      setState(prev => ({
        ...prev,
        error: 'ID de nota inválido',
        isLoading: false
      }));
      return;
    }

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
  }, [noteId, isValidNoteId]);

  // Subscribe to note changes
  useEffect(() => {
    if (!isValidNoteId) return;
    
    const noteRef = ref(database, `notes/${noteId}`);
    console.log('Creating database reference for path:', `notes/${noteId}`);
    
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
  }, [noteId, isValidNoteId]);

  // Save note with debounce
  useEffect(() => {
    if (!isValidNoteId || state.isLoading) return;
    
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
  }, [noteId, state.content, isValidNoteId]);

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