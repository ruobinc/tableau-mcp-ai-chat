import { type Theme } from '@mui/material/styles';

export const createPageStyles = (theme: Theme) => ({
  pageContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    transition: 'background-color 0.3s ease',
  } as const,

  performancePageContainer: {
    height: '100%',
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: theme.palette.background.default,
    transition: 'background-color 0.3s ease',
  } as const,

  pageHeader: {
    borderRadius: 0,
    borderBottom: `1px solid ${theme.palette.divider}`,
    px: 3,
    py: 2,
    backgroundColor: theme.palette.background.paper,
    transition: 'background-color 0.3s ease',
  } as const,

  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  } as const,

  headerIcon: {
    color: theme.palette.primary.main,
    fontSize: 20,
  } as const,

  headerTitle: {
    fontWeight: 600,
    color: theme.palette.text.primary,
    fontSize: '1.1rem',
  } as const,

  mainContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
  } as const,

  section: {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    p: 3,
  } as const,

  sectionTitle: {
    fontWeight: 600,
    color: theme.palette.text.primary,
    fontSize: '1.1rem',
    mb: 2,
  } as const,

  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'repeat(auto-fill, minmax(240px, 1fr))',
      md: 'repeat(auto-fill, minmax(280px, 1fr))',
      xl: 'repeat(4, minmax(280px, 1fr))',
    },
    gap: 3,
  } as const,

  metricCard: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    p: 1.5,
    backgroundColor: theme.palette.background.default,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow:
        theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
    },
    minHeight: 480,
    display: 'flex',
    flexDirection: 'column',
  } as const,

  metricName: {
    color: theme.palette.text.secondary,
    mb: 1,
    px: 1,
  } as const,

  metricContent: {
    flexGrow: 1,
  } as const,

  detailSection: {
    flexGrow: 1,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
    minHeight: '800px',
  } as const,

  detailHeader: {
    p: 3,
    borderBottom: `1px solid ${theme.palette.divider}`,
  } as const,

  detailContent: {
    p: 3,
  } as const,

  detailCard: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    p: 1.5,
    minHeight: 800,
    backgroundColor: theme.palette.background.default,
  } as const,

  emptyState: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 4,
  } as const,

  emptyStateCard: {
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: 2,
    p: 4,
    backgroundColor: theme.palette.background.default,
    textAlign: 'center',
    maxWidth: 400,
  } as const,

  emptyStateIcon: {
    fontSize: 48,
    color: theme.palette.text.disabled,
    mb: 2,
  } as const,

  emptyStateTitle: {
    color: theme.palette.text.secondary,
    fontWeight: 500,
    mb: 1,
  } as const,

  emptyStateDescription: {
    color: theme.palette.text.disabled,
  } as const,

  dashboardArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      opacity: 0.7,
      zIndex: 1,
    },
  } as const,

  dashboardContainer: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    borderRadius: { xs: 0, md: '12px 0 0 0' },
    overflow: 'hidden',
    boxShadow:
      theme.palette.mode === 'dark'
        ? 'inset 0 1px 3px rgba(255, 255, 255, 0.05)'
        : 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
  } as const,
});
