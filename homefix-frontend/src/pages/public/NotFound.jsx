import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, HelpCircle, ArrowRight } from 'lucide-react';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-page section-padding">
      <div className="container not-found-container text-center">
        <div className="not-found-badge-wrapper">
          <span className="not-found-code">404</span>
        </div>

        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-desc">
          The service or page you are looking for may have been moved, renamed, or is temporarily unavailable. Let's get you back on track with trusted home services.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary btn-lg">
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
          <Link to="/services" className="btn btn-secondary btn-lg">
            <Search size={18} />
            <span>Browse Services</span>
          </Link>
        </div>

        <div className="not-found-help-box">
          <HelpCircle size={20} className="text-primary" />
          <span>Need immediate assistance? Contact our support team via <Link to="/contact" className="not-found-link">Help & Contact <ArrowRight size={14} style={{ display: 'inline' }} /></Link></span>
        </div>
      </div>
    </div>
  );
}
