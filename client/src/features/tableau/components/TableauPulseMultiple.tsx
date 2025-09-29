import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Paper, Typography } from '@mui/material';
import { type FC } from 'react';

import { pulseMetrics, pulseSiteName, tableauUserName } from '../../../config/tableau';
import { tableauStyles } from '../styles/tableau-styles';
import { type TableauPulseMultipleProps } from '../types/tableau-types';
import { EmptyState } from './common';
import TableauPulseSingle from './TableauPulseSingle';

const TableauPulseMultiple: FC<TableauPulseMultipleProps> = ({ username }) => {
  const resolvedUsername = username || tableauUserName || 'default-user';

  if (pulseMetrics.length === 0) {
    return (
      <Paper sx={tableauStyles.dashedPaper}>
        <EmptyState
          icon={<TrendingUpIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />}
          title="メトリクスが設定されていません"
          description=".env.local でTableau Pulseメトリクスを設定してください。"
        />
      </Paper>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <TrendingUpIcon sx={tableauStyles.headerIcon} />
        <Typography variant="h5" sx={tableauStyles.headerTitle}>
          Tableau Pulse メトリクス
        </Typography>
      </Box>

      <Typography variant="body2" sx={tableauStyles.bodyText}>
        Tableau Pulseは、データに関する自動化された洞察とアラートを提供します。
        以下は設定されたメトリクスのサンプル表示です。
      </Typography>

      <Typography variant="h6" sx={tableauStyles.sectionTitle}>
        メトリクス一覧
      </Typography>
      <Box sx={tableauStyles.gridContainer}>
        {pulseMetrics.map((metric) => (
          <Paper
            key={metric.id}
            elevation={0}
            sx={{
              ...tableauStyles.paper,
              minHeight: 400,
            }}
          >
            <Typography variant="subtitle2" sx={tableauStyles.metricTitle}>
              {metric.name}
            </Typography>
            <TableauPulseSingle
              username={resolvedUsername}
              metricId={metric.id}
              siteName={pulseSiteName}
              width="100%"
              height="350px"
              layout="card"
            />
          </Paper>
        ))}
      </Box>

      <Typography variant="h6" sx={tableauStyles.sectionTitle}>
        詳細ビュー
      </Typography>
      <Paper
        elevation={0}
        sx={{
          ...tableauStyles.paper,
          minHeight: 600,
        }}
      >
        <TableauPulseSingle
          username={resolvedUsername}
          metricId={pulseMetrics[0].id}
          siteName={pulseSiteName}
          width="100%"
          height="550px"
          layout="default"
        />
      </Paper>
    </Box>
  );
};

export default TableauPulseMultiple;
