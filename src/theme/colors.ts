export type ColorPalette = {
  primary: string;
  primaryLight: string;
  secondary: string;
  secondaryLight: string;
  onPrimary: string;
  background: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  placeholder: string;
  chevron: string;
  tabInactive: string;
  overlay: string;
};

export const lightColors: ColorPalette = {
  primary: '#D9623B',
  primaryLight: '#D9623B26',
  secondary: '#6B8F4E',
  secondaryLight: '#6B8F4E24',
  onPrimary: '#FFFFFF',
  background: '#FAF6F0',
  card: '#FFFFFF',
  textPrimary: '#2B211B',
  textSecondary: '#7A6A5E',
  textTertiary: '#A8998C',
  border: '#EDE4DA',
  placeholder: '#F0E6DA',
  chevron: '#C9BBAE',
  tabInactive: '#A8998C',
  overlay: 'rgba(20, 12, 8, 0.95)',
};

export const darkColors: ColorPalette = {
  primary: '#E8805E',
  primaryLight: '#E8805E2E',
  secondary: '#8FB070',
  secondaryLight: '#8FB0702B',
  onPrimary: '#FFFFFF',
  background: '#1A1512',
  card: '#26201B',
  textPrimary: '#F3ECE4',
  textSecondary: '#B5A89B',
  textTertiary: '#7D7166',
  border: '#3A312A',
  placeholder: '#3A2F28',
  chevron: '#5E5249',
  tabInactive: '#7D7166',
  overlay: 'rgba(10, 7, 5, 0.95)',
};
