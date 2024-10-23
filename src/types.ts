export interface ImageUrl {
  url: string;
  detail?: 'low' | 'high' | 'auto';
}

export interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: ImageUrl;
}

export interface Message {
  role: 'user' | 'assistant';
  content: MessageContent[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}