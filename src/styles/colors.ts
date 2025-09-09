export const colors = {
  // Primary colors (Brilliant blue palette)
  primary: '#0066cc',
  primaryLight: '#3388dd',
  primaryDark: '#004499',
  
  // Secondary colors (teal/cyan)
  secondary: '#00bcd4',
  secondaryLight: '#4dd0e1',
  secondaryDark: '#0097a7',
  
  // Accent colors (orange/yellow)
  accent: '#ff9800',
  accentLight: '#ffb74d',
  accentDark: '#f57c00',
  
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
