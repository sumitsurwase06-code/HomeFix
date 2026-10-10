import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Wrench,
  LayoutDashboard,
  BarChart3,
  Users,
  HardHat,
  UserCheck,
  CalendarDays,
  CircleDollarSign,
  Receipt,
  Star,
  Layers,
  FileText,
  LogOut,
  Menu,
  X,
  Home,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DevModeBar from '../components/common/DevModeBar';
import './DashboardLayout.css';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = [
    {
      id: 1,
      title: 'Technician Verification Needed',
      desc: 'Sunil Rao uploaded Aadhar & Trade ID',
      time: '12m ago',
      type: 'warning',
      link: '/admin/verification'
    },
    {
      id: 2,
      title: 'Settlement Escrow Cleared',
      desc: 'Payout ₹1,124 released for job HF-BK-8903',
      time: '1h ago',
      type: 'success',
      link: '/admin/payouts'
    },
    {
      id: 3,
      title: 'New Customer Review',
      desc: '5-star rating for Rajesh Kumar',
      time: '3h ago',
      type: 'info',
      link: '/admin/reviews'
    }
  ];

  return (
    <div className="dashboard-layout admin-theme-root">
      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand-box">
          <Link to="/" className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <Wrench size={20} />
            </div>
            <span>HomeFix</span>
          </Link>
          <span className="sidebar-badge admin">ADMIN</span>
        </div>

        <div className="sidebar-nav-section">
          {/* OVERVIEW */}
          <span className="sidebar-nav-title">OVERVIEW</span>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `sidebar-nav-link ${isActive && !location.hash ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/revenue"
            className={({ isActive }) => `sidebar-nav-link ${isActive && !location.hash ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <BarChart3 size={18} />
            <span>Analytics</span>
          </NavLink>

          {/* OPERATIONS */}
          <span className="sidebar-nav-title">OPERATIONS</span>
          <NavLink
            to="/admin/bookings"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <CalendarDays size={18} />
            <span>Bookings</span>
          </NavLink>

          <NavLink
            to="/admin/technicians"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <HardHat size={18} />
            <span>Technicians</span>
          </NavLink>

          <NavLink
            to="/admin/customers"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Users size={18} />
            <span>Customers</span>
          </NavLink>

          <NavLink
            to="/admin/services"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Layers size={18} />
            <span>Services</span>
          </NavLink>

          <NavLink
            to="/admin/reviews"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Star size={18} />
            <span>Reviews</span>
          </NavLink>

          {/* FINANCE */}
          <span className="sidebar-nav-title">FINANCE</span>
          <NavLink
            to="/admin/revenue"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <CircleDollarSign size={18} />
            <span>Revenue</span>
          </NavLink>

          <NavLink
            to="/admin/payouts"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Receipt size={18} />
            <span>Payouts</span>
          </NavLink>

          {/* CONTROL */}
          <span className="sidebar-nav-title">CONTROL</span>
          <NavLink
            to="/admin/verification"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <UserCheck size={18} />
            <span>Technician Verification</span>
          </NavLink>

          <NavLink
            to="/admin/audit-logs"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FileText size={18} />
            <span>Audit Logs</span>
          </NavLink>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-user-brief">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
              alt={currentUser?.name}
              className="sidebar-user-avatar"
            />
            <div>
              <div className="sidebar-user-name">{currentUser?.name || 'Admin User'}</div>
              <div className="sidebar-user-role">Operations Manager</div>
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
        {/* Top bar with quick navigation & operations info */}
        <header className="dashboard-topbar corporate-admin-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-sidebar-toggle"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="topbar-title-block">
              <span className="topbar-page-title">Admin Management Console</span>
              <span className="topbar-subtext">HomeFix Operations & Platform Business Analytics</span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Live Platform Health Indicator */}
            <div className="topbar-status-indicator">
              <span className="status-ping"></span>
              <span className="status-text">Platform Live</span>
            </div>

            {/* Notification Bell */}
            <div className="notification-wrapper">
              <button
                type="button"
                className="topbar-icon-btn"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                aria-label="View notifications"
                title="Operational Notifications"
              >
                <Bell size={18} />
                <span className="notification-badge-count">{notifications.length}</span>
              </button>

              {isNotificationOpen && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <span className="notification-title">Operational Alerts</span>
                    <span className="notification-badge">{notifications.length} Unresolved</span>
                  </div>
                  <div className="notification-list">
                    {notifications.map((item) => (
                      <Link
                        key={item.id}
                        to={item.link}
                        className="notification-item"
                        onClick={() => setIsNotificationOpen(false)}
                      >
                        <div className={`notification-dot ${item.type}`} />
                        <div className="notification-content">
                          <div className="notification-item-title">{item.title}</div>
                          <div className="notification-item-desc">{item.desc}</div>
                          <div className="notification-item-time">{item.time}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="notification-footer">
                    <Link
                      to="/admin/audit-logs"
                      className="notification-view-all"
                      onClick={() => setIsNotificationOpen(false)}
                    >
                      View All System Audit Logs →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Public Site Link */}
            <Link to="/" className="btn btn-outline btn-sm topbar-public-btn" title="View Public Marketplace">
              <Home size={15} />
              <span>Public Site</span>
            </Link>

            {/* Admin Profile Chip */}
            <div className="admin-profile-chip">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
                alt=""
                className="admin-chip-avatar"
              />
              <div className="admin-chip-info">
                <span className="admin-chip-name">{currentUser?.name || 'Admin User'}</span>
                <span className="admin-chip-role">Platform Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
      <DevModeBar />
    </div>
  );
}

