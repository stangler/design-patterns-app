// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { AuthError } from '@supabase/supabase-js';

// auth モジュールをモック
vi.mock('@/lib/auth', () => ({
  auth: {
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  },
}));

import { auth } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';

const mockAuth = vi.mocked(auth);

/** Supabase AuthError の最小限モック */
function makeAuthError(message: string): AuthError {
  return {
    name: 'AuthError',
    message,
    status: 400,
    code: 'invalid_credentials',
    __isAuthError: true,
  } as unknown as AuthError;
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===================================
  // signUp
  // ===================================
  describe('signUp', () => {
    it('サインアップ成功時はdataを返しerrorはnull', async () => {
      mockAuth.signUp.mockResolvedValue({ data: { user: null, session: null }, error: null });

      const { result } = renderHook(() => useAuth());

      let response: Awaited<ReturnType<typeof result.current.signUp>>;
      await act(async () => {
        response = await result.current.signUp('test@example.com', 'password123');
      });

      expect(response!.data).toEqual({ user: null, session: null });
      expect(response!.error).toBeNull();
    });

    it('サインアップ失敗時はdataがnullでerrorを返す', async () => {
      mockAuth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: makeAuthError('Email already exists'),
      });

      const { result } = renderHook(() => useAuth());

      let response: Awaited<ReturnType<typeof result.current.signUp>>;
      await act(async () => {
        response = await result.current.signUp('test@example.com', 'password123');
      });

      expect(response!.data).toBeNull();
      expect(response!.error).not.toBeNull();
      expect(response!.error?.code).toBe('AUTH_ERROR');
    });

    it('例外がスローされた場合はエラーメッセージを返す', async () => {
      mockAuth.signUp.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuth());

      let response: Awaited<ReturnType<typeof result.current.signUp>>;
      await act(async () => {
        response = await result.current.signUp('test@example.com', 'password123');
      });

      expect(response!.data).toBeNull();
      expect(response!.error?.message).toBe('サインアップ中にエラーが発生しました');
    });
  });

  // ===================================
  // signIn
  // ===================================
  describe('signIn', () => {
    it('サインイン成功時はdataを返しerrorはnull', async () => {
      mockAuth.signIn.mockResolvedValue({ data: { user: null, session: null }, error: null });

      const { result } = renderHook(() => useAuth());

      let response: Awaited<ReturnType<typeof result.current.signIn>>;
      await act(async () => {
        response = await result.current.signIn('test@example.com', 'password123');
      });

      expect(response!.data).toEqual({ user: null, session: null });
      expect(response!.error).toBeNull();
    });

    it('サインイン失敗時はdataがnullでerrorを返す', async () => {
      mockAuth.signIn.mockResolvedValue({
        data: { user: null, session: null },
        error: makeAuthError('Invalid credentials'),
      });

      const { result } = renderHook(() => useAuth());

      let response: Awaited<ReturnType<typeof result.current.signIn>>;
      await act(async () => {
        response = await result.current.signIn('test@example.com', 'wrong-password');
      });

      expect(response!.data).toBeNull();
      expect(response!.error?.code).toBe('AUTH_ERROR');
    });

    it('例外がスローされた場合はエラーメッセージを返す', async () => {
      mockAuth.signIn.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuth());

      let response: Awaited<ReturnType<typeof result.current.signIn>>;
      await act(async () => {
        response = await result.current.signIn('test@example.com', 'password123');
      });

      expect(response!.data).toBeNull();
      expect(response!.error?.message).toBe('サインイン中にエラーが発生しました');
    });
  });

  // ===================================
  // signOut
  // ===================================
  describe('signOut', () => {
    it('サインアウト成功時はerrorがnull', async () => {
      mockAuth.signOut.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useAuth());

      let response: Awaited<ReturnType<typeof result.current.signOut>>;
      await act(async () => {
        response = await result.current.signOut();
      });

      expect(response!.error).toBeNull();
    });

    it('サインアウト失敗時はerrorを返す', async () => {
      mockAuth.signOut.mockResolvedValue({ error: makeAuthError('Sign out failed') });

      const { result } = renderHook(() => useAuth());

      let response: Awaited<ReturnType<typeof result.current.signOut>>;
      await act(async () => {
        response = await result.current.signOut();
      });

      expect(response!.error?.code).toBe('AUTH_ERROR');
    });

    it('例外がスローされた場合はエラーメッセージを返す', async () => {
      mockAuth.signOut.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuth());

      let response: Awaited<ReturnType<typeof result.current.signOut>>;
      await act(async () => {
        response = await result.current.signOut();
      });

      expect(response!.error?.message).toBe('サインアウト中にエラーが発生しました');
    });
  });
});
