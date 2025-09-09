import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { AUTH_CONFIG } from '../config/auth';

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  provider: 'apple' | 'google' | 'email' | 'anonymous';
  photo?: string;
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

  async signInWithGoogle(): Promise<AuthUser> {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      return {
        id: userInfo.data?.user?.id || '',
        email: userInfo.data?.user?.email,
        name: userInfo.data?.user?.name || undefined,
        provider: 'google',
        photo: userInfo.data?.user?.photo || undefined,
      };
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
        return {
          id: appleAuthRequestResponse.user,
          email: appleAuthRequestResponse.email || undefined,
          name: appleAuthRequestResponse.fullName 
            ? `${appleAuthRequestResponse.fullName.givenName || ''} ${appleAuthRequestResponse.fullName.familyName || ''}`.trim()
            : undefined,
          provider: 'apple',
        };
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
      // Sign out from Google if signed in
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
      const userInfo = await GoogleSignin.getCurrentUser();
      if (userInfo) {
        return {
          id: userInfo.user?.id || '',
          email: userInfo.user?.email,
          name: userInfo.user?.name || undefined,
          provider: 'google',
          photo: userInfo.user?.photo || undefined,
        };
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
    return null;
  }
}

export const authService = new AuthService();
