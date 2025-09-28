import { SmartToy } from '@mui/icons-material';
import { alpha, Box, keyframes, Typography, useTheme } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

// パフォーマンス最適化：CSSアニメーションをkeyframesで定義
const typingDots = keyframes`
  0%, 60%, 100% { opacity: 0.2; transform: scale(0.8); }
  30% { opacity: 1; transform: scale(1); }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
`;

const floatIcon = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-2px) rotate(1deg); }
  50% { transform: translateY(-1px) rotate(0deg); }
  75% { transform: translateY(-2px) rotate(-1deg); }
`;

interface LoadingIndicatorProps {
  isVisible: boolean;
  onCancel?: () => void;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = React.memo(
  ({ isVisible, onCancel }) => {
    const theme = useTheme();
    const [elapsedTime, setElapsedTime] = useState(0);

    // パフォーマンス最適化：メモ化されたスタイル
    const containerStyles = useMemo(
      () => ({
        p: 2,
        borderRadius: '20px 20px 20px 6px',
        backgroundColor: alpha(theme.palette.background.paper, 0.95),
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(10px)',
        position: 'relative' as const,
        overflow: 'hidden',
        minHeight: 64,
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        willChange: 'transform, opacity',
        // ハードウェアアクセラレーションを有効化
        transform: 'translateZ(0)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          opacity: 0.8,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.6)}, transparent)`,
          animation: `${shimmer} 2s infinite ease-in-out`,
          willChange: 'transform',
        },
      }),
      [theme]
    );

    const dotStyles = useMemo(
      () => ({
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        margin: '0 2px',
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
      }),
      [theme.palette.primary.main]
    );

    // 時間管理ロジック（パフォーマンス重視）
    useEffect(() => {
      if (!isVisible) {
        setElapsedTime(0);
        return;
      }

      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setElapsedTime(elapsed);
      }, 100);

      return () => clearInterval(timer);
    }, [isVisible]);

    if (!isVisible) return null;

    return (
      <Box sx={containerStyles}>
        {/* メインコンテンツ */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* AI思考アイコン */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: `${pulseGlow} 2s ease-in-out infinite`,
                willChange: 'transform, opacity',
                transform: 'translateZ(0)',
              }}
            >
              <SmartToy
                sx={{
                  fontSize: 18,
                  color: theme.palette.primary.main,
                  animation: `${floatIcon} 3s ease-in-out infinite`,
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
              />
            </Box>
          </Box>

          {/* テキストとドット */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.5,
                  fontSize: '0.95rem',
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                  transition: 'color 0.3s ease',
                }}
              >
                AI が回答を生成中
              </Typography>

              {/* タイピングドットアニメーション */}
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 0.5 }}>
                {[0, 1, 2].map((index) => (
                  <Box
                    key={index}
                    sx={{
                      ...dotStyles,
                      animation: `${typingDots} 1.4s ease-in-out infinite`,
                      animationDelay: `${index * 0.2}s`,
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* 進行状況バー */}
            <Box
              sx={{
                mt: 1,
                height: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: 1,
                  transition: 'width 0.3s ease',
                  width: `${Math.min(((elapsedTime % 10000) / 10000) * 100, 100)}%`,
                  willChange: 'width',
                }}
              />
            </Box>

            {/* 経過時間表示 */}
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.7rem',
                mt: 0.5,
                display: 'block',
              }}
            >
              {Math.floor(elapsedTime / 1000)}秒経過
              {onCancel && (
                <Box
                  component="span"
                  onClick={onCancel}
                  sx={{
                    ml: 1,
                    color: theme.palette.primary.main,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    '&:hover': {
                      color: theme.palette.primary.dark,
                    },
                  }}
                >
                  キャンセル
                </Box>
              )}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
);

LoadingIndicator.displayName = 'LoadingIndicator';
