// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthError } from '@/hooks/useAuthError';

describe('useAuthError', () => {
  it('初期状態ではerrorがnullである', () => {
    const { result } = renderHook(() => useAuthError());
    expect(result.current.error).toBeNull();
  });

  it('setErrorでエラーメッセージをセットできる', () => {
    const { result } = renderHook(() => useAuthError());

    act(() => {
      result.current.setError('認証に失敗しました');
    });

    expect(result.current.error).toBe('認証に失敗しました');
  });

  it('clearErrorでエラーをnullにリセットできる', () => {
    const { result } = renderHook(() => useAuthError());

    act(() => {
      result.current.setError('エラーが発生しました');
    });
    expect(result.current.error).toBe('エラーが発生しました');

    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });

  it('setErrorを複数回呼ぶと最後のメッセージが保持される', () => {
    const { result } = renderHook(() => useAuthError());

    act(() => {
      result.current.setError('最初のエラー');
    });
    act(() => {
      result.current.setError('最後のエラー');
    });

    expect(result.current.error).toBe('最後のエラー');
  });

  it('空文字でもエラーをセットできる', () => {
    const { result } = renderHook(() => useAuthError());

    act(() => {
      result.current.setError('');
    });

    expect(result.current.error).toBe('');
  });
});
