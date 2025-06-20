import { useState, useEffect } from 'react';
import { ref, onValue, set, get } from 'firebase/database';
import { db } from '../lib/firebase';

interface NoteState {
  content: string;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
}

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

    const noteRef = ref(db, `notes/${noteId}`);
    
    // Subscribe to real-time updates
    const unsubscribe = onValue(noteRef, (snapshot) => {
      const data = snapshot.val();
      setState(prev => ({
        ...prev,
        content: data || '',
        isLoading: false,
        error: !data && prev.content === '' ? 'Nota no encontrada' : null
      }));
    }, (error) => {
      setState(prev => ({
        ...prev,
        error: 'Error al cargar la nota',
        isLoading: false
      }));
      console.error('Error loading note:', error);
    });

    return () => unsubscribe();
  }, [noteId]);

  // Save note with debounce
  useEffect(() => {
    if (!noteId || state.isLoading || state.error) return;

    const timeoutId = setTimeout(async () => {
      try {
        setState(prev => ({ ...prev, isSaving: true }));
        await set(ref(db, `notes/${noteId}`), state.content);
        setState(prev => ({ ...prev, isSaving: false }));
      } catch (error) {
        console.error('Error saving note:', error);
        setState(prev => ({
          ...prev,
          error: 'Error al guardar la nota',
          isSaving: false
        }));
      }
    }, 750); // 750ms debounce

    return () => clearTimeout(timeoutId);
  }, [noteId, state.content, state.isLoading]);

  const updateContent = (newContent: string) => {
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