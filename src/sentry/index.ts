import * as Sentry from '@sentry/react-native';

type InitSentryArgs = {
  dsn: string,
};

export function initSentry({ dsn }: InitSentryArgs) {
  if (!dsn) return;
  Sentry.init({
    dsn,
    enableNative: true,
    tracesSampleRate: 0.0,
    enableAutoPerformanceTracing: false,
  });
}


