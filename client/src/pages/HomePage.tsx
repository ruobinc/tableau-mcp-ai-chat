import {
  Analytics as AnalyticsIcon,
  ArrowForward as ArrowForwardIcon,
  Assessment as AssessmentIcon,
  AutoAwesome as SparkleIcon,
  Home as HomeIcon,
  Insights as InsightsIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Fade,
  Grid,
  Grow,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const features = [
    {
      icon: <AnalyticsIcon />,
      title: 'AIデータ分析',
      description: '高度なAIモデルでデータのトレンドとパターンを自動識別',
    },
    {
      icon: <SpeedIcon />,
      title: 'リアルタイム更新',
      description: 'ライブデータ接続で常に最新の情報を表示',
    },
    {
      icon: <InsightsIcon />,
      title: 'インサイト発見',
      description: '自然言語で質問し、AIが的確な答えを提供',
    },
    {
      icon: <TimelineIcon />,
      title: '予測モデリング',
      description: '機械学習で将来のトレンドを予測・可視化',
    },
  ];

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'auto',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            theme.palette.mode === 'dark'
              ? 'radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.03) 0%, transparent 70%)'
              : 'radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.02) 0%, transparent 70%)',
          zIndex: -1,
          willChange: 'opacity',
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          py: { xs: 4, sm: 6, md: 8 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ヒーローセクション */}
        <Fade in={isLoaded} timeout={800}>
          <Box
            sx={{
              textAlign: 'center',
              mb: { xs: 6, md: 8 },
            }}
          >
            <Grow in={isLoaded} timeout={1000}>
              <Box
                sx={{
                  display: 'inline-block',
                  position: 'relative',
                  mb: 4,
                }}
              >
                <Chip
                  icon={<SparkleIcon sx={{ fontSize: 16 }} />}
                  label="Next-Gen AI Analytics Platform"
                  sx={{
                    mb: 3,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)',
                  }}
                />

                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                  }}
                >
                  <HomeIcon
                    sx={{
                      fontSize: { xs: 64, sm: 80, md: 96 },
                      color: theme.palette.primary.main,
                      filter: `drop-shadow(0 2px 8px ${alpha(theme.palette.primary.main, 0.2)})`,
                      transition: 'transform 0.3s ease',
                      willChange: 'transform',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      },
                    }}
                  />
                </Box>
              </Box>
            </Grow>

            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                backgroundSize: '200% auto',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                willChange: 'background',
              }}
            >
              次世代スーパーストア
              <br />
              ダッシュボード
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 400,
                mb: 6,
                lineHeight: 1.6,
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              AI駆動のデータ分析とインテリジェントな会話機能を備えた
              <Box
                component="span"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  display: 'block',
                  mt: 1,
                }}
              >
                革新的統合アナリティクスプラットフォーム
              </Box>
            </Typography>

            {/* 機能ハイライト */}
            <Grid container spacing={3} sx={{ mb: 6, justifyContent: 'center' }}>
              {features.map((feature, index) => (
                <Grow key={feature.title} in={isLoaded} timeout={1200 + index * 200}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card
                      sx={{
                        height: '100%',
                        background: alpha(theme.palette.background.paper, 0.7),
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        borderRadius: 3,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            mb: 2,
                            fontSize: '2rem',
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grow>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* メインカード */}
        <Grow in={isLoaded} timeout={1600}>
          <Paper
            sx={{
              p: { xs: 4, sm: 6, md: 8 },
              borderRadius: 4,
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              position: 'relative',
              overflow: 'hidden',
              boxShadow:
                theme.palette.mode === 'dark'
                  ? '0 20px 60px rgba(0, 0, 0, 0.3)'
                  : '0 20px 60px rgba(0, 0, 0, 0.1)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s ease-in-out infinite',
                '@keyframes shimmer': {
                  '0%, 100%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' },
                },
              },
            }}
          >
            <Box
              sx={{
                textAlign: 'center',
                mb: 6,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 3,
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                }}
              >
                さあ、始めよう
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 400,
                  mb: 4,
                  lineHeight: 1.6,
                  maxWidth: 500,
                  mx: 'auto',
                }}
              >
                下記の機能から選択して、データアナリティクスの旅を始めましょう
              </Typography>

              <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                <Grid item xs={12} sm={6} md={6}>
                  <Card
                    onClick={() => handleNavigate('/performance')}
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.light, 0.05)})`,
                      border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        boxShadow: `0 25px 50px ${alpha(theme.palette.primary.main, 0.25)}`,
                        borderColor: alpha(theme.palette.primary.main, 0.4),
                        '& .arrow-icon': { transform: 'translateX(8px)' },
                        '& .card-icon': { transform: 'scale(1.1) rotate(5deg)' },
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.1)}, transparent)`,
                        transition: 'left 0.8s ease',
                      },
                      '&:hover::before': {
                        left: '100%',
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 3,
                        }}
                      >
                        <AssessmentIcon
                          className="card-icon"
                          sx={{
                            fontSize: { xs: 40, sm: 48 },
                            color: theme.palette.primary.main,
                            transition: 'transform 0.3s ease',
                            filter: `drop-shadow(0 4px 8px ${alpha(theme.palette.primary.main, 0.3)})`,
                          }}
                        />
                        <ArrowForwardIcon
                          className="arrow-icon"
                          sx={{
                            fontSize: 28,
                            color: theme.palette.primary.main,
                            transition: 'transform 0.3s ease',
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{
                          color: theme.palette.primary.dark,
                          fontWeight: 700,
                          mb: 2,
                          fontSize: { xs: '1.5rem', sm: '1.8rem' },
                        }}
                      >
                        業績アナリティクス
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: { xs: '0.95rem', sm: '1rem' },
                          lineHeight: 1.7,
                          mb: 3,
                        }}
                      >
                        TableauダッシュボードとAIアシスタントを統合した高度なデータ分析環境
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          py: 1.5,
                          px: 3,
                          borderRadius: 2,
                          textTransform: 'none',
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        始める
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Card
                    onClick={() => handleNavigate('/pulse')}
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.secondary.light, 0.05)})`,
                      border: `2px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        boxShadow: `0 25px 50px ${alpha(theme.palette.secondary.main, 0.25)}`,
                        borderColor: alpha(theme.palette.secondary.main, 0.4),
                        '& .arrow-icon': { transform: 'translateX(8px)' },
                        '& .card-icon': { transform: 'scale(1.1) rotate(5deg)' },
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.1)}, transparent)`,
                        transition: 'left 0.8s ease',
                      },
                      '&:hover::before': {
                        left: '100%',
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 3,
                        }}
                      >
                        <TrendingUpIcon
                          className="card-icon"
                          sx={{
                            fontSize: { xs: 40, sm: 48 },
                            color: theme.palette.secondary.main,
                            transition: 'transform 0.3s ease',
                            filter: `drop-shadow(0 4px 8px ${alpha(theme.palette.secondary.main, 0.3)})`,
                          }}
                        />
                        <ArrowForwardIcon
                          className="arrow-icon"
                          sx={{
                            fontSize: 28,
                            color: theme.palette.secondary.main,
                            transition: 'transform 0.3s ease',
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{
                          color: theme.palette.secondary.dark,
                          fontWeight: 700,
                          mb: 2,
                          fontSize: { xs: '1.5rem', sm: '1.8rem' },
                        }}
                      >
                        メトリクス監視
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: { xs: '0.95rem', sm: '1rem' },
                          lineHeight: 1.7,
                          mb: 3,
                        }}
                      >
                        Tableau Pulseでリアルタイムメトリクスを監視し、AIがインサイトを提供
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: theme.palette.secondary.main,
                          color: theme.palette.secondary.contrastText,
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          py: 1.5,
                          px: 3,
                          borderRadius: 2,
                          textTransform: 'none',
                          boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.3)}`,
                          '&:hover': {
                            backgroundColor: theme.palette.secondary.dark,
                            boxShadow: `0 6px 20px ${alpha(theme.palette.secondary.main, 0.4)}`,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        始める
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grow>
      </Container>
    </Box>
  );
};

export default HomePage;
