import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken } from '../utils/api';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'veloura_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getAuthToken());
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'

  // Verify token on mount and refresh profile
  useEffect(() => {
    const verifyToken = async () => {
      const currentToken = getAuthToken();
      if (!currentToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const data = await api.getMe();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session verification failed, resetting token:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email, password) => {
    const response = await api.login({ email, password });
    if (response.success && response.token) {
      setAuthToken(response.token);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
      closeAuthModal();
      return response;
    }
    throw new Error(response.message || 'Authentication failed');
  };

  const register = async (userData) => {
    const response = await api.register(userData);
    if (response.success && response.token) {
      setAuthToken(response.token);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
      closeAuthModal();
      return response;
    }
    throw new Error(response.message || 'Registration failed');
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        isAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

