import { useCallback, useState } from 'react';

import { apiEndpoints } from '../../../config/api';
import { postJson } from '../../../lib/http';
import { generateId, generateTimestamp } from '../../../utils/date';
import { ChatHookState, ChatMessage } from '../types';

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
    isCreatingReport: false,
    isCreatingChart: false,
    preview: {
      isOpen: false,
      code: null,
    },
  });

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          ...message,
          id: generateId(),
          timestamp: generateTimestamp(),
        },
      ],
    }));
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || state.isLoading) return;

      addMessage({
        text: message,
        sender: 'user',
      });

      setState((prev) => ({
        ...prev,
        isLoading: true,
      }));

      try {
        // メッセージ履歴を構築（最新のユーザーメッセージを含む）
        const allMessages: ApiChatMessage[] = [
          ...state.messages.map((msg) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text,
          })),
          {
            role: 'user',
            content: message,
          },
        ];

        const response = await postJson<SendMessageResponse, SendMessageRequest>({
          url: apiEndpoints.chat,
          body: {
            messages: allMessages,
            timestamp: generateTimestamp(),
          },
        });

        addMessage({
          text: response.message,
          sender: 'bot',
        });
      } catch (error) {
        console.error('Chat error:', error);
        addMessage({
          text: 'エラーが発生しました。しばらく待ってから再試行してください。',
          sender: 'bot',
        });
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [state.isLoading, state.messages, addMessage]
  );

  const updateMessage = useCallback((messageId: number, updates: Partial<ChatMessage>) => {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg)),
    }));
  }, []);

  const requestPreview = useCallback(
    async (message: ChatMessage) => {
      if (message.dashboardCode) {
        // 既にダッシュボードコードがある場合は再利用
        setState((prev) => ({
          ...prev,
          preview: {
            isOpen: true,
            code: message.dashboardCode || null,
          },
        }));
        return;
      }

      setState((prev) => ({ ...prev, isCreatingReport: true }));

      try {
        const response = await postJson<CreateReportResponse, CreateReportRequest>({
          url: apiEndpoints.createReport,
          body: {
            content: message.text,
            timestamp: generateTimestamp(),
          },
        });

        // メッセージにダッシュボードコードを保存
        updateMessage(message.id, { dashboardCode: response.code });

        setState((prev) => ({
          ...prev,
          preview: {
            isOpen: true,
            code: response.code,
          },
        }));
      } catch (error) {
        console.error('Report creation error:', error);
      } finally {
        setState((prev) => ({ ...prev, isCreatingReport: false }));
      }
    },
    [updateMessage]
  );

  const requestChart = useCallback(
    async (message: ChatMessage) => {
      if (message.chartCode) {
        // 既にチャートコードがある場合は表示状態をトグル
        updateMessage(message.id, { showChart: !message.showChart });
        return;
      }

      setState((prev) => ({ ...prev, isCreatingChart: true }));

      try {
        const response = await postJson<CreateChartResponse, CreateChartRequest>({
          url: apiEndpoints.createChart,
          body: {
            content: message.text,
            timestamp: generateTimestamp(),
          },
        });

        // メッセージにチャートコードを保存し、表示状態をONに
        updateMessage(message.id, {
          chartCode: response.code,
          showChart: true,
        });
      } catch (error) {
        console.error('Chart creation error:', error);
      } finally {
        setState((prev) => ({ ...prev, isCreatingChart: false }));
      }
    },
    [updateMessage]
  );

  const setInput = useCallback((value: string) => {
    setState((prev) => ({ ...prev, input: value }));
  }, []);

  const toggleChat = useCallback(() => {
    setState((prev) => ({ ...prev, isChatOpen: !prev.isChatOpen }));
  }, []);

  const closePreview = useCallback(() => {
    setState((prev) => ({
      ...prev,
      preview: { isOpen: false, code: null },
    }));
  }, []);

  const openPreview = useCallback((code: string) => {
    setState((prev) => ({
      ...prev,
      preview: { isOpen: true, code },
    }));
  }, []);

  return {
    ...state,
    sendMessage,
    requestPreview,
    requestChart,
    updateMessage,
    setInput,
    toggleChat,
    closePreview,
    openPreview,
  };
};
