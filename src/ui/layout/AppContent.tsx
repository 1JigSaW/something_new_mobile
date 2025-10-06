import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { BottomTabNavigation } from '../../navigation';
import { useAuth } from '../../context/AuthContext';
import AuthScreen from '../../screens/AuthScreen';

export function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();

  console.log('AppContent: isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'user:', user);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer} />
      </SafeAreaProvider>
    );
  }

  if (!isAuthenticated) {
    console.log('AppContent: User not authenticated, showing AuthScreen');
    return <AuthScreen />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <BottomTabNavigation />
        </NavigationContainer>
      </SafeAreaView>
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

