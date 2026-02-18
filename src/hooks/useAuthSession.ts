import { useState, useEffect, useCallback } from 'react';
import { User } from '@/lib/auth';
import { getSupabaseClient } from '@/lib/supabase-client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setUserFromSession = useCallback((sessionUser: { id: string; email?: string; email_confirmed_at?: string; created_at: string } | null) => {
    if (sessionUser) {
      setUser({
        id: sessionUser.id,
        email: sessionUser.email || '',
        email_confirmed_at: sessionUser.email_confirmed_at,
        created_at: sessionUser.created_at,
      });
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const checkUser = useCallback(async () => {
    const supabase = getSupabaseClient();
    try {
      // getSession() はローカルのストレージからセッションを取得するため
      // テスト環境でのモックが機能しやすい
      const { data: { session } } = await supabase.auth.getSession();
      setUserFromSession(session?.user ?? null);
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [setUserFromSession]);

  const handleAuthChange = useCallback((_event: AuthChangeEvent, session: Session | null) => {
    setUserFromSession(session?.user ?? null);
    setLoading(false);
  }, [setUserFromSession]);

  useEffect(() => {
    // Check if user is already signed in
    const initializeAuth = async () => {
      await checkUser();
    };
    initializeAuth();
  }, [checkUser]);

  useEffect(() => {
    // Listen for auth changes
    const supabase = getSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      handleAuthChange
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [handleAuthChange]);

  return {
    user,
    loading,
    isAuthenticated,
    checkUser,
  };
}
