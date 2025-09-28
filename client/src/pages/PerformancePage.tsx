import { Box, useTheme } from '@mui/material';

import { tableauUserName } from '../config/tableau';
import { ChatPanel } from '../features/chat/components/ChatPanelRefactored';
import { ChatPreviewModal } from '../features/chat/components/ChatPreviewModal';
import { useChat } from '../features/chat/hooks/useChat';
import TableauDashboard from '../features/tableau/TableauDashboard';
import { JWTProvider } from '../providers/JWTProvider';

const PerformancePage = () => {
  const chatHook = useChat();
  const theme = useTheme();

  return (
    <JWTProvider defaultUsername={tableauUserName || 'default-user'} prefetchDefaultToken>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: theme.palette.background.default,
          transition: 'background-color 0.3s ease',
        }}
      >
        {/* ダッシュボードエリア */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.paper,
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              opacity: 0.7,
              zIndex: 1,
            },
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: theme.palette.background.paper,
              position: 'relative',
              borderRadius: { xs: 0, md: '12px 0 0 0' },
              overflow: 'hidden',
              boxShadow:
                theme.palette.mode === 'dark'
                  ? 'inset 0 1px 3px rgba(255, 255, 255, 0.05)'
                  : 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
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
          isCreatingReport={chatHook.isCreatingReport}
          isCreatingChart={chatHook.isCreatingChart}
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
