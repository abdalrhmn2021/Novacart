"use client";

import { createContext, useEffect, useState } from "react";
import * as authService from "@/services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = authService.getStoredAuth();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored?.user) setUser(stored.user);
    setLoading(false);
  }, []);

  async function login(credentials) {
    const { user: loggedInUser } = await authService.login(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function register(payload) {
    const { user: newUser } = await authService.register(payload);
    setUser(newUser);
    return newUser;
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
