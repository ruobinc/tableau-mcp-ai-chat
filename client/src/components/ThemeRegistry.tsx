import React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';

const emotionCache = createCache({ key: 'mui', prepend: true });

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3b82f6' },
    secondary: { main: '#10b981' },
    background: {
      default: '#ffffff',
      paper: '#ffffff'
    },
    text: {
      primary: '#171717',
      secondary: '#475569'
    }
  },
  typography: {
    fontFamily: "'Inter', 'Noto Sans JP', system-ui, sans-serif",
    fontWeightBold: 700,
    fontWeightMedium: 600
  },
  shape: {
    borderRadius: 12
  }
});

interface ThemeRegistryProps {
  children: React.ReactNode;
}

const ThemeRegistry: React.FC<ThemeRegistryProps> = ({ children }) => (
  <CacheProvider value={emotionCache}>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  </CacheProvider>
);

export default ThemeRegistry;
