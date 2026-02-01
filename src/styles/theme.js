// Design System for Matchmaking App
import { MD3LightTheme } from 'react-native-paper';

export const colors = {
  // Primary colors - Deep Traditional Wedding Red/Maroon
  primary: '#8B0000', // Deep burgundy red (very traditional)
  primaryLight: '#B22222',
  primaryDark: '#5C0000',
  
  // Secondary colors - Rich Gold (Traditional Wedding Gold)
  secondary: '#DAA520', // Goldenrod - traditional Indian gold
  secondaryLight: '#FFD700',
  secondaryDark: '#B8860B',
  
  // Accent colors - Saffron & Deep Maroon
  accent: '#FF8C00', // Saffron orange
  accentLight: '#FFA500',
  accentDark: '#FF7F00',
  
  // Traditional Indian Wedding colors
  maroon: '#722F37', // Deep traditional maroon
  maroonLight: '#8B3A42',
  maroonDark: '#4A1F24',
  
  // Neutral colors - Rich cream and ivory
  white: '#FFFFFF',
  black: '#1A1A1A',
  cream: '#FFF5E6', // Rich ivory/cream
  creamLight: '#FFFBF0',
  creamDark: '#F5E6D3',
  ivory: '#FFFFF0',
  
  gray: {
    50: '#F9F7F4',
    100: '#F0EDE8',
    200: '#E5E0D8',
    300: '#D4CEC4',
    400: '#B8B0A5',
    500: '#8B8276',
    600: '#6B6258',
    700: '#4A433C',
    800: '#2F2A25',
    900: '#1A1815',
  },
  
  // Status colors with Indian theme
  success: '#22C55E', // Green for prosperity
  warning: '#F59E0B', // Amber
  error: '#DC2626', // Deep red
  info: '#3B82F6',
  
  // Background colors - Rich traditional tones
  background: '#FFF5E6', // Rich ivory background
  surface: '#FFFFFF',
  surfaceVariant: '#FFFBF0',
  surfaceGold: '#FFF8DC', // Gold-tinted surface
  
  // Text colors
  text: {
    primary: '#1A1815', // Deep brown-black
    secondary: '#6B6258',
    disabled: '#B8B0A5',
    inverse: '#FFFFFF',
  },
  
  // Gradient colors - Traditional Indian Wedding gradients
  gradients: {
    primary: ['#8B0000', '#B22222'], // Deep red gradient
    secondary: ['#DAA520', '#FFD700'], // Rich gold gradient
    auspicious: ['#8B0000', '#DAA520'], // Deep red to Gold (most auspicious)
    wedding: ['#722F37', '#8B0000'], // Maroon to Deep Red
    prosperity: ['#DAA520', '#FF8C00'], // Gold to Saffron
    traditional: ['#5C0000', '#722F37'], // Deep burgundy to maroon
    royal: ['#8B0000', '#DAA520', '#FFD700'], // Royal wedding gradient
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
    onSecondary: colors.black,
    onSurface: colors.text.primary,
    onBackground: colors.text.primary,
    outline: colors.gray[300],
  },
  typography,
  spacing,
  borderRadius,
  shadows,
};