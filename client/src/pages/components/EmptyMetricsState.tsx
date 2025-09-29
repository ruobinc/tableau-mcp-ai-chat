import { Box, Paper, Typography, useTheme } from '@mui/material';
import { type FC, type ReactNode } from 'react';

import { createPageStyles } from '../styles/page-styles';

interface EmptyMetricsStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const EmptyMetricsState: FC<EmptyMetricsStateProps> = ({ icon, title, description }) => {
  const theme = useTheme();
  const styles = createPageStyles(theme);

  return (
    <Box sx={styles.emptyState}>
      <Paper elevation={0} sx={styles.emptyStateCard}>
        <Box sx={styles.emptyStateIcon}>{icon}</Box>
        <Typography variant="h6" sx={styles.emptyStateTitle}>
          {title}
        </Typography>
        <Typography variant="body2" sx={styles.emptyStateDescription}>
          {description}
        </Typography>
      </Paper>
    </Box>
  );
};

export default EmptyMetricsState;
