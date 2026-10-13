import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  User,
  Wrench,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CalendarCheck,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ChooseRole.css';

export default function ChooseRole() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, userRole } = useAuth();

  // Extract candidate return destination
  const candidateReturnTo =
    searchParams.get('returnTo') ||
    (location.state?.from
      ? location.state.from.pathname + (location.state.from.search || '')
      : null);

  // A return destination is ONLY valid if it is an active service booking flow (/customer/book...)
  const isBookingFlow = Boolean(candidateReturnTo && candidateReturnTo.startsWith('/customer/book'));
  const returnTo = isBookingFlow ? candidateReturnTo : null;

  // If already authenticated, redirect to appropriate portal
  useEffect(() => {
    if (isAuthenticated && userRole) {
      if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userRole === 'technician') {
        navigate('/technician/dashboard', { replace: true });
      } else {
        // Customer: always redirect to public homepage ('/') unless in an active booking flow
        navigate(returnTo || '/', { replace: true });
      }
    }
  }, [isAuthenticated, userRole, navigate, returnTo]);

  // Navigate to Page Two (Enter Credentials) with selected role
  const handleSelectRole = (role) => {
    // Only pass returnTo if it is an active booking flow
    const query = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : '';
    navigate(`/login/${role}${query}`, {
      state: returnTo ? { returnTo } : undefined,
    });
  };

  return (
    <div className="choose-role-page">
      <div className="choose-role-wrapper">
        {/* Top Navigation Bar */}
        <header className="choose-role-nav">
          <Link to="/" className="choose-role-back-link" title="Return to HomeFix Homepage">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          <Link to="/" className="choose-role-brand" title="HomeFix Home">
            <div className="choose-role-brand-icon">
              <Wrench size={18} />
            </div>
            <div className="choose-role-brand-text">
              <span className="brand-name-text">HomeFix</span>
              <span className="brand-tagline-text">YOUR HOME. OUR PRIORITY</span>
            </div>
          </Link>
        </header>

        {/* Hero Section */}
        <div className="choose-role-header text-center">
          <span className="choose-role-eyebrow">PORTAL ACCESS</span>
          <h1 className="choose-role-title">Welcome to HomeFix</h1>
          <p className="choose-role-subtitle">
            Choose how you want to continue.
          </p>

          {/* Contextual notification if user started from a booking action */}
          {isBookingFlow && (
            <div className="choose-role-context-pill">
              <CalendarCheck size={16} className="context-pill-icon" />
              <span>
                <strong>Booking in progress:</strong> Choose <strong>Customer</strong> to schedule your doorstep service appointment.
              </span>
            </div>
          )}
        </div>

        {/* 3 Horizontally Arranged Account Cards */}
        <main className="choose-role-grid" aria-label="Account Types">
          {/* Card 1: Customer */}
          <article
            className="choose-role-card customer-card"
            onClick={() => handleSelectRole('customer')}
            tabIndex={0}
            role="button"
            aria-label="Continue as Customer"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectRole('customer');
              }
            }}
          >
            <div className="card-top-row">
              <div className="card-icon-circle customer-icon">
                <User size={26} />
              </div>
              <span className="card-role-badge">Homeowner</span>
            </div>

            <div className="card-body">
              <h2 className="card-role-title">Customer</h2>
              <p className="card-role-desc">
                Book trusted professionals for your home.
              </p>
            </div>

            <div className="card-action-wrap">
              <button
                type="button"
                className="card-action-btn customer-btn"
                tabIndex={-1}
              >
                <span>Continue as Customer</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </article>

          {/* Card 2: Technician */}
          <article
            className="choose-role-card technician-card"
            onClick={() => handleSelectRole('technician')}
            tabIndex={0}
            role="button"
            aria-label="Continue as Technician"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectRole('technician');
              }
            }}
          >
            <div className="card-top-row">
              <div className="card-icon-circle technician-icon">
                <Wrench size={26} />
              </div>
              <span className="card-role-badge">Service Partner</span>
            </div>

            <div className="card-body">
              <h2 className="card-role-title">Technician</h2>
              <p className="card-role-desc">
                Manage service requests, appointments, and earnings.
              </p>
            </div>

            <div className="card-action-wrap">
              <button
                type="button"
                className="card-action-btn technician-btn"
                tabIndex={-1}
              >
                <span>Continue as Technician</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </article>

          {/* Card 3: Admin */}
          <article
            className="choose-role-card admin-card"
            onClick={() => handleSelectRole('admin')}
            tabIndex={0}
            role="button"
            aria-label="Continue as Admin"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectRole('admin');
              }
            }}
          >
            <div className="card-top-row">
              <div className="card-icon-circle admin-icon">
                <ShieldCheck size={26} />
              </div>
              <span className="card-role-badge">Operations</span>
            </div>

            <div className="card-body">
              <h2 className="card-role-title">Admin</h2>
              <p className="card-role-desc">
                Manage platform operations and service partners.
              </p>
            </div>

            <div className="card-action-wrap">
              <button
                type="button"
                className="card-action-btn admin-btn"
                tabIndex={-1}
              >
                <span>Continue as Admin</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </article>
        </main>

        {/* Small Footer with Account Help Links */}
        <footer className="choose-role-footer">
          <p className="footer-support-text">
            Need help accessing your account?{' '}
            <Link to="/contact" className="footer-support-link">
              Contact HomeFix Support
            </Link>
          </p>

          <div className="footer-links-row">
            <Link to="/about" className="footer-link">About Us</Link>
            <span className="footer-bullet">•</span>
            <Link to="/contact" className="footer-link">Privacy Policy</Link>
            <span className="footer-bullet">•</span>
            <Link to="/contact" className="footer-link">Terms of Service</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
