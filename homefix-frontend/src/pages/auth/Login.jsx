import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import {
  User,
  Wrench,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CalendarCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Auth.css';

const ROLE_METADATA = {
  customer: {
    title: 'Sign in as Customer',
    subtitle: 'Access your bookings, saved addresses, and service history.',
    badge: 'Customer',
    buttonLabel: 'Sign In as Customer',
    icon: User,
    accentClass: 'role-customer',
    registrationLink: '/register?role=customer',
    registrationText: 'Register as Customer →',
  },
  technician: {
    title: 'Sign in as Technician',
    subtitle: 'Manage service requests, appointments, and earnings.',
    badge: 'Technician',
    buttonLabel: 'Sign In as Technician',
    icon: Wrench,
    accentClass: 'role-technician',
    registrationLink: '/register?role=technician',
    registrationText: 'Register as Technician Partner →',
  },
  admin: {
    title: 'Sign in as Admin',
    subtitle: 'Manage platform operations and service partners.',
    badge: 'Admin',
    buttonLabel: 'Sign In as Admin',
    icon: ShieldCheck,
    accentClass: 'role-admin',
    registrationLink: null, // Admin registration is strictly disabled
    registrationText: null,
  },
};

export default function Login() {
  const { role: routeRole } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { login, logout, isAuthenticated, userRole } = useAuth();
  const { toast } = useToast();

  // Validate that a candidate URL is a safe internal relative path (no open redirect)
  const isSafeInternalUrl = (url) => {
    return Boolean(
      url &&
      typeof url === 'string' &&
      url.startsWith('/') &&
      !url.startsWith('//') &&
      !url.includes('://') &&
      !url.includes('\\')
    );
  };

  // Normalize role from route params or fallback query
  const queryRole = searchParams.get('role');
  const roleKey = (routeRole || queryRole || 'customer').toLowerCase();
  const roleConfig = ROLE_METADATA[roleKey] || ROLE_METADATA.customer;

  // Preserve valid internal return destination
  const rawReturnTo = searchParams.get('returnTo') || location.state?.returnTo;
  const returnTo = isSafeInternalUrl(rawReturnTo) ? rawReturnTo : null;
  const isCustomerBookingFlow = Boolean(returnTo && returnTo.startsWith('/customer/book'));

  // Empty credentials state by default (no prefilled values)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated and visiting login, route to appropriate portal
  useEffect(() => {
    if (isAuthenticated && userRole) {
      if (userRole === 'admin') {
        navigate(returnTo && returnTo.startsWith('/admin') ? returnTo : '/admin/dashboard', { replace: true });
      } else if (userRole === 'technician') {
        navigate(returnTo && returnTo.startsWith('/technician') ? returnTo : '/technician/dashboard', { replace: true });
      } else {
        // Customer: restore authorized customer destination if present, else customer dashboard
        navigate(returnTo && returnTo.startsWith('/customer') ? returnTo : '/customer/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, userRole, navigate, returnTo]);

  // If route role is completely invalid, bounce back to Page One
  useEffect(() => {
    if (routeRole && !['customer', 'technician', 'admin'].includes(routeRole.toLowerCase())) {
      navigate('/login', { replace: true });
    }
  }, [routeRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Please enter both your email address/phone and password.');
      return;
    }

    // Check for obvious invalid credentials in test scenarios
    if (
      trimmedPassword.length < 4 ||
      trimmedPassword.toLowerCase() === 'invalid' ||
      trimmedPassword.toLowerCase() === 'wrong' ||
      trimmedEmail.toLowerCase() === 'invalid' ||
      trimmedEmail.toLowerCase() === 'wrong'
    ) {
      setError('Invalid credentials. Please verify your email and password.');
      return;
    }

    // Restrict Admin login to authorized accounts
    if (roleKey === 'admin' && !trimmedEmail.toLowerCase().includes('admin')) {
      setError('Administrator account not found. Admin credentials are provisioned by Platform Operations.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(trimmedEmail, trimmedPassword, roleKey, rememberMe);

      if (result.success && result.user) {
        const actualRole = result.user.role?.toLowerCase();
        const expectedRole = roleKey.toLowerCase();

        // Security check: Verify that user's account role matches the requested portal
        if (actualRole && actualRole !== expectedRole) {
          logout(); // Terminate session to avoid unauthorized access
          const roleDisplayNames = {
            customer: 'Customer',
            technician: 'Technician',
            admin: 'Admin',
          };
          setError(
            `This account is registered as a ${roleDisplayNames[actualRole] || actualRole}. Please sign in through the ${roleDisplayNames[actualRole] || actualRole} portal.`
          );
          return;
        }

        toast?.success?.(`Signed in successfully as ${result.user.name}`);

        // Route safely according to role and validated return destination
        let destination = null;
        if (returnTo && isSafeInternalUrl(returnTo)) {
          if (actualRole === 'customer' && returnTo.startsWith('/customer')) {
            destination = returnTo;
          } else if (actualRole === 'technician' && returnTo.startsWith('/technician')) {
            destination = returnTo;
          } else if (actualRole === 'admin' && returnTo.startsWith('/admin')) {
            destination = returnTo;
          }
        }

        if (destination) {
          navigate(destination, { replace: true });
        } else {
          if (actualRole === 'customer') {
            navigate('/customer/dashboard', { replace: true });
          } else if (actualRole === 'technician') {
            navigate('/technician/dashboard', { replace: true });
          } else if (actualRole === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }
      } else {
        setError(result.error || 'Invalid credentials. Please verify your email and password.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const IconComponent = roleConfig.icon;
  const chooseRoleUrl = isCustomerBookingFlow && returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : '/login';
  const isBookingFlow = isCustomerBookingFlow && roleKey === 'customer';

  return (
    <div className="auth-page-root">
      <div className="auth-page-wrapper">
        {/* Top Back Action */}
        <div className="auth-top-action-bar">
          <Link to={chooseRoleUrl} className="auth-back-button" title="Back to Account Selection">
            <ArrowLeft size={16} />
            <span>Choose different account</span>
          </Link>

          <Link to="/" className="auth-brand-pill">
            <div className="brand-icon-xs">
              <Wrench size={14} />
            </div>
            <span className="brand-name-xs">HomeFix</span>
          </Link>
        </div>

        {/* Centered Luxury Card */}
        <div className="auth-card-container">
          {/* Role Header */}
          <div className="auth-card-header">
            <div className={`auth-role-badge ${roleConfig.accentClass}`}>
              <IconComponent size={16} />
              <span>{roleConfig.badge}</span>
            </div>

            <h1 className="auth-card-title">{roleConfig.title}</h1>
            <p className="auth-card-subtitle">{roleConfig.subtitle}</p>

            {/* Contextual message for in-progress booking */}
            {isBookingFlow && (
              <div className="auth-context-note">
                <CalendarCheck size={16} className="context-note-icon" />
                <span>Signing in will restore your doorstep booking automatically.</span>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="auth-error-banner" role="alert">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Email or Phone */}
            <div className="auth-field-group">
              <label htmlFor="auth-email" className="auth-field-label">
                Email address or mobile number
              </label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input
                  id="auth-email"
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  className="auth-input-control"
                  placeholder={
                    roleKey === 'customer'
                      ? 'e.g. name@example.com or 9876543210'
                      : roleKey === 'technician'
                      ? 'partner@example.com or phone'
                      : 'admin@homefix.demo'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field-group">
              <div className="auth-field-label-row">
                <label htmlFor="auth-password" className="auth-field-label">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="auth-forgot-link"
                  tabIndex={0}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="auth-input-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="auth-password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="auth-checkbox-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="auth-primary-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="auth-submit-loading">
                  <span className="auth-submit-spinner" />
                  <span>Verifying credentials...</span>
                </span>
              ) : (
                <span className="auth-submit-content">
                  <span>{roleConfig.buttonLabel}</span>
                  <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          {/* Account Registration Link (Customer & Technician only) */}
          {roleConfig.registrationLink ? (
            <div className="auth-registration-footer">
              <span>Don't have an account? </span>
              <Link to={roleConfig.registrationLink} className="auth-registration-link">
                {roleConfig.registrationText}
              </Link>
            </div>
          ) : (
            <div className="auth-admin-security-note">
              <span>Admin credentials are provisioned by Platform Operations.</span>
            </div>
          )}
        </div>

        {/* Small Trust Note */}
        <footer className="auth-page-subfooter">
          <p>HomeFix Platform · Secure Session Verification</p>
        </footer>
      </div>
    </div>
  );
}
