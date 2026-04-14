import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("shopease_token") || "");
  const [isLoading, setIsLoading] = useState(true);

  const loadCurrentUser = async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data.data.user);
    } catch {
      localStorage.removeItem("shopease_token");
      setToken("");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, [token]);

  const login = async ({ email, password }) => {
    const response = await api.post("/auth/login", { email, password });
    const nextToken = response.data.data.token;

    localStorage.setItem("shopease_token", nextToken);
    setToken(nextToken);
    setUser(response.data.data.user);

    return response.data;
  };

  const register = async ({ name, email, password }) => {
    const response = await api.post("/auth/register", { name, email, password });
    const nextToken = response.data.data.token;

    localStorage.setItem("shopease_token", nextToken);
    setToken(nextToken);
    setUser(response.data.data.user);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("shopease_token");
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
