# Environment Configuration Setup

## Overview
Все конфигурационные данные вынесены в централизованный файл `src/config/env.ts`.

## Configuration Structure

### API Configuration
- `API_BASE_URL_DEV_IOS` - URL для iOS симулятора (localhost)
- `API_BASE_URL_DEV_ANDROID` - URL для Android эмулятора (10.0.2.2)
- `API_BASE_URL_PROD` - URL для продакшена

### Authentication Configuration
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `APPLE_SIGN_IN_ENABLED` - Включить/выключить Apple Sign In
- `BUNDLE_ID` - Bundle ID для iOS

### Auth Fallback Configuration
- `AUTH_FALLBACK_ENABLED` - Включить fallback режим
- `AUTH_FALLBACK_STRICT` - Строгий режим fallback

### Performance Configuration
- `QUERY_STALE_TIME` - Время кэширования React Query (мс)
- `QUERY_RETRY_COUNT` - Количество повторов запросов
- `HTTP_TIMEOUT` - Таймаут HTTP запросов (мс)

### Monitoring Configuration
- `SENTRY_DSN` - Sentry DSN для мониторинга ошибок

## Usage

```typescript
import { ENV } from '../config/env';

// Использование в коде
const apiUrl = ENV.API_BASE_URL_DEV_IOS;
const timeout = ENV.HTTP_TIMEOUT;
```

## Production Setup

Для продакшена рекомендуется:

1. Использовать переменные окружения
2. Заменить хардкод значения на `process.env.VARIABLE_NAME`
3. Добавить валидацию конфигурации
4. Использовать разные конфигурации для разных окружений

## Example Production Implementation

```typescript
// src/config/env.ts
export const ENV = {
  API_BASE_URL_PROD: process.env.API_BASE_URL || 'https://api.yourapp.com',
  SENTRY_DSN: process.env.SENTRY_DSN || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  // ... other configs
} as const;
```

## Security Notes

- Никогда не коммитьте секретные ключи в репозиторий
- Используйте разные ключи для dev/staging/prod
- Регулярно ротируйте API ключи
- Используйте environment-specific конфигурации
