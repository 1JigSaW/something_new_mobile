import type { AppEnv } from '../types/env';
import { AUTH_CONFIG } from './auth';
import { AUTH_FALLBACK_CONFIG, shouldUseFallback } from './authFallback';

const env: AppEnv = {
  API_BASE_URL: 'http://127.0.0.1:8001',
  SENTRY_DSN: '',
};

export default env;

export {
  AUTH_CONFIG,
  AUTH_FALLBACK_CONFIG,
  shouldUseFallback,
};
