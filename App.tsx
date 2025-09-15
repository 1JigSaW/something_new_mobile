import React from 'react';
import { StatusBar } from 'react-native';
import { QueryClient } from '@tanstack/react-query';
import { AppProviders } from './src/providers/AppProviders';
import { AppContent } from './src/components/AppContent';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <AppProviders queryClient={queryClient}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <AppContent />
    </AppProviders>
  );
}