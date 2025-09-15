"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Navigation from '../../components/Navigation';
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
      <Navigation title="メトリクス - Tableau Pulse" />

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

        {/* Tableau Pulse Embed Content */}
        <Box sx={{
          flexGrow: 1,
          position: 'relative',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          minHeight: '800px'
        }}>
          <TableauPulseEmbed
            username="ruobin.chang@salesforce.com"
            metricId="80bed8ec-9478-426b-a116-bcb3a6549b4b" // メトリクスIDを設定
            siteName="ruobin-demo" // サイト名を設定
            width="100%"
            height="800px"
          />
        </Box>
      </Box>
    </Box>
  );
}