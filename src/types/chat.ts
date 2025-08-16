export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  imageData?: string;
}

export interface ConversationMessage {
  sender: 'user' | 'assistant';
  text: string;
}

export interface ChatHistory {
  messages: ConversationMessage[];
}
