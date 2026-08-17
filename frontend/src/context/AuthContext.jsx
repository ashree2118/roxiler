import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }

    setLoading(false);
  }, []);

  const persistAuth = (authToken, authUser) => {
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  };

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persistAuth(data.token, data.user);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  };

  const logout = () => {
    clearAuth();
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    const { data } = await api.patch("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return data;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      changePassword,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
