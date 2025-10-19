// Design System for Matchmaking App
import { MD3LightTheme } from 'react-native-paper';

export const colors = {
  // Primary colors
  primary: '#FF6B6B', // Coral red for love/hearts
  primaryLight: '#FF8E8E',
  primaryDark: '#E55555',
  
  // Secondary colors
  secondary: '#4ECDC4', // Teal for balance
  secondaryLight: '#7EDDD6',
  secondaryDark: '#3BA89F',
  
  // Accent colors
  accent: '#FFE66D', // Yellow for highlights
  accentLight: '#FFF2A1',
  accentDark: '#E6D15A',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#2C3E50',
  gray: {
    50: '#F8F9FA',
    100: '#E9ECEF',
    200: '#DEE2E6',
    300: '#CED4DA',
    400: '#ADB5BD',
    500: '#6C757D',
    600: '#495057',
    700: '#343A40',
    800: '#212529',
    900: '#1A1D20',
  },
  
  // Status colors
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
  
  // Background colors
  background: '#FAFBFC',
  surface: '#FFFFFF',
  surfaceVariant: '#F8F9FA',
  
  // Text colors
  text: {
    primary: '#2C3E50',
    secondary: '#6C757D',
    disabled: '#ADB5BD',
    inverse: '#FFFFFF',
  },
  
  // Gradient colors
  gradients: {
    primary: ['#FF6B6B', '#FF8E8E'],
    secondary: ['#4ECDC4', '#7EDDD6'],
    sunset: ['#FF6B6B', '#FFE66D'],
    ocean: ['#4ECDC4', '#45B7B8'],
  }
};

export const typography = {
  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryLight,
    secondary: colors.secondary,
    secondaryContainer: colors.secondaryLight,
    tertiary: colors.accent,
    tertiaryContainer: colors.accentLight,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    background: colors.background,
    error: colors.error,
    onPrimary: colors.white,
    onSecondary: colors.white,
    onSurface: colors.text.primary,
    onBackground: colors.text.primary,
    outline: colors.gray[300],
  },
  typography,
  spacing,
  borderRadius,
  shadows,
};