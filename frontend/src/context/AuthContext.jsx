/**
 * 🎮 Auth Context
 * React context for user authentication state.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import * as api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  async function handleSignup(email, username, password) {
    const data = await api.signup(email, username, password);
    const u = data.user;
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("userId", u.id);
    setUser(u);
    return u;
  }

  async function handleLogin(email, password) {
    const data = await api.login(email, password);
    const u = data.user;
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("userId", u.id);
    setUser(u);
    return u;
  }

  function handleLogout() {
    api.logout().catch(() => {});
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup: handleSignup, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
