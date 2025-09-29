import { Box, Card, CardContent, Typography } from '@mui/material';
import { Grow } from '@mui/material';
import { useTheme } from '@mui/material';
import { type FC, type ReactNode } from 'react';

import { createHomePageStyles } from '../styles/home-styles';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
  isLoaded: boolean;
}

const FeatureCard: FC<FeatureCardProps> = ({ icon, title, description, index, isLoaded }) => {
  const theme = useTheme();
  const styles = createHomePageStyles(theme);

  return (
    <Grow in={isLoaded} timeout={1200 + index * 200}>
      <Card sx={styles.featureCard}>
        <CardContent sx={{ textAlign: 'center', p: 3 }}>
          <Box sx={styles.featureIconBox}>{icon}</Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}
          >
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default FeatureCard;
