import axios, { AxiosError, AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shouldUseFallback } from '../config/authFallback';

export function createHttpClient({ baseURL }: { baseURL: string }): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
  });

  instance.interceptors.request.use(async (config) => {
    try {
      const tokensData = await AsyncStorage.getItem('auth_tokens');
      if (tokensData) {
        const tokens = JSON.parse(tokensData);
        if (!tokens.access_token.startsWith('mock_')) {
          config.headers.Authorization = `Bearer ${tokens.access_token}`;
        }
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        try {
          const tokensData = await AsyncStorage.getItem('auth_tokens');
          const tokens = tokensData ? JSON.parse(tokensData) : null;
          const isMock = tokens?.access_token?.startsWith('mock_');
          if (isMock || shouldUseFallback()) {
            return Promise.reject(error);
          }
          await AsyncStorage.removeItem('auth_tokens');
          await AsyncStorage.removeItem('auth_user');
        } catch (storageError) {
          console.error('Error clearing auth data:', storageError);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}


