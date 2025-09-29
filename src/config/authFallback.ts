export const AUTH_FALLBACK_CONFIG = {
  enabled: false,
  
  strict: false,
};

export const shouldUseFallback = (): boolean => {
  if (AUTH_FALLBACK_CONFIG.strict) {
    return false;
  }
  
  if (!AUTH_FALLBACK_CONFIG.enabled) {
    return false;
  }
  
  return __DEV__;
};
