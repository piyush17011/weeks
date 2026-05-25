import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.me()
      .then(({ user }) => setUser(user))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { user } = await api.login({ email, password });
    setUser(user);
    return user;
  };

  const register = async (data) => {
    const { user } = await api.register(data);
    setUser(user);
    return user;
  };

  const logout = async () => {
    await api.logout().catch(() => {});
    setUser(null);
  };

  const refreshUser = async () => {
    const { user } = await api.me();
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
