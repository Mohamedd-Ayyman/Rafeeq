"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiCall, getToken, setToken } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await apiCall("/api/auth/me");
        setUser(res.data.user);
      } catch (e) {
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const login = async (email, password) => {
    const res = await apiCall("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await apiCall("/api/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    return res.data;
  };

  const logout = async () => {
    try {
      await apiCall("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
