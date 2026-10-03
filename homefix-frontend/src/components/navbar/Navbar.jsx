import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Wrench, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Calendar, 
  ShieldCheck, 
  ChevronDown, 
  Briefcase 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { currentUser, isAuthenticated, userRole, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'technician') return '/technician/dashboard';
    return '/customer/dashboard';
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="brand-icon">
            <Wrench size={22} className="brand-svg" />
          </div>
          <div className="brand-text-wrap">
            <span className="brand-name">HomeFix</span>
            <span className="brand-badge">PRO</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav desktop-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Services
          </NavLink>
          <NavLink to="/technicians" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Technicians
          </NavLink>
          <a href="/#how-it-works" className="nav-link">
            How It Works
          </a>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Contact
          </NavLink>
        </nav>

        {/* Right CTA / Auth Controls */}
        <div className="navbar-actions desktop-actions">
          {isAuthenticated ? (
            <div className="user-dropdown-container">
              <button
                type="button"
                className="user-profile-btn"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                aria-expanded={isUserDropdownOpen}
              >
                <div className="user-avatar-sm">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div className="user-info-text">
                  <span className="user-name-label">{currentUser.name}</span>
                  <span className="user-role-label">{currentUser.role}</span>
                </div>
                <ChevronDown size={14} className={`dropdown-chevron ${isUserDropdownOpen ? 'rotated' : ''}`} />
              </button>

              {isUserDropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-user-name">{currentUser.name}</p>
                    <p className="dropdown-user-email">{currentUser.email}</p>
                  </div>

                  <div className="dropdown-role-switch">
                    <span className="switch-title">Quick Demo Persona:</span>
                    <div className="role-pills">
                      <button
                        type="button"
                        className={`role-pill ${userRole === 'customer' ? 'active' : ''}`}
                        onClick={() => { switchDemoRole('customer'); setIsUserDropdownOpen(false); }}
                      >
                        Customer
                      </button>
                      <button
                        type="button"
                        className={`role-pill ${userRole === 'technician' ? 'active' : ''}`}
                        onClick={() => { switchDemoRole('technician'); setIsUserDropdownOpen(false); }}
                      >
                        Technician
                      </button>
                      <button
                        type="button"
                        className={`role-pill ${userRole === 'admin' ? 'active' : ''}`}
                        onClick={() => { switchDemoRole('admin'); setIsUserDropdownOpen(false); }}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  <Link
                    to={getDashboardPath()}
                    className="dropdown-item"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <Briefcase size={16} />
                    <span>Go to Dashboard</span>
                  </Link>

                  {userRole === 'customer' && (
                    <Link
                      to="/customer/bookings"
                      className="dropdown-item"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <Calendar size={16} />
                      <span>My Bookings</span>
                    </Link>
                  )}

                  <button type="button" className="dropdown-item dropdown-logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons-group">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <nav className="mobile-nav-links">
            <NavLink
              to="/"
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </NavLink>
            <NavLink
              to="/technicians"
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Technicians
            </NavLink>
            <a
              href="/#how-it-works"
              className="mobile-nav-item"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <NavLink
              to="/about"
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </NavLink>
          </nav>

          <div className="mobile-auth-section">
            {isAuthenticated ? (
              <div className="mobile-logged-in">
                <div className="mobile-user-card">
                  <div className="user-avatar-sm">
                    {currentUser.avatar ? <img src={currentUser.avatar} alt="" /> : <User size={16} />}
                  </div>
                  <div>
                    <p className="mobile-user-name">{currentUser.name}</p>
                    <span className="badge-role">{currentUser.role}</span>
                  </div>
                </div>
                <Link
                  to={getDashboardPath()}
                  className="mobile-action-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="primary" fullWidth>Open Dashboard</Button>
                </Link>
                <Button variant="outline" fullWidth onClick={handleLogout}>Log Out</Button>
              </div>
            ) : (
              <div className="mobile-auth-actions">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth>Log In</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" fullWidth>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
