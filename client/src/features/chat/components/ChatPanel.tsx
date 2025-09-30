import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fab,
  IconButton,
  Paper,
  Slide,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  Zoom,
} from '@mui/material';
import React, { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CHAT_CONFIG } from '../../../config/constants';
import { createChatPanelStyles } from '../styles/chatStyles';
import type { ChatMessage, ChatPreviewState } from '../types';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { ChatPreviewModal } from './ChatPreviewModal';
import { LoadingIndicator } from './LoadingIndicator';

interface ChatPanelProps {
  messages: ChatMessage[];
  isOpen: boolean;
  onToggle: () => void;
  input: string;
  setInput: (value: string) => void;
  onSend: (value: string) => Promise<void> | void;
  isLoading: boolean;
  isCreatingReport: boolean;
  isCreatingChart: boolean;
  onRequestPreview: (message: ChatMessage) => void;
  onRequestChart: (message: ChatMessage) => void;
  preview: ChatPreviewState;
  onClosePreview: () => void;
  onCancelMessage?: () => void;
  onClearMessages?: () => void;
}

const EmptyState: FC = () => {
  const theme = useTheme();
  const styles = createChatPanelStyles(theme);

  return (
    <Box sx={styles.emptyState}>
      <Box sx={styles.emptyIconContainer}>
        <SmartToyIcon sx={styles.emptyIcon} />
        <Box sx={styles.emptyIconBorder} />
      </Box>
      <Typography
        variant="h5"
        sx={{
          color: theme.palette.text.primary,
          fontWeight: 600,
          mb: 2,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        データ分析を始めましょう！
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.secondary,
          maxWidth: 320,
          lineHeight: 1.7,
          fontSize: '1rem',
        }}
      >
        ダッシュボードについて質問したり、データの傾向について聞いてください。 AI
        アシスタントが詳細な分析とインサイトを提供します。
      </Typography>
    </Box>
  );
};

interface LoadingMessageProps {
  onCancel?: () => void;
}

const LoadingMessage: FC<LoadingMessageProps> = ({ onCancel }) => {
  return (
    <Box
      sx={{
        mb: 3,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          backgroundColor: '#10b981',
          mt: 0.5,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SmartToyIcon sx={{ fontSize: 16, color: 'white' }} />
      </Box>

      <Box sx={{ maxWidth: '95%', display: 'flex', flexDirection: 'column' }}>
        <LoadingIndicator isVisible={true} onCancel={onCancel} />
      </Box>
    </Box>
  );
};

export const ChatPanel: FC<ChatPanelProps> = ({
  messages,
  isOpen,
  onToggle,
  input,
  setInput,
  onSend,
  isLoading,
  isCreatingReport,
  isCreatingChart,
  onRequestPreview,
  onRequestChart,
  preview,
  onClosePreview,
  onCancelMessage,
  onClearMessages,
}) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const styles = useMemo(() => createChatPanelStyles(theme), [theme]);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const visibleMessages = useMemo(() => {
    const limit = CHAT_CONFIG.MAX_RENDERED_MESSAGES || CHAT_CONFIG.MAX_HISTORY_SIZE;
    if (!limit || messages.length <= limit) {
      return messages;
    }

    return messages.slice(-limit);
  }, [messages]);

  const hasHiddenHistory = messages.length > visibleMessages.length;
  const hiddenCount = hasHiddenHistory ? messages.length - visibleMessages.length : 0;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: CHAT_CONFIG.AUTO_SCROLL_BEHAVIOR });
  }, [visibleMessages, isLoading]);

  const handleSubmit = useCallback(() => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  }, [onSend, input, setInput]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleClearClick = useCallback(() => {
    setClearDialogOpen(true);
  }, []);

  const handleClearConfirm = useCallback(() => {
    onClearMessages?.();
    setClearDialogOpen(false);
  }, [onClearMessages]);

  const handleClearCancel = useCallback(() => {
    setClearDialogOpen(false);
  }, []);

  return (
    <>
      <Slide direction="left" in={isOpen} mountOnEnter unmountOnExit>
        <Box sx={styles.container}>
          <Paper elevation={0} sx={styles.header}>
            <Box sx={styles.headerContent}>
              <Box sx={styles.headerIcon}>
                <ChatIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={styles.headerTitle}>
                AI 分析アシスタント
              </Typography>
              {messages.length > 0 && (
                <Tooltip title="履歴をクリア" arrow>
                  <IconButton size="small" onClick={handleClearClick} sx={styles.closeButton}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="チャットを閉じる" arrow>
                <IconButton size="small" onClick={onToggle} sx={styles.closeButton}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>

          <ChatPreviewModal open={preview.isOpen} code={preview.code} onClose={onClosePreview} />

          <Box sx={styles.messagesContainer}>
            {hasHiddenHistory && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', textAlign: 'center', mb: 2 }}
              >
                最新 {visibleMessages.length} 件のメッセージを表示中。過去 {hiddenCount} 件は自動的に折りたたまれています。
              </Typography>
            )}

            {visibleMessages.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {visibleMessages.map((msg) => (
                  <ChatMessageComponent
                    key={msg.id}
                    message={msg}
                    onRequestPreview={onRequestPreview}
                    onRequestChart={onRequestChart}
                    isCreatingReport={isCreatingReport}
                    isCreatingChart={isCreatingChart}
                  />
                ))}
                {isLoading && <LoadingMessage onCancel={onCancelMessage} />}
              </>
            )}
            <div ref={chatEndRef} />
          </Box>

          <Divider />
          <Paper elevation={0} sx={styles.inputContainer}>
            <Box sx={styles.inputWrapper}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder={CHAT_CONFIG.PLACEHOLDER_TEXT}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                variant="outlined"
                sx={styles.textField}
              />
              <Zoom in={!!input.trim() || isLoading}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!input.trim() || isLoading}
                  sx={styles.sendButton}
                >
                  {isLoading ? (
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                  ) : (
                    <SendIcon sx={{ fontSize: 20 }} />
                  )}
                </Button>
              </Zoom>
            </Box>
          </Paper>
        </Box>
      </Slide>

      {!isOpen && (
        <Zoom in={!isOpen}>
          <Fab color="primary" onClick={onToggle} sx={styles.fab}>
            <ChatIcon sx={{ fontSize: 28, color: 'white' }} />
          </Fab>
        </Zoom>
      )}

      {/* 履歴クリア確認ダイアログ */}
      <Dialog
        open={clearDialogOpen}
        onClose={handleClearCancel}
        aria-labelledby="clear-dialog-title"
        aria-describedby="clear-dialog-description"
      >
        <DialogTitle id="clear-dialog-title">チャット履歴をクリア</DialogTitle>
        <DialogContent>
          <DialogContentText id="clear-dialog-description">
            すべてのチャット履歴が削除されます。この操作は元に戻せません。本当に実行しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearCancel} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleClearConfirm} color="error" variant="contained">
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
