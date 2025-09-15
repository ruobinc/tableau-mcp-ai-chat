"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

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

// JWTトークンをデコードして有効期限を取得
const getTokenExpiry = (token: string): number => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload.exp * 1000; // 秒をミリ秒に変換
  } catch (error) {
    console.error('JWT decode error:', error);
    return 0;
  }
};

// ローカルストレージからJWTトークンを取得
const getStoredToken = (username: string): string | null => {
  try {
    const stored = localStorage.getItem(JWT_STORAGE_KEY);
    if (!stored) return null;

    const tokenData: JWTTokenData = JSON.parse(stored);

    // ユーザー名が一致し、有効期限内の場合のみ返す
    if (tokenData.username === username && Date.now() < tokenData.expiry) {
      return tokenData.token;
    }

    // 期限切れまたはユーザー名が違う場合は削除
    localStorage.removeItem(JWT_STORAGE_KEY);
    return null;
  } catch (error) {
    console.error('Token storage error:', error);
    localStorage.removeItem(JWT_STORAGE_KEY);
    return null;
  }
};

// JWTトークンをローカルストレージに保存
const storeToken = (token: string, username: string): void => {
  try {
    const expiry = getTokenExpiry(token);
    if (expiry > Date.now()) {
      const tokenData: JWTTokenData = {
        token,
        expiry,
        username
      };
      localStorage.setItem(JWT_STORAGE_KEY, JSON.stringify(tokenData));
    }
  } catch (error) {
    console.error('Token store error:', error);
  }
};

// APIからJWTトークンを取得
const fetchJWTFromAPI = async (username: string): Promise<string> => {
  const response = await fetch('http://localhost:8000/api/jwt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
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
  children: ReactNode;
  defaultUsername?: string;
}

export const JWTProvider: React.FC<JWTProviderProps> = ({
  children,
  defaultUsername = 'default-user'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const tokenCache = new Map<string, Promise<string>>();

  // JWTトークンを取得（キャッシュ優先、同じユーザーの重複リクエスト防止）
  const getToken = useCallback(async (username: string): Promise<string> => {
    // 既に同じユーザー名でリクエスト中の場合は、そのPromiseを返す
    if (tokenCache.has(username)) {
      return tokenCache.get(username)!;
    }

    const tokenPromise = (async (): Promise<string> => {
      try {
        setIsLoading(true);

        // まずローカルストレージから取得を試みる
        const storedToken = getStoredToken(username);
        if (storedToken) {
          console.log('Using cached JWT token for username:', username);
          return storedToken;
        }

        // キャッシュにない場合はAPIから取得
        console.log('Fetching new JWT token for username:', username);
        const token = await fetchJWTFromAPI(username);
        storeToken(token, username);
        console.log('JWT token fetched and cached successfully for username:', username);

        return token;
      } catch (error) {
        console.error('JWT取得エラー:', error);
        throw error;
      } finally {
        setIsLoading(false);
        // リクエスト完了後にキャッシュから削除
        tokenCache.delete(username);
      }
    })();

    // リクエストをキャッシュに保存
    tokenCache.set(username, tokenPromise);
    return tokenPromise;
  }, [tokenCache]);

  // トークンをクリアする関数
  const clearToken = useCallback((username?: string) => {
    if (username) {
      // 特定ユーザーのトークンのみクリア
      const stored = localStorage.getItem(JWT_STORAGE_KEY);
      if (stored) {
        try {
          const tokenData: JWTTokenData = JSON.parse(stored);
          if (tokenData.username === username) {
            localStorage.removeItem(JWT_STORAGE_KEY);
          }
        } catch (error) {
          console.error('Token clear error:', error);
        }
      }
      tokenCache.delete(username);
    } else {
      // 全てのトークンをクリア
      localStorage.removeItem(JWT_STORAGE_KEY);
      tokenCache.clear();
    }
  }, [tokenCache]);

  // アプリケーション起動時にデフォルトユーザーのトークンを事前取得
  useEffect(() => {
    if (defaultUsername) {
      getToken(defaultUsername).catch(error => {
        console.log('Pre-fetch JWT failed for default user:', error.message);
      });
    }
  }, [defaultUsername, getToken]);

  const value: JWTContextType = {
    getToken,
    clearToken,
    isLoading
  };

  return (
    <JWTContext.Provider value={value}>
      {children}
    </JWTContext.Provider>
  );
};

export const useJWTContext = (): JWTContextType => {
  const context = useContext(JWTContext);
  if (!context) {
    throw new Error('useJWTContext must be used within a JWTProvider');
  }
  return context;
};