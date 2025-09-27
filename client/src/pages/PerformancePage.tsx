import { Box, Paper, Typography } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import { JWTProvider } from '../providers/JWTProvider';
import TableauDashboard from '../features/tableau/TableauDashboard';
import { tableauUserName } from '../config/tableau';
import { ChatPanel } from '../features/chat/components/ChatPanel';
import { ChatPreviewModal } from '../features/chat/components/ChatPreviewModal';
import { useChat } from '../features/chat/hooks/useChat';

const PerformancePage = () => {
  const chatHook = useChat();

  return (
    <JWTProvider defaultUsername={tableauUserName || 'default-user'} prefetchDefaultToken>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f8fafc'
        }}
      >
        {/* ヘッダー */}
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
              次世代スーパーストア ダッシュボード
            </Typography>
          </Box>
        </Paper>

        {/* メインコンテンツ */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* ダッシュボードエリア */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
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
                p: 2
              }}
            >
              <TableauDashboard username={tableauUserName} />
            </Box>
          </Box>

          {/* チャットパネル */}
          <ChatPanel
            messages={chatHook.messages}
            isOpen={chatHook.isChatOpen}
            onToggle={chatHook.toggleChat}
            input={chatHook.input}
            setInput={chatHook.setInput}
            onSend={chatHook.sendMessage}
            isLoading={chatHook.isLoading}
            onRequestPreview={chatHook.requestPreview}
            onRequestChart={chatHook.requestChart}
            preview={chatHook.preview}
            onClosePreview={chatHook.closePreview}
          />
        </Box>

        {/* チャットプレビューモーダル */}
        <ChatPreviewModal
          open={chatHook.preview.isOpen}
          code={chatHook.preview.code}
          onClose={chatHook.closePreview}
        />
      </Box>
    </JWTProvider>
  );
};

export default PerformancePage;