"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Navigation from '../../components/Navigation';
import { pulseMetrics, pulseSiteName, tableauUserName } from '../../constants/constants';
import dynamic from 'next/dynamic';
const TableauPulseEmbed = dynamic(() => import('../../components/TableauPulseEmbedSimple'), {
  ssr: false,
  loading: () => null
});

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
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            maxWidth: '100%',
            overflowX: 'auto',
            height: '480px'
          }}>
            {pulseMetrics.map((metric) => (
              <TableauPulseEmbed
                key={metric.id}
                username={tableauUserName}
                metricId={metric.id}
                siteName={pulseSiteName}
                width="100%"
                height="480px"
                layout="card"
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
            <TableauPulseEmbed
              username={tableauUserName}
              metricId={pulseMetrics[0].id}
              siteName={pulseSiteName}
              width="100%"
              height="800px"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}