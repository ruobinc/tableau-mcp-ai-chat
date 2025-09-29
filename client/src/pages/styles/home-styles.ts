import { alpha, keyframes, type SxProps, type Theme } from '@mui/material';

// アニメーション定義
export const animations = {
  shimmer: keyframes`
    0%, 100% { backgroundPosition: '0% 50%'; }
    50% { backgroundPosition: '100% 50%'; }
  `,
};

export const createHomePageStyles = (theme: Theme) =>
  ({
    pageContainer: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      position: 'relative' as const,
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
    } as SxProps<Theme>,

    container: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      py: { xs: 4, sm: 6, md: 8 },
      position: 'relative' as const,
      zIndex: 1,
    } as SxProps<Theme>,

    heroSection: {
      textAlign: 'center' as const,
      mb: { xs: 6, md: 8 },
    } as SxProps<Theme>,

    chipBadge: {
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
    } as SxProps<Theme>,

    iconContainer: {
      display: 'inline-block',
      position: 'relative' as const,
      mb: 4,
    } as SxProps<Theme>,

    homeIcon: {
      fontSize: { xs: 64, sm: 80, md: 96 },
      color: theme.palette.primary.main,
      filter: `drop-shadow(0 2px 8px ${alpha(theme.palette.primary.main, 0.2)})`,
      transition: 'transform 0.3s ease',
      willChange: 'transform',
      '&:hover': {
        transform: 'translateY(-4px)',
      },
    } as SxProps<Theme>,

    mainTitle: {
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
    } as SxProps<Theme>,

    subtitle: {
      color: theme.palette.text.secondary,
      fontWeight: 400,
      mb: 6,
      lineHeight: 1.6,
      fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
      maxWidth: 600,
      mx: 'auto',
    } as SxProps<Theme>,

    highlightText: {
      color: theme.palette.primary.main,
      fontWeight: 600,
      display: 'block',
      mt: 1,
    } as SxProps<Theme>,

    featureCard: {
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
    } as SxProps<Theme>,

    featureIconBox: {
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
    } as SxProps<Theme>,

    mainCard: {
      p: { xs: 4, sm: 6, md: 8 },
      borderRadius: 4,
      background: alpha(theme.palette.background.paper, 0.8),
      backdropFilter: 'blur(20px)',
      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      position: 'relative' as const,
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
        animation: `${animations.shimmer} 3s ease-in-out infinite`,
      },
    } as SxProps<Theme>,

    sectionTitle: {
      fontWeight: 700,
      color: theme.palette.text.primary,
      mb: 3,
      fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
    } as SxProps<Theme>,

    sectionSubtitle: {
      color: theme.palette.text.secondary,
      fontWeight: 400,
      mb: 4,
      lineHeight: 1.6,
      maxWidth: 500,
      mx: 'auto',
    } as SxProps<Theme>,

    navigationCard: (color: 'primary' | 'secondary') =>
      ({
        height: '100%',
        cursor: 'pointer',
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)}, ${alpha(theme.palette[color].light, 0.05)})`,
        border: `2px solid ${alpha(theme.palette[color].main, 0.2)}`,
        borderRadius: 3,
        position: 'relative' as const,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: `0 25px 50px ${alpha(theme.palette[color].main, 0.25)}`,
          borderColor: alpha(theme.palette[color].main, 0.4),
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
      }) as SxProps<Theme>,

    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: 3,
    } as SxProps<Theme>,

    cardIcon: (color: 'primary' | 'secondary') =>
      ({
        fontSize: { xs: 40, sm: 48 },
        color: theme.palette[color].main,
        transition: 'transform 0.3s ease',
        filter: `drop-shadow(0 4px 8px ${alpha(theme.palette[color].main, 0.3)})`,
      }) as SxProps<Theme>,

    arrowIcon: (color: 'primary' | 'secondary') =>
      ({
        fontSize: 28,
        color: theme.palette[color].main,
        transition: 'transform 0.3s ease',
      }) as SxProps<Theme>,

    cardTitle: (color: 'primary' | 'secondary') =>
      ({
        color: theme.palette[color].dark,
        fontWeight: 700,
        mb: 2,
        fontSize: { xs: '1.5rem', sm: '1.8rem' },
      }) as SxProps<Theme>,

    cardDescription: {
      color: theme.palette.text.secondary,
      fontSize: { xs: '0.95rem', sm: '1rem' },
      lineHeight: 1.7,
      mb: 3,
    } as SxProps<Theme>,

    ctaButton: (color: 'primary' | 'secondary') =>
      ({
        backgroundColor: theme.palette[color].main,
        color: theme.palette[color].contrastText,
        fontSize: '0.9rem',
        fontWeight: 600,
        py: 1.5,
        px: 3,
        borderRadius: 2,
        textTransform: 'none' as const,
        boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.3)}`,
        '&:hover': {
          backgroundColor: theme.palette[color].dark,
          boxShadow: `0 6px 20px ${alpha(theme.palette[color].main, 0.4)}`,
          transform: 'translateY(-2px)',
        },
      }) as SxProps<Theme>,
  }) as const;
