import { type SxProps, type Theme } from '@mui/material';

export const tableauStyles = {
  container: {
    height: '100%',
    width: '100%',
    position: 'relative',
  } as SxProps<Theme>,

  centerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    p: 4,
  } as SxProps<Theme>,

  icon: {
    fontSize: 80,
    color: '#cbd5e1',
    mb: 2,
  } as SxProps<Theme>,

  title: {
    color: '#64748b',
    fontWeight: 500,
    mb: 1,
  } as SxProps<Theme>,

  description: {
    color: '#94a3b8',
    maxWidth: 400,
    lineHeight: 1.6,
    textAlign: 'center',
  } as SxProps<Theme>,

  gridContainer: {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'repeat(auto-fill, minmax(300px, 1fr))',
      md: 'repeat(auto-fill, minmax(350px, 1fr))',
      lg: 'repeat(3, 1fr)',
    },
    gap: 3,
    mb: 4,
  } as SxProps<Theme>,

  paper: {
    border: '1px solid #e2e8f0',
    borderRadius: 2,
    p: 1.5,
    backgroundColor: '#f8fafc',
  } as SxProps<Theme>,

  dashedPaper: {
    border: '1px dashed #cbd5e1',
    borderRadius: 2,
    p: 4,
    backgroundColor: '#f8fafc',
    textAlign: 'center',
  } as SxProps<Theme>,

  sectionTitle: {
    fontWeight: 600,
    color: '#1e293b',
    mb: 2,
  } as SxProps<Theme>,

  metricTitle: {
    color: '#64748b',
    mb: 1,
    px: 1,
  } as SxProps<Theme>,

  headerIcon: {
    color: '#3b82f6',
    fontSize: 24,
  } as SxProps<Theme>,

  headerTitle: {
    fontWeight: 600,
    color: '#1e293b',
  } as SxProps<Theme>,

  bodyText: {
    color: '#64748b',
    mb: 4,
    lineHeight: 1.6,
  } as SxProps<Theme>,
} as const;

export const colorTokens = {
  primary: '#3b82f6',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  border: '#e2e8f0',
  borderDashed: '#cbd5e1',
  background: '#f8fafc',
  iconLight: '#cbd5e1',
} as const;
