import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Wrench,
  LayoutDashboard,
  Inbox,
  ClipboardList,
  CalendarDays,
  Wallet,
  Star,
  Clock,
  UserCheck,
  LogOut,
  Menu,
  X,
  Bell,
  CheckCircle2,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_BOOKINGS } from '../data/bookings';
import DevModeBar from '../components/common/DevModeBar';
import '../pages/technician/TechnicianPortal.css';
import './DashboardLayout.css';

export default function TechnicianLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const userMenuRef = useRef(null);
  const { currentUser, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Count pending incoming requests for the badge
  const pendingRequestsCount = DEMO_BOOKINGS.filter((b) => b.status === 'Requested').length;

  // Breadcrumb / Page Title resolution
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/technician/requests')) return 'New Job Requests';
    if (path.includes('/technician/bookings/')) return 'Job Details & Diagnostics';
    if (path.includes('/technician/bookings')) return 'My Assigned Jobs';
    if (path.includes('/technician/schedule')) return 'Appointment Schedule';
    if (path.includes('/technician/availability')) return 'Availability & Working Hours';
    if (path.includes('/technician/earnings')) return 'Earnings & Financials';
    if (path.includes('/technician/reviews')) return 'Customer Ratings & Reviews';
    if (path.includes('/technician/profile')) return 'Professional Profile';
    return 'Technician Operations Dashboard';
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation: Deep Emerald Partner Theme */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand-box">
          <Link to="/technician/dashboard" className="sidebar-brand">
            <Wrench size={22} className="text-secondary" />
            <span>HomeFix</span>
          </Link>
          <span className="sidebar-badge technician">Partner</span>
        </div>

        <div className="sidebar-nav-section">
          {/* SECTION 1: WORKSPACE */}
          <span className="sidebar-nav-title">Workspace</span>
          <NavLink
            to="/technician/dashboard"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/technician/requests"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Inbox size={18} />
            <span>New Requests</span>
            {pendingRequestsCount > 0 && (
              <span
                style={{
                  marginLeft: 'auto',
                  backgroundColor: 'var(--secondary, #C59A45)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.1rem 0.45rem',
                  borderRadius: '9999px',
                }}
              >
                {pendingRequestsCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/technician/bookings"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <ClipboardList size={18} />
            <span>My Jobs</span>
          </NavLink>

          <NavLink
            to="/technician/schedule"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <CalendarDays size={18} />
            <span>Schedule</span>
          </NavLink>

          {/* SECTION 2: PERFORMANCE */}
          <span className="sidebar-nav-title">Performance</span>
          <NavLink
            to="/technician/earnings"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Wallet size={18} />
            <span>Earnings</span>
          </NavLink>

          <NavLink
            to="/technician/reviews"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Star size={18} />
            <span>Reviews</span>
          </NavLink>

          {/* SECTION 3: ACCOUNT & SCHEDULE */}
          <span className="sidebar-nav-title">Account</span>
          <NavLink
            to="/technician/availability"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Clock size={18} />
            <span>Availability</span>
          </NavLink>

          <NavLink
            to="/technician/profile"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <UserCheck size={18} />
            <span>Professional Profile</span>
          </NavLink>
        </div>

        {/* Sidebar Footer with Technician Info */}
        <div className="sidebar-footer">
          <div className="sidebar-user-brief">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100'}
              alt={currentUser?.name}
              className="sidebar-user-avatar"
            />
            <div style={{ minWidth: 0, flex: '1 1 auto' }}>
              <div className="sidebar-user-name truncate">{currentUser?.name || 'Technician'}</div>
              <div className="sidebar-user-role flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-gray-400'}`}></span>
                <span>{isOnline ? 'Available' : 'Offline'}</span>
              </div>
            </div>
          </div>
          <button type="button" className="sidebar-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Role-Specific Technician Topbar */}
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-sidebar-toggle"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Partner Portal</span>
              <span className="text-[var(--border)]">•</span>
              <span className="topbar-page-title text-sm md:text-base">{getPageTitle()}</span>
            </div>
          </div>

          <div className="topbar-right flex items-center gap-3">
            {/* Live Availability Toggle Pill */}
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border"
              style={{
                backgroundColor: isOnline ? 'var(--emerald-light, #DCEFE7)' : 'var(--surface-raised, #FFF9EE)',
                borderColor: isOnline ? 'rgba(6, 78, 59, 0.2)' : 'var(--champagne-border, #E2CCA1)',
                color: isOnline ? 'var(--emerald-ink, #064E3B)' : 'var(--text-muted, #5F6F68)',
              }}
              onClick={() => setIsOnline(!isOnline)}
              title={isOnline ? 'You are receiving new job dispatch alerts' : 'You are currently offline'}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isOnline ? '#10B981' : '#9CA3AF',
                }}
              ></span>
              <span>{isOnline ? 'Available for Jobs' : 'Offline'}</span>
            </button>

            {/* Notification Bell */}
            <Link
              to="/technician/requests"
              className="relative p-2 rounded-lg text-[var(--emerald-ink)] hover:bg-[var(--champagne-light)] transition-colors"
              title="Job Requests"
            >
              <Bell size={18} />
              {pendingRequestsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--secondary, #C59A45)',
                  }}
                ></span>
              )}
            </Link>

            {/* User Dropdown */}
            <div className="tech-profile-dropdown-wrapper" ref={userMenuRef}>
              <button
                type="button"
                className="tech-profile-trigger"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
                aria-label="Toggle technician account menu"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100'}
                  alt={currentUser?.name || 'Technician'}
                  className="tech-navbar-avatar"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100';
                  }}
                />
                <div className="tech-profile-trigger-info">
                  <span className="tech-profile-trigger-name">
                    {currentUser?.name || 'Technician Partner'}
                  </span>
                  <span className="tech-profile-trigger-role">
                    Partner Technician
                  </span>
                </div>
                <ChevronDown size={14} className={`tech-dropdown-chevron ${isUserMenuOpen ? 'rotate' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div
                  className="tech-profile-dropdown-menu"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <div className="tech-dropdown-header">
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100'}
                      alt=""
                      className="tech-dropdown-avatar"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100';
                      }}
                    />
                    <div className="tech-dropdown-user-details">
                      <div className="tech-dropdown-name">{currentUser?.name || 'Technician'}</div>
                      <div className="tech-dropdown-email">{currentUser?.email || 'technician@homefix.com'}</div>
                      <span className="tech-dropdown-badge">Verified Partner</span>
                    </div>
                  </div>

                  <div className="tech-dropdown-links">
                    <Link
                      to="/technician/profile"
                      className="tech-dropdown-item"
                    >
                      <UserCheck size={15} />
                      <span>Professional Profile</span>
                    </Link>
                    <Link
                      to="/technician/availability"
                      className="tech-dropdown-item"
                    >
                      <Clock size={15} />
                      <span>Availability Slots</span>
                    </Link>
                    <Link
                      to="/technician/earnings"
                      className="tech-dropdown-item"
                    >
                      <Wallet size={15} />
                      <span>Earnings & Payouts</span>
                    </Link>
                  </div>

                  <div className="tech-dropdown-divider"></div>

                  <button
                    type="button"
                    className="tech-dropdown-item danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="dashboard-content">
          <Outlet context={{ isOnline, setIsOnline }} />
        </main>

        {/* Dev Mode Role Switcher Bar */}
        <DevModeBar currentRole="technician" onSwitchRole={switchDemoRole} />
      </div>
    </div>
  );
}
