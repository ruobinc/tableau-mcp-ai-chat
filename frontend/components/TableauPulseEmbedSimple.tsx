"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useJWTToken } from '../hooks/useJWTToken';

interface TableauPulseEmbedProps {
  username?: string;
  metricId?: string;
  siteName?: string;
  height?: string | number;
  width?: string | number;
  layout?: 'default' | 'card' | 'ban';
}

export default function TableauPulseEmbedSimple({
  username = 'default-user',
  metricId = '',
  siteName = '',
  height = '100%',
  width = '100%',
  layout = 'default'
}: TableauPulseEmbedProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { jwtToken, loading, error } = useJWTToken(username);

  // クライアントサイドでのマウント状態を管理
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // サーバーサイドレンダリング時またはマウント前は何も表示しない
  if (!isMounted) {
    return null;
  }

  // メトリクスIDが設定されていない場合の処理
  if (!metricId) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        p: 4
      }}>
        <TrendingUpIcon sx={{
          fontSize: 80,
          color: '#cbd5e1',
          mb: 2
        }} />
        <Typography variant="h6" sx={{
          color: '#64748b',
          fontWeight: 500,
          mb: 1
        }}>
          Tableau Pulse設定が必要です
        </Typography>
        <Typography variant="body2" sx={{
          color: '#94a3b8',
          maxWidth: 400,
          lineHeight: 1.6,
          textAlign: 'center'
        }}>
          メトリクスIDを設定してTableau Pulseを表示してください。
        </Typography>
      </Box>
    );
  }

  // ローディング中
  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        p: 4
      }}>
        <CircularProgress size={40} sx={{ color: '#3b82f6', mb: 2 }} />
        <Typography variant="body1" sx={{
          color: '#64748b',
          fontWeight: 500
        }}>
          Tableau Pulseを読み込み中...
        </Typography>
      </Box>
    );
  }

  // エラーが発生した場合
  if (error) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        p: 4
      }}>
        <Alert severity="error" sx={{ mb: 2, maxWidth: 400 }}>
          {error}
        </Alert>
        <Typography variant="body2" sx={{
          color: '#94a3b8',
          textAlign: 'center'
        }}>
          Tableau Pulseサーバーの接続設定を確認してください。
        </Typography>
      </Box>
    );
  }

  // 正しいURL形式で設定
  const pulseUrl = siteName
    ? `https://prod-apnortheast-a.online.tableau.com/pulse/site/${siteName}/metrics/${metricId}`
    : `https://prod-apnortheast-a.online.tableau.com/pulse/metrics/${metricId}`;

  console.log('Rendering Tableau Pulse with URL:', pulseUrl);

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
}