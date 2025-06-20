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
        console.log('Initializing new note:', {
          id: noteId,
          database: database.type,
          app: database.app.name
        });

        const noteRef = ref(database, `notes/${noteId}`);
        await set(noteRef, '');
        console.log('Note initialized successfully:', noteId);
      } catch (error) {
        const errorMsg = `Error al crear la nota: ${error instanceof Error ? error.message : 'Error desconocido'}`;
        console.error('Error initializing note:', {
          error,
          noteId,
          database: database.type
        });
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

    console.log('Setting up note subscription:', {
      id: noteId,
      database: database.type
    });
    
    const noteRef = ref(database, `notes/${noteId}`);
    
    const unsubscribe = onValue(noteRef, (snapshot) => {
      try {
        console.log('Received database update:', {
          id: noteId,
          exists: snapshot.exists(),
          value: snapshot.val()
        });
        
        const data = snapshot.val();
        
        setState(prev => ({
          ...prev,
          content: data ?? '', // Use nullish coalescing to handle null/undefined
          isLoading: false,
          error: null
        }));
      } catch (error) {
        const errorMsg = `Error al cargar la nota: ${error instanceof Error ? error.message : 'Error desconocido'}`;
        console.error('Firebase read error:', {
          error,
          noteId,
          snapshot: snapshot.exists()
        });
        setState(prev => ({
          ...prev,
          error: errorMsg,
          isLoading: false
        }));
      }
    }, (error) => {
      console.error('Firebase subscription error:', {
        error,
        noteId,
        database: database.type
      });
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
    
    console.log('Save effect triggered:', {
      id: noteId,
      contentLength: state.content?.length ?? 0,
      isLoading: state.isLoading,
      isSaving: state.isSaving,
      database: database.type
    });

    const timeoutId = setTimeout(async () => {
      // Skip save if content is undefined
      if (state.content === undefined) {
        console.log('Skipping save - content is undefined');
        return;
      }

      setState(prev => ({ ...prev, isSaving: true, error: null }));
      
      try {
        const noteRef = ref(database, `notes/${noteId}`);
        
        console.log('Attempting to save note:', {
          id: noteId,
          ref: noteRef.toString(),
          contentLength: state.content.length,
          contentPreview: state.content.substring(0, 100) + '...',
          database: database.type
        });

        await set(noteRef, state.content);
        
        console.log('Note saved successfully:', {
          id: noteId,
          contentLength: state.content.length
        });
      } catch (error) {
        const errorMsg = `Error al guardar la nota: ${error instanceof Error ? error.message : 'Error desconocido'}`;
        console.error('Firebase write error:', {
          error,
          noteId,
          contentLength: state.content.length,
          database: database.type
        });
        
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
    
    console.log('Updating note content:', {
      id: noteId,
      oldLength: state.content?.length ?? 0,
      newLength: newContent.length,
      database: database.type
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