
export type MessageRole = 'user' | 'model';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
}

export interface Note {
  id: string;
  content: string;
}
