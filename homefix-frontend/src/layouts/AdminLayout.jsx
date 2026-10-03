import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  LayoutDashboard,
  Users,
  HardHat,
  UserCheck,
  CalendarDays,
  CircleDollarSign,
  Star,
  Layers,
  FileText,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

export default function AdminLayout() {
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
          <span className="sidebar-badge admin">Admin</span>
        </div>

        <div className="sidebar-nav-section">
          <span className="sidebar-nav-title">Administration</span>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <LayoutDashboard size={18} />
            <span>Executive Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/verification"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <UserCheck size={18} />
            <span>Partner Verification</span>
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
            to="/admin/bookings"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <CalendarDays size={18} />
            <span>All Bookings</span>
          </NavLink>

          <span className="sidebar-nav-title">Operations & Finance</span>
          <NavLink
            to="/admin/revenue"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <CircleDollarSign size={18} />
            <span>Revenue & Commission</span>
          </NavLink>

          <NavLink
            to="/admin/services"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Layers size={18} />
            <span>Service Catalog</span>
          </NavLink>

          <NavLink
            to="/admin/reviews"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Star size={18} />
            <span>Reviews Moderation</span>
          </NavLink>

          <NavLink
            to="/admin/audit-logs"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FileText size={18} />
            <span>System Audit Logs</span>
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
              <div className="sidebar-user-name">{currentUser?.name || 'Admin'}</div>
              <div className="sidebar-user-role">Platform Super Admin</div>
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
            <span className="topbar-page-title">Admin Management System</span>
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
                className="role-tag-btn"
                onClick={() => { switchDemoRole('technician'); navigate('/technician/dashboard'); }}
              >
                Technician
              </button>
              <button
                type="button"
                className="role-tag-btn active"
                onClick={() => switchDemoRole('admin')}
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
