import React, { createContext, useContext, useState } from 'react';
import { createMMKV } from 'react-native-mmkv';
import { lightColors, darkColors, type ColorPalette } from './colors';

const storage = createMMKV();
const CHIAVE_TEMA = 'tema';

type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ColorPalette;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const salvato = storage.getString(CHIAVE_TEMA);
    return salvato === 'dark' ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    const nuovoMode = mode === 'light' ? 'dark' : 'light';
    setMode(nuovoMode);
    storage.set(CHIAVE_TEMA, nuovoMode);
  };

  const value: ThemeContextValue = {
    mode,
    colors: mode === 'light' ? lightColors : darkColors,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve essere usato dentro un ThemeProvider');
  }
  return context;
}