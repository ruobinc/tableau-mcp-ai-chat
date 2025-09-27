export type ChatSender = 'user' | 'bot';

export interface ChatMessage {
  id: number;
  text: string;
  sender: ChatSender;
  timestamp: string;
  dashboardCode?: string;
  chartCode?: string;
  showChart?: boolean;
}

export interface ChatPreviewState {
  isOpen: boolean;
  code: string | null;
}

export interface ChatHookState {
  messages: ChatMessage[];
  input: string;
  isChatOpen: boolean;
  isLoading: boolean;
  preview: ChatPreviewState;
}