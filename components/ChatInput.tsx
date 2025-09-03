import React, { useState } from 'react';
import SendIcon from './icons/SendIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700/50">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for changes or suggestions..."
          disabled={isLoading}
          className="w-full bg-gray-800 border border-gray-600 rounded-full py-3 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-gray-200 placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-white shadow-lg transition-all duration-300 ease-in-out transform flex items-center justify-center h-10 w-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 enabled:bg-gradient-to-br enabled:from-purple-500 enabled:to-purple-700 enabled:hover:scale-110 enabled:active:scale-100 enabled:hover:from-purple-600 enabled:hover:to-purple-800 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? <SpinnerIcon /> : <SendIcon className="w-5 h-5 text-white" />}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;