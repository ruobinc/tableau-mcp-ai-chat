import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box } from '@mui/material';
import { TableauPulse } from '@tableau/embedding-api-react';
import { type FC, useEffect, useState } from 'react';

import { useJWTToken } from '../hooks/useJWTToken';
import { tableauStyles } from '../styles/tableau-styles';
import { type TableauPulseSingleProps } from '../types/tableau-types';
import { EmptyState, ErrorDisplay, LoadingIndicator } from './common';

const TableauPulseSingle: FC<TableauPulseSingleProps> = ({
  username = 'default-user',
  metricId = '',
  siteName = '',
  height = '100%',
  width = '100%',
  layout = 'default',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { jwtToken, loading, error } = useJWTToken(username);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!metricId) {
    return (
      <EmptyState
        icon={<TrendingUpIcon sx={tableauStyles.icon} />}
        title="Tableau Pulse設定が必要です"
        description="メトリクスIDを設定してTableau Pulseを表示してください。"
      />
    );
  }

  if (loading) {
    return <LoadingIndicator message="Tableau Pulseを読み込み中..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        description="Tableau Pulseサーバーの接続設定を確認してください。"
      />
    );
  }

  const pulseUrl = siteName
    ? `https://prod-apnortheast-a.online.tableau.com/pulse/site/${siteName}/metrics/${metricId}`
    : `https://prod-apnortheast-a.online.tableau.com/pulse/metrics/${metricId}`;

  const normalizedWidth = typeof width === 'number' ? `${width}px` : width;
  const normalizedHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <Box sx={tableauStyles.container}>
      {jwtToken ? (
        <TableauPulse
          src={pulseUrl}
          token={jwtToken}
          width={normalizedWidth}
          height={normalizedHeight}
          layout={layout}
        />
      ) : (
        <LoadingIndicator message="認証中..." />
      )}
    </Box>
  );
};

export default TableauPulseSingle;
