"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Navigation from '../../components/Navigation';

export default function PulsePage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Simulate loading delay for Tableau Pulse embedding
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  if (error) {
    return (
      <Box sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc'
      }}>
        <Navigation title="メトリクス - Tableau Pulse" />

        {/* Error Content */}
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3
        }}>
          <Alert
            severity="error"
            sx={{ maxWidth: 400 }}
            action={
              <button onClick={handleRetry} style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}>
                再試行
              </button>
            }
          >
            Tableau Pulseの読み込みに失敗しました。{error}
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8fafc'
    }}>
      <Navigation title="メトリクス - Tableau Pulse" />

      {/* Main Content */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc'
      }}>
        {isLoading ? (
          <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}>
            <CircularProgress size={40} sx={{ color: '#3b82f6' }} />
            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
              Tableau Pulseを読み込み中...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Pulse Header */}
            <Paper elevation={0} sx={{
              borderRadius: 0,
              borderBottom: '1px solid #e2e8f0',
              px: 3,
              py: 2,
              backgroundColor: '#ffffff'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <TrendingUpIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  color: '#1e293b',
                  fontSize: '1.1rem'
                }}>
                  Tableau Pulse メトリクス
                </Typography>
              </Box>
            </Paper>

            {/* Content */}
            <Box sx={{
              flexGrow: 1,
              position: 'relative',
              backgroundColor: '#ffffff',
              overflow: 'hidden'
            }}>
              {/* Tableau Pulse Embed Container */}
              <Box
                id="tableau-pulse-container"
                sx={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  backgroundColor: '#ffffff'
                }}
              >
                {/* Placeholder for actual Tableau Pulse embed */}
                <iframe
                  src="about:blank"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    backgroundColor: '#ffffff'
                  }}
                  title="Tableau Pulse Dashboard"
                  onLoad={() => {
                    console.log('Tableau Pulse container ready for default-user');
                  }}
                />

                {/* Overlay with sample content until real Tableau Pulse is configured */}
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
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  gap: 3,
                  p: 4
                }}>
                  <TrendingUpIcon sx={{ fontSize: 48, color: '#cbd5e1' }} />
                  <Typography variant="h5" sx={{
                    color: '#64748b',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}>
                    Tableau Pulse
                  </Typography>
                  <Typography variant="body1" sx={{
                    color: '#94a3b8',
                    textAlign: 'center',
                    maxWidth: 400,
                    lineHeight: 1.6
                  }}>
                    ここにTableau Pulseのメトリクス、アラート、インサイトが表示されます。
                    リアルタイムでデータの変化を監視し、重要な傾向を自動的に検出します。
                  </Typography>
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 2,
                    width: '100%',
                    maxWidth: 600,
                    mt: 2
                  }}>
                    {[
                      { label: "売上高", value: "¥12.5M", change: "+5.2%" },
                      { label: "コンバージョン率", value: "3.8%", change: "+0.3%" },
                      { label: "顧客満足度", value: "94.2%", change: "+1.1%" },
                      { label: "アクティブユーザー", value: "8,432", change: "+12.4%" }
                    ].map((metric, index) => (
                      <Paper key={index} sx={{
                        p: 2,
                        textAlign: 'center',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0'
                      }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                          {metric.label}
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, my: 0.5 }}>
                          {metric.value}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#10b981', fontSize: '0.75rem' }}>
                          {metric.change}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}