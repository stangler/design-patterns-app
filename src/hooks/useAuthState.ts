import { useState, useCallback } from 'react';
import { User } from '@/lib/auth';
import { auth } from '@/lib/auth';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthStateType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const useAuthState = () => {
  const [state, setState] = useState<AuthStateType>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false
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
        error: error ? error.message : null,
        isAuthenticated: !!user
      }));
    } catch (error) {
      console.error('Auth check error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: '認証チェック中にエラーが発生しました',
        isAuthenticated: false
      }));
    }
  }, []);

  const handleAuthChange = useCallback(async (event: AuthChangeEvent, session: Session | null) => {
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
  }, []);

  return {
    state,
    setState,
    checkUser,
    handleAuthChange
  };
}