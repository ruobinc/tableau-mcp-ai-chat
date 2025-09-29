import { Box, CircularProgress, Typography } from '@mui/material';
import { type FC } from 'react';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: FC<LoadingIndicatorProps> = ({ message = '読み込み中...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        p: 4,
      }}
    >
      <CircularProgress size={40} sx={{ color: '#3b82f6', mb: 2 }} />
      <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingIndicator;
