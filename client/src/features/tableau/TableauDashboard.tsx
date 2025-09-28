import { useEffect, useState, type FC } from 'react';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import { TableauViz } from '@tableau/embedding-api-react';
import { tableauEmbeddedUrl, tableauUserName } from '../../config/tableau';
import { useJWTToken } from './hooks/useJWTToken';

interface TableauDashboardProps {
  username?: string;
}

const resolveUsername = (value?: string) => {
  if (value && value !== 'undefined') {
    return value;
  }
  if (tableauUserName && tableauUserName !== 'undefined') {
    return tableauUserName;
  }
  return 'default-user';
};

const TableauDashboard: FC<TableauDashboardProps> = ({ username }) => {
  const [isMounted, setIsMounted] = useState(false);
  const resolvedUsername = resolveUsername(username);
  const { jwtToken, loading, error } = useJWTToken(resolvedUsername);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!tableauEmbeddedUrl) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: 4
        }}
      >
        <BarChartIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500, mb: 1 }}>
          Tableau設定が必要です
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: 400, lineHeight: 1.6, textAlign: 'center' }}>
          .env.local で Tableau サーバーの設定を行ってください。
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: 4
        }}
      >
        <CircularProgress size={40} sx={{ color: '#3b82f6', mb: 2 }} />
        <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
          Tableauダッシュボードを読み込み中...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: 4
        }}
      >
        <Alert severity="error" sx={{ mb: 2, maxWidth: 400 }}>
          {error}
        </Alert>
        <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center' }}>
          Tableauサーバーの接続設定を確認してください。
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        position: 'relative'
      }}
    >
      {jwtToken ? (
        <TableauViz
          src={tableauEmbeddedUrl}
          token={jwtToken}
          toolbar="hidden"
          hideTabs
          width="100%"
          device="desktop"
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            p: 4
          }}
        >
          <CircularProgress size={40} sx={{ color: '#3b82f6', mb: 2 }} />
          <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
            認証中...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TableauDashboard;