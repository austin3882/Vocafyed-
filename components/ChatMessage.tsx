import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import ApplyIcon from './icons/ApplyIcon';
import AddToNoteIcon from './icons/AddToNoteIcon';

interface ChatMessageProps {
  message: ChatMessageType;
  onApplySuggestion?: (suggestion: string) => void;
  onAddToNote?: (text: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onApplySuggestion, onAddToNote }) => {
  const { role, text } = message;
  const isUser = role === 'user';

  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-purple-600 text-white rounded-l-xl rounded-t-xl'
    : 'bg-gray-700 text-gray-200 rounded-r-xl rounded-t-xl';

  if (isUser) {
    return (
      <div className={`my-2 ${containerClasses} animate-bubbleInUser`}>
        <div className={`p-3 max-w-lg lg:max-w-xl xl:max-w-2xl whitespace-pre-wrap ${bubbleClasses}`}>
          {text}
        </div>
      </div>
    );
  }

  // --- Model Message Rendering ---
  const codeBlockRegex = /```(?:\w*\n)?([\s\S]+?)```/;
  const match = text.match(codeBlockRegex);

  const handleAddToNote = () => {
    if (!onAddToNote) return;
    if (match) {
      onAddToNote(match[1].trim());
    } else {
      onAddToNote(text);
    }
  };

  const renderContentWithSuggestion = () => {
    if (!onApplySuggestion || !match) return <p className="whitespace-pre-wrap">{text}</p>;

    const suggestion = match[1].trim();
    const preText = text.substring(0, match.index);
    const postText = text.substring(match.index! + match[0].length);

    return (
      <>
        {preText.trim() && <p className="whitespace-pre-wrap mb-2">{preText.trim()}</p>}
        <div
          onClick={() => onApplySuggestion(suggestion)}
          className="group/suggestion relative bg-gray-800/70 p-4 rounded-lg cursor-pointer border border-gray-600 hover:border-purple-500 transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onApplySuggestion(suggestion);
            }
          }}
          aria-label="Apply this suggestion to your note"
        >
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/suggestion:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2 text-white transform scale-90 group-hover/suggestion:scale-100 transition-transform duration-300 ease-in-out">
              <ApplyIcon className="w-6 h-6" />
              <span>Apply to Note</span>
            </div>
          </div>
          <pre className="whitespace-pre-wrap text-gray-300 font-sans">{suggestion}</pre>
        </div>
        {postText.trim() && <p className="whitespace-pre-wrap mt-2">{postText.trim()}</p>}
      </>
    );
  };

  return (
    <div className={`my-2 group ${containerClasses}`}>
      <div className="flex items-center gap-2">
        <div className={`p-3 max-w-lg lg:max-w-xl xl:max-w-2xl ${bubbleClasses}`}>
          {match ? renderContentWithSuggestion() : <p className="whitespace-pre-wrap">{text}</p>}
        </div>
        {onAddToNote && (
          <button
            onClick={handleAddToNote}
            title="Add to Note"
            aria-label="Add content from this message to your note"
            className="p-2 rounded-full bg-gray-800 text-gray-400 transition-all duration-300 ease-in-out transform hover:scale-125 active:scale-115 active:brightness-125 hover:text-white hover:bg-gradient-to-br hover:from-green-500 hover:to-green-600 hover:shadow-lg hover:shadow-green-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500"
          >
            <AddToNoteIcon className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;