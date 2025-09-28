import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navigation from './components/navigation/Navigation';
import { getMainRoutes } from './routes';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#10b981',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#171717',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Noto Sans JP', system-ui, sans-serif",
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Navigation />
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
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

export default App;
