import { useState, useCallback } from 'react';
import { ChatMessage, ChatHookState } from '../types';
import { postJson } from '../../../lib/http';
import { apiEndpoints } from '../../../config/api';

interface ApiChatMessage {
  role: string;
  content: string;
}

interface SendMessageRequest {
  messages: ApiChatMessage[];
  timestamp: string;
}

interface SendMessageResponse {
  message: string;
  timestamp: string;
  success: boolean;
}

interface CreateReportRequest {
  content: string;
  timestamp: string;
}

interface CreateReportResponse {
  code: string;
  timestamp: string;
  success: boolean;
}

interface CreateChartRequest {
  content: string;
  timestamp: string;
}

interface CreateChartResponse {
  code: string;
  timestamp: string;
  success: boolean;
}

export const useChat = () => {
  const [state, setState] = useState<ChatHookState>({
    messages: [],
    input: '',
    isChatOpen: false,
    isLoading: false,
    preview: {
      isOpen: false,
      code: null
    }
  });

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setState(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          ...message,
          id: Date.now() + Math.random(),
          timestamp: new Date().toISOString()
        }
      ]
    }));
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || state.isLoading) return;

    addMessage({
      text: message,
      sender: 'user'
    });

    setState(prev => ({
      ...prev,
      isLoading: true
    }));

    try {
      // メッセージ履歴を構築（最新のユーザーメッセージを含む）
      const allMessages: ApiChatMessage[] = [
        ...state.messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        {
          role: 'user',
          content: message
        }
      ];

      const response = await postJson<SendMessageResponse, SendMessageRequest>({
        url: apiEndpoints.chat,
        body: {
          messages: allMessages,
          timestamp: new Date().toISOString()
        }
      });

      addMessage({
        text: response.message,
        sender: 'bot'
      });
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        text: 'エラーが発生しました。しばらく待ってから再試行してください。',
        sender: 'bot'
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.isLoading, addMessage]);

  const createReport = useCallback(async (messageId: number) => {
    const message = state.messages.find(m => m.id === messageId);
    if (!message?.text) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await postJson<CreateReportResponse, CreateReportRequest>({
        url: apiEndpoints.createReport,
        body: {
          content: message.text,
          timestamp: new Date().toISOString()
        }
      });

      setState(prev => ({
        ...prev,
        preview: {
          isOpen: true,
          code: response.code
        }
      }));
    } catch (error) {
      console.error('Report creation error:', error);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.messages]);

  const createChart = useCallback(async (messageId: number) => {
    const message = state.messages.find(m => m.id === messageId);
    if (!message?.text) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await postJson<CreateChartResponse, CreateChartRequest>({
        url: apiEndpoints.createChart,
        body: {
          content: message.text,
          timestamp: new Date().toISOString()
        }
      });

      setState(prev => ({
        ...prev,
        preview: {
          isOpen: true,
          code: response.code
        }
      }));
    } catch (error) {
      console.error('Chart creation error:', error);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.messages]);

  const setInput = useCallback((value: string) => {
    setState(prev => ({ ...prev, input: value }));
  }, []);

  const toggleChat = useCallback(() => {
    setState(prev => ({ ...prev, isChatOpen: !prev.isChatOpen }));
  }, []);

  const closePreview = useCallback(() => {
    setState(prev => ({
      ...prev,
      preview: { isOpen: false, code: null }
    }));
  }, []);

  const openPreview = useCallback((code: string) => {
    setState(prev => ({
      ...prev,
      preview: { isOpen: true, code }
    }));
  }, []);

  return {
    ...state,
    sendMessage,
    createReport,
    createChart,
    setInput,
    toggleChat,
    closePreview,
    openPreview
  };
};