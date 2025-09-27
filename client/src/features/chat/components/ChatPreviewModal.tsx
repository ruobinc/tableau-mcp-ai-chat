import { FC } from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import CloseIcon from '@mui/icons-material/Close';

interface ChatPreviewModalProps {
  open: boolean;
  code: string | null;
  onClose: () => void;
}

export const ChatPreviewModal: FC<ChatPreviewModalProps> = ({ open, code, onClose }) => {
  if (!open) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 1, sm: 2 }
      }}
    >
      <Paper
        sx={{
          width: '98%',
          maxWidth: 1600,
          height: '95%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <BarChartIcon sx={{ fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
              分析レポート
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            position: 'relative',
            backgroundColor: '#f8fafc'
          }}
        >
          {code ? (
            <iframe
              srcDoc={code}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: 'white',
                borderRadius: '0 0 12px 12px'
              }}
              sandbox="allow-scripts"
              title="LLM Preview"
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#64748b'
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                ダッシュボードを読み込み中...
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};