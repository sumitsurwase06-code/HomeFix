import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEMO_USERS } from '../data/demoUsers';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Session / User state initialization
  const [currentUser, setCurrentUser] = useState(() => {
    // Check sessionStorage first (active session), then localStorage (persisted remember-me)
    const sessionUser = sessionStorage.getItem('homefix_user');
    if (sessionUser) {
      try {
        return JSON.parse(sessionUser);
      } catch (e) {
        sessionStorage.removeItem('homefix_user');
      }
    }
    const localUser = localStorage.getItem('homefix_user');
    if (localUser) {
      try {
        return JSON.parse(localUser);
      } catch (e) {
        localStorage.removeItem('homefix_user');
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    return (
      sessionStorage.getItem('homefix_auth_token') ||
      localStorage.getItem('homefix_auth_token') ||
      null
    );
  });

  const [loading, setLoading] = useState(false);

  // Global Smart Login Modal state
  const [loginModalState, setLoginModalState] = useState({
    isOpen: false,
    defaultRole: 'customer',
    redirectUrl: null,
    contextualTitle: null,
    contextualSubtitle: null,
  });

  // Synchronize authentication state to storage
  useEffect(() => {
    if (currentUser && token) {
      // By default sync to current session
      sessionStorage.setItem('homefix_user', JSON.stringify(currentUser));
      sessionStorage.setItem('homefix_auth_token', token);
    } else if (!currentUser) {
      sessionStorage.removeItem('homefix_user');
      sessionStorage.removeItem('homefix_auth_token');
      localStorage.removeItem('homefix_user');
      localStorage.removeItem('homefix_auth_token');
    }
  }, [currentUser, token]);

  /**
   * Open the Global Smart Login Modal with optional configuration
   */
  const openLoginModal = useCallback((options = {}) => {
    setLoginModalState({
      isOpen: true,
      defaultRole: options.role || options.defaultRole || 'customer',
      redirectUrl: options.redirectUrl || null,
      contextualTitle: options.title || options.contextualTitle || null,
      contextualSubtitle: options.subtitle || options.message || options.contextualSubtitle || null,
    });
  }, []);

  /**
   * Close the Global Smart Login Modal
   */
  const closeLoginModal = useCallback(() => {
    setLoginModalState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  /**
   * Canonical login method
   */
  const login = async (email, password, roleHint = 'customer', rememberMe = true) => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, password, role: roleHint });
      const { user, token: resToken } = response.data;

      setCurrentUser(user);
      setToken(resToken);

      if (rememberMe) {
        localStorage.setItem('homefix_user', JSON.stringify(user));
        localStorage.setItem('homefix_auth_token', resToken);
      } else {
        localStorage.removeItem('homefix_user');
        localStorage.removeItem('homefix_auth_token');
      }
      sessionStorage.setItem('homefix_user', JSON.stringify(user));
      sessionStorage.setItem('homefix_auth_token', resToken);

      closeLoginModal();
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 1-Click Instant Demo Login for academic grading and presentation
   */
  const quickDemoLogin = (role = 'customer', rememberMe = true) => {
    const matched = DEMO_USERS.find((u) => u.role?.toLowerCase() === role?.toLowerCase());
    if (matched) {
      const demoToken = 'demo-jwt-token-' + matched.role + '-' + Date.now();
      setCurrentUser(matched);
      setToken(demoToken);

      if (rememberMe) {
        localStorage.setItem('homefix_user', JSON.stringify(matched));
        localStorage.setItem('homefix_auth_token', demoToken);
      }
      sessionStorage.setItem('homefix_user', JSON.stringify(matched));
      sessionStorage.setItem('homefix_auth_token', demoToken);

      closeLoginModal();
      return { success: true, user: matched };
    }
    return { success: false, error: 'Demo user not found for role ' + role };
  };

  /**
   * Switch role helper for quick testing during demonstrations
   */
  const switchDemoRole = (role) => {
    return quickDemoLogin(role, true);
  };

  /**
   * Completely purges authenticated state and returns user to Public Guest browsing
   */
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    sessionStorage.removeItem('homefix_user');
    sessionStorage.removeItem('homefix_auth_token');
    localStorage.removeItem('homefix_user');
    localStorage.removeItem('homefix_auth_token');
    closeLoginModal();
  };

  /**
   * Alias for explicit reset to public guest mode
   */
  const resetToGuest = () => {
    logout();
  };

  const value = {
    currentUser,
    token,
    isAuthenticated: Boolean(currentUser && token),
    userRole: currentUser?.role ? currentUser.role.toLowerCase() : null,
    loading,
    loginModalState,
    openLoginModal,
    closeLoginModal,
    login,
    logout,
    resetToGuest,
    quickDemoLogin,
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
