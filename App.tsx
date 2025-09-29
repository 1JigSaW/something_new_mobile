import React from 'react';
import { StatusBar } from 'react-native';
import { QueryClient } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProviders } from './src/providers/AppProviders';
import { AppContent } from './src/ui/layout/AppContent';

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders queryClient={queryClient}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <AppContent />
      </AppProviders>
    </GestureHandlerRootView>
  );
}