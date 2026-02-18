// Design System for Matchmaking App
import { MD3LightTheme } from 'react-native-paper';

export const colors = {
  // Primary colors - Deep Traditional Red/Maroon (Auspicious Indian Wedding Colors)
  primary: '#8B0000', // Deep burgundy red - traditional wedding color
  primaryLight: '#A52A2A',
  primaryDark: '#660000',
  
  // Secondary colors - Rich Gold/Saffron (Prosperity & Auspiciousness)
  secondary: '#DAA520', // Rich traditional Indian gold
  secondaryLight: '#FFD700',
  secondaryDark: '#B8860B',
  
  // Accent colors - Saffron & Deep Maroon
  accent: '#FF8C00', // Saffron orange - auspicious
  accentLight: '#FFA500',
  accentDark: '#FF7F00',
  
  // Traditional Indian Wedding colors
  maroon: '#722F37', // Deep traditional maroon
  maroonLight: '#8B3A42',
  maroonDark: '#4A1F24',
  
  // Neutral colors - Clean whites and grays
  white: '#FFFFFF',
  black: '#0F172A',
  cream: '#F8FAFC', // Soft off-white
  creamLight: '#FFFFFF',
  creamDark: '#F1F5F9',
  ivory: '#FFFBF5',
  
  gray: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  
  // Status colors - Modern and vibrant
  success: '#10B981', // Emerald green
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Modern red
  info: '#3B82F6', // Blue
  
  // Background colors - Rich traditional tones
  background: '#FFFFFF', // White background
  surface: '#FFFFFF',
  surfaceVariant: '#FFFEF5',
  surfaceGold: '#FFF8DC', // Gold-tinted surface
  
  // Text colors
  text: {
    primary: '#0F172A', // Deep slate
    secondary: '#64748B',
    disabled: '#CBD5E1',
    inverse: '#FFFFFF',
  },
  
  // Gradient colors - Traditional Indian Wedding gradients
  gradients: {
    primary: ['#8B0000', '#A52A2A'], // Deep red gradient
    secondary: ['#DAA520', '#FFD700'], // Rich gold gradient
    auspicious: ['#8B0000', '#DAA520'], // Deep red to Gold (most auspicious)
    wedding: ['#722F37', '#8B0000'], // Maroon to Deep Red
    prosperity: ['#DAA520', '#FF8C00'], // Gold to Saffron
    traditional: ['#660000', '#722F37'], // Deep burgundy to maroon
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
  sm: 6,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  '3xl': 32,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  soft: {
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
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