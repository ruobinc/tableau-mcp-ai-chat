import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { apiEndpoints } from '@/config/api';

interface JWTResponse {
  token: string;
  success: boolean;
}

interface JWTTokenData {
  token: string;
  expiry: number;
  username: string;
}

interface JWTContextType {
  getToken: (username: string) => Promise<string>;
  clearToken: (username?: string) => void;
  isLoading: boolean;
}

const JWT_STORAGE_KEY = 'tableau_jwt_token';
const isBrowser = typeof window !== 'undefined';

const decodeExpiry = (token: string): number => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
          .join('')
      )
    );

    return payload.exp * 1000;
  } catch (error) {
    console.error('JWT decode error:', error);
    return 0;
  }
};

const getStoredToken = (username: string): string | null => {
  if (!isBrowser) {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(JWT_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const tokenData = JSON.parse(stored) as JWTTokenData;
    const isValidUser = tokenData.username === username;
    const isValidExpiry = Date.now() < tokenData.expiry;

    if (isValidUser && isValidExpiry) {
      return tokenData.token;
    }

    window.localStorage.removeItem(JWT_STORAGE_KEY);
    return null;
  } catch (error) {
    console.error('Token storage error:', error);
    window.localStorage.removeItem(JWT_STORAGE_KEY);
    return null;
  }
};

const storeToken = (token: string, username: string): void => {
  if (!isBrowser) {
    return;
  }

  try {
    const expiry = decodeExpiry(token);
    if (expiry > Date.now()) {
      const tokenData: JWTTokenData = { token, expiry, username };
      window.localStorage.setItem(JWT_STORAGE_KEY, JSON.stringify(tokenData));
    }
  } catch (error) {
    console.error('Token store error:', error);
  }
};

const fetchJWTFromAPI = async (username: string): Promise<string> => {
  const response = await fetch(apiEndpoints.jwt, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username })
  });

  if (!response.ok) {
    throw new Error('JWT取得に失敗しました');
  }

  const data: JWTResponse = await response.json();

  if (!data.success || !data.token) {
    throw new Error('有効なJWTトークンが取得できませんでした');
  }

  return data.token;
};

const JWTContext = createContext<JWTContextType | null>(null);

interface JWTProviderProps {
  children: React.ReactNode;
  defaultUsername?: string;
  prefetchDefaultToken?: boolean;
}

export const JWTProvider: React.FC<JWTProviderProps> = ({
  children,
  defaultUsername = 'default-user',
  prefetchDefaultToken = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const tokenCacheRef = useRef<Map<string, Promise<string>>>(new Map());

  const getToken = useCallback(async (username: string): Promise<string> => {
    const cache = tokenCacheRef.current;

    if (cache.has(username)) {
      return cache.get(username)!;
    }

    const tokenPromise = (async (): Promise<string> => {
      try {
        setIsLoading(true);

        const cachedToken = getStoredToken(username);
        if (cachedToken) {
          console.log('Using cached JWT token for username:', username);
          return cachedToken;
        }

        console.log('Fetching new JWT token for username:', username);
        const token = await fetchJWTFromAPI(username);
        storeToken(token, username);
        console.log('JWT token fetched and cached successfully for username:', username);

        return token;
      } finally {
        setIsLoading(false);
        tokenCacheRef.current.delete(username);
      }
    })();

    cache.set(username, tokenPromise);
    return tokenPromise;
  }, []);

  const clearToken = useCallback((username?: string) => {
    const cache = tokenCacheRef.current;

    if (!isBrowser) {
      cache.clear();
      return;
    }

    if (username) {
      const stored = window.localStorage.getItem(JWT_STORAGE_KEY);
      if (stored) {
        try {
          const tokenData = JSON.parse(stored) as JWTTokenData;
          if (tokenData.username === username) {
            window.localStorage.removeItem(JWT_STORAGE_KEY);
          }
        } catch (error) {
          console.error('Token clear error:', error);
          window.localStorage.removeItem(JWT_STORAGE_KEY);
        }
      }
      cache.delete(username);
    } else {
      window.localStorage.removeItem(JWT_STORAGE_KEY);
      cache.clear();
    }
  }, []);

  useEffect(() => {
    if (!prefetchDefaultToken || !defaultUsername || !isBrowser) {
      return;
    }

    getToken(defaultUsername).catch((error) => {
      console.log('Pre-fetch JWT failed:', error.message);
    });
  }, [prefetchDefaultToken, defaultUsername, getToken]);

  const value = useMemo(
    () => ({
      getToken,
      clearToken,
      isLoading
    }),
    [getToken, clearToken, isLoading]
  );

  return <JWTContext.Provider value={value}>{children}</JWTContext.Provider>;
};

export const useJWTContext = (): JWTContextType => {
  const context = useContext(JWTContext);
  if (!context) {
    throw new Error('useJWTContext must be used within a JWTProvider');
  }
  return context;
};
