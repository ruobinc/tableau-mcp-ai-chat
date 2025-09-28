import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Paper, Typography, useTheme } from '@mui/material';

import { pulseMetrics, pulseSiteName, tableauUserName } from '../config/tableau';
import TableauPulseEmbed from '../features/tableau/TableauPulseEmbed';
import { JWTProvider } from '../providers/JWTProvider';

const PulsePage = () => {
  const theme = useTheme();

  return (
    <JWTProvider defaultUsername={tableauUserName || 'default-user'} prefetchDefaultToken>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.background.default,
          transition: 'background-color 0.3s ease',
        }}
      >
        {/* ヘッダー */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 0,
            borderBottom: `1px solid ${theme.palette.divider}`,
            px: 3,
            py: 2,
            backgroundColor: theme.palette.background.paper,
            transition: 'background-color 0.3s ease',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <TrendingUpIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '1.1rem' }}
            >
              Tableau Pulse メトリクス
            </Typography>
          </Box>
        </Paper>

        {/* メインコンテンツ */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.default,
          }}
        >
          {pulseMetrics.length > 0 ? (
            <>
              {/* メトリクス一覧セクション */}
              <Box
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  p: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: '1.1rem',
                    mb: 2,
                  }}
                >
                  メトリクス一覧
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(auto-fill, minmax(240px, 1fr))',
                      md: 'repeat(auto-fill, minmax(280px, 1fr))',
                      xl: 'repeat(4, minmax(280px, 1fr))',
                    },
                    gap: 3,
                  }}
                >
                  {pulseMetrics.map((metric) => (
                    <Paper
                      key={metric.id}
                      elevation={0}
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        p: 1.5,
                        backgroundColor: theme.palette.background.default,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow:
                            theme.palette.mode === 'dark'
                              ? '0 4px 20px rgba(0,0,0,0.3)'
                              : '0 4px 20px rgba(0,0,0,0.1)',
                        },
                        minHeight: 480,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ color: theme.palette.text.secondary, mb: 1, px: 1 }}
                      >
                        {metric.name}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <TableauPulseEmbed
                          mode="single"
                          username={tableauUserName}
                          metricId={metric.id}
                          siteName={pulseSiteName}
                          width="100%"
                          height="440px"
                          layout="card"
                        />
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>

              {/* 詳細ビューセクション */}
              <Box
                sx={{
                  flexGrow: 1,
                  position: 'relative',
                  backgroundColor: theme.palette.background.paper,
                  overflow: 'hidden',
                  minHeight: '800px',
                }}
              >
                <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '1.1rem' }}
                  >
                    メトリクス詳細
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      p: 1.5,
                      minHeight: 800,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
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
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  border: `1px dashed ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 4,
                  backgroundColor: theme.palette.background.default,
                  textAlign: 'center',
                  maxWidth: 400,
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 2 }} />
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.text.secondary, fontWeight: 500, mb: 1 }}
                >
                  メトリクスが設定されていません
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>
                  .env.local でTableau Pulseメトリクスを設定してください。
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>
    </JWTProvider>
  );
};

export default PulsePage;
