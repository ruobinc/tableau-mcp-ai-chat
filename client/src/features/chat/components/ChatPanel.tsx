import { useCallback, useRef, useEffect, type FC } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Divider,
  Avatar,
  Slide,
  Tooltip,
  Fab,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import PreviewIcon from '@mui/icons-material/Preview';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import MarkdownRenderer from '../../../components/markdown/MarkdownRenderer';
import type { ChatMessage, ChatPreviewState } from '../types';
import { ChatPreviewModal } from './ChatPreviewModal';

interface ChatPanelProps {
  messages: ChatMessage[];
  isOpen: boolean;
  onToggle: () => void;
  input: string;
  setInput: (value: string) => void;
  onSend: (value: string) => Promise<void> | void;
  isLoading: boolean;
  onRequestPreview: (message: ChatMessage) => void;
  onRequestChart: (message: ChatMessage) => void;
  preview: ChatPreviewState;
  onClosePreview: () => void;
}

const formatTimestamp = (timestamp: string) => {
  try {
    return new Date(timestamp).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return timestamp;
  }
};

export const ChatPanel: FC<ChatPanelProps> = ({
  messages,
  isOpen,
  onToggle,
  input,
  setInput,
  onSend,
  isLoading,
  onRequestPreview,
  onRequestChart,
  preview,
  onClosePreview
}) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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

  return (
    <>
      <Slide direction="left" in={isOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            width: { xs: '100%', md: 600, lg: 750 },
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            position: { xs: 'fixed', md: 'relative' },
            top: { xs: 0, md: 'auto' },
            right: { xs: 0, md: 'auto' },
            height: { xs: '100vh', md: 'auto' },
            zIndex: { xs: 1200, md: 'auto' },
            boxShadow: { xs: '0 0 20px rgba(0,0,0,0.1)', md: 'none' }
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 0,
              borderBottom: '1px solid #e2e8f0',
              px: 3,
              py: 2,
              backgroundColor: '#fafafa'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ChatIcon sx={{ color: '#10b981', fontSize: 20 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.1rem', flexGrow: 1 }}
              >
                AI 分析アシスタント
              </Typography>
              <IconButton
                size="small"
                onClick={onToggle}
                sx={{
                  color: '#64748b',
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                    color: '#475569'
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>

          <ChatPreviewModal open={preview.isOpen} code={preview.code} onClose={onClosePreview} />

          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 3,
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '3px' },
              '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#94a3b8' }
            }}
          >
            {messages.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center'
                }}
              >
                <SmartToyIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500, mb: 1 }}>
                  データ分析を始めましょう！
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: 280, lineHeight: 1.6 }}>
                  ダッシュボードについて質問したり、データの傾向について聞いてください。
                </Typography>
              </Box>
            ) : (
              <>
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      mb: 3,
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      gap: 1
                    }}
                  >
                    {msg.sender === 'bot' && (
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          backgroundColor: '#10b981',
                          mt: 0.5
                        }}
                      >
                        <SmartToyIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                    )}

                    <Box sx={{ maxWidth: '95%', display: 'flex', flexDirection: 'column' }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius:
                            msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          backgroundColor: msg.sender === 'user' ? '#3b82f6' : '#ffffff',
                          color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                          border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                          boxShadow:
                            msg.sender === 'user'
                              ? '0 2px 8px rgba(59, 130, 246, 0.15)'
                              : '0 1px 3px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        {msg.sender === 'bot' ? (
                          <Box
                            sx={{
                              '& p': { margin: 0, lineHeight: 1.5, fontSize: '0.9rem' },
                              '& h1, & h2, & h3, & h4, & h5, & h6': {
                                margin: '0.5em 0',
                                fontWeight: 600
                              },
                              '& ul, & ol': {
                                margin: '0.5em 0',
                                paddingLeft: '1.5em'
                              },
                              '& li': { margin: '0.2em 0' },
                              '& code': {
                                backgroundColor: '#f1f5f9',
                                padding: '0.1em 0.3em',
                                borderRadius: '4px',
                                fontSize: '0.85em',
                                color: '#1e293b'
                              },
                              '& pre': {
                                backgroundColor: '#f8fafc',
                                padding: '0.75em',
                                borderRadius: '8px',
                                overflow: 'auto',
                                fontSize: '0.85em',
                                margin: '0.5em 0',
                                border: '1px solid #e2e8f0'
                              },
                              '& pre code': {
                                backgroundColor: 'transparent',
                                padding: 0
                              },
                              '& blockquote': {
                                borderLeft: '3px solid #e2e8f0',
                                paddingLeft: '1em',
                                margin: '0.5em 0',
                                color: '#64748b',
                                fontStyle: 'italic'
                              },
                              '& strong': { fontWeight: 600 },
                              '& em': { fontStyle: 'italic' },
                              '& table': {
                                borderCollapse: 'collapse',
                                width: '100%',
                                margin: '0.8em 0',
                                fontSize: '0.85rem',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                borderRadius: '6px',
                                overflow: 'hidden'
                              },
                              '& th, & td': {
                                border: '1px solid #e2e8f0',
                                padding: '0.75em 1em',
                                textAlign: 'left'
                              },
                              '& th': {
                                backgroundColor: '#f8fafc',
                                fontWeight: 600,
                                color: '#374151',
                                borderBottom: '2px solid #d1d5db'
                              },
                              '& tbody tr:nth-of-type(even)': { backgroundColor: '#f9fafb' },
                              '& tbody tr:hover': { backgroundColor: '#f3f4f6' }
                            }}
                          >
                            <MarkdownRenderer>{msg.text}</MarkdownRenderer>
                          </Box>
                        ) : (
                          <Typography variant="body2" sx={{ lineHeight: 1.5, fontSize: '0.9rem' }}>
                            {msg.text}
                          </Typography>
                        )}
                      </Paper>

                      <Typography
                        variant="caption"
                        sx={{
                          color: '#94a3b8',
                          mt: 0.5,
                          ml: msg.sender === 'user' ? 0 : 1,
                          textAlign: msg.sender === 'user' ? 'right' : 'left',
                          fontSize: '0.7rem'
                        }}
                      >
                        {formatTimestamp(msg.timestamp)}
                      </Typography>

                      {msg.sender === 'bot' && (
                        <Box sx={{ mt: 1, ml: 1, display: 'flex', gap: 1 }}>
                          <Tooltip
                            title={msg.dashboardCode ? 'レポート再表示' : 'レポート作成'}
                            placement="top"
                            arrow
                          >
                            <IconButton
                              size="small"
                              onClick={() => onRequestPreview(msg)}
                              sx={{
                                color: msg.dashboardCode ? '#10b981' : '#3b82f6',
                                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                                border: '1px solid',
                                borderColor: msg.dashboardCode ? '#10b981' : '#3b82f6',
                                '&:hover': {
                                  backgroundColor: msg.dashboardCode
                                    ? 'rgba(16, 185, 129, 0.1)'
                                    : 'rgba(59, 130, 246, 0.1)',
                                  borderColor: msg.dashboardCode ? '#059669' : '#2563eb',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <PreviewIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip
                            title={msg.chartCode ? (msg.showChart ? 'チャート非表示' : 'チャート表示') : 'チャート作成'}
                            placement="top"
                            arrow
                          >
                            <IconButton
                              size="small"
                              onClick={() => onRequestChart(msg)}
                              sx={{
                                color: msg.chartCode ? (msg.showChart ? '#f59e0b' : '#10b981') : '#8b5cf6',
                                backgroundColor: 'rgba(139, 92, 246, 0.05)',
                                border: '1px solid',
                                borderColor: msg.chartCode ? (msg.showChart ? '#f59e0b' : '#10b981') : '#8b5cf6',
                                '&:hover': {
                                  backgroundColor: msg.chartCode
                                    ? msg.showChart
                                      ? 'rgba(245, 158, 11, 0.1)'
                                      : 'rgba(16, 185, 129, 0.1)'
                                    : 'rgba(139, 92, 246, 0.1)',
                                  borderColor: msg.chartCode
                                    ? msg.showChart
                                      ? '#d97706'
                                      : '#059669'
                                    : '#7c3aed',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <ShowChartIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}

                      {msg.sender === 'bot' && msg.showChart && msg.chartCode && (
                        <Box
                          sx={{
                            mt: 2,
                            ml: 1,
                            border: '1px solid #e2e8f0',
                            borderRadius: 2,
                            backgroundColor: '#ffffff',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <Box
                            sx={{
                              p: 2,
                              borderBottom: '1px solid #e2e8f0',
                              backgroundColor: '#f8fafc',
                              borderRadius: '8px 8px 0 0'
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: '#374151',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              <ShowChartIcon sx={{ fontSize: 16 }} />
                              チャート
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              height: { xs: 460, md: 530 },
                              overflow: 'hidden'
                            }}
                          >
                            <iframe
                              srcDoc={msg.chartCode}
                              style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                backgroundColor: 'white'
                              }}
                              sandbox="allow-scripts"
                              title="Inline Chart"
                            />
                          </Box>
                        </Box>
                      )}
                    </Box>

                    {msg.sender === 'user' && (
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          backgroundColor: '#64748b',
                          mt: 0.5
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                    )}
                  </Box>
                ))}

                {isLoading && (
                  <Box
                    sx={{
                      mb: 3,
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      gap: 1
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        backgroundColor: '#10b981',
                        mt: 0.5
                      }}
                    >
                      <SmartToyIcon sx={{ fontSize: 16 }} />
                    </Avatar>

                    <Box sx={{ maxWidth: '95%', display: 'flex', flexDirection: 'column' }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: '16px 16px 16px 4px',
                          backgroundColor: '#ffffff',
                          color: '#1e293b',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={16} sx={{ color: '#10b981' }} />
                          <Typography
                            variant="body2"
                            sx={{
                              lineHeight: 1.5,
                              fontSize: '0.9rem',
                              color: '#64748b',
                              fontStyle: 'italic'
                            }}
                          >
                            回答を生成中...
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  </Box>
                )}
              </>
            )}
            <div ref={chatEndRef} />
          </Box>

          <Divider />
          <Paper
            elevation={0}
            sx={{
              borderRadius: 0,
              p: 2,
              backgroundColor: '#ffffff'
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="データについて質問してください... (⌘+Enter で送信)"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    backgroundColor: '#f8fafc',
                    '& fieldset': { border: '1px solid #e2e8f0' },
                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                    '&.Mui-focused fieldset': {
                      borderColor: '#10b981',
                      borderWidth: '1px'
                    }
                  },
                  '& .MuiOutlinedInput-input': {
                    py: 1,
                    px: 1.5,
                    fontSize: '0.9rem'
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                sx={{
                  minWidth: 40,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                  '&:hover': {
                    backgroundColor: '#059669',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                  },
                  '&:disabled': {
                    backgroundColor: '#cbd5e1'
                  }
                }}
              >
                <SendIcon sx={{ fontSize: 16 }} />
              </Button>
            </Box>
          </Paper>
        </Box>
      </Slide>

      {!isOpen && (
        <Fab
          color="primary"
          onClick={onToggle}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 48,
            height: 48,
            backgroundColor: '#10b981',
            '&:hover': { backgroundColor: '#059669' },
            zIndex: 1300,
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)'
          }}
        >
          <ChatIcon sx={{ fontSize: 20 }} />
        </Fab>
      )}
    </>
  );
};