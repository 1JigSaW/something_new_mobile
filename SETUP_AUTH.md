# Настройка авторизации

## 1. Google Sign In

### Шаги:
1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google Sign-In API:
   - Перейдите в "APIs & Services" → "Library"
   - Найдите "Google Sign-In API" и включите
4. Создайте OAuth 2.0 credentials:
   - Перейдите в "APIs & Services" → "Credentials"
   - Нажмите "Create Credentials" → "OAuth 2.0 Client IDs"
   - Выберите "iOS" как тип приложения
   - Bundle ID: `org.reactjs.native.example.something-new-mobile`
   - Получите Client ID (формат: `123456789-abcdefg.apps.googleusercontent.com`)

### Обновление файлов:
1. В `src/config/auth.ts` замените `YOUR_GOOGLE_CLIENT_ID_HERE` на ваш реальный Client ID
2. В `ios/something_new_mobile/Info.plist` замените `YOUR_GOOGLE_CLIENT_ID` на ваш реальный Client ID

## 2. Apple Sign In

### Шаги:
1. Перейдите в [Apple Developer Console](https://developer.apple.com)
2. В разделе "Certificates, Identifiers & Profiles"
3. Выберите "Identifiers" → найдите ваш App ID
4. Включите "Sign In with Apple" capability

### Дополнительная настройка:
- Apple Sign In работает автоматически после включения capability
- Никаких дополнительных конфигурационных файлов не требуется

## 3. Тестирование

После настройки:
1. Перезапустите Metro bundler: `npm start`
2. Пересоберите iOS приложение: `npx react-native run-ios`
3. Протестируйте авторизацию на симуляторе

## Важные замечания:

- Google Sign In требует реального устройства или симулятора с Google Play Services
- Apple Sign In работает только на реальных устройствах или симуляторах iOS 13+
- Для production нужно настроить правильные Bundle ID и сертификаты
