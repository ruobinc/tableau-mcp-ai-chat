import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Paper, Typography, useTheme } from '@mui/material';

import { pulseMetrics, pulseSiteName, tableauUserName } from '../config/tableau';
import { TableauPulseEmbed } from '../features/tableau/components';
import { EmptyMetricsState, JWTPageWrapper, MetricCard } from './components';
import { createPageStyles } from './styles/page-styles';

const PulsePage = () => {
  const theme = useTheme();
  const styles = createPageStyles(theme);

  return (
    <JWTPageWrapper username={tableauUserName}>
      <Box sx={styles.pageContainer}>
        <Box sx={styles.mainContent}>
          {pulseMetrics.length > 0 ? (
            <>
              <Box sx={styles.section}>
                <Typography variant="h6" sx={styles.sectionTitle}>
                  メトリクス一覧
                </Typography>
                <Box sx={styles.metricsGrid}>
                  {pulseMetrics.map((metric) => (
                    <MetricCard key={metric.id} name={metric.name}>
                      <TableauPulseEmbed
                        mode="single"
                        username={tableauUserName}
                        metricId={metric.id}
                        siteName={pulseSiteName}
                        width="100%"
                        height="440px"
                        layout="card"
                      />
                    </MetricCard>
                  ))}
                </Box>
              </Box>

              <Box sx={styles.detailSection}>
                <Box sx={styles.detailHeader}>
                  <Typography variant="h6" sx={styles.sectionTitle}>
                    メトリクス詳細
                  </Typography>
                </Box>
                <Box sx={styles.detailContent}>
                  <Paper elevation={0} sx={styles.detailCard}>
                    <TableauPulseEmbed
                      mode="single"
                      username={tableauUserName}
                      metricId={pulseMetrics[0].id}
                      siteName={pulseSiteName}
                      width="100%"
                      height="1500px"
                      layout="default"
                    />
                  </Paper>
                </Box>
              </Box>
            </>
          ) : (
            <EmptyMetricsState
              icon={<TrendingUpIcon sx={{ fontSize: 48 }} />}
              title="メトリクスが設定されていません"
              description=".env.local でTableau Pulseメトリクスを設定してください。"
            />
          )}
        </Box>
      </Box>
    </JWTPageWrapper>
  );
};

export default PulsePage;
