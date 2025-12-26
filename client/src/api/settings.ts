import { API_BASE_URL } from '../config/api';
import { BedrockSettings, ValidationResponse } from '../types/bedrock-settings';

export const validateBedrockSettings = async (
  settings: BedrockSettings
): Promise<ValidationResponse> => {
  const response = await fetch(`${API_BASE_URL}/settings/bedrock/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      aws_region: settings.awsRegion,
      aws_bearer_token: settings.awsBearerToken,
      bedrock_model_id: settings.bedrockModelId,
      max_tokens: settings.maxTokens,
    }),
  });

  if (!response.ok) {
    throw new Error('設定の検証に失敗しました');
  }

  return response.json();
};
