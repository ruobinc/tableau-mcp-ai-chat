import {
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon,
  AutoAwesome as SparkleIcon,
  Home as HomeIcon,
  Insights as InsightsIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Box, Chip, Container, Fade, Grow, Paper, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FeatureCard, NavigationCard } from './components';
import { createHomePageStyles } from './styles/home-styles';

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = createHomePageStyles(theme);
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
    <Box sx={styles.pageContainer}>
      <Container maxWidth="lg" sx={styles.container}>
        {/* ヒーローセクション */}
        <Fade in={isLoaded} timeout={800}>
          <Box sx={styles.heroSection}>
            <Grow in={isLoaded} timeout={1000}>
              <Box sx={styles.iconContainer}>
                <Chip
                  icon={<SparkleIcon sx={{ fontSize: 16 }} />}
                  label="Next-Gen AI Analytics Platform"
                  sx={styles.chipBadge}
                />

                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <HomeIcon sx={styles.homeIcon} />
                </Box>
              </Box>
            </Grow>

            <Typography variant="h1" sx={styles.mainTitle}>
              次世代スーパーストア
              <br />
              ダッシュボード
            </Typography>

            <Typography variant="h5" sx={styles.subtitle}>
              AI駆動のデータ分析とインテリジェントな会話機能を備えた
              <Box component="span" sx={styles.highlightText}>
                革新的統合アナリティクスプラットフォーム
              </Box>
            </Typography>

            {/* 機能ハイライト */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(auto-fit, minmax(250px, 1fr))',
                  md: 'repeat(4, 1fr)',
                },
                gap: 3,
                mb: 6,
                justifyItems: 'center',
              }}
            >
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                  isLoaded={isLoaded}
                />
              ))}
            </Box>
          </Box>
        </Fade>

        {/* メインカード */}
        <Grow in={isLoaded} timeout={1600}>
          <Paper sx={styles.mainCard}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h3" sx={styles.sectionTitle}>
                さあ、始めよう
              </Typography>
              <Typography variant="h6" sx={styles.sectionSubtitle}>
                下記の機能から選択して、データアナリティクスの旅を始めましょう
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 3,
                  justifyItems: 'center',
                }}
              >
                <NavigationCard
                  icon={<AssessmentIcon />}
                  title="業績アナリティクス"
                  description="TableauダッシュボードとAIアシスタントを統合した高度なデータ分析環境"
                  onClick={() => handleNavigate('/performance')}
                  color="primary"
                />

                <NavigationCard
                  icon={<TrendingUpIcon />}
                  title="メトリクス監視"
                  description="Tableau Pulseでリアルタイムメトリクスを監視し、AIがインサイトを提供"
                  onClick={() => handleNavigate('/pulse')}
                  color="secondary"
                />
              </Box>
            </Box>
          </Paper>
        </Grow>
      </Container>
    </Box>
  );
};

export default HomePage;
