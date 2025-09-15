"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface TableauPulseEmbedProps {
  username?: string;
  metricId?: string;
  siteName?: string;
  height?: string | number;
  width?: string | number;
}

interface JWTResponse {
  token: string;
  success: boolean;
}

export default function TableauPulseEmbedSimple({
  username = 'default-user',
  metricId = '',
  siteName = '',
  height = '100%',
  width = '100%'
}: TableauPulseEmbedProps) {
  const [jwtToken, setJwtToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  // JWTトークンの取得
  const fetchJWTToken = useCallback(async (): Promise<void> => {
    try {
      console.log('Fetching JWT token for username:', username);
      const response = await fetch('http://localhost:8000/api/jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error('JWT取得に失敗しました');
      }

      const data: JWTResponse = await response.json();
      console.log('JWT response received:', { success: data.success, tokenLength: data.token?.length });

      if (data.success && data.token) {
        setJwtToken(data.token);
        setError('');
        console.log('JWT token set successfully');
      } else {
        throw new Error('有効なJWTトークンが取得できませんでした');
      }
    } catch (err) {
      console.error('JWT取得エラー:', err);
      setError(err instanceof Error ? err.message : 'JWT取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [username]);

  // クライアントサイドでのマウント状態を管理
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      fetchJWTToken();
    }
  }, [isMounted, fetchJWTToken]);

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
    <Box sx={{
      height: '100%',
      width: '100%',
      position: 'relative'
    }}>
      {/* Pure HTML approach with tableau-pulse */}
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
              layout="default">
            </tableau-pulse>
          `
        }}
      />
    </Box>
  );
}