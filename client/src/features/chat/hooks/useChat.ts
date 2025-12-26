import { useCallback, useEffect, useRef, useState } from 'react';

import { apiEndpoints } from '../../../config/api';
import { CHAT_CONFIG } from '../../../config/constants';
import { useBedrockSettings } from '../../../contexts/BedrockSettingsContext';
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
  aws_region: string;
  aws_bearer_token: string;
  bedrock_model_id: string;
  max_tokens: number;
}

interface SendMessageResponse {
  message: string;
  timestamp: string;
  success: boolean;
}

interface CreateReportRequest {
  content: string;
  timestamp: string;
  aws_region: string;
  aws_bearer_token: string;
  bedrock_model_id: string;
  max_tokens: number;
}

interface CreateReportResponse {
  code: string;
  timestamp: string;
  success: boolean;
}

interface CreateChartRequest {
  content: string;
  timestamp: string;
  aws_region: string;
  aws_bearer_token: string;
  bedrock_model_id: string;
  max_tokens: number;
}

interface CreateChartResponse {
  code: string;
  timestamp: string;
  success: boolean;
}

export const useChat = () => {
  const { settings, hasSettings } = useBedrockSettings();
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
    setState((prev) => {
      const nextMessage: ChatMessage = {
        ...message,
        id: generateId(),
        timestamp: generateTimestamp(),
      };

      const appendedMessages = [...prev.messages, nextMessage];

      if (appendedMessages.length <= CHAT_CONFIG.MAX_HISTORY_SIZE) {
        return {
          ...prev,
          messages: appendedMessages,
        };
      }

      const excessCount = appendedMessages.length - CHAT_CONFIG.MAX_HISTORY_SIZE;
      const removedMessages = appendedMessages.slice(0, excessCount);
      const remainingMessages = appendedMessages.slice(excessCount);

      removedMessages.forEach((removedMessage) => {
        previewCacheRef.current.delete(removedMessage.id);
        chartCacheRef.current.delete(removedMessage.id);
      });

      const shouldClosePreview = removedMessages.some(
        (removedMessage) => removedMessage.id === prev.preview.messageId
      );

      return {
        ...prev,
        messages: remainingMessages,
        preview: shouldClosePreview ? { isOpen: false, messageId: null } : prev.preview,
      };
    });
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || state.isLoading) return;

      // Bedrock設定のチェック
      if (!hasSettings || !settings) {
        addMessage({
          text: 'Bedrock設定が未設定です。ページ上部の設定ボタンから設定を行ってください。',
          sender: 'bot',
        });
        return;
      }

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
        const historyLimit = Math.max((CHAT_CONFIG.API_HISTORY_LIMIT || 0) - 1, 0);
        const recentMessages =
          historyLimit > 0 ? state.messages.slice(-historyLimit) : state.messages;

        const allMessages: ApiChatMessage[] = [
          ...recentMessages.map((msg) => ({
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
            aws_region: settings.awsRegion,
            aws_bearer_token: settings.awsBearerToken,
            bedrock_model_id: settings.bedrockModelId,
            max_tokens: settings.maxTokens,
          },
          signal: abortControllerRef.current?.signal,
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
    [state.isLoading, state.messages, addMessage, hasSettings, settings]
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

      // Bedrock設定のチェック
      if (!hasSettings || !settings) {
        console.error('Bedrock settings not configured');
        return;
      }

      setState((prev) => ({ ...prev, isCreatingReport: true }));

      try {
        const response = await postJson<CreateReportResponse, CreateReportRequest>({
          url: apiEndpoints.createReport,
          body: {
            content: message.text,
            timestamp: generateTimestamp(),
            aws_region: settings.awsRegion,
            aws_bearer_token: settings.awsBearerToken,
            bedrock_model_id: settings.bedrockModelId,
            max_tokens: settings.maxTokens,
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
    [hasSettings, settings]
  );

  const requestChart = useCallback(
    async (message: ChatMessage) => {
      const cachedCode = chartCacheRef.current.get(message.id);
      if (cachedCode) {
        // 既にチャートがある場合は表示状態をトグル
        updateMessage(message.id, { showChart: !message.showChart });
        return;
      }

      // Bedrock設定のチェック
      if (!hasSettings || !settings) {
        console.error('Bedrock settings not configured');
        return;
      }

      setState((prev) => ({ ...prev, isCreatingChart: true }));

      try {
        const response = await postJson<CreateChartResponse, CreateChartRequest>({
          url: apiEndpoints.createChart,
          body: {
            content: message.text,
            timestamp: generateTimestamp(),
            aws_region: settings.awsRegion,
            aws_bearer_token: settings.awsBearerToken,
            bedrock_model_id: settings.bedrockModelId,
            max_tokens: settings.maxTokens,
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
    [updateMessage, hasSettings, settings]
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
      abortControllerRef.current = null;
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // チャット履歴をクリアする機能を追加
  const clearMessages = useCallback(() => {
    previewCacheRef.current.clear();
    chartCacheRef.current.clear();
    setState((prev) => ({
      ...prev,
      messages: [],
      preview: { isOpen: false, messageId: null },
    }));
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

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    };
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
