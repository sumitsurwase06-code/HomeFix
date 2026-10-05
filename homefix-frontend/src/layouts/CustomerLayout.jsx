import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  LayoutDashboard,
  CalendarPlus,
  Users,
  CalendarCheck,
  MapPin,
  User,
  Star,
  LogOut,
  Menu,
  X,
  Home,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DevModeBar from '../components/common/DevModeBar';
import './DashboardLayout.css';

export default function CustomerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand-box">
          <Link to="/" className="sidebar-brand">
            <Wrench size={22} className="text-primary" />
            <span>HomeFix</span>
          </Link>
          <span className="sidebar-badge customer">Customer</span>
        </div>

        <div className="sidebar-nav-section">
          <span className="sidebar-nav-title">Customer Menu</span>
          <NavLink
            to="/customer/dashboard"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/customer/book"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <CalendarPlus size={18} />
            <span>Book a Service</span>
          </NavLink>

          <NavLink
            to="/customer/technicians"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Users size={18} />
            <span>Find Technicians</span>
          </NavLink>

          <NavLink
            to="/customer/bookings"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <CalendarCheck size={18} />
            <span>My Bookings</span>
          </NavLink>

          <span className="sidebar-nav-title">Preferences</span>
          <NavLink
            to="/customer/addresses"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <MapPin size={18} />
            <span>Saved Addresses</span>
          </NavLink>

          <NavLink
            to="/customer/profile"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <User size={18} />
            <span>My Profile</span>
          </NavLink>

          <NavLink
            to="/customer/reviews"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Star size={18} />
            <span>My Reviews</span>
          </NavLink>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-user-brief">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser?.name}
              className="sidebar-user-avatar"
            />
            <div>
              <div className="sidebar-user-name">{currentUser?.name || 'Customer'}</div>
              <div className="sidebar-user-role">Customer Account</div>
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
        {/* Top bar with quick navigation & role switcher */}
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
            <span className="topbar-page-title">Customer Portal</span>
          </div>

          <div className="topbar-right">
            <Link to="/" className="btn btn-outline btn-sm" title="Back to Public Site">
              <Home size={16} />
              <span>Public Site</span>
            </Link>
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
