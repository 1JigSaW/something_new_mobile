import axios, { AxiosError, AxiosInstance } from 'axios';

export function createHttpClient({ baseURL }: { baseURL: string }): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
  });

  instance.interceptors.request.use((config) => {
    // TODO: inject auth token from store when ready
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Centralized error handling/logging hook
      return Promise.reject(error);
    }
  );

  return instance;
}


