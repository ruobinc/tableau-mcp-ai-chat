export interface TableauDashboardProps {
  username?: string;
}

export interface TableauPulseMetric {
  id: string;
  name: string;
}

export interface TableauPulseSingleProps {
  username?: string;
  metricId?: string;
  siteName?: string;
  height?: string | number;
  width?: string | number;
  layout?: 'default' | 'card' | 'ban';
}

export interface TableauPulseMultipleProps {
  username?: string;
}

export interface TableauPulseEmbedProps {
  mode?: 'single' | 'multiple';
  username?: string;
  metricId?: string;
  siteName?: string;
  height?: string | number;
  width?: string | number;
  layout?: 'default' | 'card' | 'ban';
}

export interface JWTTokenState {
  jwtToken: string;
  loading: boolean;
  error: string;
  refetch: () => Promise<void>;
  clearToken: () => void;
}
