import { useCallback, useState } from 'react';

export function useAuthError() {
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setErrorWithMessage = useCallback((message: string) => {
    setError(message);
  }, []);

  return {
    error,
    clearError,
    setError: setErrorWithMessage
  };
}
