import { useState, useEffect, useCallback } from 'react';
import { User } from '@/lib/auth';
import { getSupabaseClient } from '@/lib/supabase-client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkUser = useCallback(async () => {
    const supabase = getSupabaseClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({
          id: user.id,
          email: user.email || '',
          email_confirmed_at: user.email_confirmed_at,
          created_at: user.created_at
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAuthChange = useCallback((event: AuthChangeEvent, session: Session | null) => {
    if (session) {
      setUser({
        id: session.user.id,
        email: session.user.email || '',
        email_confirmed_at: session.user.email_confirmed_at,
        created_at: session.user.created_at
      });
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
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
    checkUser
  };
}