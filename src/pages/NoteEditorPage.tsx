import React from 'react';
import { useParams } from 'react-router-dom';
import { useNote } from '../hooks/useNote';

export function NoteEditorPage() {
  const { noteId } = useParams<{ noteId: string }>();
  const { content, isLoading, isSaving, error, updateContent } = useNote(noteId);

  const handleCopyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => console.log('URL copied to clipboard:', url),
      (err) => console.error('Error copying URL:', err)
    );
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateContent(event.target.value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-300">Cargando nota...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                FastNotes
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {noteId}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {isSaving ? 'Guardando...' : 'Guardado'}
              </span>
              <button
                onClick={handleCopyUrl}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              >
                Copiar URL
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Escribe tu nota aquí..."
            className="w-full h-full min-h-[calc(100vh-8rem)] p-4 border-0 focus:ring-0 text-gray-900 dark:text-white bg-transparent resize-none"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
} 