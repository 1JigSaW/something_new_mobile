import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Text as RNText } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Screen from '../ui/Screen';
import Container from '../ui/layout/Container';
import Button from '../ui/atoms/Button';
import Text from '../ui/atoms/Text';
import Loader from '../ui/Loader';
import AppLogo from '../assets/images/AppLogo';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography
} from '../styles';

const AuthScreen: React.FC = () => {
  const { signIn, isLoading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn('google');
    } catch (error: any) {
      console.error('Google Sign In failed:', error);
      
      // Если пользователь отменил авторизацию, не показываем ошибку
      if (error.code === 'SIGN_IN_CANCELLED' || error.message?.includes('cancelled')) {
        console.log('User cancelled Google Sign In');
        return;
      }
      
      // Показываем ошибку только для реальных проблем
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn('apple');
    } catch (error) {
      console.error('Apple Sign In failed:', error);
      Alert.alert('Error', 'Failed to sign in with Apple');
    } finally {
      setIsSigningIn(false);
    }
  };

  if (isLoading || isSigningIn) {
    return (
      <Screen>
        <Container>
          <View style={styles.loaderContainer}>
            <Loader />
            <View style={styles.loaderText}>
              <Text color="muted">Signing you in...</Text>
            </View>
          </View>
        </Container>
      </Screen>
    );
  }

  return (
    <Screen>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Container>
            <View style={styles.content}>
              {/* Logo */}
              <View style={styles.logoContainer}>
                <View style={styles.logo}>
                  <AppLogo 
                    size={48} 
                    color="#ffffff" 
                    backgroundColor="transparent"
                  />
                </View>
              </View>

              {/* Title */}
              <View style={styles.titleContainer}>
                <RNText style={styles.title}>Welcome to Something New</RNText>
                <View style={styles.subtitleContainer}>
                  <RNText style={styles.subtitle}>Start your journey of daily challenges</RNText>
                </View>
              </View>

              {/* Spacer */}
              <View style={styles.spacer} />

              {/* Google Sign In Button */}
              <View style={styles.buttonContainer}>
                <Button
                  title="Continue with Google"
                  onPress={handleGoogleSignIn}
                  style={styles.googleButton}
                  disabled={isSigningIn}
                />
              </View>

              {/* Apple Sign In Button (temporarily disabled) */}
              {/* <View style={styles.buttonContainer}>
                <Button
                  title="Continue with Apple"
                  onPress={handleAppleSignIn}
                  style={styles.appleButton}
                />
              </View> */}

              {/* Bottom Spacer */}
              <View style={styles.bottomSpacer} />
            </View>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing['4xl'],
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  loaderText: {
    marginTop: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  spacer: {
    height: spacing['4xl'],
  },
  buttonContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    ...shadows.sm,
  },
  appleButton: {
    backgroundColor: '#000000',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  bottomSpacer: {
    height: spacing['3xl'],
  },
});

export default AuthScreen;