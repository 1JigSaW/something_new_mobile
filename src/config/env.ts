// Environment configuration
// В продакшене эти значения должны браться из переменных окружения

export const ENV = {
  // API Configuration
  API_BASE_URL_DEV_IOS: 'http://localhost:8001',
  API_BASE_URL_DEV_ANDROID: 'http://10.0.2.2:8001',
  API_BASE_URL_PROD: 'https://your-production-api.com',

  // Sentry Configuration
  SENTRY_DSN: '',

  // Google Auth Configuration
  GOOGLE_CLIENT_ID: '718637865767-ajepgs9stmej8lmjvf5prj799dhegapl.apps.googleusercontent.com',

  // Apple Auth Configuration
  APPLE_SIGN_IN_ENABLED: true,
  BUNDLE_ID: 'org.reactjs.native.example.something-new-mobile',

  // Auth Fallback Configuration
  AUTH_FALLBACK_ENABLED: false,
  AUTH_FALLBACK_STRICT: false,

  // React Query Configuration
  QUERY_STALE_TIME: 300000, // 5 minutes
  QUERY_RETRY_COUNT: 2,

  // HTTP Client Configuration
  HTTP_TIMEOUT: 15000,
} as const;
