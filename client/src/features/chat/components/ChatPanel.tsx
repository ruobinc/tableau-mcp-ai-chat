import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PreviewIcon from '@mui/icons-material/Preview';
import SendIcon from '@mui/icons-material/Send';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import {
  alpha,
  Avatar,
  Box,
  Button,
  CircularProgress,
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
import React, { type FC, useCallback, useEffect, useRef } from 'react';

import MarkdownRenderer from '../../../components/markdown/MarkdownRenderer';
import type { ChatMessage, ChatPreviewState } from '../types';
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
}

const formatTimestamp = (timestamp: string) => {
  try {
    return new Date(timestamp).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
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
  isCreatingReport: _isCreatingReport,
  isCreatingChart: _isCreatingChart,
  onRequestPreview,
  onRequestChart,
  preview,
  onClosePreview,
  onCancelMessage,
}) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();

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
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            position: { xs: 'fixed', md: 'relative' },
            top: { xs: 0, md: 'auto' },
            right: { xs: 0, md: 'auto' },
            height: { xs: '100vh', md: 'auto' },
            zIndex: { xs: 1200, md: 'auto' },
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 0 40px rgba(0,0,0,0.5)'
                : '0 0 40px rgba(0,0,0,0.1)',
            borderLeft: `1px solid ${theme.palette.divider}`,
            transition: 'all 0.3s ease',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 0,
              borderBottom: `1px solid ${theme.palette.divider}`,
              px: 3,
              py: 2,
              backgroundColor: alpha(theme.palette.background.default, 0.8),
              backdropFilter: 'blur(10px)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                opacity: 0.6,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                <ChatIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.2rem',
                  flexGrow: 1,
                }}
              >
                AI 分析アシスタント
              </Typography>
              <Tooltip title="チャットを閉じる" arrow>
                <IconButton
                  size="small"
                  onClick={onToggle}
                  sx={{
                    color: theme.palette.text.secondary,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main,
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>

          <ChatPreviewModal open={preview.isOpen} code={preview.code} onClose={onClosePreview} />

          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 3,
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.02) 0%, rgba(15, 23, 42, 0.05) 100%)'
                  : 'linear-gradient(180deg, rgba(248, 250, 252, 0.02) 0%, rgba(226, 232, 240, 0.05) 100%)',
              '&::-webkit-scrollbar': { width: '8px' },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
                borderRadius: '4px',
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.5),
                },
              },
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
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    mb: 3,
                  }}
                >
                  <SmartToyIcon
                    sx={{
                      fontSize: 64,
                      color: alpha(theme.palette.primary.main, 0.3),
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        color: alpha(theme.palette.primary.main, 0.5),
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      opacity: 0.7,
                      transition: 'all 0.3s ease',
                    }}
                  />
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
                      gap: 1,
                    }}
                  >
                    {msg.sender === 'bot' && (
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          backgroundColor: '#10b981',
                          mt: 0.5,
                        }}
                      >
                        <SmartToyIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                    )}

                    <Box sx={{ maxWidth: '95%', display: 'flex', flexDirection: 'column' }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius:
                            msg.sender === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                          background:
                            msg.sender === 'user'
                              ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                              : alpha(theme.palette.background.paper, 0.8),
                          color:
                            msg.sender === 'user'
                              ? theme.palette.primary.contrastText
                              : theme.palette.text.primary,
                          border:
                            msg.sender === 'user' ? 'none' : `1px solid ${theme.palette.divider}`,
                          boxShadow:
                            msg.sender === 'user'
                              ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                              : `0 2px 10px ${alpha(theme.palette.common.black, 0.05)}`,
                          backdropFilter: msg.sender === 'user' ? 'none' : 'blur(10px)',
                          position: 'relative',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow:
                              msg.sender === 'user'
                                ? `0 6px 25px ${alpha(theme.palette.primary.main, 0.4)}`
                                : `0 4px 15px ${alpha(theme.palette.common.black, 0.1)}`,
                          },
                        }}
                      >
                        {msg.sender === 'bot' ? (
                          <Box
                            sx={{
                              '& p': { margin: 0, lineHeight: 1.5, fontSize: '0.9rem' },
                              '& h1, & h2, & h3, & h4, & h5, & h6': {
                                margin: '0.5em 0',
                                fontWeight: 600,
                              },
                              '& ul, & ol': {
                                margin: '0.5em 0',
                                paddingLeft: '1.5em',
                              },
                              '& li': { margin: '0.2em 0' },
                              '& code': {
                                backgroundColor: '#f1f5f9',
                                padding: '0.1em 0.3em',
                                borderRadius: '4px',
                                fontSize: '0.85em',
                                color: '#1e293b',
                              },
                              '& pre': {
                                backgroundColor: '#f8fafc',
                                padding: '0.75em',
                                borderRadius: '8px',
                                overflow: 'auto',
                                fontSize: '0.85em',
                                margin: '0.5em 0',
                                border: '1px solid #e2e8f0',
                              },
                              '& pre code': {
                                backgroundColor: 'transparent',
                                padding: 0,
                              },
                              '& blockquote': {
                                borderLeft: '3px solid #e2e8f0',
                                paddingLeft: '1em',
                                margin: '0.5em 0',
                                color: '#64748b',
                                fontStyle: 'italic',
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
                                overflow: 'hidden',
                              },
                              '& th, & td': {
                                border: '1px solid #e2e8f0',
                                padding: '0.75em 1em',
                                textAlign: 'left',
                              },
                              '& th': {
                                backgroundColor: '#f8fafc',
                                fontWeight: 600,
                                color: '#374151',
                                borderBottom: '2px solid #d1d5db',
                              },
                              '& tbody tr:nth-of-type(even)': { backgroundColor: '#f9fafb' },
                              '& tbody tr:hover': { backgroundColor: '#f3f4f6' },
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
                          fontSize: '0.7rem',
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
                                  transform: 'scale(1.05)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <PreviewIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip
                            title={
                              msg.chartCode
                                ? msg.showChart
                                  ? 'チャート非表示'
                                  : 'チャート表示'
                                : 'チャート作成'
                            }
                            placement="top"
                            arrow
                          >
                            <IconButton
                              size="small"
                              onClick={() => onRequestChart(msg)}
                              sx={{
                                color: msg.chartCode
                                  ? msg.showChart
                                    ? '#f59e0b'
                                    : '#10b981'
                                  : '#8b5cf6',
                                backgroundColor: 'rgba(139, 92, 246, 0.05)',
                                border: '1px solid',
                                borderColor: msg.chartCode
                                  ? msg.showChart
                                    ? '#f59e0b'
                                    : '#10b981'
                                  : '#8b5cf6',
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
                                  transform: 'scale(1.05)',
                                },
                                transition: 'all 0.2s ease',
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
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          <Box
                            sx={{
                              p: 2,
                              borderBottom: '1px solid #e2e8f0',
                              backgroundColor: '#f8fafc',
                              borderRadius: '8px 8px 0 0',
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: '#374151',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <ShowChartIcon sx={{ fontSize: 16 }} />
                              チャート
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              height: { xs: 460, md: 530 },
                              overflow: 'hidden',
                            }}
                          >
                            <iframe
                              srcDoc={msg.chartCode}
                              style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                backgroundColor: 'white',
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
                          mt: 0.5,
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
                      gap: 1,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        backgroundColor: '#10b981',
                        mt: 0.5,
                      }}
                    >
                      <SmartToyIcon sx={{ fontSize: 16 }} />
                    </Avatar>

                    <Box sx={{ maxWidth: '95%', display: 'flex', flexDirection: 'column' }}>
                      <LoadingIndicator isVisible={isLoading} onCancel={onCancelMessage} />
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
              p: 2.5,
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(10px)',
              borderTop: `1px solid ${theme.palette.divider}`,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                opacity: 0.5,
              },
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="データについて質問してください... (⌘+Enter で送信)"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    backgroundColor: alpha(theme.palette.background.default, 0.5),
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s ease',
                    '& fieldset': {
                      border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      transition: 'all 0.2s ease',
                    },
                    '&:hover fieldset': {
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                      boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: '2px',
                      boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    py: 1.5,
                    px: 2,
                    fontSize: '1rem',
                    color: theme.palette.text.primary,
                    '&::placeholder': {
                      color: theme.palette.text.secondary,
                      opacity: 0.7,
                    },
                  },
                }}
              />
              <Zoom in={!!input.trim() || isLoading}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!input.trim() || isLoading}
                  sx={{
                    minWidth: 48,
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.5)}`,
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    },
                    '&:disabled': {
                      background: alpha(theme.palette.action.disabled, 0.3),
                      transform: 'none',
                      boxShadow: 'none',
                    },
                  }}
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
          <Fab
            color="primary"
            onClick={onToggle}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              width: 64,
              height: 64,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
              zIndex: 1300,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'transform, box-shadow',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.5)}`,
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -4,
                left: -4,
                right: -4,
                bottom: -4,
                borderRadius: '50%',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                opacity: 0.2,
                transition: 'opacity 0.3s ease',
                zIndex: -1,
              },
            }}
          >
            <ChatIcon sx={{ fontSize: 28, color: 'white' }} />
          </Fab>
        </Zoom>
      )}
    </>
  );
};
