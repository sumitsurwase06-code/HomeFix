import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';

/**
 * Route protection wrapper.
 * Currently uses mock AuthContext state; ready to be backed by Spring Security tokens.
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullPage message="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // If logged in user doesn't have the appropriate role, redirect to their corresponding dashboard
    if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (userRole === 'technician') return <Navigate to="/technician/dashboard" replace />;
    return <Navigate to="/customer/dashboard" replace />;
  }

  return children;
}
