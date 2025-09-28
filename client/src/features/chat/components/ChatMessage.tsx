import PersonIcon from '@mui/icons-material/Person';
import PreviewIcon from '@mui/icons-material/Preview';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Avatar, Box, CircularProgress, IconButton, Paper, Tooltip, Typography, useTheme } from '@mui/material';
import { type FC } from 'react';

import MarkdownRenderer from '../../../components/markdown/MarkdownRenderer';
import { formatTimestamp } from '../../../utils/date';
import { createMessageStyles } from '../styles/chatStyles';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
  onRequestPreview: (message: ChatMessageType) => void;
  onRequestChart: (message: ChatMessageType) => void;
  isCreatingReport?: boolean;
  isCreatingChart?: boolean;
}

export const ChatMessage: FC<ChatMessageProps> = ({
  message,
  onRequestPreview,
  onRequestChart,
  isCreatingReport = false,
  isCreatingChart = false,
}) => {
  const theme = useTheme();
  const styles = createMessageStyles(theme, message.sender === 'user');

  return (
    <Box sx={styles.container}>
      {message.sender === 'bot' && (
        <Avatar sx={styles.avatar}>
          <SmartToyIcon sx={{ fontSize: 16 }} />
        </Avatar>
      )}

      <Box sx={styles.messageWrapper}>
        <Paper elevation={0} sx={styles.messageBubble}>
          {message.sender === 'bot' ? (
            <Box
              sx={{
                '& p': { margin: 0, lineHeight: 1.5, fontSize: '0.9rem' },
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  margin: '0.5em 0',
                  fontWeight: 600,
                },
                '& ul, & ol': {
                  margin: '0.5em 0',
                  paddingLeft: '1.5em',
                },
                '& li': { margin: '0.2em 0' },
                '& code': {
                  backgroundColor: '#f1f5f9',
                  padding: '0.1em 0.3em',
                  borderRadius: '4px',
                  fontSize: '0.85em',
                  color: '#1e293b',
                },
                '& pre': {
                  backgroundColor: '#f8fafc',
                  padding: '0.75em',
                  borderRadius: '8px',
                  overflow: 'auto',
                  fontSize: '0.85em',
                  margin: '0.5em 0',
                  border: '1px solid #e2e8f0',
                },
                '& pre code': {
                  backgroundColor: 'transparent',
                  padding: 0,
                },
                '& blockquote': {
                  borderLeft: '3px solid #e2e8f0',
                  paddingLeft: '1em',
                  margin: '0.5em 0',
                  color: '#64748b',
                  fontStyle: 'italic',
                },
                '& strong': { fontWeight: 600 },
                '& em': { fontStyle: 'italic' },
                '& table': {
                  borderCollapse: 'collapse',
                  width: '100%',
                  margin: '0.8em 0',
                  fontSize: '0.85rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                },
                '& th, & td': {
                  border: '1px solid #e2e8f0',
                  padding: '0.75em 1em',
                  textAlign: 'left',
                },
                '& th': {
                  backgroundColor: '#f8fafc',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '2px solid #d1d5db',
                },
                '& tbody tr:nth-of-type(even)': { backgroundColor: '#f9fafb' },
                '& tbody tr:hover': { backgroundColor: '#f3f4f6' },
              }}
            >
              <MarkdownRenderer>{message.text}</MarkdownRenderer>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ lineHeight: 1.5, fontSize: '0.9rem' }}>
              {message.text}
            </Typography>
          )}
        </Paper>

        <Typography variant="caption" sx={styles.timestamp}>
          {formatTimestamp(message.timestamp)}
        </Typography>

        {message.sender === 'bot' && (
          <Box sx={styles.actionButtons}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip
                title={message.dashboardCode ? 'レポート再表示' : 'レポート作成'}
                placement="top"
                arrow
              >
                <IconButton
                  size="small"
                  onClick={() => onRequestPreview(message)}
                  disabled={isCreatingReport}
                  sx={{
                    color: message.dashboardCode ? '#10b981' : '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.05)',
                    border: '1px solid',
                    borderColor: message.dashboardCode ? '#10b981' : '#3b82f6',
                    '&:hover': {
                      backgroundColor: message.dashboardCode
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(59, 130, 246, 0.1)',
                      borderColor: message.dashboardCode ? '#059669' : '#2563eb',
                      transform: 'scale(1.05)',
                    },
                    '&:disabled': {
                      backgroundColor: 'rgba(200, 200, 200, 0.1)',
                      borderColor: '#d1d5db',
                      color: '#9ca3af',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <PreviewIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>

              <Tooltip
                title={
                  message.chartCode
                    ? message.showChart
                      ? 'チャート非表示'
                      : 'チャート表示'
                    : 'チャート作成'
                }
                placement="top"
                arrow
              >
                <IconButton
                  size="small"
                  onClick={() => onRequestChart(message)}
                  disabled={isCreatingChart}
                  sx={{
                    color: message.chartCode
                      ? message.showChart
                        ? '#f59e0b'
                        : '#10b981'
                      : '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.05)',
                    border: '1px solid',
                    borderColor: message.chartCode
                      ? message.showChart
                        ? '#f59e0b'
                        : '#10b981'
                      : '#8b5cf6',
                    '&:hover': {
                      backgroundColor: message.chartCode
                        ? message.showChart
                          ? 'rgba(245, 158, 11, 0.1)'
                          : 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(139, 92, 246, 0.1)',
                      borderColor: message.chartCode
                        ? message.showChart
                          ? '#d97706'
                          : '#059669'
                        : '#7c3aed',
                      transform: 'scale(1.05)',
                    },
                    '&:disabled': {
                      backgroundColor: 'rgba(200, 200, 200, 0.1)',
                      borderColor: '#d1d5db',
                      color: '#9ca3af',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ShowChartIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* ローディングステータス表示エリア */}
            {(isCreatingReport || isCreatingChart) && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 1,
                  px: 2,
                  py: 1,
                  backgroundColor: 'rgba(59, 130, 246, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
                }}
              >
                <CircularProgress
                  size={16}
                  sx={{
                    color: isCreatingReport ? '#3b82f6' : '#8b5cf6',
                    filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.3))',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: isCreatingReport ? '#3b82f6' : '#8b5cf6',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    letterSpacing: '0.025em',
                    textShadow: '0 0 8px rgba(59, 130, 246, 0.2)',
                  }}
                >
                  {isCreatingReport ? 'レポート作成中...' : 'チャート作成中...'}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {message.sender === 'bot' && message.showChart && message.chartCode && (
          <Box sx={styles.chartContainer}>
            <Box sx={styles.chartHeader}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#374151',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <ShowChartIcon sx={{ fontSize: 16 }} />
                チャート
              </Typography>
            </Box>
            <Box sx={styles.chartFrame}>
              <iframe
                srcDoc={message.chartCode}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  backgroundColor: 'white',
                }}
                sandbox="allow-scripts"
                title="Inline Chart"
              />
            </Box>
          </Box>
        )}
      </Box>

      {message.sender === 'user' && (
        <Avatar sx={styles.avatar}>
          <PersonIcon sx={{ fontSize: 16 }} />
        </Avatar>
      )}
    </Box>
  );
};
