import { useCallback, useRef, useState } from 'react';

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
      messageId: null,
    },
  });

  // AbortControllerでリクエストキャンセル機能を追加
  const abortControllerRef = useRef<AbortController | null>(null);
  const previewCacheRef = useRef<Map<number, string>>(new Map());
  const chartCacheRef = useRef<Map<number, string>>(new Map());

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

      // 前のリクエストをキャンセル
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 新しいAbortControllerを作成
      abortControllerRef.current = new AbortController();

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

        // キャンセルされていない場合のみレスポンスを処理
        if (!abortControllerRef.current?.signal.aborted) {
          addMessage({
            text: response.message,
            sender: 'bot',
          });
        }
      } catch (error) {
        // AbortErrorの場合は何もしない
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error('Chat error:', error);
        addMessage({
          text: 'エラーが発生しました。しばらく待ってから再試行してください。',
          sender: 'bot',
        });
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
        abortControllerRef.current = null;
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
      const cachedCode = previewCacheRef.current.get(message.id);
      if (cachedCode) {
        setState((prev) => ({
          ...prev,
          preview: {
            isOpen: true,
            messageId: message.id,
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

        setState((prev) => ({
          ...prev,
          preview: {
            isOpen: true,
            messageId: message.id,
          },
        }));
        previewCacheRef.current.set(message.id, response.code);
      } catch (error) {
        console.error('Report creation error:', error);
      } finally {
        setState((prev) => ({ ...prev, isCreatingReport: false }));
      }
    },
    []
  );

  const requestChart = useCallback(
    async (message: ChatMessage) => {
      const cachedCode = chartCacheRef.current.get(message.id);
      if (cachedCode) {
        // 既にチャートがある場合は表示状態をトグル
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

        chartCacheRef.current.set(message.id, response.code);

        // メッセージ表示状態をONに
        updateMessage(message.id, {
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
    setState((prev) => {
      if (prev.preview.messageId !== null) {
        previewCacheRef.current.delete(prev.preview.messageId);
      }

      return {
        ...prev,
        preview: { isOpen: false, messageId: null },
      };
    });
  }, []);

  const openPreview = useCallback((messageId: number) => {
    if (!previewCacheRef.current.has(messageId)) {
      return;
    }

    setState((prev) => ({
      ...prev,
      preview: { isOpen: true, messageId },
    }));
  }, []);

  // キャンセル機能を追加
  const cancelMessage = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // チャット履歴をクリアする機能を追加
  const clearMessages = useCallback(() => {
    previewCacheRef.current.clear();
    chartCacheRef.current.clear();
    setState((prev) => ({ ...prev, messages: [] }));
  }, []);

  const getPreviewContent = useCallback((messageId: number | null) => {
    if (messageId == null) {
      return undefined;
    }
    return previewCacheRef.current.get(messageId);
  }, []);

  const getChartContent = useCallback((messageId: number) => {
    return chartCacheRef.current.get(messageId);
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
    cancelMessage,
    clearMessages,
    getPreviewContent,
    getChartContent,
  };
};
