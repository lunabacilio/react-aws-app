'use client';

import { useState, useEffect } from 'react';

export default function StickyNotesApp() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Cargar notas del localStorage al iniciar
  useEffect(() => {
    const savedNotes = localStorage.getItem('stickyNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Guardar notas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('stickyNotes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.trim() !== '') {
      const note = {
        id: Date.now(),
        text: newNote,
        color: getRandomColor(),
        createdAt: new Date().toLocaleString()
      };
      setNotes([...notes, note]);
      setNewNote('');
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim() !== '') {
      setNotes(notes.map(note => 
        note.id === editingId ? { ...note, text: editText } : note
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const getRandomColor = () => {
    const colors = [
      'bg-yellow-200',
      'bg-pink-200', 
      'bg-blue-200',
      'bg-green-200',
      'bg-purple-200',
      'bg-orange-200'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addNote();
    }
  };

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            📝 Sticky Notes
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Crea y organiza tus notas de forma sencilla
          </p>
        </header>

        {/* Add Note Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu nota aquí..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={addNote}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No hay notas aún
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Crea tu primera nota escribiendo arriba
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`${note.color} p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow relative group`}
              >
                {/* Delete Button */}
                <button
                  onClick={() => deleteNote(note.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-opacity"
                >
                  ×
                </button>

                {/* Note Content */}
                {editingId === note.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={handleEditKeyPress}
                      className="w-full p-2 text-gray-800 bg-white/50 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={saveEdit}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => startEdit(note.id, note.text)}
                    className="cursor-pointer"
                  >
                    <p className="text-gray-800 font-medium mb-2 break-words">
                      {note.text}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      {note.createdAt}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            Tienes {notes.length} nota{notes.length !== 1 ? 's' : ''} • 
            Haz clic en una nota para editarla
          </p>
        </footer>
      </div>
    </div>
  );
}
