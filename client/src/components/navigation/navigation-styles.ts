import { alpha, type SxProps, type Theme } from '@mui/material';

export const createNavigationStyles = (theme: Theme) =>
  ({
    container: {
      borderRadius: 0,
      borderBottom: `1px solid ${theme.palette.divider}`,
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
      backdropFilter: 'blur(20px)',
      position: 'relative' as const,
      zIndex: 1100,
      transition: 'all 0.3s ease',
    } as SxProps<Theme>,

    toolbar: {
      px: { xs: 2, sm: 3 },
      minHeight: { xs: '64px', sm: '72px' },
      position: 'relative' as const,
    } as SxProps<Theme>,

    menuButton: {
      mr: 2,
      color: theme.palette.text.secondary,
      transition: 'all 0.2s ease',
      '&:hover': {
        color: theme.palette.primary.main,
        transform: 'scale(1.1)',
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
    } as SxProps<Theme>,

    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      flexGrow: 1,
      minWidth: 0,
    } as SxProps<Theme>,

    logoBox: {
      display: 'flex',
      alignItems: 'center',
      mr: 3,
      position: 'relative' as const,
    } as SxProps<Theme>,

    logoIcon: {
      mr: 1.5,
      color: theme.palette.primary.main,
      fontSize: 32,
      filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))',
      transition: 'filter 0.3s ease',
    } as SxProps<Theme>,

    sparkleIcon: {
      position: 'absolute' as const,
      top: -4,
      right: 8,
      fontSize: 14,
      color: theme.palette.secondary.main,
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'scale(1.1) rotate(15deg)',
      },
    } as SxProps<Theme>,

    title: {
      fontWeight: 700,
      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontSize: { xs: '1.1rem', sm: '1.3rem' },
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    } as SxProps<Theme>,

    tabs: {
      '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.primary.main,
        height: 3,
        borderRadius: '3px 3px 0 0',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      '& .MuiTab-root': {
        color: theme.palette.text.secondary,
        fontWeight: 500,
        fontSize: '0.9rem',
        textTransform: 'none' as const,
        minHeight: 48,
        transition: 'all 0.2s ease',
        borderRadius: '12px 12px 0 0',
        '&.Mui-selected': {
          color: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          fontWeight: 600,
        },
        '&:hover': {
          color: theme.palette.text.primary,
          backgroundColor: alpha(theme.palette.action.hover, 0.5),
          transform: 'translateY(-1px)',
        },
      },
    } as SxProps<Theme>,

    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    } as SxProps<Theme>,

    themeToggle: {
      color: theme.palette.text.secondary,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        color: theme.palette.primary.main,
        transform: 'scale(1.1) rotate(360deg)',
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
    } as SxProps<Theme>,

    accountButton: {
      color: theme.palette.text.secondary,
      transition: 'all 0.2s ease',
      '&:hover': {
        color: theme.palette.primary.main,
        transform: 'scale(1.1)',
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
    } as SxProps<Theme>,

    gradientBorder: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
      backgroundSize: '200% 100%',
      opacity: 0.8,
    } as SxProps<Theme>,

    menu: {
      mt: 1,
      borderRadius: 2,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: alpha(theme.palette.background.paper, 0.9),
      backdropFilter: 'blur(20px)',
      minWidth: 180,
    } as SxProps<Theme>,

    menuItem: {
      py: 1.5,
      px: 2,
      borderRadius: 1,
      mx: 1,
      my: 0.5,
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        transform: 'translateX(4px)',
      },
    } as SxProps<Theme>,
  }) as const;
