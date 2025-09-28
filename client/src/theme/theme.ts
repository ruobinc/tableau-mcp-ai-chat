import { createTheme, ThemeOptions } from '@mui/material/styles';

import { THEME_CONFIG } from '../config/constants';

const createAppTheme = (isDark: boolean) => {
  const themeOptions: ThemeOptions = {
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: THEME_CONFIG.COLORS.PRIMARY,
        light: THEME_CONFIG.COLORS.PRIMARY_LIGHT,
        dark: THEME_CONFIG.COLORS.PRIMARY_DARK,
        contrastText: '#ffffff',
      },
      secondary: {
        main: THEME_CONFIG.COLORS.SECONDARY,
        light: THEME_CONFIG.COLORS.SECONDARY_LIGHT,
        dark: THEME_CONFIG.COLORS.SECONDARY_DARK,
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#0f172a' : '#f8fafc',
        paper: isDark ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f1f5f9' : '#0f172a',
        secondary: isDark ? '#cbd5e1' : '#475569',
      },
      divider: isDark ? '#374151' : '#e2e8f0',
      action: {
        hover: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        selected: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
      },
    },
    typography: {
      fontFamily:
        "'Inter', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif",
      h1: {
        fontWeight: 800,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.025em',
      },
      h3: {
        fontWeight: 600,
        letterSpacing: '-0.015em',
      },
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.015em',
      },
      h5: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h6: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      button: {
        fontWeight: 500,
        textTransform: 'none',
        letterSpacing: '0.025em',
      },
    },
    shape: {
      borderRadius: THEME_CONFIG.BORDER_RADIUS.MEDIUM,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: THEME_CONFIG.BORDER_RADIUS.MEDIUM,
            padding: '10px 24px',
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: THEME_CONFIG.TRANSITIONS.BOUNCE,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: THEME_CONFIG.SHADOWS.MEDIUM,
            },
          },
          contained: {
            boxShadow: THEME_CONFIG.SHADOWS.LIGHT,
            '&:hover': {
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: THEME_CONFIG.BORDER_RADIUS.LARGE,
            transition: THEME_CONFIG.TRANSITIONS.SLOW,
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            minHeight: 48,
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};

export { createAppTheme };
