import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  LayoutDashboard,
  Inbox,
  ClipboardList,
  Calendar,
  Wallet,
  Star,
  UserCheck,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

export default function TechnicianLayout() {
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
            <Wrench size={22} className="text-secondary" />
            <span>HomeFix</span>
          </Link>
          <span className="sidebar-badge technician">Technician</span>
        </div>

        <div className="sidebar-nav-section">
          <span className="sidebar-nav-title">Technician Hub</span>
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
            <span>Booking Requests</span>
          </NavLink>

          <NavLink
            to="/technician/bookings"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <ClipboardList size={18} />
            <span>Assigned Jobs</span>
          </NavLink>

          <NavLink
            to="/technician/availability"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Calendar size={18} />
            <span>Availability Slots</span>
          </NavLink>

          <span className="sidebar-nav-title">Financials & Profile</span>
          <NavLink
            to="/technician/earnings"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Wallet size={18} />
            <span>Earnings & Payouts</span>
          </NavLink>

          <NavLink
            to="/technician/reviews"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Star size={18} />
            <span>My Ratings</span>
          </NavLink>

          <NavLink
            to="/technician/profile"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <UserCheck size={18} />
            <span>Technician Profile</span>
          </NavLink>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-user-brief">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100'}
              alt={currentUser?.name}
              className="sidebar-user-avatar"
            />
            <div>
              <div className="sidebar-user-name">{currentUser?.name || 'Technician'}</div>
              <div className="sidebar-user-role">Service Partner</div>
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
            <span className="topbar-page-title">Technician Partner Portal</span>
          </div>

          <div className="topbar-right">
            {/* Quick Demo Persona Switcher */}
            <div className="topbar-role-selector" title="Switch Demo View for Viva/Testing">
              <span className="topbar-role-label">Viva View:</span>
              <button
                type="button"
                className="role-tag-btn"
                onClick={() => { switchDemoRole('customer'); navigate('/customer/dashboard'); }}
              >
                Customer
              </button>
              <button
                type="button"
                className="role-tag-btn active"
                onClick={() => switchDemoRole('technician')}
              >
                Technician
              </button>
              <button
                type="button"
                className="role-tag-btn"
                onClick={() => { switchDemoRole('admin'); navigate('/admin/dashboard'); }}
              >
                Admin
              </button>
            </div>

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
    </div>
  );
}
