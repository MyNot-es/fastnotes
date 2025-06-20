import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

const HomePage = () => {
  const [noteId, setNoteId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreateNote = () => {
    try {
      const newNoteId = uuidv4();
      console.log('Creating new note with ID:', newNoteId);
      navigate(`/nota/${newNoteId}`);
    } catch (error) {
      console.error('Error creating note:', error);
      setError('Error al crear la nota. Por favor, intenta de nuevo.');
    }
  };

  const handleNoteIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNoteId(value);
    if (error) setError(null); // Clear error when user types
  };

  const handleNoteIdSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const trimmedId = noteId.trim();
    if (!trimmedId) {
      setError('Por favor, ingresa un código de nota.');
      return;
    }

    if (!uuidValidate(trimmedId)) {
      setError('El código ingresado no es válido.');
      return;
    }

    console.log('Navigating to existing note:', trimmedId);
    navigate(`/nota/${trimmedId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            FastNotes
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Crea o recupera una nota al instante
          </p>
        </div>

        <div className="space-y-6">
          <button
            type="button"
            onClick={handleCreateNote}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            Crear nueva nota
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                O
              </span>
            </div>
          </div>

          <form onSubmit={handleNoteIdSubmit} className="space-y-4">
            <div>
              <label htmlFor="noteId" className="sr-only">
                Código de la nota
              </label>
              <input
                id="noteId"
                type="text"
                value={noteId}
                onChange={handleNoteIdChange}
                placeholder="Ingresa el código de la nota"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                autoComplete="off"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
            >
              Recuperar nota
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 