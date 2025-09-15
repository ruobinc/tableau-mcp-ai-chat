"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import Slide from '@mui/material/Slide';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CircularProgress, Tooltip } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import dynamic from 'next/dynamic';
import Navigation from '../../components/Navigation';

const TableauDashboard = dynamic(() => import('../../components/TableauDashboard'), {
  ssr: false,
  loading: () => null
});

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  dashboardCode?: string;
  chartCode?: string;
  showChart?: boolean;
}

export default function PerformancePage() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [message, setMessage] = React.useState('');
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showReactPreview, setShowReactPreview] = React.useState(false);
  const [reactCode, setReactCode] = React.useState('');
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleReactPreview = (code?: string) => {
    setShowReactPreview(!showReactPreview);
    if (code) {
      setReactCode(code);
    } else if (!reactCode) {
      setReactCode(`function TestComponent() {
  return (
    <div style={{padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px'}}>
      <h2>テストレポート</h2>
      <p>これはLLMから生成されたReactコンポーネントのテストです。</p>
      <button onClick={() => alert('Hello!')}>クリックしてください</button>
    </div>
  );
}`);
    }
  };

  const extractDashboardCode = (text: string): string | null => {
    const htmlMatch = text.match(/<!DOCTYPE html>[\s\S]*?<\/html>/i);
    if (htmlMatch) {
      return htmlMatch[0];
    }
    return null;
  };

  const handlePreviewRequest = async (message: ChatMessage) => {
    if (message.dashboardCode) {
      handleReactPreview(message.dashboardCode);
      return;
    }

    const extractedCode = extractDashboardCode(message.text);
    if (extractedCode) {
      setChatMessages(prev => prev.map(msg =>
        msg.id === message.id
          ? { ...msg, dashboardCode: extractedCode }
          : msg
      ));
      handleReactPreview(extractedCode);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/create_report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message.text,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => prev.map(msg =>
          msg.id === message.id
            ? { ...msg, dashboardCode: data.code }
            : msg
        ));
        handleReactPreview(data.code);
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Error fetching preview code:', error);
      handleReactPreview();
    } finally {
      setIsLoading(false);
    }
  };

  const handleChartRequest = async (message: ChatMessage) => {
    if (message.chartCode) {
      setChatMessages(prev => prev.map(msg =>
        msg.id === message.id
          ? { ...msg, showChart: !msg.showChart }
          : msg
      ));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/create_chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message.text,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => prev.map(msg =>
          msg.id === message.id
            ? { ...msg, chartCode: data.code, showChart: true }
            : msg
        ));
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Error fetching chart code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() && !isLoading) {
      const newMessage: ChatMessage = {
        id: Date.now(),
        text: message.trim(),
        sender: 'user',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, newMessage]);
      const currentMessage = message.trim();
      setMessage('');
      setIsLoading(true);

      try {
        const historyMessages = chatMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));

        const allMessages = [
          ...historyMessages,
          { role: 'user', content: currentMessage }
        ];

        const response = await fetch('http://localhost:8000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: allMessages,
            timestamp: new Date().toISOString()
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const botResponse: ChatMessage = {
            id: Date.now() + 1,
            text: data.message,
            sender: 'bot',
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, botResponse]);
        } else {
          throw new Error('API request failed');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        const errorResponse: ChatMessage = {
          id: Date.now() + 1,
          text: '申し訳ありません。現在サーバーに接続できません。しばらく後にもう一度お試しください。',
          sender: 'bot',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, errorResponse]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault();
        handleSendMessage();
      }
    }
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8fafc'
    }}>
      <Navigation title="業績一覧 - Tableau Analytics Dashboard" />

      {/* Main Content Area - Split Layout */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Left Panel - Tableau Dashboard */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #e2e8f0',
          backgroundColor: '#ffffff'
        }}>
          {/* Dashboard Header */}
          <Paper elevation={0} sx={{
            borderRadius: 0,
            borderBottom: '1px solid #e2e8f0',
            px: 3,
            py: 2,
            backgroundColor: '#fafafa'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <BarChartIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
              <Typography variant="h6" sx={{
                fontWeight: 600,
                color: '#1e293b',
                fontSize: '1.1rem'
              }}>
                ダッシュボード
              </Typography>
            </Box>
          </Paper>

          {/* Dashboard Container */}
          <Box sx={{
            flexGrow: 1,
            backgroundColor: '#f8fafc',
            position: 'relative',
            pt: 2,
            pb: 2,
            pl: 2,
            pr: 4
          }}>
            <TableauDashboard username="default-user" />
          </Box>
        </Box>

        {/* Right Panel - Chat Area */}
        <Slide direction="left" in={isChatOpen} mountOnEnter unmountOnExit>
          <Box sx={{
            width: { xs: '100%', md: 500, lg: 600 },
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            position: { xs: 'fixed', md: 'relative' },
            top: { xs: 0, md: 'auto' },
            right: { xs: 0, md: 'auto' },
            height: { xs: '100vh', md: 'auto' },
            zIndex: { xs: 1200, md: 'auto' },
            boxShadow: { xs: '0 0 20px rgba(0,0,0,0.1)', md: 'none' }
          }}>
          {/* Chat Header */}
          <Paper elevation={0} sx={{
            borderRadius: 0,
            borderBottom: '1px solid #e2e8f0',
            px: 3,
            py: 2,
            backgroundColor: '#fafafa'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ChatIcon sx={{ color: '#10b981', fontSize: 20 }} />
              <Typography variant="h6" sx={{
                fontWeight: 600,
                color: '#1e293b',
                fontSize: '1.1rem',
                flexGrow: 1
              }}>
                AI 分析アシスタント
              </Typography>
              <IconButton
                size="small"
                onClick={handleChatToggle}
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

          {/* HTML Dashboard Preview Modal */}
          {showReactPreview && (
            <Box sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(4px)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 1, sm: 2 },
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <Paper sx={{
                width: '98%',
                maxWidth: 1600,
                height: '95%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                animation: 'slideUp 0.3s ease-out'
              }}>
                <Box sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <BarChartIcon sx={{ fontSize: 24 }} />
                    <Typography variant="h6" sx={{
                      fontWeight: 600,
                      fontSize: '1.1rem'
                    }}>
                      ダッシュボードプレビュー
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleReactPreview()}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white'
                      }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Box sx={{
                  flexGrow: 1,
                  position: 'relative',
                  backgroundColor: '#f8fafc'
                }}>
                  {reactCode ? (
                    <iframe
                      srcDoc={reactCode}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        backgroundColor: 'white',
                        borderRadius: '0 0 12px 12px'
                      }}
                      sandbox="allow-scripts"
                    />
                  ) : (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      color: '#64748b'
                    }}>
                      <CircularProgress size={40} sx={{ color: '#667eea', mb: 2 }} />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        ダッシュボードを読み込み中...
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>
          )}

          {/* Messages Container */}
          <Box sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 3,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#cbd5e1',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#94a3b8',
            }
          }}>
            {chatMessages.length === 0 ? (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center'
              }}>
                <SmartToyIcon sx={{
                  fontSize: 48,
                  color: '#cbd5e1',
                  mb: 2
                }} />
                <Typography variant="h6" sx={{
                  color: '#64748b',
                  fontWeight: 500,
                  mb: 1,
                  fontSize: '1rem'
                }}>
                  データ分析を始めましょう！
                </Typography>
                <Typography variant="body2" sx={{
                  color: '#94a3b8',
                  maxWidth: 280,
                  lineHeight: 1.6
                }}>
                  ダッシュボードについて質問したり、データの傾向について聞いてください。
                </Typography>
              </Box>
            ) : (
              <>
                {chatMessages.map((msg) => (
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
                    <Avatar sx={{
                      width: 28,
                      height: 28,
                      backgroundColor: '#10b981',
                      mt: 0.5
                    }}>
                      <SmartToyIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}

                  <Box sx={{
                    maxWidth: '95%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        backgroundColor: msg.sender === 'user' ? '#3b82f6' : '#ffffff',
                        color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                        border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                        boxShadow: msg.sender === 'user' ?
                          '0 2px 8px rgba(59, 130, 246, 0.15)' :
                          '0 1px 3px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      {msg.sender === 'bot' ? (
                        <Box sx={{
                          '& p': {
                            margin: 0,
                            lineHeight: 1.5,
                            fontSize: '0.9rem'
                          },
                          '& h1, & h2, & h3, & h4, & h5, & h6': {
                            margin: '0.5em 0',
                            fontWeight: 600
                          },
                          '& ul, & ol': {
                            margin: '0.5em 0',
                            paddingLeft: '1.5em'
                          },
                          '& li': {
                            margin: '0.2em 0'
                          },
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
                          '& strong': {
                            fontWeight: 600
                          },
                          '& em': {
                            fontStyle: 'italic'
                          },
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
                          '& tbody tr:nth-of-type(even)': {
                            backgroundColor: '#f9fafb'
                          },
                          '& tbody tr:hover': {
                            backgroundColor: '#f3f4f6'
                          }
                        }}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{
                          lineHeight: 1.5,
                          fontSize: '0.9rem'
                        }}>
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
                      {msg.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>

                    {/* Action Buttons - show for bot messages */}
                    {msg.sender === 'bot' && (
                      <Box sx={{ mt: 1, ml: 1, display: 'flex', gap: 1 }}>
                        <Tooltip
                          title={msg.dashboardCode || extractDashboardCode(msg.text) ? 'レポート再表示' : 'レポート作成'}
                          placement="top"
                          arrow
                        >
                          <IconButton
                            size="small"
                            onClick={() => handlePreviewRequest(msg)}
                            sx={{
                              color: msg.dashboardCode || extractDashboardCode(msg.text) ? '#10b981' : '#3b82f6',
                              backgroundColor: 'rgba(59, 130, 246, 0.05)',
                              border: '1px solid',
                              borderColor: msg.dashboardCode || extractDashboardCode(msg.text) ? '#10b981' : '#3b82f6',
                              '&:hover': {
                                backgroundColor: msg.dashboardCode || extractDashboardCode(msg.text) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                borderColor: msg.dashboardCode || extractDashboardCode(msg.text) ? '#059669' : '#2563eb',
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
                            onClick={() => handleChartRequest(msg)}
                            sx={{
                              color: msg.chartCode ? (msg.showChart ? '#f59e0b' : '#10b981') : '#8b5cf6',
                              backgroundColor: 'rgba(139, 92, 246, 0.05)',
                              border: '1px solid',
                              borderColor: msg.chartCode ? (msg.showChart ? '#f59e0b' : '#10b981') : '#8b5cf6',
                              '&:hover': {
                                backgroundColor: msg.chartCode ? (msg.showChart ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)') : 'rgba(139, 92, 246, 0.1)',
                                borderColor: msg.chartCode ? (msg.showChart ? '#d97706' : '#059669') : '#7c3aed',
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

                    {/* Inline Chart Display */}
                    {msg.sender === 'bot' && msg.showChart && msg.chartCode && (
                      <Box sx={{
                        mt: 2,
                        ml: 1,
                        border: '1px solid #e2e8f0',
                        borderRadius: 2,
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}>
                        <Box sx={{
                          p: 2,
                          borderBottom: '1px solid #e2e8f0',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px 8px 0 0'
                        }}>
                          <Typography variant="subtitle2" sx={{
                            color: '#374151',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            <ShowChartIcon sx={{ fontSize: 16 }} />
                            チャート
                          </Typography>
                        </Box>
                        <Box sx={{
                          height: 400,
                          overflow: 'hidden'
                        }}>
                          <iframe
                            srcDoc={msg.chartCode}
                            style={{
                              width: '100%',
                              height: '100%',
                              border: 'none',
                              backgroundColor: 'white'
                            }}
                            sandbox="allow-scripts"
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>

                  {msg.sender === 'user' && (
                    <Avatar sx={{
                      width: 28,
                      height: 28,
                      backgroundColor: '#64748b',
                      mt: 0.5
                    }}>
                      <PersonIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                </Box>
                ))}

                {/* Loading indicator */}
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
                    <Avatar sx={{
                      width: 28,
                      height: 28,
                      backgroundColor: '#10b981',
                      mt: 0.5
                    }}>
                      <SmartToyIcon sx={{ fontSize: 16 }} />
                    </Avatar>

                    <Box sx={{
                      maxWidth: '95%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
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
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <CircularProgress size={16} sx={{ color: '#10b981' }} />
                          <Typography variant="body2" sx={{
                            lineHeight: 1.5,
                            fontSize: '0.9rem',
                            color: '#64748b',
                            fontStyle: 'italic'
                          }}>
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

          {/* Chat Input Area */}
          <Divider />
          <Paper
            elevation={0}
            sx={{
              borderRadius: 0,
              p: 2,
              backgroundColor: '#ffffff'
            }}
          >
            <Box sx={{
              display: 'flex',
              gap: 1.5,
              alignItems: 'flex-end'
            }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="データについて質問してください... (⌘+Enter で送信)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    backgroundColor: '#f8fafc',
                    '& fieldset': {
                      border: '1px solid #e2e8f0'
                    },
                    '&:hover fieldset': {
                      borderColor: '#cbd5e1'
                    },
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
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
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
      </Box>

      {/* Floating Action Button - Only show when chat is closed */}
      {!isChatOpen && (
        <Fab
          color="primary"
          onClick={handleChatToggle}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 48,
            height: 48,
            backgroundColor: '#10b981',
            '&:hover': {
              backgroundColor: '#059669'
            },
            zIndex: 1300,
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)'
          }}
        >
          <ChatIcon sx={{ fontSize: 20 }} />
        </Fab>
      )}
    </Box>
  );
}