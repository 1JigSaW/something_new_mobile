export const colors = {
  // Primary colors (dark elegant palette)
  primary: '#1a1a1a',
  primaryLight: '#333333',
  primaryDark: '#000000',
  
  // Secondary colors (white/light gray)
  secondary: '#ffffff',
  secondaryLight: '#f8f9fa',
  secondaryDark: '#e9ecef',
  
  // Accent colors (subtle blue)
  accent: '#4a90e2',
  accentLight: '#7bb3f0',
  accentDark: '#2c5aa0',
  
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
