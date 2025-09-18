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
      
      // If user cancelled authorization, don't show error
      if (error.code === 'SIGN_IN_CANCELLED' || error.message?.includes('cancelled')) {
        console.log('User cancelled Google Sign In');
        return;
      }
      
      // Show error only for real problems
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
              {/* Hero Section with Gradient Background */}
              <View style={styles.heroSection}>
                <View style={styles.logoContainer}>
                  <View style={styles.logo}>
                    <AppLogo 
                      size={48} 
                      color="#ffffff" 
                      backgroundColor="transparent"
                    />
                  </View>
                </View>

                <View style={styles.titleContainer}>
                  <RNText style={styles.title}>Something New</RNText>
                </View>
              </View>

              {/* Sign In Section */}
              <View style={styles.signInSection}>
                <View style={styles.buttonContainer}>
                <Button
                  title="Google"
                  onPress={handleGoogleSignIn}
                  style={styles.googleButton}
                  disabled={isSigningIn}
                />
                </View>

                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <RNText style={styles.dividerText}>or</RNText>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.buttonContainer}>
                <Button
                  title="Apple"
                  onPress={handleAppleSignIn}
                  style={styles.appleButton}
                  disabled={isSigningIn}
                />
                </View>

              </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
    paddingBottom: spacing['4xl'],
    justifyContent: 'center',
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
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing['4xl'],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: spacing.md,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: spacing.lg,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  featureText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  signInSection: {
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  googleButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    ...shadows.md,
  },
  appleButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    ...shadows.md,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.lg,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  termsContainer: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  termsText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AuthScreen;