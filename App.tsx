
import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { createChat, sendMessageToChat } from './services/geminiService';
import type { ChatMessage, Note } from './types';
import Header from './components/Header';
import NoteEditor from './components/NoteEditor';
import ChatPanel from './components/ChatPanel';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isNoteVisible, setIsNoteVisible] = useState<boolean>(false); // Starts hidden
  const [deletingNotes, setDeletingNotes] = useState<Set<string>>(new Set());
  const [isNoteJustAdded, setIsNoteJustAdded] = useState<boolean>(false);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    try {
      chatRef.current = createChat();
      setMessages([
        { 
          id: 'initial-greeting', 
          role: 'model', 
          text: "How can I help you create more effective notes today? I'll turn your raw ideas into clear, structured, and impactful text, helping you refine your thoughts and save time."
        }
      ]);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Failed to initialize AI Assistant: ${e.message}`);
      } else {
        setError('An unknown error occurred during initialization.');
      }
    }
  }, []);

  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim() || !chatRef.current) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userInput,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    const combinedNoteContent = notes.map(note => note.content).join('\n\n');

    try {
      const aiResponseText = await sendMessageToChat(chatRef.current, combinedNoteContent, userInput);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: aiResponseText,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get response from AI: ${errorMessage}`);
      const errorResponseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: `Sorry, I encountered an error: ${errorMessage}`,
      };
      setMessages((prevMessages) => [...prevMessages, errorResponseMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFoldNote = () => {
    const combinedNoteContent = notes.map(note => note.content).join('\n\n');
    if (!combinedNoteContent.trim() || isLoading) return;
    handleSendMessage('Please summarize this note.');
  };

  const handleApplySuggestion = (suggestion: string) => {
    setNotes([{ id: Date.now().toString(), content: suggestion }]);
  };

  const handleAddToNote = (textToAdd: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: textToAdd,
    };
    setNotes(prevNotes => [...prevNotes, newNote]);
    
    // Trigger the glow effect
    setIsNoteJustAdded(true);
    setTimeout(() => {
      setIsNoteJustAdded(false);
    }, 1000); // Duration of the animation
  };
  
  const handleDeleteNote = (noteId: string) => {
    setDeletingNotes(prev => new Set(prev).add(noteId));

    setTimeout(() => {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      setDeletingNotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(noteId);
        return newSet;
      });
    }, 300); // Animation duration
  };

  const handleToggleNote = () => {
    setIsNoteVisible(prev => !prev);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <Header 
        isNoteVisible={isNoteVisible} 
        onToggleNote={handleToggleNote} 
        isNoteJustAdded={isNoteJustAdded} 
      />
      <main className="flex-1 flex flex-row p-4 md:p-8 gap-4 overflow-hidden">
        <div className="flex-1 min-w-0">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onApplySuggestion={handleApplySuggestion}
            onAddToNote={handleAddToNote}
          />
        </div>
        <div 
          className={`flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${isNoteVisible ? 'w-full sm:w-1/2 md:w-2/5 lg:w-1/3' : 'w-0'}`}
        >
          <NoteEditor
            notes={notes}
            onDeleteNote={handleDeleteNote}
            isLoading={isLoading}
            onFoldNote={handleFoldNote}
            deletingNoteIds={deletingNotes}
          />
        </div>
      </main>
      {error && (
        <div className="absolute bottom-4 right-4 bg-red-800 text-white p-4 rounded-lg shadow-lg">
          <p><strong>Error:</strong> {error}</p>
          <button onClick={() => setError(null)} className="absolute top-1 right-2 text-xl">&times;</button>
        </div>
      )}
    </div>
  );
};

export default App;