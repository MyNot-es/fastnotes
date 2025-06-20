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
        console.log('Initializing new note:', noteId);
        const noteRef = ref(database, `notes/${noteId}`);
        await set(noteRef, '');
        console.log('Note initialized successfully:', noteId);
      } catch (error) {
        console.error('Error initializing note:', error);
        setState(prev => ({
          ...prev,
          error: `Error al crear la nota: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          isLoading: false
        }));
      }
    };

    initializeNote();
  }, [noteId]);

  // Subscribe to note changes
  useEffect(() => {
    if (!noteId) return;

    console.log('Setting up note subscription:', noteId);
    const noteRef = ref(database, `notes/${noteId}`);
    
    const unsubscribe = onValue(noteRef, (snapshot) => {
      try {
        console.log('Received database update for note:', noteId);
        const data = snapshot.val();
        
        setState(prev => ({
          ...prev,
          content: data ?? '', // Use nullish coalescing to handle null/undefined
          isLoading: false,
          error: null
        }));
      } catch (error) {
        console.error('Firebase read error:', error);
        setState(prev => ({
          ...prev,
          error: `Error al cargar la nota: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          isLoading: false
        }));
      }
    }, (error) => {
      console.error('Firebase subscription error:', error);
      setState(prev => ({
        ...prev,
        error: `Error al conectar con la nota: ${error.message}`,
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
    if (!noteId || state.isLoading) return;
    
    // Log the current state for debugging
    console.log('Save effect triggered:', {
      noteId,
      contentLength: state.content?.length ?? 0,
      isLoading: state.isLoading,
      isSaving: state.isSaving
    });

    const timeoutId = setTimeout(async () => {
      // Skip save if content is undefined
      if (state.content === undefined) {
        console.log('Skipping save - content is undefined');
        return;
      }

      // Set saving state
      setState(prev => ({ ...prev, isSaving: true }));
      
      try {
        console.log('Attempting to save note:', {
          noteId,
          contentLength: state.content.length,
          content: state.content.substring(0, 100) + '...' // Log first 100 chars for debugging
        });

        const noteRef = ref(database, `notes/${noteId}`);
        await set(noteRef, state.content);
        
        console.log('Note saved successfully:', noteId);
        setState(prev => ({ ...prev, isSaving: false, error: null }));
      } catch (error) {
        console.error('Firebase write error:', {
          error,
          noteId,
          contentLength: state.content.length
        });
        
        setState(prev => ({
          ...prev,
          error: `Error al guardar la nota: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          isSaving: false
        }));
      }
    }, 750); // 750ms debounce

    return () => {
      clearTimeout(timeoutId);
    };
  }, [noteId, state.content]);

  const updateContent = (newContent: string) => {
    if (state.isLoading) return;
    
    console.log('Updating note content:', {
      noteId,
      oldLength: state.content?.length ?? 0,
      newLength: newContent.length
    });
    
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