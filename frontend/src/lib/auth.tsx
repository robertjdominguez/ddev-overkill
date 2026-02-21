import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, expiresAt: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY_TOKEN = 'admin_token';
const STORAGE_KEY_EXPIRES = 'admin_token_expires';

// Bridge for Apollo Client to read the current token
let tokenAccessor: (() => string | null) | null = null;
export function setTokenAccessor(fn: () => string | null) {
  tokenAccessor = fn;
}
export function getToken(): string | null {
  return tokenAccessor ? tokenAccessor() : null;
}

function isTokenValid(token: string | null, expiresAt: string | null): boolean {
  if (!token || !expiresAt) return false;
  return new Date(expiresAt).getTime() > Date.now();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const t = sessionStorage.getItem(STORAGE_KEY_TOKEN);
    const e = sessionStorage.getItem(STORAGE_KEY_EXPIRES);
    return isTokenValid(t, e) ? t : null;
  });

  const isAuthenticated = token !== null;

  useEffect(() => {
    setTokenAccessor(() => token);
  }, [token]);

  const login = useCallback((newToken: string, expiresAt: string) => {
    sessionStorage.setItem(STORAGE_KEY_TOKEN, newToken);
    sessionStorage.setItem(STORAGE_KEY_EXPIRES, expiresAt);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_EXPIRES);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
