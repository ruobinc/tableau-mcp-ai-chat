import { useCallback, useEffect, useState } from 'react';
import { useJWTContext } from '@/providers/JWTProvider';

export const useJWTToken = (username: string) => {
  const [jwtToken, setJwtToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { getToken, clearToken: contextClearToken } = useJWTContext();

  const fetchJWTToken = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');

      const token = await getToken(username);
      setJwtToken(token);
    } catch (err) {
      console.error('JWT取得エラー:', err);
      setError(err instanceof Error ? err.message : 'JWT取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [username, getToken]);

  const clearToken = useCallback(() => {
    contextClearToken(username);
    setJwtToken('');
  }, [username, contextClearToken]);

  useEffect(() => {
    if (username) {
      fetchJWTToken();
    }
  }, [username, fetchJWTToken]);

  return {
    jwtToken,
    loading,
    error,
    refetch: fetchJWTToken,
    clearToken
  };
};
