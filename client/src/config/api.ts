const defaultBaseUrl = 'http://localhost:8000';

const normalizedBaseUrl = (() => {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (!raw) {
    return defaultBaseUrl;
  }
  try {
    const trimmed = raw.trim();
    if (!trimmed) {
      return defaultBaseUrl;
    }
    const url = new URL(trimmed.startsWith('http') ? trimmed : `http://${trimmed}`);
    return url.origin;
  } catch (error) {
    console.warn('[config/api] Invalid VITE_API_BASE_URL, falling back to default.', error);
    return defaultBaseUrl;
  }
})();

export const API_BASE_URL = normalizedBaseUrl;

export const apiEndpoints = {
  chat: `${API_BASE_URL}/api/chat`,
  createReport: `${API_BASE_URL}/api/create_report`,
  createChart: `${API_BASE_URL}/api/create_chart`,
  jwt: `${API_BASE_URL}/api/jwt`
} as const;