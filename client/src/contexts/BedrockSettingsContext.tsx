import { createContext, ReactNode, useContext, useState } from 'react';

import { storage } from '../utils/storage';
import { BedrockSettings, DEFAULT_BEDROCK_SETTINGS } from '../types/bedrock-settings';

interface BedrockSettingsContextType {
  settings: BedrockSettings | null;
  updateSettings: (settings: BedrockSettings) => void;
  clearSettings: () => void;
  hasSettings: boolean;
}

const BedrockSettingsContext = createContext<BedrockSettingsContextType>({
  settings: null,
  updateSettings: () => {},
  clearSettings: () => {},
  hasSettings: false,
});

export const useBedrockSettings = () => useContext(BedrockSettingsContext);

interface BedrockSettingsProviderProps {
  children: ReactNode;
}

export const BedrockSettingsProvider = ({ children }: BedrockSettingsProviderProps) => {
  const [settings, setSettings] = useState<BedrockSettings | null>(() => {
    return storage.getBedrockSettings();
  });

  const updateSettings = (newSettings: BedrockSettings) => {
    storage.setBedrockSettings(newSettings);
    setSettings(newSettings);
  };

  const clearSettings = () => {
    storage.clearBedrockSettings();
    setSettings(null);
  };

  const hasSettings = settings !== null && settings.awsBearerToken !== '';

  return (
    <BedrockSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        clearSettings,
        hasSettings,
      }}
    >
      {children}
    </BedrockSettingsContext.Provider>
  );
};
