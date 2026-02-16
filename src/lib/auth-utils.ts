
// 認証関連のユーティリティ関数
export const createAuthError = (message: string, details?: string): AuthError => ({
  code: 'AUTH_ERROR',
  message,
  details
});

export const handleAuthResponse = (response: { data: unknown; error: unknown }): { data: unknown; error: AuthError | null } => {
  if (response.error) {
    return { data: null, error: createAuthError(String(response.error)) };
  }
  return { data: response.data, error: null };
};

export interface AuthError {
  code: string;
  message: string;
  details?: string;
}