import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_CONFIG } from '../config/auth';
import { shouldUseFallback } from '../config/authFallback';
import { http } from '../api';
import { API } from '../api/endpoints';

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  provider: 'apple' | 'google' | 'email' | 'anonymous';
  photo?: string;
  tokens?: AuthTokens;
}

class AuthService {
  constructor() {
    this.initializeGoogleSignIn();
  }

  private initializeGoogleSignIn() {
    GoogleSignin.configure({
      webClientId: AUTH_CONFIG.GOOGLE_CLIENT_ID,
      iosClientId: AUTH_CONFIG.GOOGLE_CLIENT_ID,
      offlineAccess: true,
    });
  }

  private async saveTokens(tokens: AuthTokens): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_tokens', JSON.stringify(tokens));
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  }

  private async getTokens(): Promise<AuthTokens | null> {
    try {
      const tokensData = await AsyncStorage.getItem('auth_tokens');
      return tokensData ? JSON.parse(tokensData) : null;
    } catch (error) {
      console.error('Error getting tokens:', error);
      return null;
    }
  }

  private async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_tokens');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  private async authenticateWithBackend(provider: string, idToken: string, userData?: any): Promise<AuthUser> {
    try {
      const response = await http.post(
        API.auth.login(),
        {
          provider,
          id_token: idToken,
        },
      );

      const { user, tokens } = response.data;
      
      await this.saveTokens(tokens);

      return {
        ...user,
        tokens,
      };
    } catch (error) {
      console.error('Backend authentication failed:', error);
      
      const useFallback = shouldUseFallback();
      console.log('Should use fallback:', useFallback);
      console.log('Environment:', __DEV__ ? 'development' : 'production');
      console.log('__DEV__:', __DEV__);
      
      if (useFallback) {
        console.log('Using fallback authentication for development');
        
        const mockTokens: AuthTokens = {
          access_token: `mock_${provider}_${Date.now()}`,
          refresh_token: `mock_refresh_${provider}_${Date.now()}`,
          token_type: 'Bearer',
          expires_in: 3600,
        };
        
        const mockUser: AuthUser = {
          id: userData?.id || `mock_${provider}_user_${Date.now()}`,
          email: userData?.email || (provider === 'google' ? 'test@gmail.com' : 'test@icloud.com'),
          name: userData?.name || (provider === 'google' ? 'Test Google User' : 'Test Apple User'),
          provider: provider as 'google' | 'apple',
          photo: userData?.photo,
          tokens: mockTokens,
        };
        
        await this.saveTokens(mockTokens);
        
        return mockUser;
      } else {
        console.log('Fallback disabled - failing authentication');
        throw new Error('Authentication server is not available. Please try again later.');
      }
    }
  }

  async signInWithEmailCode({ email, code }: { email: string, code: string }): Promise<AuthUser> {
    try {
      const { data } = await http.post(
        API.auth.verify(),
        {
          email,
          code,
        },
      );
      const tokens: AuthTokens = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_type: data.token_type,
        expires_in: data.expires_in ?? 3600,
      };
      await this.saveTokens(tokens);
      const user = await this.getCurrentUser();
      if (user) {
        return user;
      }
      return {
        id: email,
        email,
        provider: 'email',
        tokens,
      };
    } catch (error) {
      await this.clearTokens();
      throw error;
    }
  }

  async signInWithGoogle(): Promise<AuthUser> {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      if (!userInfo.data?.idToken) {
        throw new Error('No ID token received from Google');
      }

      const userData = {
        id: userInfo.data.user?.id || '',
        email: userInfo.data.user?.email,
        name: userInfo.data.user?.name,
        photo: userInfo.data.user?.photo,
      };

      return await this.authenticateWithBackend('google', userInfo.data.idToken, userData);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Sign in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Sign in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Play services not available');
      } else {
        throw new Error(`Google sign in failed: ${error.message}`);
      }
    }
  }

  async signInWithApple(): Promise<AuthUser> {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

      if (credentialState === appleAuth.State.AUTHORIZED) {
        if (!appleAuthRequestResponse.identityToken) {
          throw new Error('No identity token received from Apple');
        }

        const userData = {
          id: appleAuthRequestResponse.user,
          email: appleAuthRequestResponse.email,
          name: appleAuthRequestResponse.fullName 
            ? `${appleAuthRequestResponse.fullName.givenName || ''} ${appleAuthRequestResponse.fullName.familyName || ''}`.trim()
            : undefined,
        };

        return await this.authenticateWithBackend('apple', appleAuthRequestResponse.identityToken, userData);
      } else {
        throw new Error('Apple sign in not authorized');
      }
    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) {
        throw new Error('Apple sign in was cancelled');
      } else {
        throw new Error(`Apple sign in failed: ${error.message}`);
      }
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.clearTokens();
      
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) {
        await GoogleSignin.signOut();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const tokens = await this.getTokens();
      if (!tokens) {
        return null;
      }

      if (tokens.access_token.startsWith('mock_')) {
        console.log('Using mock user for development');
        return {
          id: tokens.access_token.split('_')[2],
          email: tokens.access_token.includes('google') ? 'test@gmail.com' : 'test@icloud.com',
          name: tokens.access_token.includes('google') ? 'Test Google User' : 'Test Apple User',
          provider: tokens.access_token.includes('google') ? 'google' : 'apple',
          tokens,
        };
      }

      try {
        const response = await http.get(
          API.auth.me(),
          {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          },
        );

        return {
          ...response.data.user,
          tokens,
        };
      } catch (error) {
        await this.clearTokens();
        return null;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
