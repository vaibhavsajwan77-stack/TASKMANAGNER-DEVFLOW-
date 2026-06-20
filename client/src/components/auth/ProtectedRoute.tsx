import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "../api/authApi";

type User = {
  name: string;
  email?: string;
} | null;

interface AuthContextType {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("devflow_token");
    const savedUser = localStorage.getItem("devflow_user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("devflow_token");
        localStorage.removeItem("devflow_user");
      }
    }

    setLoading(false);
  }, []);

  const saveSession = (token: string, user: User) => {
    if (!token || !user) return;

    localStorage.setItem("devflow_token", token);
    localStorage.setItem("devflow_user", JSON.stringify(user));

    setToken(token);
    setUser(user);
  };

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email.trim(), password.trim());

    if (!res?.token || !res?.user) {
      throw new Error("Invalid login response");
    }

    saveSession(res.token, res.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authApi.register(
      name.trim(),
      email.trim(),
      password.trim()
    );

    if (!res?.token || !res?.user) {
      throw new Error("Invalid register response");
    }

    saveSession(res.token, res.user);
  };

  const logout = () => {
    localStorage.removeItem("devflow_token");
    localStorage.removeItem("devflow_user");
    setUser(null);
    setToken(null);
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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};