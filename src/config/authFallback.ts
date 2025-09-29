// Configuration for authentication fallback
// Set to false to disable mock authentication in development

export const AUTH_FALLBACK_CONFIG = {
  enabled: false,
  
  strict: false,
};

export const shouldUseFallback = (): boolean => {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  
  if (AUTH_FALLBACK_CONFIG.strict) {
    return false;
  }
  
  if (!AUTH_FALLBACK_CONFIG.enabled) {
    return false;
  }
  
  return __DEV__ || process.env.NODE_ENV === 'development';
};
