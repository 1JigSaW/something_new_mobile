export type AppEnv = {
  API_BASE_URL: string;
  SENTRY_DSN?: string;
  GOOGLE_CLIENT_ID: string;
  APPLE_SIGN_IN_ENABLED: boolean;
  BUNDLE_ID: string;
  AUTH_FALLBACK_ENABLED: boolean;
  AUTH_FALLBACK_STRICT: boolean;
  QUERY_STALE_TIME: number;
  QUERY_RETRY_COUNT: number;
  HTTP_TIMEOUT: number;
};


