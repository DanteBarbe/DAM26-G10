import React, { createContext, useContext, useState } from 'react';
import { apiFetch, setAuthToken } from '@/src/api/apiClient';

export type AuthUser = {
  id: number;
  email: string;
  username: string;
  name: string;
  surname: string;
  role: 'USER' | 'ADMIN';
};

export type UpdateProfileData = {
  name?: string;
  surname?: string;
  username?: string;
  email?: string;
  password?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, password: string) => {
    const res = await apiFetch<{ data: { user: AuthUser; token: string }; message: string }>(
      '/api/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) },
    );
    setAuthToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (_) {}
    setAuthToken(null);
    setUser(null);
  };

  const updateProfile = async (data: UpdateProfileData) => {
    if (!user) throw new Error('No hay usuario autenticado.');
    const res = await apiFetch<{ data: AuthUser; message: string }>(
      `/api/users/${user.id}`,
      { method: 'PATCH', body: JSON.stringify(data) },
    );
    setUser(res.data);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
