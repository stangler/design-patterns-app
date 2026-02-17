// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { AuthError } from '@supabase/supabase-js';

// auth モジュールをモック
vi.mock('@/lib/auth', () => ({
  auth: {
    getCurrentUser: vi.fn(),
  },
  // User 型は実際の型定義を使うため再エクスポートは不要
}));

import { auth } from '@/lib/auth';
import { useAuthState } from '@/hooks/useAuthState';

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

/** Supabase User の最小限モック */
function makeUser(id = 'user-1', email = 'test@example.com') {
  return {
    id,
    email,
    email_confirmed_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
  };
}

describe('useAuthState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===================================
  // 初期状態
  // ===================================
  describe('初期状態', () => {
    it('user が null, loading が true, isAuthenticated が false', () => {
      // checkUser が呼ばれないよう pending のままにする
      mockAuth.getCurrentUser.mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useAuthState());

      expect(result.current.state.user).toBeNull();
      expect(result.current.state.loading).toBe(true);
      expect(result.current.state.error).toBeNull();
      expect(result.current.state.isAuthenticated).toBe(false);
    });
  });

  // ===================================
  // checkUser
  // ===================================
  describe('checkUser', () => {
    it('ユーザーが存在する場合は user と isAuthenticated:true をセットする', async () => {
      const mockUser = makeUser();
      mockAuth.getCurrentUser.mockResolvedValue({ user: mockUser, error: null });

      const { result } = renderHook(() => useAuthState());

      await act(async () => {
        await result.current.checkUser();
      });

      expect(result.current.state.user).toEqual({
        id: 'user-1',
        email: 'test@example.com',
        email_confirmed_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
      });
      expect(result.current.state.isAuthenticated).toBe(true);
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toBeNull();
    });

    it('ユーザーが存在しない場合は user:null, isAuthenticated:false をセットする', async () => {
      mockAuth.getCurrentUser.mockResolvedValue({ user: null, error: null });

      const { result } = renderHook(() => useAuthState());

      await act(async () => {
        await result.current.checkUser();
      });

      expect(result.current.state.user).toBeNull();
      expect(result.current.state.isAuthenticated).toBe(false);
      expect(result.current.state.loading).toBe(false);
    });

    it('エラーが返された場合は error メッセージをセットする', async () => {
      mockAuth.getCurrentUser.mockResolvedValue({
        user: null,
        error: makeAuthError('Session expired'),
      });

      const { result } = renderHook(() => useAuthState());

      await act(async () => {
        await result.current.checkUser();
      });

      expect(result.current.state.user).toBeNull();
      expect(result.current.state.error).toBe('Session expired');
      expect(result.current.state.loading).toBe(false);
    });

    it('例外がスローされた場合はエラーメッセージをセットする', async () => {
      mockAuth.getCurrentUser.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuthState());

      await act(async () => {
        await result.current.checkUser();
      });

      expect(result.current.state.error).toBe('認証チェック中にエラーが発生しました');
      expect(result.current.state.isAuthenticated).toBe(false);
      expect(result.current.state.loading).toBe(false);
    });
  });

  // ===================================
  // handleAuthChange
  // ===================================
  describe('handleAuthChange', () => {
    it('セッションがある場合は user をセットする', async () => {
      mockAuth.getCurrentUser.mockResolvedValue({ user: null, error: null });

      const { result } = renderHook(() => useAuthState());

      const mockSession = {
        user: makeUser('user-2', 'other@example.com'),
      };

      await act(async () => {
        await result.current.handleAuthChange(
          'SIGNED_IN',
          mockSession as Parameters<typeof result.current.handleAuthChange>[1]
        );
      });

      expect(result.current.state.user).toEqual({
        id: 'user-2',
        email: 'other@example.com',
        email_confirmed_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
      });
      expect(result.current.state.loading).toBe(false);
    });

    it('セッションがない場合は user:null をセットする', async () => {
      mockAuth.getCurrentUser.mockResolvedValue({ user: makeUser(), error: null });

      const { result } = renderHook(() => useAuthState());

      await act(async () => {
        await result.current.checkUser();
      });

      // サインアウト
      await act(async () => {
        await result.current.handleAuthChange('SIGNED_OUT', null);
      });

      expect(result.current.state.user).toBeNull();
      expect(result.current.state.loading).toBe(false);
    });
  });
});
