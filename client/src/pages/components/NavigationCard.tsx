import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Typography, useTheme } from '@mui/material';
import { type FC, type ReactNode } from 'react';

import { createHomePageStyles } from '../styles/home-styles';

interface NavigationCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: 'primary' | 'secondary';
}

const NavigationCard: FC<NavigationCardProps> = ({ icon, title, description, onClick, color }) => {
  const theme = useTheme();
  const styles = createHomePageStyles(theme);

  return (
    <Card onClick={onClick} sx={styles.navigationCard(color)}>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Box sx={styles.cardHeader}>
          <Box className="card-icon" component="div" sx={styles.cardIcon(color)}>
            {icon}
          </Box>
          <ArrowForwardIcon className="arrow-icon" sx={styles.arrowIcon(color)} />
        </Box>
        <Typography variant="h4" sx={styles.cardTitle(color)}>
          {title}
        </Typography>
        <Typography variant="body1" sx={styles.cardDescription}>
          {description}
        </Typography>
        <Button variant="contained" sx={styles.ctaButton(color)}>
          始める
        </Button>
      </CardContent>
    </Card>
  );
};

export default NavigationCard;
