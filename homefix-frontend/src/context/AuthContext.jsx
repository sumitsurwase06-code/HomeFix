import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../data/demoUsers';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('homefix_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        localStorage.removeItem('homefix_user');
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('homefix_auth_token') || null;
  });

  const [loading, setLoading] = useState(false);

  // Synchronize authentication state to localStorage
  useEffect(() => {
    if (currentUser && token) {
      localStorage.setItem('homefix_user', JSON.stringify(currentUser));
      localStorage.setItem('homefix_auth_token', token);
    } else if (!currentUser) {
      localStorage.removeItem('homefix_user');
      localStorage.removeItem('homefix_auth_token');
    }
  }, [currentUser, token]);

  /**
   * Canonical login method
   * Receives verified user payload and replaces previous user session completely
   */
  const login = async (email, password, roleHint = 'customer') => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, password, role: roleHint });
      const { user, token: resToken } = response.data;
      
      // Store new authenticated session as the single source of truth
      setCurrentUser(user);
      setToken(resToken);
      localStorage.setItem('homefix_user', JSON.stringify(user));
      localStorage.setItem('homefix_auth_token', resToken);
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Switch role helper for quick testing during demonstrations and vivas
   */
  const switchDemoRole = (role) => {
    const matched = DEMO_USERS.find((u) => u.role?.toLowerCase() === role?.toLowerCase());
    if (matched) {
      const demoToken = 'demo-jwt-token-' + matched.role + '-' + Date.now();
      setCurrentUser(matched);
      setToken(demoToken);
      localStorage.setItem('homefix_user', JSON.stringify(matched));
      localStorage.setItem('homefix_auth_token', demoToken);
    }
  };

  /**
   * Canonical logout method
   * Completely purges authenticated state, credentials, and session caches
   */
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('homefix_user');
    localStorage.removeItem('homefix_auth_token');
  };

  const value = {
    currentUser,
    token,
    isAuthenticated: Boolean(currentUser && token),
    userRole: currentUser?.role ? currentUser.role.toLowerCase() : null,
    loading,
    login,
    logout,
    switchDemoRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
