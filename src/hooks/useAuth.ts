import { useCallback } from 'react';
import { auth } from '@/lib/auth';
import { createAuthError, handleAuthResponse } from '@/lib/auth-utils';

export function useAuth() {
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await auth.signUp(email, password);
      const result = handleAuthResponse({ data, error });
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error: createAuthError('サインアップ中にエラーが発生しました') };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await auth.signIn(email, password);
      const result = handleAuthResponse({ data, error });
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error: createAuthError('サインイン中にエラーが発生しました') };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await auth.signOut();
      const result = handleAuthResponse({ data: null, error });
      return result;
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: createAuthError('サインアウト中にエラーが発生しました') };
    }
  }, []);

  return {
    signUp,
    signIn,
    signOut
  };
}