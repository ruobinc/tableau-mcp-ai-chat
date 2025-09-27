import { Box, Typography } from '@mui/material';
import { JWTProvider } from '../providers/JWTProvider';
import TableauDashboard from '../features/tableau/TableauDashboard';

export default function TableauDashboardSample() {
  return (
    <JWTProvider defaultUsername="default-user" prefetchDefaultToken>
      <Box sx={{ height: '600px', width: '100%' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Tableau Dashboard with JWT Authentication
        </Typography>
        <TableauDashboard />
      </Box>
    </JWTProvider>
  );
}