import React from 'react';
import NoteIcon from './icons/NoteIcon';
import ArrowIcon from './icons/ArrowIcon';

interface HeaderProps {
  isNoteVisible: boolean;
  onToggleNote: () => void;
  isNoteJustAdded: boolean;
}

const Header: React.FC<HeaderProps> = ({ isNoteVisible, onToggleNote, isNoteJustAdded }) => {
  return (
    <header className="p-4 border-b border-gray-700/50 shadow-lg flex items-center justify-center">
      <div className="flex items-center gap-4">
        <h1 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-100 whitespace-nowrap ${isNoteJustAdded ? 'animate-glow-pulse' : ''}`}>
          Vocafyed Notepad
        </h1>
        <ArrowIcon className="w-8 h-8 text-cyan-400 animate-gentle-pulse" />
        <button
          onClick={onToggleNote}
          title={isNoteVisible ? 'Hide Notebook' : 'Show Notebook'}
          aria-label={isNoteVisible ? 'Hide Notebook' : 'Show Notebook'}
          className={`p-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 ${isNoteVisible ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
        >
          <NoteIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;