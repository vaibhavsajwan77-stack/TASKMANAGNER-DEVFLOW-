import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { authApi } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('devflow_token');
    const savedUser = localStorage.getItem('devflow_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('devflow_token');
        localStorage.removeItem('devflow_user');
      }
    }

    setLoading(false);
  }, []);

  const saveSession = (token: string, user: User) => {
    if (!token || !user) return;

    localStorage.setItem('devflow_token', token);
    localStorage.setItem('devflow_user', JSON.stringify(user));

    setToken(token);
    setUser(user);
  };

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email.trim(), password.trim());

    // FIX: authApi.ts confirms backend returns { token, user }
    // No accessToken fallback needed — using exact key from AuthResponse type
    const receivedToken = data?.token;
    const receivedUser = data?.user;

    if (!receivedToken || !receivedUser) {
      throw new Error('Invalid login response from server');
    }

    saveSession(receivedToken, receivedUser);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await authApi.register(name.trim(), email.trim(), password.trim());

    // FIX: authApi.ts confirms backend returns { token, user }
    // No accessToken fallback needed — using exact key from AuthResponse type
    const receivedToken = data?.token;
    const receivedUser = data?.user;

    if (!receivedToken || !receivedUser) {
      throw new Error('Invalid register response from server');
    }

    saveSession(receivedToken, receivedUser);
  };

  const logout = () => {
    localStorage.removeItem('devflow_token');
    localStorage.removeItem('devflow_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;

};