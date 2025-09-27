import React, { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useJWTToken } from '@/features/tableau/hooks/useJWTToken';
import { TableauPulse } from '@/features/tableau/components/TableauEmbedding';

interface TableauPulseEmbedProps {
  username?: string;
  metricId?: string;
  siteName?: string;
  height?: string | number;
  width?: string | number;
  layout?: 'default' | 'card' | 'ban';
}

const TableauPulseEmbedSimple: React.FC<TableauPulseEmbedProps> = ({
  username = 'default-user',
  metricId = '',
  siteName = '',
  height = '100%',
  width = '100%',
  layout = 'default'
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { jwtToken, loading, error } = useJWTToken(username);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!metricId) {
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
        <TrendingUpIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500, mb: 1 }}>
          Tableau Pulse設定が必要です
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: 400, lineHeight: 1.6, textAlign: 'center' }}>
          メトリクスIDを設定してTableau Pulseを表示してください。
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
          Tableau Pulseを読み込み中...
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
          Tableau Pulseサーバーの接続設定を確認してください。
        </Typography>
      </Box>
    );
  }

  const pulseUrl = siteName
    ? `https://prod-apnortheast-a.online.tableau.com/pulse/site/${siteName}/metrics/${metricId}`
    : `https://prod-apnortheast-a.online.tableau.com/pulse/metrics/${metricId}`;

  const normalizedWidth = typeof width === 'number' ? `${width}px` : width;
  const normalizedHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%'
      }}
    >
      {jwtToken ? (
        <TableauPulse
          src={pulseUrl}
          token={jwtToken}
          width={normalizedWidth}
          height={normalizedHeight}
          layout={layout}
          iframeAuth
          iframeStyle="border: none; border-radius: 8px;"
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
          <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500, textAlign: 'center' }}>
            認証中...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TableauPulseEmbedSimple;
