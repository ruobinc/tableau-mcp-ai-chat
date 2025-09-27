import React, { Suspense } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Navigation from '@/components/navigation/Navigation';
import { pulseMetrics, pulseSiteName, tableauUserName } from '@/config/tableau';
import useInView from '@/lib/hooks/useInView';
import { CircularProgress } from '@mui/material';

const TableauPulseEmbed = React.lazy(() => import('@/features/tableau/TableauPulseEmbedSimple'));

interface MetricCardProps {
  metricId: string;
  username?: string;
  siteName?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ metricId, username, siteName }) => {
  const { ref, isInView } = useInView<HTMLDivElement>({ rootMargin: '200px' });

  return (
    <Paper
      ref={ref}
      elevation={0}
      sx={{
        border: '1px solid #e2e8f0',
        borderRadius: 2,
        p: 1.5,
        backgroundColor: '#f8fafc',
        minHeight: 480,
        display: 'flex',
        alignItems: 'stretch'
      }}
    >
      {isInView ? (
        <Suspense
          fallback={
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress size={32} sx={{ color: '#3b82f6' }} />
            </Box>
          }
        >
          <TableauPulseEmbed
            username={username}
            metricId={metricId}
            siteName={siteName}
            width="100%"
            height="480px"
            layout="card"
          />
        </Suspense>
      ) : (
        <Skeleton variant="rounded" width="100%" height="100%" sx={{ borderRadius: 2, minHeight: 480 }} />
      )}
    </Paper>
  );
};

const LazyDetailEmbed: React.FC = () => {
  const firstMetric = pulseMetrics[0];
  const { ref, isInView } = useInView<HTMLDivElement>({ rootMargin: '300px' });

  if (!firstMetric) {
    return (
      <Paper
        elevation={0}
        sx={{
          border: '1px dashed #cbd5e1',
          borderRadius: 2,
          p: 3,
          backgroundColor: '#f8fafc',
          color: '#64748b'
        }}
      >
        メトリクスが設定されていません。
      </Paper>
    );
  }

  return (
    <Paper
      ref={ref}
      elevation={0}
      sx={{
        border: '1px solid #e2e8f0',
        borderRadius: 2,
        p: 1.5,
        minHeight: 800,
        backgroundColor: '#f8fafc'
      }}
    >
      {isInView ? (
        <Suspense
          fallback={
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 10 }}>
              <CircularProgress size={32} sx={{ color: '#3b82f6' }} />
            </Box>
          }
        >
          <TableauPulseEmbed
            username={tableauUserName}
            metricId={firstMetric.id}
            siteName={pulseSiteName}
            width="100%"
            height="800px"
          />
        </Suspense>
      ) : (
        <Skeleton variant="rounded" width="100%" height={800} sx={{ borderRadius: 2 }} />
      )}
    </Paper>
  );
};

const PulsePage: React.FC = () => (
  <Box
    sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8fafc'
    }}
  >
    <Navigation title="次世代スーパーストア ダッシュボード" />

    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          borderBottom: '1px solid #e2e8f0',
          px: 3,
          py: 2,
          backgroundColor: '#ffffff'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TrendingUpIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.1rem' }}>
            Tableau Pulse メトリクス
          </Typography>
        </Box>
      </Paper>

      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          p: 3
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.1rem', mb: 2 }}>
          メトリクス一覧
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(auto-fill, minmax(240px, 1fr))',
              md: 'repeat(auto-fill, minmax(280px, 1fr))',
              xl: 'repeat(4, minmax(280px, 1fr))'
            },
            gap: 3
          }}
        >
          {pulseMetrics.map((metric) => (
            <MetricCard key={metric.id} metricId={metric.id} username={tableauUserName} siteName={pulseSiteName} />
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          position: 'relative',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          minHeight: '800px'
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.1rem' }}>
            メトリクス詳細
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <LazyDetailEmbed />
        </Box>
      </Box>
    </Box>
  </Box>
);

export default PulsePage;
