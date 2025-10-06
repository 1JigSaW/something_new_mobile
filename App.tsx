import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { QueryClient } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProviders } from './src/providers/AppProviders';
import { AppContent } from './src/ui/layout/AppContent';
import { ENV } from './src/config/env';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: ENV.QUERY_RETRY_COUNT,
      staleTime: ENV.QUERY_STALE_TIME,
    },
  },
});

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AppProviders queryClient={queryClient}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
        <AppContent />
      </AppProviders>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});