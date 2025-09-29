import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, AuthUser } from '../services/authService';
import { shouldUseFallback } from '../config/authFallback';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (provider: 'apple' | 'google' | 'email', userData?: { email: string; name?: string; code?: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const saveUserToStorage = async (user: AuthUser | null) => {
    try {
      if (user) {
        await AsyncStorage.setItem('auth_user', JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem('auth_user');
      }
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  };

  const loadUserFromStorage = async (): Promise<AuthUser | null> => {
    try {
      const userData = await AsyncStorage.getItem('auth_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error loading user from storage:', error);
      return null;
    }
  };

  const checkCurrentUser = async () => {
    try {
      if (!shouldUseFallback()) {
        console.log('Fallback disabled - checking only with auth service');
        const currentUser = await authService.getCurrentUser();
        console.log('Current user check result:', currentUser);
        
        if (currentUser) {
          setUser(currentUser);
          await saveUserToStorage(currentUser);
        } else {
          setUser(null);
          await saveUserToStorage(null);
        }
        setIsLoading(false);
        return;
      }

      const savedUser = await loadUserFromStorage();
      if (savedUser) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          console.log('Found valid saved user:', currentUser);
          setUser(currentUser);
          await saveUserToStorage(currentUser);
        } else {
          console.log('Saved user is no longer valid, clearing');
          setUser(null);
          await saveUserToStorage(null);
        }
        setIsLoading(false);
        return;
      }

      const currentUser = await authService.getCurrentUser();
      console.log('Current user check result:', currentUser);
      
      if (currentUser) {
        setUser(currentUser);
        await saveUserToStorage(currentUser);
      } else {
        setUser(null);
        await saveUserToStorage(null);
      }
    } catch (error) {
      console.error('Error checking current user:', error);
      setUser(null);
      await saveUserToStorage(null);
    } finally {
      setIsLoading(false);
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

      setUser(authUser);
      await saveUserToStorage(authUser);
    } catch (error: any) {
      console.error('Auth error:', error);
      
      if (error.code === 'SIGN_IN_CANCELLED' || error.message?.includes('cancelled')) {
        console.log('User cancelled authentication');
        
        if (user) {
          console.log('User is already authenticated, keeping current session');
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
      setUser(null);
      await saveUserToStorage(null);
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
