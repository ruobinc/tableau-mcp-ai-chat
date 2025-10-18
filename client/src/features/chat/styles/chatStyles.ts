import { alpha, Theme } from '@mui/material';

import { THEME_CONFIG, UI_CONFIG } from '../../../config/constants';

export const createChatPanelStyles = (theme: Theme) => ({
  container: {
    width: {
      xs: UI_CONFIG.CHAT_PANEL_WIDTH.MOBILE,
      md: UI_CONFIG.CHAT_PANEL_WIDTH.TABLET,
      lg: UI_CONFIG.CHAT_PANEL_WIDTH.DESKTOP,
    },
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
    backdropFilter: 'blur(20px)',
    position: { xs: 'fixed' as const, md: 'relative' as const },
    top: { xs: 0, md: 'auto' },
    right: { xs: 0, md: 'auto' },
    height: { xs: '100vh', md: 'auto' },
    zIndex: { xs: 1200, md: 'auto' },
    boxShadow:
      theme.palette.mode === 'dark' ? '0 0 40px rgba(0,0,0,0.5)' : '0 0 40px rgba(0,0,0,0.1)',
    borderLeft: `1px solid ${theme.palette.divider}`,
    transition: THEME_CONFIG.TRANSITIONS.SLOW,
  },

  header: {
    borderRadius: 0,
    borderBottom: `1px solid ${theme.palette.divider}`,
    px: 3,
    py: 2,
    backgroundColor: alpha(theme.palette.background.default, 0.8),
    backdropFilter: 'blur(10px)',
    position: 'relative' as const,
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
  },

  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  },

  headerIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: UI_CONFIG.AVATAR_SIZE.MEDIUM,
    height: UI_CONFIG.AVATAR_SIZE.MEDIUM,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.ROUND,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
  },

  headerTitle: {
    fontWeight: 700,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '1.2rem',
    flexGrow: 1,
  },

  closeButton: {
    color: theme.palette.text.secondary,
    transition: THEME_CONFIG.TRANSITIONS.DEFAULT,
    '&:hover': {
      backgroundColor: alpha(theme.palette.error.main, 0.1),
      color: theme.palette.error.main,
      transform: 'scale(1.1)',
    },
  },

  messagesContainer: {
    flexGrow: 1,
    overflowY: 'auto' as const,
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
      transition: THEME_CONFIG.TRANSITIONS.DEFAULT,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.5),
      },
    },
  },

  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center' as const,
  },

  emptyIcon: {
    fontSize: 64,
    color: alpha(theme.palette.primary.main, 0.3),
    transition: THEME_CONFIG.TRANSITIONS.SLOW,
    '&:hover': {
      transform: 'scale(1.1)',
      color: alpha(theme.palette.primary.main, 0.5),
    },
  },

  emptyIconContainer: {
    position: 'relative' as const,
    display: 'inline-block',
    mb: 3,
  },

  emptyIconBorder: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 80,
    height: 80,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.ROUND,
    border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    opacity: 0.7,
    transition: THEME_CONFIG.TRANSITIONS.SLOW,
  },

  inputContainer: {
    borderRadius: 0,
    p: 2.5,
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    backdropFilter: 'blur(10px)',
    borderTop: `1px solid ${theme.palette.divider}`,
    position: 'relative' as const,
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
  },

  inputWrapper: {
    display: 'flex',
    gap: 1.5,
    alignItems: 'flex-end',
  },

  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '24px',
      backgroundColor: alpha(theme.palette.background.default, 0.5),
      backdropFilter: 'blur(10px)',
      transition: THEME_CONFIG.TRANSITIONS.DEFAULT,
      '& fieldset': {
        border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        transition: THEME_CONFIG.TRANSITIONS.DEFAULT,
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
  },

  sendButton: {
    minWidth: 48,
    width: 48,
    height: 48,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.ROUND,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
    transition: THEME_CONFIG.TRANSITIONS.BOUNCE,
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
  },

  fab: {
    position: 'fixed' as const,
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
    zIndex: 1300,
    transition: THEME_CONFIG.TRANSITIONS.BOUNCE,
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
      borderRadius: THEME_CONFIG.BORDER_RADIUS.ROUND,
      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      opacity: 0.2,
      transition: THEME_CONFIG.TRANSITIONS.SLOW,
      zIndex: -1,
    },
  },
});

export const createMessageStyles = (theme: Theme, isUser: boolean) => ({
  container: {
    mb: 3,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    gap: 1,
  },

  avatar: {
    width: UI_CONFIG.AVATAR_SIZE.SMALL,
    height: UI_CONFIG.AVATAR_SIZE.SMALL,
    backgroundColor: isUser ? '#64748b' : '#10b981',
    mt: 0.5,
  },

  messageWrapper: {
    maxWidth: '95%',
    display: 'flex',
    flexDirection: 'column' as const,
  },

  messageBubble: {
    p: 2,
    borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
    background: isUser
      ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
      : alpha(theme.palette.background.paper, 0.8),
    color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
    border: isUser ? 'none' : `1px solid ${theme.palette.divider}`,
    boxShadow: isUser
      ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`
      : `0 2px 10px ${alpha(theme.palette.common.black, 0.05)}`,
    backdropFilter: isUser ? 'none' : 'blur(10px)',
    position: 'relative' as const,
    transition: THEME_CONFIG.TRANSITIONS.DEFAULT,
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: isUser
        ? `0 6px 25px ${alpha(theme.palette.primary.main, 0.4)}`
        : `0 4px 15px ${alpha(theme.palette.common.black, 0.1)}`,
    },
  },

  timestamp: {
    color: '#94a3b8',
    mt: 0.5,
    ml: isUser ? 0 : 1,
    textAlign: isUser ? 'right' : 'left',
    fontSize: '0.7rem',
  },

  actionButtons: {
    mt: 1,
    ml: 1,
    display: 'flex',
    gap: 1,
  },

  chartContainer: {
    mt: 2,
    ml: 1,
    border: '1px solid #e2e8f0',
    borderRadius: 2,
    backgroundColor: '#ffffff',
    boxShadow: THEME_CONFIG.SHADOWS.LIGHT,
  },

  chartHeader: {
    p: 2,
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: '8px 8px 0 0',
  },

  chartFrame: {
    height: { xs: 360, md: 400 },
    maxHeight: 400,
    overflow: 'hidden',
  },
});
