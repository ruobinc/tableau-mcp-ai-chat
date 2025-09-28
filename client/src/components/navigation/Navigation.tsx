import {
  AccountCircle,
  Assessment as AssessmentIcon,
  AutoAwesome as AutoAwesomeIcon,
  BarChart as BarChartIcon,
  DarkMode as DarkModeIcon,
  Home as HomeIcon,
  LightMode as LightModeIcon,
  Menu as MenuIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDarkMode } from '../../App';

interface NavigationProps {
  title?: string;
}

const Navigation: React.FC<NavigationProps> = ({ title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const isMenuOpen = Boolean(anchorEl);

  const currentTab = React.useMemo(() => {
    if (location.pathname.startsWith('/performance')) return 1;
    if (location.pathname.startsWith('/pulse')) return 2;
    return 0;
  }, [location.pathname]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/home');
        break;
      case 1:
        navigate('/performance');
        break;
      case 2:
        navigate('/pulse');
        break;
      default:
        break;
    }
  };

  const menuId = 'primary-search-account-menu';

  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(20px)',
          position: 'relative',
          zIndex: 1100,
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, sm: 3 },
            minHeight: { xs: '64px', sm: '72px' },
            position: 'relative',
          }}
        >
          <Tooltip title="メニュー" arrow>
            <IconButton
              size="medium"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{
                mr: 2,
                color: theme.palette.text.secondary,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: 'scale(1.1)',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mr: 3,
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <BarChartIcon
                  sx={{
                    mr: 1.5,
                    color: theme.palette.primary.main,
                    fontSize: 32,
                    filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))',
                    transition: 'filter 0.3s ease',
                  }}
                />
                <AutoAwesomeIcon
                  sx={{
                    position: 'absolute',
                    top: -4,
                    right: 8,
                    fontSize: 14,
                    color: theme.palette.secondary.main,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1) rotate(15deg)',
                    },
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.1rem', sm: '1.3rem' },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
              >
                {title || 'Tableau Analytics Dashboard'}
              </Typography>
            </Box>

            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              sx={{
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
                  textTransform: 'none',
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
              }}
            >
              <Tab
                icon={<HomeIcon sx={{ transition: 'transform 0.2s ease' }} />}
                iconPosition="start"
                label="ホーム"
                sx={{ gap: 1 }}
              />
              <Tab
                icon={<AssessmentIcon sx={{ transition: 'transform 0.2s ease' }} />}
                iconPosition="start"
                label="業績一覧"
                sx={{ gap: 1 }}
              />
              <Tab
                icon={<TrendingUpIcon sx={{ transition: 'transform 0.2s ease' }} />}
                iconPosition="start"
                label="メトリクス"
                sx={{ gap: 1 }}
              />
            </Tabs>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={darkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'} arrow>
              <IconButton
                onClick={toggleDarkMode}
                sx={{
                  color: theme.palette.text.secondary,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'scale(1.1) rotate(360deg)',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <Fade in={darkMode} timeout={300}>
                  <LightModeIcon sx={{ position: darkMode ? 'static' : 'absolute' }} />
                </Fade>
                <Fade in={!darkMode} timeout={300}>
                  <DarkModeIcon sx={{ position: !darkMode ? 'static' : 'absolute' }} />
                </Fade>
              </IconButton>
            </Tooltip>

            <Tooltip title="アカウント" arrow>
              <IconButton
                size="medium"
                edge="end"
                aria-label="account"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                sx={{
                  color: theme.palette.text.secondary,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'scale(1.1)',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>

        {/* グラデーションボーダー */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
            backgroundSize: '200% 100%',
            opacity: 0.8,
          }}
        />
      </Paper>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(20px)',
              minWidth: 180,
            },
          },
        }}
      >
        <MenuItem
          onClick={handleMenuClose}
          sx={{
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
          }}
        >
          プロフィール
        </MenuItem>
        <MenuItem
          onClick={handleMenuClose}
          sx={{
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
          }}
        >
          アカウント設定
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navigation;
