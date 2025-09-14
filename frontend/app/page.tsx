"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
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
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ReactMarkdown from 'react-markdown';
import { CircularProgress } from '@mui/material';


interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatBotPage() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [message, setMessage] = React.useState('');
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
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
        // 会話履歴をAPIフォーマットに変換
        const historyMessages = chatMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));
        
        // 現在のメッセージを追加
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
        // Cmd+Enter または Ctrl+Enter で送信
        event.preventDefault();
        handleSendMessage();
      }
      // 普通のEnterは何もしない（デフォルトの改行動作）
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
      {/* Header */}
      <Paper elevation={1} sx={{ 
        borderRadius: 0,
        borderBottom: '1px solid #e2e8f0'
      }}>
        <Toolbar sx={{ 
          px: { xs: 2, sm: 3 },
          minHeight: { xs: '56px', sm: '64px' }
        }}>
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, color: '#64748b' }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <BarChartIcon sx={{ mr: 1.5, color: '#3b82f6', fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{ 
                fontWeight: 600,
                color: '#1e293b',
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              Tableau Analytics Dashboard
            </Typography>
          </Box>
          
          <IconButton
            size="medium"
            edge="end"
            aria-label="account"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            sx={{ color: '#64748b' }}
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </Paper>
      {renderMenu}
      
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            position: 'relative'
          }}>
            {/* Placeholder for Tableau Dashboard */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              p: 4
            }}>
              <BarChartIcon sx={{ 
                fontSize: 80, 
                color: '#cbd5e1', 
                mb: 2 
              }} />
              <Typography variant="h6" sx={{ 
                color: '#64748b',
                fontWeight: 500,
                mb: 1
              }}>
                Tableau ダッシュボード
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#94a3b8',
                maxWidth: 400,
                lineHeight: 1.6
              }}>
                ここにTableauダッシュボードが表示されます。<br />
                次のステップで統合する予定です。
              </Typography>
            </Box>
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
                            margin: '0.5em 0'
                          },
                          '& th, & td': {
                            border: '1px solid #e2e8f0',
                            padding: '0.5em',
                            textAlign: 'left'
                          },
                          '& th': {
                            backgroundColor: '#f8fafc',
                            fontWeight: 600
                          }
                        }}>
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
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
