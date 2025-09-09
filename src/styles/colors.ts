export const colors = {
  // Primary colors (фиолетовая палитра)
  primary: '#8b5cf6',
  primaryLight: '#a78bfa',
  primaryDark: '#7c3aed',
  
  // Secondary colors
  secondary: '#10b981',
  secondaryLight: '#6ee7b7',
  secondaryDark: '#059669',
  
  // Accent colors
  accent: '#f59e0b',
  accentLight: '#fbbf24',
  accentDark: '#d97706',
  
  // Neutral colors
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceSecondary: '#f1f5f9',
  
  // Text colors
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Border colors
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  
  // Shadow colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
} as const;

export const timeSlotColors = {
  small: colors.secondary,
  medium: colors.accent,
  large: colors.primary,
} as const;
