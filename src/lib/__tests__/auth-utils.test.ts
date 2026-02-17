import { describe, it, expect } from 'vitest';
import { createAuthError, handleAuthResponse } from '@/lib/auth-utils';

describe('auth-utils.ts', () => {
  // ===================================
  // createAuthError
  // ===================================
  describe('createAuthError', () => {
    it('messageのみでAuthErrorを生成する', () => {
      const error = createAuthError('認証に失敗しました');
      expect(error.code).toBe('AUTH_ERROR');
      expect(error.message).toBe('認証に失敗しました');
      expect(error.details).toBeUndefined();
    });

    it('detailsを含むAuthErrorを生成する', () => {
      const error = createAuthError('認証に失敗しました', '詳細情報');
      expect(error.code).toBe('AUTH_ERROR');
      expect(error.message).toBe('認証に失敗しました');
      expect(error.details).toBe('詳細情報');
    });

    it('空文字のmessageでもAuthErrorを生成する', () => {
      const error = createAuthError('');
      expect(error.code).toBe('AUTH_ERROR');
      expect(error.message).toBe('');
    });
  });

  // ===================================
  // handleAuthResponse
  // ===================================
  describe('handleAuthResponse', () => {
    it('errorがない場合はdataをそのまま返す', () => {
      const response = { data: { id: 'user-1' }, error: null };
      const result = handleAuthResponse(response);
      expect(result.data).toEqual({ id: 'user-1' });
      expect(result.error).toBeNull();
    });

    it('errorがある場合はdataをnullにしてAuthErrorを返す', () => {
      const response = { data: { id: 'user-1' }, error: new Error('接続エラー') };
      const result = handleAuthResponse(response);
      expect(result.data).toBeNull();
      expect(result.error).not.toBeNull();
      expect(result.error?.code).toBe('AUTH_ERROR');
      expect(result.error?.message).toContain('接続エラー');
    });

    it('errorが文字列の場合もAuthErrorを返す', () => {
      const response = { data: null, error: 'Invalid credentials' };
      const result = handleAuthResponse(response);
      expect(result.data).toBeNull();
      expect(result.error?.message).toBe('Invalid credentials');
    });

    it('dataがnullでerrorもnullの場合はdataをnullで返す', () => {
      const response = { data: null, error: null };
      const result = handleAuthResponse(response);
      expect(result.data).toBeNull();
      expect(result.error).toBeNull();
    });
  });
});
