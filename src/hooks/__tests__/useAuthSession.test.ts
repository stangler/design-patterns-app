// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// Supabase クライアントをモック
const mockGetSession = vi.fn();
const mockGetUser = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockUnsubscribe = vi.fn();

vi.mock('@/lib/supabase-client', () => ({
  getSupabaseClient: vi.fn(() => ({
    auth: {
      getSession: mockGetSession,
      getUser: mockGetUser,
      onAuthStateChange: mockOnAuthStateChange,
    },
  })),
}));

import { useAuthSession } from '@/hooks/useAuthSession';

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

describe('useAuthSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // getSession はデフォルトで null セッションを返す
    mockGetSession.mockResolvedValue({ data: { session: null } });
    // onAuthStateChange はデフォルトで subscription を返す
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });
  });

  // ===================================
  // 初期ロード
  // ===================================
  describe('初期ロード', () => {
    it('ユーザーが存在する場合は user と isAuthenticated:true をセットする', async () => {
      const mockUser = makeUser();
      mockGetSession.mockResolvedValue({ data: { session: { user: mockUser } } });

      const { result } = renderHook(() => useAuthSession());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual({
        id: 'user-1',
        email: 'test@example.com',
        email_confirmed_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
      });
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('ユーザーが存在しない場合は user:null, isAuthenticated:false をセットする', async () => {
      mockGetSession.mockResolvedValue({ data: { session: null } });

      const { result } = renderHook(() => useAuthSession());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('例外がスローされた場合は user:null, isAuthenticated:false をセットする', async () => {
      mockGetSession.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuthSession());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  // ===================================
  // checkUser（手動呼び出し）
  // ===================================
  describe('checkUser', () => {
    it('手動で checkUser を呼ぶと最新のユーザー情報を取得する', async () => {
      mockGetSession.mockResolvedValue({ data: { session: null } });

      const { result } = renderHook(() => useAuthSession());

      await waitFor(() => expect(result.current.loading).toBe(false));

      // ユーザーがサインインした状態に変更
      mockGetSession.mockResolvedValue({ data: { session: { user: makeUser('user-2', 'new@example.com') } } });

      await act(async () => {
        await result.current.checkUser();
      });

      expect(result.current.user?.id).toBe('user-2');
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  // ===================================
  // onAuthStateChange
  // ===================================
  describe('onAuthStateChange', () => {
    it('セッションがある場合は user をセットする', async () => {
      mockGetSession.mockResolvedValue({ data: { session: null } });

      let capturedCallback: ((event: string, session: unknown) => void) | null = null;
      mockOnAuthStateChange.mockImplementation((cb) => {
        capturedCallback = cb;
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
      });

      const { result } = renderHook(() => useAuthSession());

      await waitFor(() => expect(result.current.loading).toBe(false));

      const mockSession = {
        user: makeUser('user-3', 'session@example.com'),
      };

      await act(async () => {
        capturedCallback!('SIGNED_IN', mockSession);
      });

      expect(result.current.user?.id).toBe('user-3');
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('セッションがない場合は user:null をセットする', async () => {
      const mockUser = makeUser();
      mockGetSession.mockResolvedValue({ data: { session: { user: mockUser } } });

      let capturedCallback: ((event: string, session: unknown) => void) | null = null;
      mockOnAuthStateChange.mockImplementation((cb) => {
        capturedCallback = cb;
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
      });

      const { result } = renderHook(() => useAuthSession());

      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        capturedCallback!('SIGNED_OUT', null);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('アンマウント時に subscription.unsubscribe が呼ばれる', async () => {
      mockGetSession.mockResolvedValue({ data: { session: null } });

      const { unmount } = renderHook(() => useAuthSession());

      await waitFor(() => expect(mockGetSession).toHaveBeenCalled());

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
