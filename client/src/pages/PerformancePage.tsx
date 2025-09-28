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
          height: 'calc(100vh - 64px)', // Navigation height を差し引く
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#f8fafc'
        }}
      >
        {/* ダッシュボードエリア */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: '#ffffff',
              position: 'relative',
              height: 'calc(100vh - 64px)',
              minHeight: '800px'
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