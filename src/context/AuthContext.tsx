import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthUser } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (provider: 'apple' | 'google' | 'email', userData?: { email: string; name?: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      console.log('Current user check result:', currentUser);
      
      // Временная заглушка для тестирования - создаем тестового пользователя
      if (!currentUser) {
        const testUser = {
          id: 'test-user-123',
          email: 'test@example.com',
          name: 'Test User',
          provider: 'email' as const,
        };
        console.log('Using test user for development');
        setUser(testUser);
      } else {
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Error checking current user:', error);
      // В случае ошибки тоже создаем тестового пользователя
      const testUser = {
        id: 'test-user-123',
        email: 'test@example.com',
        name: 'Test User',
        provider: 'email' as const,
      };
      setUser(testUser);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (provider: 'apple' | 'google' | 'email', userData?: { email: string; name?: string }) => {
    setIsLoading(true);
    try {
      let authUser: AuthUser;
      
      if (provider === 'google') {
        authUser = await authService.signInWithGoogle();
      } else if (provider === 'apple') {
        authUser = await authService.signInWithApple();
      } else if (provider === 'email' && userData) {
        // Mock email auth - in a real app, you'd call your backend API
        authUser = {
          id: userData.email,
          email: userData.email,
          name: userData.name,
          provider: 'email'
        };
      } else {
        throw new Error('Unsupported provider or missing user data');
      }

      setUser(authUser);
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Если пользователь отменил авторизацию, проверяем текущее состояние
      if (error.code === 'SIGN_IN_CANCELLED' || error.message?.includes('cancelled')) {
        console.log('User cancelled authentication');
        
        // Если пользователь уже авторизован, оставляем его авторизованным
        if (user) {
          console.log('User is already authenticated, keeping current session');
          return;
        }
        
        // Если пользователь не авторизован, выбрасываем ошибку
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
