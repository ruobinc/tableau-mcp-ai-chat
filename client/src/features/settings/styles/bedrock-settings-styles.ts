import { SxProps, Theme } from '@mui/material';

export const createBedrockSettingsStyles = (theme: Theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      minWidth: 600,
      maxWidth: 700,
    },
  } as const,

  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    pb: 2,
  } as const,

  dialogContent: {
    pt: 3,
    pb: 2,
  } as const,

  formField: {
    mb: 2.5,
  } as const,

  actions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    pt: 2,
    px: 3,
    pb: 2,
    gap: 1,
  } as const,

  testButton: {
    mr: 'auto',
  } as const,

  alert: {
    mb: 2,
  } as const,
});

export type BedrockSettingsStyles = ReturnType<typeof createBedrockSettingsStyles>;
