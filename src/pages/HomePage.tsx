import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// UUID v4 validation regex
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function HomePage() {
  const navigate = useNavigate();
  const [noteId, setNoteId] = useState('');
  const [error, setError] = useState('');

  const handleCreateNote = () => {
    const newNoteId = uuidv4();
    navigate(`/note/${newNoteId}`);
  };

  const handleRecoverNote = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedId = noteId.trim();
    if (!trimmedId) {
      setError('Por favor, ingresa un código de nota');
      return;
    }

    if (!UUID_V4_REGEX.test(trimmedId)) {
      setError('El código ingresado no es válido. Debe ser un UUID v4');
      return;
    }

    navigate(`/note/${trimmedId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 text-gray-900 dark:text-gray-100 text-center">
        FastNotes
      </h1>
      
      <div className="flex flex-col gap-6 w-full max-w-sm sm:max-w-md">
        <button
          onClick={handleCreateNote}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
        >
          Crear nota
        </button>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 dark:from-gray-700 to-transparent opacity-10 rounded-lg"></div>
          <form onSubmit={handleRecoverNote} className="flex flex-col gap-3">
            <div className="space-y-2">
              <input
                type="text"
                value={noteId}
                onChange={(e) => {
                  setNoteId(e.target.value);
                  setError('');
                }}
                placeholder="Ingresa el código de la nota"
                className="w-full px-4 py-3 rounded-lg bg-white/5 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
              />
              {error && (
                <p className="text-red-600 dark:text-red-400 text-sm px-1">
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Recuperar nota
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 