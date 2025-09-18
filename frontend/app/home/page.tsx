"use client";
import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SparkleIcon from '@mui/icons-material/AutoAwesome';
import Navigation from '../../components/Navigation';

export default function HomePage() {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Video */}
      <Box
        component="video"
        autoPlay
        muted
        loop
        playsInline
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
          filter: 'brightness(0.3) blur(1px)'
        }}
      >
        <source src="/home-video.mp4" type="video/mp4" />
      </Box>

      {/* Overlay for better readability */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: -1
      }} />

      <Navigation />

      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
        position: 'relative',
        zIndex: 1
      }}>
        <Paper sx={{
          p: { xs: 3, sm: 5, md: 6 },
          maxWidth: { xs: '90%', sm: '85%', md: 750 },
          width: '100%',
          textAlign: 'center',
          borderRadius: 4,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #10b981)',
            animation: 'shimmer 3s linear infinite'
          },
          '@keyframes shimmer': {
            '0%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '200% 0' }
          }
        }}>
          {/* Status Badge and Icon Container */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4
          }}>
            <Chip
              icon={<SparkleIcon sx={{ fontSize: 16 }} />}
              label="AI-Powered Analytics"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(59, 130, 246, 0.15)'
                }
              }}
            />

            {/* Hero Icon with Animation */}
            <Box sx={{
              display: 'inline-block',
              position: 'relative'
            }}>
              <HomeIcon sx={{
                fontSize: { xs: 56, sm: 72 },
                color: '#3b82f6',
                filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-8px)' }
                }
              }} />
              {/* Pulse Effect */}
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                borderRadius: '50%',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 1
                  },
                  '100%': {
                    transform: 'translate(-50%, -50%) scale(1.3)',
                    opacity: 0
                  }
                }
              }} />
            </Box>
          </Box>

          {/* Enhanced Title */}
          <Typography variant="h2" sx={{
            fontWeight: 800,
            background: 'linear-gradient(45deg, #1e293b, #3b82f6, #8b5cf6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3,
            fontSize: { xs: '2rem', sm: '3rem' },
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            次世代スーパーストア
            <br />
            ダッシュボード
          </Typography>

          {/* Enhanced Subtitle */}
          <Typography variant="h6" sx={{
            color: '#64748b',
            fontWeight: 400,
            mb: 4,
            lineHeight: 1.6,
            fontSize: { xs: '1rem', sm: '1.2rem' },
            maxWidth: 480,
            mx: 'auto',
            textAlign: 'center'
          }}>
            ようこそ！AI駆動のデータ分析と
            <br />
            インテリジェントな会話機能を備えた
            <br />
            <Box component="span" sx={{
              color: '#3b82f6',
              fontWeight: 600,
              textDecoration: 'underline',
              textDecorationColor: 'rgba(59, 130, 246, 0.3)'
            }}>
              次世代統合ダッシュボード
            </Box>
            へ
          </Typography>

          {/* Enhanced Action Cards */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: { xs: 3, md: 4 },
            mt: 1,
            width: '100%',
            maxWidth: { xs: '100%', md: '600px' },
            mx: 'auto'
          }}>
            {/* Performance Card */}
            <Paper
              elevation={0}
              onClick={() => handleNavigate('/performance')}
              sx={{
                p: { xs: 3, sm: 4 },
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.1) 100%)',
                borderRadius: 3,
                border: '2px solid rgba(59, 130, 246, 0.2)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)',
                  borderColor: 'rgba(59, 130, 246, 0.4)',
                  '& .arrow-icon': {
                    transform: 'translateX(8px)'
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  transition: 'left 0.8s ease'
                },
                '&:hover::before': {
                  left: '100%'
                }
              }}
            >
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2
              }}>
                <AssessmentIcon sx={{
                  fontSize: { xs: 32, sm: 40 },
                  color: '#3b82f6',
                  filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
                }} />
                <ArrowForwardIcon
                  className="arrow-icon"
                  sx={{
                    fontSize: 24,
                    color: '#3b82f6',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </Box>
              <Typography variant="h5" sx={{
                color: '#1e40af',
                fontWeight: 700,
                mb: 1.5,
                fontSize: { xs: '1.3rem', sm: '1.5rem' }
              }}>
                業績一覧
              </Typography>
              <Typography variant="body1" sx={{
                color: '#64748b',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                lineHeight: 1.6,
                mb: 2
              }}>
                TableauダッシュボードとTableau MCPを活用したAI分析アシスタントで包括的な業績分析
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#2563eb'
                  }
                }}
              >
                詳細を見る
              </Button>
            </Paper>

            {/* Metrics Card */}
            <Paper
              elevation={0}
              onClick={() => handleNavigate('/pulse')}
              sx={{
                p: { xs: 3, sm: 4 },
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(167, 243, 208, 0.1) 100%)',
                borderRadius: 3,
                border: '2px solid rgba(16, 185, 129, 0.2)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)',
                  borderColor: 'rgba(16, 185, 129, 0.4)',
                  '& .arrow-icon': {
                    transform: 'translateX(8px)'
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  transition: 'left 0.8s ease'
                },
                '&:hover::before': {
                  left: '100%'
                }
              }}
            >
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2
              }}>
                <TrendingUpIcon sx={{
                  fontSize: { xs: 32, sm: 40 },
                  color: '#10b981',
                  filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))'
                }} />
                <ArrowForwardIcon
                  className="arrow-icon"
                  sx={{
                    fontSize: 24,
                    color: '#10b981',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </Box>
              <Typography variant="h5" sx={{
                color: '#047857',
                fontWeight: 700,
                mb: 1.5,
                fontSize: { xs: '1.3rem', sm: '1.5rem' }
              }}>
                メトリクス
              </Typography>
              <Typography variant="body1" sx={{
                color: '#64748b',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                lineHeight: 1.6,
                mb: 2
              }}>
                Tableau Pulseによるリアルタイム監視と生成AIによるインサイト発見
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderColor: '#10b981',
                  color: '#10b981',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderColor: '#059669'
                  }
                }}
              >
                詳細を見る
              </Button>
            </Paper>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}