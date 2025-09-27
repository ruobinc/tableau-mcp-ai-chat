import { useEffect, useState, type FC } from 'react';
import { Alert, Box, CircularProgress, Typography, Paper } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { TableauPulse } from '@tableau/embedding-api-react';
import { JWTProvider } from '../../providers/JWTProvider';
import { useJWTToken } from './hooks/useJWTToken';
import { pulseMetrics, pulseSiteName, tableauUserName } from '../../config/tableau';

interface SinglePulseProps {
  username?: string;
  metricId?: string;
  siteName?: string;
  height?: string | number;
  width?: string | number;
  layout?: 'default' | 'card' | 'ban';
}

interface TableauPulseEmbedProps {
  mode?: 'single' | 'multiple';
  username?: string;
  metricId?: string;
  siteName?: string;
  height?: string | number;
  width?: string | number;
  layout?: 'default' | 'card' | 'ban';
}

// 単一メトリクス表示コンポーネント
const SinglePulse: FC<SinglePulseProps> = ({
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

// 複数メトリクス表示コンポーネント
const MultiplePulseView: FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <TrendingUpIcon sx={{ color: '#3b82f6', fontSize: 24 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
          Tableau Pulse メトリクス
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ color: '#64748b', mb: 4, lineHeight: 1.6 }}>
        Tableau Pulseは、データに関する自動化された洞察とアラートを提供します。
        以下は設定されたメトリクスのサンプル表示です。
      </Typography>

      {pulseMetrics.length > 0 ? (
        <>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
            メトリクス一覧
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(auto-fill, minmax(300px, 1fr))',
                md: 'repeat(auto-fill, minmax(350px, 1fr))',
                lg: 'repeat(3, 1fr)'
              },
              gap: 3,
              mb: 4
            }}
          >
            {pulseMetrics.map((metric) => (
              <Paper
                key={metric.id}
                elevation={0}
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  p: 1.5,
                  backgroundColor: '#f8fafc',
                  minHeight: 400
                }}
              >
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1, px: 1 }}>
                  {metric.name}
                </Typography>
                <SinglePulse
                  username={tableauUserName}
                  metricId={metric.id}
                  siteName={pulseSiteName}
                  width="100%"
                  height="350px"
                  layout="card"
                />
              </Paper>
            ))}
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
            詳細ビュー
          </Typography>
          <Paper
            elevation={0}
            sx={{
              border: '1px solid #e2e8f0',
              borderRadius: 2,
              p: 1.5,
              backgroundColor: '#f8fafc',
              minHeight: 600
            }}
          >
            <SinglePulse
              username={tableauUserName}
              metricId={pulseMetrics[0].id}
              siteName={pulseSiteName}
              width="100%"
              height="550px"
              layout="default"
            />
          </Paper>
        </>
      ) : (
        <Paper
          elevation={0}
          sx={{
            border: '1px dashed #cbd5e1',
            borderRadius: 2,
            p: 4,
            backgroundColor: '#f8fafc',
            textAlign: 'center'
          }}
        >
          <TrendingUpIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500, mb: 1 }}>
            メトリクスが設定されていません
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            .env.local でTableau Pulseメトリクスを設定してください。
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

// メインコンポーネント
const TableauPulseEmbed: FC<TableauPulseEmbedProps> = ({
  mode = 'single',
  username,
  metricId,
  siteName,
  height,
  width,
  layout
}) => {
  if (mode === 'multiple') {
    return (
      <JWTProvider defaultUsername={tableauUserName || 'default-user'} prefetchDefaultToken>
        <MultiplePulseView />
      </JWTProvider>
    );
  }

  // 単一モードの場合
  return (
    <SinglePulse
      username={username}
      metricId={metricId}
      siteName={siteName}
      height={height}
      width={width}
      layout={layout}
    />
  );
};

export default TableauPulseEmbed;