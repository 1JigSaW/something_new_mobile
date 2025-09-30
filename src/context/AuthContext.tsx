import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthUser } from '../services/authService';
import { shouldUseFallback } from '../config';
import { useAsyncStorage } from '../hooks/useAsyncStorage';
import { STORAGE_KEYS } from '../types/hooks';
import { onUnauthorized } from '../api/authEvents';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (provider: 'apple' | 'google' | 'email', userData?: { email: string; name?: string; code?: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, saveUser] = useAsyncStorage<AuthUser | null>(STORAGE_KEYS.AUTH_USER, null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!isChecking) {
      checkCurrentUser();
    }
  }, []);

  useEffect(() => {
    const off = onUnauthorized(async () => {
      await saveUser(null);
    });
    return () => {
      off();
    };
  }, [saveUser]);

  const checkCurrentUser = async () => {
    if (isChecking) {
      console.log('checkCurrentUser: already checking, skipping...');
      return;
    }

    setIsChecking(true);
    try {
      console.log('checkCurrentUser: starting, shouldUseFallback:', shouldUseFallback());
      
      if (!shouldUseFallback()) {
        console.log('checkCurrentUser: not in fallback mode, checking auth...');
        const currentUser = await authService.getCurrentUser();
        console.log('checkCurrentUser: currentUser from authService:', currentUser);
        
        await saveUser(currentUser);
        setIsLoading(false);
        return;
      }

      if (user) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          await saveUser(currentUser);
        } else {
          await saveUser(null);
        }
        setIsLoading(false);
        return;
      }

      const currentUser = await authService.getCurrentUser();
      
      await saveUser(currentUser);
    } catch (error) {
      console.error('Error checking current user:', error);
      await saveUser(null);
    } finally {
      setIsLoading(false);
      setIsChecking(false);
    }
  };

  const signIn = async (provider: 'apple' | 'google' | 'email', userData?: { email: string; name?: string; code?: string }) => {
    setIsLoading(true);
    try {
      let authUser: AuthUser;
      
      if (provider === 'google') {
        authUser = await authService.signInWithGoogle();
      } else if (provider === 'apple') {
        authUser = await authService.signInWithApple();
      } else if (provider === 'email' && userData?.email && userData?.code) {
        authUser = await authService.signInWithEmailCode({ email: userData.email, code: userData.code });
      } else {
        throw new Error('Unsupported provider or missing user data');
      }

      await saveUser(authUser);
    } catch (error: any) {
      console.error('Auth error:', error);
      
      if (error.code === 'SIGN_IN_CANCELLED' || error.message?.includes('cancelled')) {
        
        if (user) {
          return;
        }
        
        throw new Error('Authentication was cancelled');
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      await saveUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
