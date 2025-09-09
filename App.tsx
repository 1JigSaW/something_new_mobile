/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import './global.css';
import React from 'react';
import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProviders } from './src/providers/AppProviders';
import { ChallengeProvider } from './src/context/ChallengeContext';
import { AuthProvider } from './src/context/AuthContext';
import { AppContent } from './src/components/AppContent';
import env from './src/config';
import { initSentry } from './src/sentry';

const queryClient = new QueryClient();

export default function App() {
  initSentry({ dsn: env.SENTRY_DSN ?? '' });
  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <AppProviders
        queryClient={queryClient}
      >
        <AuthProvider>
          <ChallengeProvider>
            <AppContent />
          </ChallengeProvider>
        </AuthProvider>
      </AppProviders>
    </>
  );
}
