import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../data/demoUsers';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('homefix_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default to the demo customer for quick evaluation out-of-the-box
    return DEMO_USERS[0];
  });

  const [token, setToken] = useState(() => localStorage.getItem('homefix_auth_token') || 'demo-jwt-token-initial');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('homefix_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('homefix_user');
      localStorage.removeItem('homefix_auth_token');
    }
  }, [currentUser]);

  /**
   * Mock login function
   * Ready to be swapped with Spring Security /api/auth/login response payload
   */
  const login = async (email, password, roleHint = 'customer') => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, password, role: roleHint });
      const { user, token: resToken } = response.data;
      setCurrentUser(user);
      setToken(resToken);
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
    const matched = DEMO_USERS.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      localStorage.setItem('homefix_user', JSON.stringify(matched));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('homefix_user');
    localStorage.removeItem('homefix_auth_token');
  };

  const value = {
    currentUser,
    token,
    isAuthenticated: Boolean(currentUser),
    userRole: currentUser?.role || null,
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
