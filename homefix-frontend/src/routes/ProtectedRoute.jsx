import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';

/**
 * Strict role-based route guard.
 * Validates authenticated session and authorized role for the requested portal.
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullPage message="Authenticating session..." />;
  }

  // If unauthenticated, redirect to login with reference to attempted destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Normalize roles to lowercase
  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());
  const normalizedUserRole = userRole?.toLowerCase();

  // If user role is not authorized for this specific portal, redirect to their own dashboard
  if (normalizedAllowed.length > 0 && (!normalizedUserRole || !normalizedAllowed.includes(normalizedUserRole))) {
    if (normalizedUserRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (normalizedUserRole === 'technician') {
      return <Navigate to="/technician/dashboard" replace />;
    }
    return <Navigate to="/customer/dashboard" replace />;
  }

  return children;
}
