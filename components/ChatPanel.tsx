import React, { useEffect, useRef } from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface ChatPanelProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onApplySuggestion: (suggestion: string) => void;
  onAddToNote: (text: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isLoading, onApplySuggestion, onAddToNote }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-gray-700/50 text-center">
        <h2 className="text-xl font-semibold text-gray-200">Notepad AI Assistant</h2>
        <p className="text-sm text-gray-400 mt-1">Amplify your notes, refine them to perfection.</p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onApplySuggestion={onApplySuggestion} onAddToNote={onAddToNote} />
        ))}
         {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
           <div className="flex justify-start my-2" aria-label="AI is typing">
            <div className="p-3 bg-gray-700 rounded-r-xl rounded-t-xl flex items-center space-x-3">
              <span className="text-gray-300">Vocafyed is typing</span>
              <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-pulse" style={{animationDelay: '0s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
           </div>
         )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatPanel;