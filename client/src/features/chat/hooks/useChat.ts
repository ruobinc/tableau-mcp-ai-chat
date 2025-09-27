import { useCallback, useMemo, useState } from 'react';
import { apiEndpoints } from '@/config/api';
import { postJson } from '@/lib/http';
import type { ChatMessage, ChatPreviewState } from '@/features/chat/types';

interface ChatApiRequest {
  role: string;
  content: string;
}

interface ChatApiResponse {
  message: string;
  timestamp: string;
  success: boolean;
}

interface CreateReportResponse {
  code: string;
  timestamp: string;
  success: boolean;
}

interface SendMessageOptions {
  text: string;
}

const extractDashboardCode = (text: string): string | null => {
  const match = text.match(/<!DOCTYPE html>[\s\S]*?<\/html>/i);
  return match ? match[0] : null;
};

const nowTimestamp = () => new Date().toISOString();

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [preview, setPreview] = useState<ChatPreviewState>({ isOpen: false, code: null });

  const closePreview = useCallback(() => {
    setPreview({ isOpen: false, code: null });
  }, []);

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const updateMessage = useCallback((id: number, updater: (message: ChatMessage) => ChatMessage) => {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? updater(msg) : msg)));
  }, []);

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  const sendMessage = useCallback(async ({ text }: SendMessageOptions) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const id = Date.now();
    const timestamp = nowTimestamp();

    const userMessage: ChatMessage = {
      id,
      text: trimmed,
      sender: 'user',
      timestamp
    };

    appendMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const history: ChatApiRequest[] = [...messages, userMessage].map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await postJson<ChatApiResponse, { messages: ChatApiRequest[]; timestamp: string }>({
        url: apiEndpoints.chat,
        body: {
          messages: history,
          timestamp
        }
      });

      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        text: response.message,
        sender: 'bot',
        timestamp: response.timestamp ?? nowTimestamp()
      };

      appendMessage(botMessage);
    } catch (error) {
      console.error('Error sending chat message:', error);
      const fallback: ChatMessage = {
        id: Date.now() + 2,
        text: '申し訳ありません。現在サーバーに接続できません。しばらく後にもう一度お試しください。',
        sender: 'bot',
        timestamp: nowTimestamp()
      };
      appendMessage(fallback);
    } finally {
      setIsLoading(false);
    }
  }, [appendMessage, messages]);

  const requestPreview = useCallback(async (message: ChatMessage) => {
    if (message.dashboardCode) {
      setPreview({ isOpen: true, code: message.dashboardCode });
      return;
    }

    const extracted = extractDashboardCode(message.text);
    if (extracted) {
      updateMessage(message.id, (msg) => ({ ...msg, dashboardCode: extracted }));
      setPreview({ isOpen: true, code: extracted });
      return;
    }

    setIsLoading(true);

    try {
      const response = await postJson<CreateReportResponse, { content: string; timestamp: string }>({
        url: apiEndpoints.createReport,
        body: {
          content: message.text,
          timestamp: nowTimestamp()
        }
      });

      updateMessage(message.id, (msg) => ({ ...msg, dashboardCode: response.code }));
      setPreview({ isOpen: true, code: response.code });
    } catch (error) {
      console.error('Error creating preview:', error);
      setPreview({
        isOpen: true,
        code: `<!DOCTYPE html><html><body style="font-family: sans-serif; padding: 24px;">
<h2>プレビューの生成に失敗しました</h2>
<p>しばらく待ってから再度お試しください。</p>
</body></html>`
      });
    } finally {
      setIsLoading(false);
    }
  }, [updateMessage]);

  const requestChart = useCallback(async (message: ChatMessage) => {
    if (message.chartCode) {
      updateMessage(message.id, (msg) => ({ ...msg, showChart: !msg.showChart }));
      return;
    }

    setIsLoading(true);
    try {
      const response = await postJson<CreateReportResponse, { content: string; timestamp: string }>({
        url: apiEndpoints.createChart,
        body: {
          content: message.text,
          timestamp: nowTimestamp()
        }
      });

      updateMessage(message.id, (msg) => ({ ...msg, chartCode: response.code, showChart: true }));
    } catch (error) {
      console.error('Error creating chart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [updateMessage]);

  const state = useMemo(
    () => ({
      messages,
      input,
      isChatOpen,
      isLoading,
      preview
    }),
    [messages, input, isChatOpen, isLoading, preview]
  );

  return {
    ...state,
    setInput,
    toggleChat,
    sendMessage,
    requestPreview,
    requestChart,
    closePreview
  };
};
