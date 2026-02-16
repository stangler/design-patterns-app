'use client';

import { createContext, useContext, ReactNode } from 'react';
import { User } from '@/lib/auth';

import { AuthError } from '@/lib/auth-utils';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useAuth as useAuthLogic } from '@/hooks/useAuth';
import { useAuthError } from '@/hooks/useAuthError';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<{ data: unknown; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ data: unknown; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  clearError: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading, isAuthenticated } = useAuthSession();
  const { signUp, signIn, signOut } = useAuthLogic();
  const { error, clearError } = useAuthError();

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        clearError,
        isAuthenticated
      }}
    >
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
