import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken } from '../utils/api';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'veloura_user';
const LOGIN_HISTORY_STORAGE_KEY = 'veloura_login_history';

/**
 * Retrieve saved login history for this specific browser/device
 * Keyed by email: { [email]: { email, name, avatar, loginCount, lastLogin } }
 */
export const getLoginHistory = () => {
  try {
    const raw = localStorage.getItem(LOGIN_HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

/**
 * Increment login count for this specific user on this browser
 */
export const recordUserLogin = (user) => {
  if (!user || !user.email) return;
  try {
    const history = getLoginHistory();
    const key = user.email.toLowerCase().trim();
    const prev = history[key] || { email: key, name: user.name, avatar: user.avatar || '', loginCount: 0 };
    history[key] = {
      ...prev,
      name: user.name || prev.name,
      avatar: user.avatar || prev.avatar,
      authProvider: user.authProvider || prev.authProvider || 'local',
      loginCount: (prev.loginCount || 0) + 1,
      lastLogin: Date.now()
    };
    localStorage.setItem(LOGIN_HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.warn('Could not record login history:', err);
  }
};

/**
 * Remove a specific saved account from this browser
 */
export const removeSavedAccount = (email) => {
  if (!email) return;
  try {
    const history = getLoginHistory();
    delete history[email.toLowerCase().trim()];
    localStorage.setItem(LOGIN_HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.warn('Could not remove account from history:', err);
  }
};

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
      recordUserLogin(response.user);
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
      recordUserLogin(response.user);
      closeAuthModal();
      return response;
    }
    throw new Error(response.message || 'Registration failed');
  };

  const googleLogin = async (googleData) => {
    const response = await api.googleLogin(googleData);
    if (response.success && response.token) {
      setAuthToken(response.token);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
      recordUserLogin(response.user);
      closeAuthModal();
      return response;
    }
    throw new Error(response.message || 'Google authentication failed');
  };

  const appleLogin = async (appleData) => {
    const response = await api.appleLogin(appleData);
    if (response.success && response.token) {
      setAuthToken(response.token);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
      recordUserLogin(response.user);
      closeAuthModal();
      return response;
    }
    throw new Error(response.message || 'Apple authentication failed');
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
        googleLogin,
        appleLogin,
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
