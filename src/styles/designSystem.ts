import { colors as palette } from './colors';

export const colors = {
  primary: palette.primary,
  primaryLight: palette.primaryLight,
  primaryDark: palette.primaryDark,
  white: palette.surface,
  black: palette.textPrimary,
  gray50: palette.secondaryLight,
  gray100: palette.secondaryDark,
  gray200: palette.gray200,
  gray300: palette.gray300,
  gray400: palette.textMuted,
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  success: palette.success,
  warning: palette.warning,
  error: palette.error,
  info: palette.info,
  text: palette.textPrimary,
  textMuted: palette.textSecondary,
  background: palette.background,
  border: palette.border,
} as const;

export const typography = {
  xs: { 
    fontSize: 12, 
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  sm: { 
    fontSize: 14, 
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  base: { 
    fontSize: 16, 
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  lg: { 
    fontSize: 18, 
    lineHeight: 28,
    fontWeight: '500' as const,
  },
  xl: { 
    fontSize: 20, 
    lineHeight: 28,
    fontWeight: '500' as const,
  },
  '2xl': { 
    fontSize: 24, 
    lineHeight: 32,
    fontWeight: '600' as const,
  },
  '3xl': { 
    fontSize: 30, 
    lineHeight: 36,
    fontWeight: '600' as const,
  },
  '4xl': { 
    fontSize: 36, 
    lineHeight: 40,
    fontWeight: '700' as const,
  },
  
  weights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;