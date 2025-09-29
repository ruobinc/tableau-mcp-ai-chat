import { useMediaQuery } from '@mui/material';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { storage } from '../utils/storage';

interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const useDarkMode = () => useContext(DarkModeContext);

interface DarkModeProviderProps {
  children: ReactNode;
}

export const DarkModeProvider = ({ children }: DarkModeProviderProps) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = storage.getDarkMode();
    return saved !== null ? saved : prefersDarkMode;
  });

  const toggleDarkMode = () => {
    setDarkMode((prev: boolean) => {
      const newValue = !prev;
      storage.setDarkMode(newValue);
      return newValue;
    });
  };

  useEffect(() => {
    const savedDarkMode = storage.getDarkMode();
    if (savedDarkMode === null) {
      setDarkMode(prefersDarkMode);
    }
  }, [prefersDarkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
