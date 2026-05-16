import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import type { AuthUser } from '../types';

interface AuthContextProps {
  user: AuthUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('freshopia_token'));
  const [user, setUser] = useState<AuthUser | null>(token ? { username: atob(token), token } : null);

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        username,
        password,
      });
      const newToken = res.data.token;
      localStorage.setItem('freshopia_token', newToken);
      setToken(newToken);
      setUser({ username, token: newToken });
    } catch (err) {
      console.error('Login failed', err);
      throw err;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, {
        username,
        password,
      });
      const newToken = res.data.token;
      localStorage.setItem('freshopia_token', newToken);
      setToken(newToken);
      setUser({ username, token: newToken });
    } catch (err) {
      console.error('Registration failed', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('freshopia_token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
