export interface BedrockSettings {
  awsRegion: string;
  awsBearerToken: string;
  bedrockModelId: string;
  maxTokens: number;
}

export interface ValidationResponse {
  valid: boolean;
  message: string;
}

export const DEFAULT_BEDROCK_SETTINGS: BedrockSettings = {
  awsRegion: 'ap-northeast-1',
  awsBearerToken: '',
  bedrockModelId: 'apac.anthropic.claude-sonnet-4-20250514-v1:0',
  maxTokens: 10000,
};

export const AWS_REGIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
  { value: 'eu-central-1', label: 'Europe (Frankfurt)' },
  { value: 'eu-west-1', label: 'Europe (Ireland)' },
] as const;
