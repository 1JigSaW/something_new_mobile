import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';

interface AppProvidersProps {
  queryClient: QueryClient;
}

export function AppProviders({
  children,
  queryClient,
}: PropsWithChildren<AppProvidersProps>) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default AppProviders;


