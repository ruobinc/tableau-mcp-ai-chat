import React, { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useJWTToken } from '@/features/tableau/hooks/useJWTToken';

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
  const [isApiReady, setIsApiReady] = useState(false);
  const { jwtToken, loading, error } = useJWTToken(username);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    let cancelled = false;

    const markReady = () => {
      if (!cancelled) {
        setIsApiReady(true);
      }
    };

    if (typeof window !== 'undefined' && 'customElements' in window) {
      const registry = window.customElements;
      if (registry.get('tableau-pulse')) {
        markReady();
      } else {
        registry
          .whenDefined('tableau-pulse')
          .then(markReady)
          .catch(() => {
            if (!cancelled) {
              setIsApiReady(false);
            }
          });
      }
    }

    return () => {
      cancelled = true;
    };
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  if (!isApiReady) {
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
        <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500, textAlign: 'center' }}>
          Tableau Pulseを初期化しています...
        </Typography>
      </Box>
    );
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

  return (
    <div
      style={{
        width: '100%',
        height: '100%'
      }}
      dangerouslySetInnerHTML={{
        __html: `
          <tableau-pulse
            src="${pulseUrl}"
            token="${jwtToken}"
            width="${typeof width === 'string' ? width : `${width}px`}"
            height="${typeof height === 'string' ? height : `${height}px`}"
            layout="${layout}">
          </tableau-pulse>
        `
      }}
    />
  );
};

export default TableauPulseEmbedSimple;
