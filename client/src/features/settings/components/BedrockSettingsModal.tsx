import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme,
} from '@mui/material';
import { type FC, useState } from 'react';

import { validateBedrockSettings } from '../../../api/settings';
import { useBedrockSettings } from '../../../contexts/BedrockSettingsContext';
import { BedrockSettings, DEFAULT_BEDROCK_SETTINGS } from '../../../types/bedrock-settings';
import { createBedrockSettingsStyles } from '../styles/bedrock-settings-styles';

interface BedrockSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const BedrockSettingsModal: FC<BedrockSettingsModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const styles = createBedrockSettingsStyles(theme);
  const { settings: savedSettings, updateSettings } = useBedrockSettings();

  const [formData, setFormData] = useState<BedrockSettings>(
    savedSettings || DEFAULT_BEDROCK_SETTINGS
  );
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleChange = (field: keyof BedrockSettings) => (event: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'maxTokens' ? parseInt(event.target.value) || 0 : event.target.value,
    }));
    setTestResult(null);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const result = await validateBedrockSettings(formData);
      setTestResult({
        success: result.valid,
        message: result.message,
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: `接続テストに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    updateSettings(formData);
    onClose();
  };

  const handleClose = () => {
    setFormData(savedSettings || DEFAULT_BEDROCK_SETTINGS);
    setTestResult(null);
    onClose();
  };

  const isFormValid =
    formData.awsRegion &&
    formData.awsBearerToken &&
    formData.bedrockModelId &&
    formData.maxTokens >= 100 &&
    formData.maxTokens <= 200000;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth sx={styles.dialog}>
      <DialogTitle sx={styles.dialogTitle}>Bedrock設定</DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        {testResult && (
          <Alert severity={testResult.success ? 'success' : 'error'} sx={styles.alert}>
            {testResult.message}
          </Alert>
        )}

        <TextField
          fullWidth
          label="AWSリージョン"
          value={formData.awsRegion}
          onChange={handleChange('awsRegion')}
          sx={styles.formField}
          helperText="例: ap-northeast-1, us-east-1, us-west-2"
        />

        <TextField
          fullWidth
          label="AWS Bearer Token"
          type="password"
          value={formData.awsBearerToken}
          onChange={handleChange('awsBearerToken')}
          sx={styles.formField}
          helperText="AWS Bedrockの認証トークンを入力してください"
        />

        <TextField
          fullWidth
          label="BedrockモデルID"
          value={formData.bedrockModelId}
          onChange={handleChange('bedrockModelId')}
          sx={styles.formField}
          helperText="例: apac.anthropic.claude-sonnet-4-20250514-v1:0"
        />

        <TextField
          fullWidth
          label="Max Tokens"
          type="number"
          value={formData.maxTokens}
          onChange={handleChange('maxTokens')}
          sx={styles.formField}
          helperText="100〜200000の範囲で指定してください"
          inputProps={{ min: 100, max: 200000 }}
        />
      </DialogContent>

      <DialogActions sx={styles.actions}>
        <Button
          onClick={handleTest}
          disabled={!isFormValid || testing}
          startIcon={testing && <CircularProgress size={16} />}
          sx={styles.testButton}
        >
          {testing ? '接続テスト中...' : '接続テスト'}
        </Button>
        <Button onClick={handleClose} color="inherit">
          キャンセル
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={!isFormValid}>
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BedrockSettingsModal;
