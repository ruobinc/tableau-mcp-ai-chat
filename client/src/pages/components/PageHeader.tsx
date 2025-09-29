import { Box, Paper, Typography, useTheme } from '@mui/material';
import { type FC, type ReactNode } from 'react';

import { createPageStyles } from '../styles/page-styles';

interface PageHeaderProps {
  icon: ReactNode;
  title: string;
}

const PageHeader: FC<PageHeaderProps> = ({ icon, title }) => {
  const theme = useTheme();
  const styles = createPageStyles(theme);

  return (
    <Paper elevation={0} sx={styles.pageHeader}>
      <Box sx={styles.headerContent}>
        <Box sx={styles.headerIcon}>{icon}</Box>
        <Typography variant="h6" sx={styles.headerTitle}>
          {title}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PageHeader;
