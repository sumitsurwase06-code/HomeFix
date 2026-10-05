import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Clock,
  CreditCard,
  Sparkles,
  CheckCircle2,
  Users,
  Award,
  ChevronRight,
  Star,
  Activity,
  FileCheck,
  Calendar,
  UserCheck
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../data/services';
import { DEMO_TECHNICIANS } from '../../data/technicians';
import ServiceCard from '../../components/service/ServiceCard';
import TechnicianCard from '../../components/technician/TechnicianCard';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import './Home.css';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const navigate = useNavigate();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    navigate(`/customer/book?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`);
  };

  return (
    <div className="home-page">
      {/* ================= HERO SECTION (REFERENCE DESIGN MATCH) ================= */}
      <section className="hero-luxury-section">
        <div className="container-fluid hero-luxury-container">
          {/* Left Column: Champagne Editorial Typography & CTAs */}
          <div className="hero-editorial-panel">
            <h1 className="hero-editorial-title">
              Professional Home <br />
              Services, Made Simple
            </h1>

            <p className="hero-editorial-desc">
              Book trusted professionals for all your home needs — cleaning, repair, installation and more, at your convenience.
            </p>

            {/* Main Action Buttons */}
            <div className="hero-action-pills">
              <Link to="/customer/book" className="btn btn-primary btn-lg">
                <span>Book a Service</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/services" className="btn btn-secondary btn-lg">
                Explore Services
              </Link>
            </div>

            {/* Trust Indicator Badges Row (as in reference image) */}
            <div className="hero-trust-row">
              <div className="hero-trust-item">
                <div className="hero-trust-circle">
                  <ShieldCheck size={18} />
                </div>
                <span className="hero-trust-label">Verified Professionals</span>
              </div>

              <div className="hero-trust-item">
                <div className="hero-trust-circle">
                  <Clock size={18} />
                </div>
                <span className="hero-trust-label">On-Time Service</span>
              </div>

              <div className="hero-trust-item">
                <div className="hero-trust-circle">
                  <Star size={18} />
                </div>
                <span className="hero-trust-label">Quality Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Right Column: Luxury Living Room Visual */}
          <div className="hero-visual-panel">
            <div className="hero-image-frame">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=80"
                alt="Modern luxury living room with emerald accent walls and natural decor"
                className="hero-interior-img"
              />

              {/* Floating Glassmorphism Pill Card (as in reference image) */}
              <div className="hero-floating-pill-card">
                <div className="pill-card-text">
                  <strong>Transform Your Home</strong>
                  <span>With Expert Care</span>
                </div>
                <div className="pill-card-dots">
                  <span className="dot active" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR SERVICES SECTION (REFERENCE DESIGN MATCH) ================= */}
      <section className="services-showcase-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title font-serif-heading">Our Services</h2>
            <div className="title-champagne-underline" />
            <p className="section-subtitle">
              Standardized rates, verified specialists, and guaranteed quality for every household maintenance trade.
            </p>
          </div>

          <div className="services-cards-grid">
            {SERVICE_CATEGORIES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={() => navigate(`/customer/book?service=${service.id}`)}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/services">
              <Button variant="outline" size="lg" rightIcon={<ArrowRight size={18} />}>
                View All Available Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION (EMERALD BACKGROUND MATCH) ================= */}
      <section className="how-it-works-emerald-section" id="how-it-works">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="emerald-section-title">How It Works</h2>
            <div className="title-gold-underline" />
            <p className="emerald-section-subtitle">
              Book a certified home technician in four seamless, reliable steps
            </p>
          </div>

          <div className="how-it-works-emerald-grid">
            {/* Step 1 */}
            <div className="emerald-step-item">
              <div className="emerald-step-circle">
                <Search size={26} />
              </div>
              <h3 className="emerald-step-title">1. Choose Service</h3>
              <p className="emerald-step-desc">
                Browse and select the service you need.
              </p>
            </div>

            {/* Step 2 */}
            <div className="emerald-step-item">
              <div className="emerald-step-circle">
                <Calendar size={26} />
              </div>
              <h3 className="emerald-step-title">2. Pick Date & Time</h3>
              <p className="emerald-step-desc">
                Schedule at your convenience.
              </p>
            </div>

            {/* Step 3 */}
            <div className="emerald-step-item">
              <div className="emerald-step-circle">
                <UserCheck size={26} />
              </div>
              <h3 className="emerald-step-title">3. Get Matched</h3>
              <p className="emerald-step-desc">
                We assign a verified professional.
              </p>
            </div>

            {/* Step 4 */}
            <div className="emerald-step-item">
              <div className="emerald-step-circle">
                <CheckCircle2 size={26} />
              </div>
              <h3 className="emerald-step-title">4. Relax</h3>
              <p className="emerald-step-desc">
                Your home service is completed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED TECHNICIANS ================= */}
      <section className="section-padding bg-alt">
        <div className="container">
          <div className="section-header flex justify-between items-end flex-wrap gap-4">
            <div>
              <span className="section-eyebrow">Certified Partners</span>
              <h2 className="section-title">Top-Rated Local Technicians</h2>
              <p className="section-subtitle text-left" style={{ margin: 0 }}>
                Identity checked, skill tested, and rated by verified neighborhood homeowners.
              </p>
            </div>
            <Link to="/technicians">
              <Button variant="outline" size="md" rightIcon={<ArrowRight size={16} />}>
                Browse All Technicians
              </Button>
            </Link>
          </div>

          <div className="technicians-grid">
            {DEMO_TECHNICIANS.slice(0, 3).map((tech) => (
              <TechnicianCard key={tech.id} technician={tech} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY HOMEFIX (TRUST & BENEFITS) ================= */}
      <section className="section-padding bg-champagne-light">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">The HomeFix Standard</span>
            <h2 className="section-title">Why Homeowners Choose HomeFix</h2>
            <p className="section-subtitle">
              Luxury quality, transparent rates, and trusted local experts for peace of mind.
            </p>
          </div>

          <div className="why-grid">
            <Card className="why-card p-6" hoverEffect>
              <div className="why-icon-box">
                <ShieldCheck size={28} className="text-emerald" />
              </div>
              <h3 className="why-title">4-Point Verified</h3>
              <p className="why-text">
                Technicians pass government identity validation, trade license verification, background screening, and onboarding audits.
              </p>
            </Card>

            <Card className="why-card p-6" hoverEffect>
              <div className="why-icon-box">
                <CreditCard size={28} className="text-emerald" />
              </div>
              <h3 className="why-title">Transparent Pricing</h3>
              <p className="why-text">
                Fixed visiting charges and itemized upfront quotations for parts and labor. No surprise surcharges.
              </p>
            </Card>

            <Card className="why-card p-6" hoverEffect>
              <div className="why-icon-box">
                <Clock size={28} className="text-emerald" />
              </div>
              <h3 className="why-title">On-Time Arrival</h3>
              <p className="why-text">
                Select your preferred 2-hour window. Our technicians adhere to strict punctuality standards.
              </p>
            </Card>

            <Card className="why-card p-6" hoverEffect>
              <div className="why-icon-box">
                <Award size={28} className="text-emerald" />
              </div>
              <h3 className="why-title">Quality Guarantee</h3>
              <p className="why-text">
                Every repair comes with our HomeFix Service Warranty. If an issue recurs, our team will make it right.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA SECTION ================= */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-banner-box">
            <div className="cta-content">
              <span className="cta-pill">Book in 60 Seconds</span>
              <h2 className="cta-title">Ready to Experience Hassle-Free Home Repair?</h2>
              <p className="cta-description">
                Join thousands of satisfied homeowners who trust HomeFix for dependable electrical, plumbing, carpentry, and appliance servicing.
              </p>
              <div className="cta-actions">
                <Link to="/customer/book">
                  <Button variant="accent" size="lg" rightIcon={<ArrowRight size={18} />}>
                    Book a Service Now
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" size="lg" className="cta-secondary-btn">
                    Explore All Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
