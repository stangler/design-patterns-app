'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User, AuthState } from '@/lib/auth';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<{ data: unknown; error: unknown }>;
  signIn: (email: string, password: string) => Promise<{ data: unknown; error: unknown }>;
  signOut: () => Promise<{ error: unknown }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  const checkUser = useCallback(async () => {
    try {
      const { user, error } = await auth.getCurrentUser();
      setState(prev => ({
        ...prev,
        user: user ? {
          id: user.id,
          email: user.email || '',
          email_confirmed_at: user.email_confirmed_at,
          created_at: user.created_at
        } : null,
        loading: false,
        error: error ? error.message : null
      }));
    } catch (error) {
      console.error('Auth check error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: '認証チェック中にエラーが発生しました'
      }));
    }
  }, []);

  useEffect(() => {
    // Check if user is already signed in
    const initializeAuth = async () => {
      await checkUser();
    };
    initializeAuth();
  }, [checkUser]);

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (session) {
          setState(prev => ({
            ...prev,
            user: session.user ? {
              id: session.user.id,
              email: session.user.email || '',
              email_confirmed_at: session.user.email_confirmed_at,
              created_at: session.user.created_at
            } : null,
            loading: false
          }));
        } else {
          setState(prev => ({
            ...prev,
            user: null,
            loading: false
          }));
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  const signUp = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await auth.signUp(email, password);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error ? error.message : null
      }));
      return { data, error };
    } catch (error) {
      console.error('Sign up error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'サインアップ中にエラーが発生しました'
      }));
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await auth.signIn(email, password);
      setState(prev => ({
        ...prev,
        user: data?.user ? {
          id: data.user.id,
          email: data.user.email || '',
          email_confirmed_at: data.user.email_confirmed_at,
          created_at: data.user.created_at
        } : null,
        loading: false,
        error: error ? error.message : null
      }));
      return { data, error };
    } catch (error) {
      console.error('Sign in error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'サインイン中にエラーが発生しました'
      }));
      return { data: null, error };
    }
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      const { error } = await auth.signOut();
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        error: error ? error.message : null
      }));
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'サインアウト中にエラーが発生しました'
      }));
      return { error };
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        signUp,
        signIn,
        signOut,
        clearError
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