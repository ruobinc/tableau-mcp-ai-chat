import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ThemeRegistry from '@/components/ThemeRegistry';
import { JWTProvider } from '@/providers/JWTProvider';
import { tableauUserName } from '@/config/tableau';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeRegistry>
        <JWTProvider defaultUsername={tableauUserName} prefetchDefaultToken={false}>
          <App />
        </JWTProvider>
      </ThemeRegistry>
    </BrowserRouter>
  </React.StrictMode>
);
