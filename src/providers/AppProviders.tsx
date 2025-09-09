import React, { PropsWithChildren } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type AppProvidersProps = {
  queryClient: QueryClient,
};

export function AppProviders({
  children,
  queryClient,
}: PropsWithChildren<AppProvidersProps>) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default AppProviders;


