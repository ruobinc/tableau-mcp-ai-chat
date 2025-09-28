import { Box, Typography } from '@mui/material';
import { type FC, type ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const EmptyState: FC<EmptyStateProps> = ({ icon, title, description }) => {
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
      {icon}
      <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500, mb: 1 }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: '#94a3b8', maxWidth: 400, lineHeight: 1.6, textAlign: 'center' }}
      >
        {description}
      </Typography>
    </Box>
  );
};

export default EmptyState;
