import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { useNote } from '../hooks/useNote';

export default function NoteEditorPage() {
  const { id } = useParams();
  const { content, isLoading, isSaving, error, updateContent } = useNote(id);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyId = async () => {
    if (!id) return;

    try {
      // Try the modern API first
      await navigator.clipboard.writeText(id);
      setCopySuccess(true);
    } catch (err) {
      // Fallback to the older API
      const textArea = document.createElement('textarea');
      textArea.value = id;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
      } catch (err) {
        console.error('Error al copiar:', err);
      }
      document.body.removeChild(textArea);
    }

    // Reset success message after 2 seconds
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          Editor de Notas
        </h1>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="text-gray-500 dark:text-gray-400">
            {isLoading && 'Cargando...'}
            {isSaving && 'Guardando...'}
            {!isLoading && !isSaving && 'Guardado'}
          </div>

          {id && (
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
              <span className="text-gray-700 dark:text-gray-300 font-mono text-sm">
                {id}
              </span>
              <button
                onClick={handleCopyId}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors relative group"
                aria-label="Copiar ID"
              >
                {copySuccess ? (
                  <FiCheck className="text-green-500" size={18} />
                ) : (
                  <FiCopy className="text-gray-500 dark:text-gray-400" size={18} />
                )}
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {copySuccess ? '¡Copiado!' : 'Copiar ID'}
                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      {error ? (
        <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-[calc(100vh-8rem)]">
          <textarea
            value={content}
            onChange={(e) => updateContent(e.target.value)}
            placeholder="Escribe tu nota aquí..."
            className="flex-1 w-full p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:outline-none resize-none text-base sm:text-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
} 