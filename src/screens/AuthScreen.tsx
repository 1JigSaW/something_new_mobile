import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Text as RNText, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Screen from '../ui/Screen';
import Container from '../ui/layout/Container';
import Text from '../ui/atoms/Text';
import Loader from '../ui/Loader';
import AppLogo from '../assets/images/AppLogo';
import { GoogleIcon, AppleIcon } from '../assets/icons';
import { colors, spacing, borderRadius, shadows } from '../styles';

const AuthScreen: React.FC = () => {
  const { signIn, isLoading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn('google');
    } catch (error: any) {
      console.error('Google Sign In failed:', error);
      
      if (error.code === 'SIGN_IN_CANCELLED' || error.message?.includes('cancelled')) {
        setIsSigningIn(false);
        return;
      }
      
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn('apple');
    } catch (error: any) {
      console.error('Apple Sign In failed:', error);
      
      if (error.code === 'SIGN_IN_CANCELLED' || error.message?.includes('cancelled')) {
        setIsSigningIn(false);
        return;
      }
      
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
              {/* Hero Section */}
              <View style={styles.heroSection}>
                <View style={styles.logoContainer}>
                  <View style={styles.logo}>
                    <AppLogo 
                      size={48} 
                      color={colors.surface} 
                      backgroundColor="transparent"
                    />
                  </View>
                </View>

                <View style={styles.titleContainer}>
                  <RNText style={styles.title}>Something New</RNText>
                  <RNText style={styles.subtitle}>Discover new challenges every day</RNText>
                </View>
              </View>

              {/* Auth Card */}
              <View style={styles.authCard}>
                <View style={styles.cardHeader}>
                  <RNText style={styles.cardTitle}>Welcome!</RNText>
                  <RNText style={styles.cardSubtitle}>Sign in to continue your journey</RNText>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleSignIn}
                    disabled={isSigningIn}
                  >
                    <View style={styles.iconContainer}>
                      <GoogleIcon size={20} color={colors.info} />
                    </View>
                    <RNText style={styles.buttonText}>Continue with Google</RNText>
                  </TouchableOpacity>
                </View>

                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <RNText style={styles.dividerText}>or</RNText>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.appleButton}
                    onPress={handleAppleSignIn}
                    disabled={isSigningIn}
                  >
                    <View style={styles.iconContainer}>
                      <AppleIcon size={20} color={colors.textPrimary} />
                    </View>
                    <RNText style={styles.buttonText}>Continue with Apple</RNText>
                  </TouchableOpacity>
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
    paddingTop: 60,
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
    marginBottom: spacing['3xl'],
  },
  authCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: spacing['2xl'],
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: spacing.sm,
  },
  cardSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
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
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appleButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  dividerText: {
    marginHorizontal: spacing.lg,
    fontSize: 14,
    color: colors.surface,
    fontWeight: '500',
    opacity: 0.8,
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