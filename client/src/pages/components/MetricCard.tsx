import { Box, Paper, Typography, useTheme } from '@mui/material';
import { type FC, type ReactNode } from 'react';

import { createPageStyles } from '../styles/page-styles';

interface MetricCardProps {
  name: string;
  children: ReactNode;
}

const MetricCard: FC<MetricCardProps> = ({ name, children }) => {
  const theme = useTheme();
  const styles = createPageStyles(theme);

  return (
    <Paper elevation={0} sx={styles.metricCard}>
      <Typography variant="subtitle2" sx={styles.metricName}>
        {name}
      </Typography>
      <Box sx={styles.metricContent}>{children}</Box>
    </Paper>
  );
};

export default MetricCard;
