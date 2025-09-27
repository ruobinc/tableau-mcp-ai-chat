import React, { Suspense, useCallback } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import BarChartIcon from '@mui/icons-material/BarChart';

import Navigation from '@/components/navigation/Navigation';
import { tableauUserName } from '@/config/tableau';
import { ChatPanel } from '@/features/chat/components/ChatPanel';
import { useChat } from '@/features/chat/hooks/useChat';

const TableauDashboard = React.lazy(() => import('@/features/tableau/TableauDashboard'));

const DashboardFallback: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      p: 4
    }}
  >
    <CircularProgress size={40} sx={{ color: '#3b82f6', mb: 2 }} />
    <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
      Tableauダッシュボードを読み込み中...
    </Typography>
  </Box>
);

const PerformancePage: React.FC = () => {
  const {
    messages,
    input,
    setInput,
    isChatOpen,
    toggleChat,
    isLoading,
    sendMessage,
    requestPreview,
    requestChart,
    preview,
    closePreview
  } = useChat();

  const handleSend = useCallback(
    async (value: string) => {
      await sendMessage({ text: value });
    },
    [sendMessage]
  );

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc'
      }}
    >
      <Navigation title="次世代スーパーストア  ダッシュボード" />

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #e2e8f0',
            backgroundColor: '#ffffff'
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 0,
              borderBottom: '1px solid #e2e8f0',
              px: 3,
              py: 2,
              backgroundColor: '#fafafa'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <BarChartIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.1rem' }}>
                ダッシュボード
              </Typography>
            </Box>
          </Paper>

          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: '#f8fafc',
              position: 'relative',
              pt: 2,
              pb: 2,
              pl: 2,
              pr: 4
            }}
          >
            <Suspense fallback={<DashboardFallback />}>
              <TableauDashboard username={tableauUserName} />
            </Suspense>
          </Box>
        </Box>

        <ChatPanel
          messages={messages}
          isOpen={isChatOpen}
          onToggle={toggleChat}
          input={input}
          setInput={setInput}
          onSend={handleSend}
          isLoading={isLoading}
          onRequestPreview={requestPreview}
          onRequestChart={requestChart}
          preview={preview}
          onClosePreview={closePreview}
        />
      </Box>
    </Box>
  );
};

export default PerformancePage;
