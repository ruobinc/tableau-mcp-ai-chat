import { Alert, Box, Typography } from '@mui/material';
import { type FC } from 'react';

interface ErrorDisplayProps {
  error: string;
  description?: string;
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({ error, description }) => {
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
      <Alert severity="error" sx={{ mb: 2, maxWidth: 400 }}>
        {error}
      </Alert>
      {description && (
        <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center' }}>
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default ErrorDisplay;
