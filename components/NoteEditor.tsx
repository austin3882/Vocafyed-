import React from 'react';
import FoldIcon from './icons/FoldIcon';
import CloseIcon from './icons/CloseIcon';
import NoteIcon from './icons/NoteIcon';
import type { Note } from '../types';

interface NoteEditorProps {
  notes: Note[];
  isLoading: boolean;
  onFoldNote: () => void;
  onDeleteNote: (id: string) => void;
  deletingNoteIds: Set<string>;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ notes, isLoading, onFoldNote, onDeleteNote, deletingNoteIds }) => {
  return (
    <div className="flex flex-col h-full bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-gray-700/50 flex items-center justify-center relative">
        <h2 className="text-xl font-semibold text-center text-gray-200">Your Notebook</h2>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <button
              onClick={onFoldNote}
              disabled={isLoading || notes.length === 0}
              title="Summarize the note with AI"
              className="p-2 rounded-full text-gray-400 transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-100 enabled:hover:bg-gray-700 enabled:hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed disabled:transform-none"
              aria-label="Summarize Note"
            >
              <FoldIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
      <div className="flex-1 w-full p-4 overflow-y-auto space-y-3">
        {notes.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-center p-4">
             <NoteIcon className="w-12 h-12 text-gray-600 mb-4" />
             <h3 className="text-lg font-semibold text-gray-400">Your canvas awaits</h3>
             <p className="text-gray-500 mt-1">Add notes from the chat or apply suggestions to start building.</p>
           </div>
        ) : (
          notes.map(note => {
            const isDeleting = deletingNoteIds.has(note.id);
            return (
              <div key={note.id} className={`relative bg-gray-900/50 p-4 rounded-lg border border-gray-700 group ${isDeleting ? 'animate-noteOut' : 'animate-noteIn'}`}>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="absolute top-2 right-2 p-1 bg-gray-700 text-gray-400 rounded-full opacity-50 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-200"
                  aria-label="Delete note"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
                <p className="text-gray-200 whitespace-pre-wrap pr-6">
                  {note.content}
                </p>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
};

export default NoteEditor;