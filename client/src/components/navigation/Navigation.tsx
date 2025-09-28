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

import { useDarkMode } from '../../contexts/DarkModeContext';
import { createNavigationStyles } from './navigation-styles';

interface NavigationProps {
  title?: string;
}

const Navigation: React.FC<NavigationProps> = ({ title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const styles = createNavigationStyles(theme);

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
    const routes = ['/home', '/performance', '/pulse'];
    navigate(routes[newValue] || '/home');
  };

  const menuId = 'primary-search-account-menu';

  return (
    <>
      <Paper elevation={0} sx={styles.container}>
        <Toolbar sx={styles.toolbar}>
          <Tooltip title="メニュー" arrow>
            <IconButton
              size="medium"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={styles.menuButton}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          <Box sx={styles.logoContainer}>
            <Box sx={styles.logoBox}>
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <BarChartIcon sx={styles.logoIcon} />
                <AutoAwesomeIcon sx={styles.sparkleIcon} />
              </Box>
              <Typography variant="h6" sx={styles.title}>
                {title || 'Tableau Analytics Dashboard'}
              </Typography>
            </Box>

            <Tabs value={currentTab} onChange={handleTabChange} sx={styles.tabs}>
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

          <Box sx={styles.rightSection}>
            <Tooltip title={darkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'} arrow>
              <IconButton onClick={toggleDarkMode} sx={styles.themeToggle}>
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
                sx={styles.accountButton}
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>

        <Box sx={styles.gradientBorder} />
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
            sx: styles.menu,
          },
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={styles.menuItem}>
          プロフィール
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={styles.menuItem}>
          アカウント設定
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navigation;
