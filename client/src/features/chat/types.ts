export type ChatSender = 'user' | 'bot';

export interface ChatMessage {
  id: number;
  text: string;
  sender: ChatSender;
  timestamp: string;
  showChart?: boolean;
}

export interface ChatPreviewState {
  isOpen: boolean;
  messageId: number | null;
}

export interface ChatHookState {
  messages: ChatMessage[];
  input: string;
  isChatOpen: boolean;
  isLoading: boolean;
  isCreatingReport: boolean;
  isCreatingChart: boolean;
  preview: ChatPreviewState;
}
