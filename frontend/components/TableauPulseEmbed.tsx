"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useJWTToken } from '../hooks/useJWTToken';

interface TableauPulseEmbedProps {
  username?: string;
  metricId?: string;
  siteName?: string;
  height?: string | number;
  width?: string | number;
}

export default function TableauPulseEmbed({
  username = 'default-user',
  metricId = '',
  siteName = '',
  height = '100%',
  width = '100%'
}: TableauPulseEmbedProps) {
  const [isMounted, setIsMounted] = useState(false);
  const pulseRef = useRef<HTMLDivElement>(null);
  const { jwtToken, loading: jwtLoading, error: jwtError } = useJWTToken(username);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Tableau Embedding APIの読み込み待機
  const waitForTableauAPI = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const checkAPI = () => {
        if (typeof window !== 'undefined') {
          const windowWithTableau = window as Window & {
            customElements?: CustomElementRegistry;
            tableau?: unknown;
          };

          console.log('Checking Tableau API availability:', {
            customElements: !!windowWithTableau.customElements,
            tableauPulseRegistered: !!windowWithTableau.customElements?.get('tableau-pulse'),
            tableauObject: !!windowWithTableau.tableau
          });

          if (windowWithTableau.customElements?.get('tableau-pulse')) {
            console.log('tableau-pulse custom element found');
            resolve();
          } else if (windowWithTableau.tableau) {
            console.log('tableau object found');
            resolve();
          } else {
            console.log('Tableau API not ready yet, checking again...');
            setTimeout(checkAPI, 500);
          }
        }
      };

      // 15秒でタイムアウト
      setTimeout(() => {
        console.error('Tableau API loading timeout');
        reject(new Error('Tableau Embedding API の読み込みがタイムアウトしました'));
      }, 15000);

      checkAPI();
    });
  };

  // クライアントサイドでのマウント状態を管理
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Tableau Pulse初期化（JavaScript APIアプローチ）
  const initializePulse = useCallback(async () => {
    if (!jwtToken) {
      console.log('JWT token not available yet');
      return;
    }

    if (!pulseRef.current) {
      console.log('Pulse ref not available yet');
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('Initializing Tableau Pulse with JavaScript API...');
      console.log('MetricId:', metricId);
      console.log('SiteName:', siteName);
      console.log('JWT Token available:', !!jwtToken);
      console.log('Pulse ref current:', pulseRef.current);

      // Tableau Embedding APIが読み込まれるまで待機
      await waitForTableauAPI();
      console.log('Tableau API loaded successfully');

      // 再度nullチェック（非同期処理後）
      if (!pulseRef.current) {
        console.error('Pulse ref became null during initialization');
        setError('コンテナ要素が見つかりません');
        setLoading(false);
        return;
      }

      // コンテナをクリア
      pulseRef.current.innerHTML = '';

      // 正しいURL形式で設定 (site指定も含める)
      const pulseUrl = siteName
        ? `https://prod-apnortheast-a.online.tableau.com/pulse/site/${siteName}/metrics/${metricId}`
        : `https://prod-apnortheast-a.online.tableau.com/pulse/metrics/${metricId}`;

      console.log('Pulse URL:', pulseUrl);

      // 直接Web Component HTMLとしてtableau-pulseを設定
      console.log('Using direct Web Component approach');

      // 一意のIDを生成
      const pulseId = `tableau-pulse-${Date.now()}`;

      const pulseHTML = `
        <tableau-pulse
          id="${pulseId}"
          src="${pulseUrl}"
          token="${jwtToken}"
          width="${typeof width === 'string' ? width : `${width}px`}"
          height="${typeof height === 'string' ? height : `${height}px`}"
          layout="default">
        </tableau-pulse>
      `;

      if (pulseRef.current) {
        pulseRef.current.innerHTML = pulseHTML;

        // 少し待ってから要素を取得してイベントリスナーを追加
        setTimeout(() => {
          const pulseElement = document.getElementById(pulseId);
          if (pulseElement) {
            console.log('Pulse element found, setting up event listeners');

            pulseElement.addEventListener('firstinteractive', () => {
              console.log('Tableau Pulse is ready');
              setLoading(false);
            });

            pulseElement.addEventListener('error', (event: Event) => {
              console.error('Tableau Pulse error event:', event);
              const errorEvent = event as CustomEvent<{ message?: string }>;
              setError(`Pulse読み込みエラー: ${errorEvent.detail?.message || 'Unknown error'}`);
              setLoading(false);
            });

            pulseElement.addEventListener('load', () => {
              console.log('Tableau Pulse loaded');
              setLoading(false);
            });

            console.log('Event listeners added to pulse element');
          } else {
            console.error('Could not find pulse element after creation');
            setError('Pulse要素が見つかりません');
            setLoading(false);
          }
        }, 100);

      } else {
        console.error('Pulse ref is null when setting innerHTML');
        setError('コンテナ要素が見つかりません');
        setLoading(false);
        return;
      }

      // タイムアウト処理
      setTimeout(() => {
        console.log('Checking loading state after 5 seconds...');
        setLoading(false);
      }, 5000);

    } catch (err) {
      console.error('Failed to initialize Tableau Pulse:', err);
      setError(`初期化エラー: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  }, [jwtToken, metricId, siteName, width, height]);

  useEffect(() => {
    // 少し遅延させてDOM要素が確実に準備されるようにする
    const timeoutId = setTimeout(() => {
      if (jwtToken && pulseRef.current && metricId && isMounted) {
        console.log('Starting Pulse initialization...');
        initializePulse();
      } else {
        console.log('Pulse initialization skipped:', {
          jwtToken: !!jwtToken,
          pulseRefCurrent: !!pulseRef.current,
          metricId: !!metricId,
          isMounted
        });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [jwtToken, metricId, isMounted, initializePulse]);

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
  if (loading || jwtLoading) {
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
  if (error || jwtError) {
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
          {error || jwtError}
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

  return (
    <Box sx={{
      height: '100%',
      width: '100%',
      position: 'relative'
    }}>
      {/* Tableau Pulse Container */}
      <Box
        ref={pulseRef}
        sx={{
          width: '100%',
          height: '100%',
          '& tableau-pulse': {
            width: '100%',
            height: '100%',
            display: 'block'
          }
        }}
      />

      {/* Loading overlay for JWT token */}
      {jwtToken && !error && loading && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 10
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