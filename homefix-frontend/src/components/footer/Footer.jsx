import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Heart,
  Globe,
  Share2,
  ExternalLink
} from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="container footer-container">
        {/* Brand & Mission */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <div className="brand-icon">
              <Wrench size={20} />
            </div>
            <span className="brand-name">HomeFix</span>
          </div>
          <p className="footer-tagline">
            "Reliable Home Services, Right When You Need Them."
          </p>
          <p className="footer-desc">
            A centralized on-demand household repair and technician dispatch platform built for rapid diagnostics, verified local experts, and transparent pricing.
          </p>
          <div className="footer-socials">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="Project Repository" className="social-icon-btn">
              <Globe size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="Professional Network" className="social-icon-btn">
              <Share2 size={18} />
            </a>
            <a href="https://google.com" target="_blank" rel="noreferrer" aria-label="Portal Link" className="social-icon-btn">
              <ExternalLink size={18} />
            </a>
          </div>
        </div>

        {/* Popular Services */}
        <div className="footer-col">
          <h4 className="footer-title">Popular Services</h4>
          <ul className="footer-links">
            <li><Link to="/services">Plumbing & Tap Repair</Link></li>
            <li><Link to="/services">Electrical & Wiring Safety</Link></li>
            <li><Link to="/services">Carpentry & Lock Systems</Link></li>
            <li><Link to="/services">Appliance Repair (AC, Washer)</Link></li>
            <li><Link to="/services">Seepage & Leakage Treatment</Link></li>
            <li><Link to="/services">Deep Cleaning & Sanitization</Link></li>
          </ul>
        </div>

        {/* Company & Platform */}
        <div className="footer-col">
          <h4 className="footer-title">Platform & Roles</h4>
          <ul className="footer-links">
            <li><Link to="/about">About HomeFix</Link></li>
            <li><Link to="/#how-it-works">How It Works</Link></li>
            <li><Link to="/technicians">Find Technicians</Link></li>
            <li><Link to="/register">Register as Technician</Link></li>
            <li><Link to="/customer/dashboard">Customer Dashboard</Link></li>
            <li><Link to="/admin/dashboard">Admin Control Center</Link></li>
          </ul>
        </div>

        {/* Support & Contact */}
        <div className="footer-col contact-col">
          <h4 className="footer-title">Support & Academic Info</h4>
          <ul className="footer-contact-list">
            <li>
              <Mail size={16} className="contact-icon" />
              <span>support@homefix.demo</span>
            </li>
            <li>
              <Phone size={16} className="contact-icon" />
              <span>+91 (800) 466-3349</span>
            </li>
            <li>
              <MapPin size={16} className="contact-icon" />
              <span>Academic Engineering Campus, India</span>
            </li>
            <li>
              <ShieldCheck size={16} className="contact-icon text-success" />
              <span>Major BTech Project Capstone Demonstration</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="copyright-text">
            © {new Date().getFullYear()} HomeFix Platform. All rights reserved. Built with React & Vite.
          </p>
          <div className="footer-bottom-links">
            <Link to="/about">Privacy Policy</Link>
            <span className="dot-divider">•</span>
            <Link to="/about">Terms of Service</Link>
            <span className="dot-divider">•</span>
            <span className="academic-badge">Academic Prototype</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
