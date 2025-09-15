"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import { tableauEmbeddedUrl } from '../constants/constants';
import { useJWTToken } from '../hooks/useJWTToken';

interface TableauDashboardProps {
  username?: string;
}

export default function TableauDashboard({ username = 'default-user' }: TableauDashboardProps) {
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

  // 環境変数が設定されていない場合の処理
  if (!tableauEmbeddedUrl) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        p: 4
      }}>
        <BarChartIcon sx={{
          fontSize: 80,
          color: '#cbd5e1',
          mb: 2
        }} />
        <Typography variant="h6" sx={{
          color: '#64748b',
          fontWeight: 500,
          mb: 1
        }}>
          Tableau設定が必要です
        </Typography>
        <Typography variant="body2" sx={{
          color: '#94a3b8',
          maxWidth: 400,
          lineHeight: 1.6,
          textAlign: 'center'
        }}>
          .env.localファイルでTableauサーバーの設定を行ってください。
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
          Tableauダッシュボードを読み込み中...
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
          Tableauサーバーの接続設定を確認してください。
        </Typography>
      </Box>
    );
  }

  // Tableau Vizの表示URL構築（JWTトークン付き）
  const vizUrl = `${tableauEmbeddedUrl}?:embed=yes&:toolbar=no&:tabs=no&:token=${jwtToken}`;

  return (
    <Box sx={{
      height: '100%',
      width: '100%',
      position: 'relative'
    }}>
      {jwtToken ? (
        <iframe
          src={vizUrl}
          width="100%"
          height="100%"
          style={{
            border: 'none',
            borderRadius: '8px'
          }}
          onLoad={() => {
            console.log('Tableau iframe loaded successfully');
          }}
          onError={() => {
            console.error('ダッシュボードの読み込みに失敗しました');
          }}
        />
      ) : (
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
            認証中...
          </Typography>
        </Box>
      )}
    </Box>
  );
}