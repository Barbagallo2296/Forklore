import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { createMMKV } from 'react-native-mmkv';
import { lightColors, darkColors, type ColorPalette } from './colors';

const storage = createMMKV();
const CHIAVE_TEMA = 'tema';

type ThemeMode = 'light' | 'dark';

export type PreferenzaTema = ThemeMode | 'system';

type ThemeContextValue = {
  mode: ThemeMode;
  preferenza: PreferenzaTema;
  colors: ColorPalette;
  toggleTheme: () => void;
  setPreferenza: (preferenza: PreferenzaTema) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const temaSistema = useColorScheme();
  const [preferenza, setPreferenzaState] = useState<PreferenzaTema>(() => {
    const salvato = storage.getString(CHIAVE_TEMA);
    return salvato === 'light' || salvato === 'dark' ? salvato : 'system';
  });

  const mode: ThemeMode =
    preferenza === 'system' ? (temaSistema === 'dark' ? 'dark' : 'light') : preferenza;

  const setPreferenza = (nuova: PreferenzaTema) => {
    setPreferenzaState(nuova);
    storage.set(CHIAVE_TEMA, nuova);
  };

  const toggleTheme = () => {
    setPreferenza(mode === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextValue = {
    mode,
    preferenza,
    colors: mode === 'light' ? lightColors : darkColors,
    toggleTheme,
    setPreferenza,
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
