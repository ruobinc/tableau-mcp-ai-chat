import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';

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

  return (
    <>
      <Paper
        elevation={1}
        sx={{
          borderRadius: 0,
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, sm: 3 },
            minHeight: { xs: '56px', sm: '64px' }
          }}
        >
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, color: '#64748b' }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
            <BarChartIcon sx={{ mr: 1.5, color: '#3b82f6', fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#1e293b',
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                mr: 3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {title || 'Tableau Analytics Dashboard'}
            </Typography>

            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTabs-indicator': { backgroundColor: '#3b82f6' },
                '& .MuiTab-root': {
                  color: '#64748b',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  minHeight: 48,
                  '&.Mui-selected': { color: '#3b82f6' },
                  '&:hover': { color: '#475569' }
                }
              }}
            >
              <Tab icon={<HomeIcon />} iconPosition="start" label="ホーム" sx={{ gap: 1 }} />
              <Tab icon={<AssessmentIcon />} iconPosition="start" label="業績一覧" sx={{ gap: 1 }} />
              <Tab icon={<TrendingUpIcon />} iconPosition="start" label="メトリクス" sx={{ gap: 1 }} />
            </Tabs>
          </Box>

          <IconButton
            size="medium"
            edge="end"
            aria-label="account"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            sx={{ color: '#64748b' }}
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      </Menu>
    </>
  );
};

export default Navigation;
