import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SparkleIcon from '@mui/icons-material/AutoAwesome';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        overflow: 'hidden'
      }}
    >
      {/* ヘッダースペース */}
      <Box sx={{ height: '80px' }} />

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 3 },
          position: 'relative',
          zIndex: 1
        }}
      >
        <Paper
          sx={{
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
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4
            }}
          >
            <Chip
              icon={<SparkleIcon sx={{ fontSize: 16 }} />}
              label="AI-Powered Analytics"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                fontWeight: 500
              }}
            />

            <HomeIcon
              sx={{
                fontSize: { xs: 56, sm: 72 },
                color: '#3b82f6',
                filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))',
                mb: 2
              }}
            />
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(45deg, #1e293b, #3b82f6, #8b5cf6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
              fontSize: { xs: '2rem', sm: '3rem' },
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}
          >
            次世代スーパーストア
            <br />
            ダッシュボード
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: '#64748b',
              fontWeight: 400,
              mb: 4,
              lineHeight: 1.6,
              fontSize: { xs: '1rem', sm: '1.2rem' },
              maxWidth: 480,
              mx: 'auto'
            }}
          >
            AI駆動のデータ分析と
            <br />
            インテリジェントな会話機能を備えた
            <br />
            <Box
              component="span"
              sx={{
                color: '#3b82f6',
                fontWeight: 600,
                textDecoration: 'underline',
                textDecorationColor: 'rgba(59, 130, 246, 0.3)'
              }}
            >
              次世代統合ダッシュボード
            </Box>
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: { xs: 3, md: 4 },
              mt: 1,
              width: '100%',
              maxWidth: { xs: '100%', md: '600px' },
              mx: 'auto'
            }}
          >
            <Paper
              elevation={0}
              onClick={() => handleNavigate('/performance')}
              sx={{
                p: { xs: 3, sm: 4 },
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.1) 100%)',
                borderRadius: 3,
                border: '2px solid rgba(59, 130, 246, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <AssessmentIcon
                  sx={{
                    fontSize: { xs: 32, sm: 40 },
                    color: '#3b82f6'
                  }}
                />
                <ArrowForwardIcon sx={{ fontSize: 24, color: '#3b82f6' }} />
              </Box>
              <Typography variant="h5" sx={{ color: '#1e40af', fontWeight: 700, mb: 1.5, fontSize: { xs: '1.3rem', sm: '1.5rem' } }}>
                業績一覧
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontSize: { xs: '0.9rem', sm: '1rem' }, lineHeight: 1.6, mb: 2 }}>
                TableauダッシュボードとTableau MCPを活用したAI分析アシスタント
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                詳細を見る
              </Button>
            </Paper>

            <Paper
              elevation={0}
              onClick={() => handleNavigate('/pulse')}
              sx={{
                p: { xs: 3, sm: 4 },
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(167, 243, 208, 0.1) 100%)',
                borderRadius: 3,
                border: '2px solid rgba(16, 185, 129, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.15)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <TrendingUpIcon
                  sx={{
                    fontSize: { xs: 32, sm: 40 },
                    color: '#10b981'
                  }}
                />
                <ArrowForwardIcon sx={{ fontSize: 24, color: '#10b981' }} />
              </Box>
              <Typography variant="h5" sx={{ color: '#047857', fontWeight: 700, mb: 1.5, fontSize: { xs: '1.3rem', sm: '1.5rem' } }}>
                メトリクス
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontSize: { xs: '0.9rem', sm: '1rem' }, lineHeight: 1.6, mb: 2 }}>
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
                  textTransform: 'none'
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
};

export default HomePage;