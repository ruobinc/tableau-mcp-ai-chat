import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Navigation from './components/navigation/Navigation';
import { DarkModeProvider, useDarkMode } from './contexts/DarkModeContext';
import { getMainRoutes } from './routes';
import { createAppTheme } from './theme/theme';

function AppContent() {
  const { darkMode } = useDarkMode();
  const theme = createAppTheme(darkMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            background: theme.palette.background.default,
            transition: 'background-color 0.3s ease',
          }}
        >
          <Navigation />
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              {getMainRoutes()}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
}

export default App;
