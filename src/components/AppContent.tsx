import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigation } from '../navigation/BottomTabNavigation';
import AuthScreen from '../screens/AuthScreen';
import { useAuth } from '../context/AuthContext';

export function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  
  console.log('AppContent render - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  // Показываем загрузку пока проверяем авторизацию
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <AuthScreen />
      </SafeAreaProvider>
    );
  }

  // Если авторизован, показываем основное приложение
  if (isAuthenticated) {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <BottomTabNavigation />
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }

  // Если не авторизован, показываем экран авторизации
  return (
    <SafeAreaProvider>
      <AuthScreen />
    </SafeAreaProvider>
  );
}
