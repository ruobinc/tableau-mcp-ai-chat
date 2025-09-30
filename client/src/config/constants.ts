export const LOCAL_STORAGE_KEYS = {
  DARK_MODE: 'darkMode',
  JWT_TOKEN_PREFIX: 'jwt-token-',
  CHAT_HISTORY: 'chatHistory',
  USER_PREFERENCES: 'userPreferences',
} as const;

export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Tableau MCP AI Chat',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DESCRIPTION: 'TableauダッシュボードとAI分析アシスタントを統合した対話型分析プラットフォーム',
} as const;

export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: '#3b82f6',
    PRIMARY_LIGHT: '#60a5fa',
    PRIMARY_DARK: '#1d4ed8',
    SECONDARY: '#10b981',
    SECONDARY_LIGHT: '#34d399',
    SECONDARY_DARK: '#047857',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    INFO: '#3b82f6',
  },
  BORDER_RADIUS: {
    SMALL: 8,
    MEDIUM: 12,
    LARGE: 16,
    XLARGE: 20,
    ROUND: '50%',
  },
  TRANSITIONS: {
    DEFAULT: 'all 0.2s ease',
    SLOW: 'all 0.3s ease',
    BOUNCE: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  SHADOWS: {
    LIGHT: '0 2px 8px rgba(0, 0, 0, 0.1)',
    MEDIUM: '0 4px 12px rgba(0, 0, 0, 0.15)',
    HEAVY: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
} as const;

export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 2000,
  MAX_HISTORY_SIZE: 100,
  MAX_RENDERED_MESSAGES: 50,
  API_HISTORY_LIMIT: 20,
  TYPING_DELAY: 1000,
  AUTO_SCROLL_BEHAVIOR: 'smooth' as ScrollBehavior,
  PLACEHOLDER_TEXT: 'データについて質問してください... (⌘+Enter で送信)',
} as const;

export const UI_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  CHAT_PANEL_WIDTH: {
    MOBILE: '100%',
    TABLET: 600,
    DESKTOP: 750,
  },
  AVATAR_SIZE: {
    SMALL: 28,
    MEDIUM: 36,
    LARGE: 48,
  },
  ANIMATION_DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
} as const;

export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const TABLEAU_CONFIG = {
  DEFAULT_HEIGHT: 800,
  DEFAULT_TOOLBAR_POSITION: 'Bottom' as const,
  DEFAULT_HIDE_TABS: true,
  DEFAULT_DEVICE: 'desktop' as const,
} as const;
