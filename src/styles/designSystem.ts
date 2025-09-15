// Something New - Design System
// Единый стиль для всего приложения

import { typography as importedTypography } from './typography';

export const colors = {
  // Основные цвета (purple palette)
  primary: '#8b5cf6',        // Основной фиолетовый
  primaryLight: '#a78bfa',   // Светло-фиолетовый
  primaryDark: '#7c3aed',    // Темно-фиолетовый
  
  // Нейтральные цвета
  white: '#ffffff',
  black: '#000000',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Семантические цвета
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#8b5cf6',
  
  // Алиасы для совместимости
  text: '#1f2937',
  textMuted: '#6b7280',
  background: '#ffffff',
  border: '#e5e7eb',
} as const;

export const typography = {
  // Размеры шрифтов
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
  
  // Веса шрифтов
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

// Компонентные стили
export const buttonStyles = {
  primary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
} as const;

export const inputStyles = {
  default: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
    fontSize: typography.base.fontSize,
    color: colors.text,
  },
  focused: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 2,
  },
} as const;

export const cardStyles = {
  default: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
} as const;

// Текстовые стили
export const textStyles = {
  title: {
    ...typography['2xl'],
    color: colors.text,
    fontWeight: typography.weights.semibold,
  },
  subtitle: {
    ...typography.lg,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
  body: {
    ...typography.base,
    color: colors.text,
  },
  caption: {
    ...typography.sm,
    color: colors.textMuted,
  },
  button: {
    ...typography.base,
    color: colors.white,
    fontWeight: typography.weights.medium,
  },
  buttonSecondary: {
    ...typography.base,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
} as const;

// Лейаут стили
export const layoutStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  paddingHorizontal: {
    paddingHorizontal: spacing.lg,
  },
  paddingVertical: {
    paddingVertical: spacing.lg,
  },
  marginBottom: {
    marginBottom: spacing.lg,
  },
  marginTop: {
    marginTop: spacing.lg,
  },
} as const;
