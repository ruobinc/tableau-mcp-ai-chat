import { Box, useTheme } from '@mui/material';

import { tableauUserName } from '../config/tableau';
import { ChatPanel } from '../features/chat/components';
import { useChat } from '../features/chat/hooks/useChat';
import { TableauDashboard } from '../features/tableau/components';
import { JWTPageWrapper } from './components';
import { createPageStyles } from './styles/page-styles';

const PerformancePage = () => {
  const chatHook = useChat();
  const theme = useTheme();
  const styles = createPageStyles(theme);

  return (
    <JWTPageWrapper username={tableauUserName}>
      <Box sx={styles.performancePageContainer}>
        <Box sx={styles.dashboardArea}>
          <Box sx={styles.dashboardContainer}>
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
          onCancelMessage={chatHook.cancelMessage}
          onClearMessages={chatHook.clearMessages}
          getPreviewContent={chatHook.getPreviewContent}
          getChartContent={chatHook.getChartContent}
        />

        {/* チャットプレビューモーダル */}
        <ChatPreviewModal
          open={chatHook.preview.isOpen}
          code={chatHook.getPreviewContent(chatHook.preview.messageId) ?? null}
          onClose={chatHook.closePreview}
        />
      </Box>
    </JWTPageWrapper>
  );
};

export default PerformancePage;
