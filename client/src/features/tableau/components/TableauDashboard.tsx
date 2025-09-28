import BarChartIcon from '@mui/icons-material/BarChart';
import { Box } from '@mui/material';
import { TableauViz } from '@tableau/embedding-api-react';
import { type FC, useEffect, useState } from 'react';

import { tableauEmbeddedUrl, tableauUserName } from '../../../config/tableau';
import { useJWTToken } from '../hooks/useJWTToken';
import { tableauStyles } from '../styles/tableau-styles';
import { type TableauDashboardProps } from '../types/tableau-types';
import { EmptyState, ErrorDisplay, LoadingIndicator } from './common';

const resolveUsername = (value?: string): string => {
  if (value && value !== 'undefined') {
    return value;
  }
  if (tableauUserName && tableauUserName !== 'undefined') {
    return tableauUserName;
  }
  return 'default-user';
};

const TableauDashboard: FC<TableauDashboardProps> = ({ username }) => {
  const [isMounted, setIsMounted] = useState(false);
  const resolvedUsername = resolveUsername(username);
  const { jwtToken, loading, error } = useJWTToken(resolvedUsername);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!tableauEmbeddedUrl) {
    return (
      <EmptyState
        icon={<BarChartIcon sx={tableauStyles.icon} />}
        title="Tableau設定が必要です"
        description=".env.local で Tableau サーバーの設定を行ってください。"
      />
    );
  }

  if (loading) {
    return <LoadingIndicator message="Tableauダッシュボードを読み込み中..." />;
  }

  if (error) {
    return (
      <ErrorDisplay error={error} description="Tableauサーバーの接続設定を確認してください。" />
    );
  }

  return (
    <Box sx={tableauStyles.container}>
      {jwtToken ? (
        <TableauViz
          src={tableauEmbeddedUrl}
          token={jwtToken}
          toolbar="hidden"
          hideTabs
          width="100%"
          device="desktop"
        />
      ) : (
        <LoadingIndicator message="認証中..." />
      )}
    </Box>
  );
};

export default TableauDashboard;
