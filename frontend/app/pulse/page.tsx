"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import dynamic from 'next/dynamic';
import Navigation from '../../components/Navigation';
import { pulseMetrics, pulseSiteName, tableauUserName } from '../../constants/constants';
import useInView from '../../hooks/useInView';
const TableauPulseEmbed = dynamic(() => import('../../components/TableauPulseEmbedSimple'), {
  ssr: false,
  loading: () => <Skeleton variant="rounded" height={320} sx={{ borderRadius: 2 }} />
});

interface MetricCardProps {
  metricId: string;
  username?: string;
  siteName?: string;
}

function MetricCard({ metricId, username, siteName }: MetricCardProps) {
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
        <TableauPulseEmbed
          username={username}
          metricId={metricId}
          siteName={siteName}
          width="100%"
          height="480px"
          layout="card"
        />
      ) : (
        <Skeleton
          variant="rounded"
          width="100%"
          height="100%"
          sx={{ borderRadius: 2, minHeight: 480 }}
        />
      )}
    </Paper>
  );
}

function LazyDetailEmbed() {
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
        <TableauPulseEmbed
          username={tableauUserName}
          metricId={firstMetric.id}
          siteName={pulseSiteName}
          width="100%"
          height="800px"
        />
      ) : (
        <Skeleton
          variant="rounded"
          width="100%"
          height={800}
          sx={{ borderRadius: 2 }}
        />
      )}
    </Paper>
  );
}

export default function PulsePage() {
  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8fafc'
    }}>
      <Navigation title="次世代スーパーストア ダッシュボード" />

      {/* Main Content */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc'
      }}>
        {/* Pulse Header */}
        <Paper elevation={0} sx={{
          borderRadius: 0,
          borderBottom: '1px solid #e2e8f0',
          px: 3,
          py: 2,
          backgroundColor: '#ffffff'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <TrendingUpIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
            <Typography variant="h6" sx={{
              fontWeight: 600,
              color: '#1e293b',
              fontSize: '1.1rem'
            }}>
              Tableau Pulse メトリクス
            </Typography>
          </Box>
        </Paper>

        {/* Tableau Pulse Kanban Cards */}
        <Box sx={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          p: 3
        }}>
          <Typography variant="h6" sx={{
            fontWeight: 600,
            color: '#1e293b',
            fontSize: '1.1rem',
            mb: 2
          }}>
            メトリクス一覧
          </Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(auto-fill, minmax(240px, 1fr))',
              md: 'repeat(auto-fill, minmax(280px, 1fr))',
              xl: 'repeat(4, minmax(280px, 1fr))'
            },
            gap: 3
          }}>
            {pulseMetrics.map((metric) => (
              <MetricCard
                key={metric.id}
                metricId={metric.id}
                username={tableauUserName}
                siteName={pulseSiteName}
              />
            ))}
          </Box>
        </Box>

        {/* Main Tableau Pulse Embed Content */}
        <Box sx={{
          flexGrow: 1,
          position: 'relative',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          minHeight: '800px'
        }}>
          <Box sx={{
            p: 3,
            borderBottom: '1px solid #e2e8f0'
          }}>
            <Typography variant="h6" sx={{
              fontWeight: 600,
              color: '#1e293b',
              fontSize: '1.1rem'
            }}>
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
}
