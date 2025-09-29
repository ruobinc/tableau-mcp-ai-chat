import { LOCAL_STORAGE_KEYS } from '../config/constants';

export const storage = {
  getDarkMode: (): boolean | null => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.DARK_MODE);
    return saved ? JSON.parse(saved) : null;
  },

  setDarkMode: (value: boolean): void => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.DARK_MODE, JSON.stringify(value));
  },

  getJwtToken: (username: string): string | null => {
    return localStorage.getItem(`${LOCAL_STORAGE_KEYS.JWT_TOKEN_PREFIX}${username}`);
  },

  setJwtToken: (username: string, token: string): void => {
    localStorage.setItem(`${LOCAL_STORAGE_KEYS.JWT_TOKEN_PREFIX}${username}`, token);
  },

  clearJwtToken: (username: string): void => {
    localStorage.removeItem(`${LOCAL_STORAGE_KEYS.JWT_TOKEN_PREFIX}${username}`);
  },

  getChatHistory: () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CHAT_HISTORY);
    return saved ? JSON.parse(saved) : [];
  },

  setChatHistory: (history: any[]): void => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(history));
  },

  clearChatHistory: (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CHAT_HISTORY);
  },

  getUserPreferences: () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_PREFERENCES);
    return saved ? JSON.parse(saved) : {};
  },

  setUserPreferences: (preferences: Record<string, any>): void => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  },

  clearUserPreferences: (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_PREFERENCES);
  },

  clearAll: (): void => {
    Object.values(LOCAL_STORAGE_KEYS).forEach((key) => {
      if (key.endsWith('_PREFIX')) return;
      localStorage.removeItem(key);
    });
  },
};
