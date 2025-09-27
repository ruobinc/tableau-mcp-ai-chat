import { Box, Typography, Paper } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { JWTProvider } from '../providers/JWTProvider';
import TableauPulseEmbed from '../features/tableau/TableauPulseEmbed';
import { pulseMetrics, pulseSiteName, tableauUserName } from '../config/tableau';

const PulsePage = () => {
  return (
    <JWTProvider defaultUsername={tableauUserName || 'default-user'} prefetchDefaultToken>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f8fafc'
        }}
      >
        {/* ヘッダー */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 0,
            borderBottom: '1px solid #e2e8f0',
            px: 3,
            py: 2,
            backgroundColor: '#ffffff'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <TrendingUpIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.1rem' }}>
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
            backgroundColor: '#f8fafc'
          }}
        >
          {pulseMetrics.length > 0 ? (
            <>
              {/* メトリクス一覧セクション */}
              <Box
                sx={{
                  backgroundColor: '#ffffff',
                  borderBottom: '1px solid #e2e8f0',
                  p: 3
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.1rem', mb: 2 }}>
                  メトリクス一覧
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(auto-fill, minmax(240px, 1fr))',
                      md: 'repeat(auto-fill, minmax(280px, 1fr))',
                      xl: 'repeat(4, minmax(280px, 1fr))'
                    },
                    gap: 3
                  }}
                >
                  {pulseMetrics.map((metric) => (
                    <Paper
                      key={metric.id}
                      elevation={0}
                      sx={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 2,
                        p: 1.5,
                        backgroundColor: '#f8fafc',
                        minHeight: 480,
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1, px: 1 }}>
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
                  backgroundColor: '#ffffff',
                  overflow: 'hidden',
                  minHeight: '800px'
                }}
              >
                <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.1rem' }}>
                    メトリクス詳細
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 2,
                      p: 1.5,
                      minHeight: 800,
                      backgroundColor: '#f8fafc'
                    }}
                  >
                    <TableauPulseEmbed
                      mode="single"
                      username={tableauUserName}
                      metricId={pulseMetrics[0].id}
                      siteName={pulseSiteName}
                      width="100%"
                      height="760px"
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
                p: 4
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  border: '1px dashed #cbd5e1',
                  borderRadius: 2,
                  p: 4,
                  backgroundColor: '#f8fafc',
                  textAlign: 'center',
                  maxWidth: 400
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500, mb: 1 }}>
                  メトリクスが設定されていません
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
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