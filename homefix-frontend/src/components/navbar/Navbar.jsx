import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Home,
  Wrench, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Calendar, 
  ShieldCheck, 
  ChevronDown, 
  Briefcase,
  Search,
  LogIn
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const { currentUser, isAuthenticated, userRole, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
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

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/services?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    }
  };

  const getDashboardPath = () => {
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'technician') return '/technician/dashboard';
    return '/customer/dashboard';
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Brand Logo with Tagline */}
        <Link to="/" className="navbar-brand" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div className="brand-text-wrap">
            <span className="brand-name">HomeFix</span>
            <span className="brand-tagline">YOUR HOME. OUR PRIORITY</span>
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

        {/* Search Box in Navbar (as in reference design) */}
        <form className="navbar-search-form desktop-search" onSubmit={handleNavSearch}>
          <Search size={15} className="navbar-search-icon" />
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search services..."
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
          />
        </form>

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
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} />
                  ) : (
                    <User size={15} />
                  )}
                </div>
                <div className="user-info-text">
                  <span className="user-name-label">{currentUser?.name?.split(' ')[0] || 'User'}</span>
                  <span className="user-role-label">{currentUser?.role || 'Member'}</span>
                </div>
                <ChevronDown size={14} className={`dropdown-chevron ${isUserDropdownOpen ? 'rotated' : ''}`} />
              </button>

              {isUserDropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-user-name">{currentUser?.name}</p>
                    <p className="dropdown-user-email">{currentUser?.email}</p>
                  </div>

                  <div className="dropdown-role-switch">
                    <span className="switch-title">Quick Demo Switch:</span>
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
            <Link to="/login" className="navbar-login-pill-btn">
              <User size={16} />
              <span>Login / Sign Up</span>
            </Link>
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
          <form className="mobile-search-form" onSubmit={handleNavSearch}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search services..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
            />
          </form>

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
              About
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
              <div className="mobile-user-card">
                <div className="mobile-user-info">
                  <span className="mobile-user-name">{currentUser?.name}</span>
                  <span className="mobile-user-role">{currentUser?.role}</span>
                </div>
                <div className="mobile-user-actions">
                  <Link
                    to={getDashboardPath()}
                    className="btn btn-primary btn-sm w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm w-full mt-2"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="mobile-auth-buttons">
                <Link
                  to="/login"
                  className="btn btn-secondary btn-md w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-md w-full mt-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
