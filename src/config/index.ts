import { Platform } from 'react-native';
import type { AppEnv } from '../types/env';
import { ENV } from './env';

// Для iOS симулятора используем localhost, для Android эмулятора - 10.0.2.2
const API_BASE_URL = __DEV__ 
  ? (Platform.OS === 'ios' ? ENV.API_BASE_URL_DEV_IOS : ENV.API_BASE_URL_DEV_ANDROID)
  : ENV.API_BASE_URL_PROD;

const env: AppEnv = {
  API_BASE_URL,
  SENTRY_DSN: ENV.SENTRY_DSN,
  GOOGLE_CLIENT_ID: ENV.GOOGLE_CLIENT_ID,
  APPLE_SIGN_IN_ENABLED: ENV.APPLE_SIGN_IN_ENABLED,
  BUNDLE_ID: ENV.BUNDLE_ID,
  AUTH_FALLBACK_ENABLED: ENV.AUTH_FALLBACK_ENABLED,
  AUTH_FALLBACK_STRICT: ENV.AUTH_FALLBACK_STRICT,
  QUERY_STALE_TIME: ENV.QUERY_STALE_TIME,
  QUERY_RETRY_COUNT: ENV.QUERY_RETRY_COUNT,
  HTTP_TIMEOUT: ENV.HTTP_TIMEOUT,
};

export default env;

// Legacy exports for backward compatibility
export const AUTH_CONFIG = {
  GOOGLE_CLIENT_ID: ENV.GOOGLE_CLIENT_ID,
  APPLE_SIGN_IN_ENABLED: ENV.APPLE_SIGN_IN_ENABLED,
  BUNDLE_ID: ENV.BUNDLE_ID,
};

export const AUTH_FALLBACK_CONFIG = {
  enabled: ENV.AUTH_FALLBACK_ENABLED,
  strict: ENV.AUTH_FALLBACK_STRICT,
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
