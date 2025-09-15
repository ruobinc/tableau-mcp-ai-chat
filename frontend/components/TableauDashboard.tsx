"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';

interface TableauDashboardProps {
  username?: string;
}

interface JWTResponse {
  token: string;
  success: boolean;
}

export default function TableauDashboard({ username = 'default-user' }: TableauDashboardProps) {
  const [jwtToken, setJwtToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  // Tableau設定を環境変数から取得
  const tableauServerUrl = process.env.TABLEAU_SERVER_URL;
  const tableauSiteId = process.env.TABLEAU_SITE_ID;
  const tableauWorkbookId = process.env.TABLEAU_WORKBOOK_ID;
  const tableauViewName = process.env.TABLEAU_VIEW_NAME;

  // JWTトークンの取得
  const fetchJWTToken = useCallback(async (): Promise<void> => {
    try {
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

      if (data.success && data.token) {
        setJwtToken(data.token);
        setError('');
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

  useEffect(() => {
    if (jwtToken) {
      setLoading(false);
    }
  }, [jwtToken]);

  // サーバーサイドレンダリング時またはマウント前は何も表示しない
  if (!isMounted) {
    return null;
  }

  // 環境変数が設定されていない場合の処理
  if (!tableauServerUrl || !tableauSiteId || !tableauWorkbookId || !tableauViewName) {
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
  const vizUrl = `${tableauServerUrl}/t/${tableauSiteId}/views/${tableauWorkbookId}/${tableauViewName}?:embed=yes&:toolbar=no&:tabs=no&:token=${jwtToken}`;

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
            setError('ダッシュボードの読み込みに失敗しました');
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