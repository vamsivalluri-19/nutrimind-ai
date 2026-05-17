import { DarkTheme } from '@react-navigation/native';

export const colors = {
  background: '#06111f',
  surface: 'rgba(10, 24, 45, 0.88)',
  surfaceAlt: 'rgba(18, 34, 61, 0.8)',
  border: 'rgba(148, 163, 184, 0.18)',
  text: '#F5F7FB',
  textSoft: '#B4C1D1',
  primary: '#54E1C1',
  primaryStrong: '#32B7D3',
  accent: '#F6B93B',
  danger: '#FF7A90',
  success: '#61E18C',
  warning: '#FFD166',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
};

export const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};
