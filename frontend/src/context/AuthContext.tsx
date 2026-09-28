import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import api from "../services/api";

export type UserRole = "customer" | "admin";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role?: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<AuthUser>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const TOKEN_KEY = "nova_token";
const USER_KEY = "nova_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const persistAuth = useCallback((nextToken: string | null, nextUser: AuthUser | null) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }

    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/user");
      const nextUser = data as AuthUser;
      setUser(nextUser);
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } catch (error) {
      persistAuth(null, null);
    } finally {
      setLoading(false);
    }
  }, [persistAuth, token]);

  useEffect(() => {
    const sync = () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          setUser(JSON.parse(storedUser) as AuthUser);
        }
      } else {
        setToken(null);
        setUser(null);
      }
    };

    sync();
    window.addEventListener("nova-auth-changed", sync);

    return () => {
      window.removeEventListener("nova-auth-changed", sync);
    };
  }, []);

  useEffect(() => {
    if (token) {
      void refreshUser();
      return;
    }

    setUser(null);
    setLoading(false);
  }, [token, refreshUser]);

  const login = useCallback(
    async (payload: { email: string; password: string }) => {
      const { data } = await api.post("/login", payload);
      const nextUser = data.user as AuthUser;
      persistAuth(data.token, nextUser);
      window.dispatchEvent(new Event("nova-auth-changed"));
      return nextUser;
    },
    [persistAuth],
  );

  const register = useCallback(
    async (payload: { name: string; email: string; password: string; password_confirmation: string }) => {
      const { data } = await api.post("/register", payload);
      const nextUser = data.user as AuthUser;
      persistAuth(data.token, nextUser);
      window.dispatchEvent(new Event("nova-auth-changed"));
    },
    [persistAuth],
  );

  const logout = useCallback(async () => {
    try {
      if (token) {
        await api.post("/logout");
      }
    } catch (error) {
      // Ignore backend logout errors and clear local auth state.
    } finally {
      persistAuth(null, null);
      window.dispatchEvent(new Event("nova-auth-changed"));
    }
  }, [persistAuth, token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === "admin",
      loading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [loading, login, logout, refreshUser, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
