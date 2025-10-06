import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { BottomTabNavigation } from '../../navigation';
import { useAuth } from '../../context/AuthContext';
import AuthScreen from '../../screens/AuthScreen';

export function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();

  console.log('AppContent: isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'user:', user);

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white',
      card: 'white',
    },
  };

  return (
    <SafeAreaProvider>
      {isLoading ? (
        <SafeAreaView style={styles.loadingContainer} />
      ) : !isAuthenticated ? (
        <SafeAreaView style={styles.container}>
          <AuthScreen />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.container}>
          <NavigationContainer theme={navigationTheme}>
            <BottomTabNavigation />
          </NavigationContainer>
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

