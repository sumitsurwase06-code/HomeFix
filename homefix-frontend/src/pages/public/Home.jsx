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
  FileCheck
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
      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-pulse" />
              <span>India's On-Demand Trusted Repair Network</span>
            </div>

            <h1 className="hero-title">
              Reliable Home Services, <br />
              <span className="text-gradient">Right When You Need Them.</span>
            </h1>

            <p className="hero-description">
              Find trusted professionals for repairs, maintenance, cleaning and more — all in one place with transparent upfront pricing and verified local technicians.
            </p>

            {/* Quick Search Form */}
            <form className="hero-search-bar" onSubmit={handleHeroSearch}>
              <div className="search-input-wrap">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="What service do you need? (e.g. Tap leak, AC service)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="search-divider-vertical" />

              <div className="search-input-wrap location-wrap">
                <MapPin size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Enter your location (e.g. Indirapuram)"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="hero-submit-btn">
                <span>Find Help</span>
                <ArrowRight size={16} />
              </Button>
            </form>

            {/* CTA Action Buttons */}
            <div className="hero-cta-buttons">
              <Link to="/customer/book">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>
                  Book a Service
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg">
                  Explore Services
                </Button>
              </Link>
            </div>

            {/* Popular quick tags */}
            <div className="hero-popular-tags">
              <span className="popular-label">Popular Now:</span>
              <Link to="/customer/book?service=plumbing" className="popular-pill">Plumbing</Link>
              <Link to="/customer/book?service=electrical" className="popular-pill">Electrical</Link>
              <Link to="/customer/book?service=appliance-repair" className="popular-pill">AC Servicing</Link>
              <Link to="/customer/book?service=leakage-repair" className="popular-pill">Leakage</Link>
            </div>
          </div>

          {/* Right Hero Visual Showcase */}
          <div className="hero-visual-wrap">
            <div className="hero-card-floating main-hero-image">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80"
                alt="Professional home repair technician servicing appliances"
                className="hero-main-img"
              />
              <div className="hero-glass-pill glass-pill-top">
                <ShieldCheck size={20} className="text-success" />
                <div>
                  <div className="pill-strong">Certified Backgrounds</div>
                  <div className="pill-muted">Strict 4-point verification</div>
                </div>
              </div>

              <div className="hero-glass-pill glass-pill-bottom">
                <Star size={20} className="star-icon" />
                <div>
                  <div className="pill-strong">4.8 / 5.0 Rating</div>
                  <div className="pill-muted">From 12,000+ satisfied homes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST INDICATORS ================= */}
      <section className="trust-strip-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon-box">
                <Award size={24} />
              </div>
              <div className="trust-meta">
                <div className="trust-stat">10+ Services</div>
                <div className="trust-label">Multi-trade solutions under one roof</div>
                <span className="stat-demo-note">(Academic Demo Data)</span>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box">
                <ShieldCheck size={24} />
              </div>
              <div className="trust-meta">
                <div className="trust-stat">Verified Technicians</div>
                <div className="trust-label">Skill audited & identity documented</div>
                <span className="stat-demo-note">(Academic Demo Data)</span>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box">
                <Clock size={24} />
              </div>
              <div className="trust-meta">
                <div className="trust-stat">Easy Booking</div>
                <div className="trust-label">Instant slot confirmation in 60s</div>
                <span className="stat-demo-note">(Academic Demo Data)</span>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box">
                <CreditCard size={24} />
              </div>
              <div className="trust-meta">
                <div className="trust-stat">Secure Payments</div>
                <div className="trust-label">Itemized billing & post-service payment</div>
                <span className="stat-demo-note">(Academic Demo Data)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICE CATEGORIES ================= */}
      <section className="section-padding bg-alt">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Comprehensive Expertise</span>
            <h2 className="section-title">Explore Our Service Categories</h2>
            <p className="section-subtitle">
              From fixing minor drippy faucets to full domestic rewiring and deep appliance restoration, select your required category below.
            </p>
          </div>

          <div className="service-categories-grid">
            {SERVICE_CATEGORIES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={() => navigate(`/customer/book?service=${service.id}`)}
              />
            ))}
          </div>

          <div className="all-services-cta">
            <Link to="/services">
              <Button variant="outline" size="lg" rightIcon={<ArrowRight size={18} />}>
                View Detailed Service Catalog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS (4 STEPS) ================= */}
      <section className="section-padding" id="how-it-works">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Streamlined Experience</span>
            <h2 className="section-title">How HomeFix Works in 4 Simple Steps</h2>
            <p className="section-subtitle">
              A frictionless workflow connecting you with top-rated local technicians in minutes.
            </p>
          </div>

          <div className="how-it-works-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon-wrap">
                <Search size={24} />
              </div>
              <h3 className="step-title">Select a Service</h3>
              <p className="step-text">
                Browse our standardized catalog of household trades and pick the exact repair category needed.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon-wrap">
                <FileCheck size={24} />
              </div>
              <h3 className="step-title">Describe Your Problem</h3>
              <p className="step-text">
                Specify the issue symptoms, optionally upload real photo attachments, and provide your home location.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon-wrap">
                <Users size={24} />
              </div>
              <h3 className="step-title">Choose a Technician</h3>
              <p className="step-text">
                Compare verified ratings, service fees, proximity, and choose the expert best suited for your schedule.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <div className="step-icon-wrap">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="step-title">Get the Job Done</h3>
              <p className="step-text">
                Technician arrives at your doorstep, diagnoses the fault, executes repair, and provides a clear itemized receipt.
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
              <span className="section-eyebrow">Top-Rated Partners</span>
              <h2 className="section-title">Featured Demo Technicians</h2>
              <p className="section-subtitle">
                Representative profiles demonstrating skill tags, ratings, visiting charges, and availability.
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

      {/* ================= WHY HOMEFIX ================= */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">The HomeFix Difference</span>
            <h2 className="section-title">Why Homeowners Trust HomeFix</h2>
            <p className="section-subtitle">
              Engineered with modern full-stack architecture for reliability, security, and utmost transparency.
            </p>
          </div>

          <div className="why-grid">
            <Card className="why-card" hoverEffect>
              <div className="why-icon-box">
                <ShieldCheck size={28} className="text-primary" />
              </div>
              <h3 className="why-title">Trusted Professionals</h3>
              <p className="why-text">
                Technicians submit valid national IDs, certifications, and trade portfolios before gaining admin approval.
              </p>
            </Card>

            <Card className="why-card" hoverEffect>
              <div className="why-icon-box">
                <CreditCard size={28} className="text-secondary" />
              </div>
              <h3 className="why-title">Transparent Pricing</h3>
              <p className="why-text">
                Zero surprise charges. Standardized visiting fee plus upfront itemized material and labor quotes.
              </p>
            </Card>

            <Card className="why-card" hoverEffect>
              <div className="why-icon-box">
                <Clock size={28} className="text-warning" />
              </div>
              <h3 className="why-title">Easy Booking</h3>
              <p className="why-text">
                Book a technician in under 2 minutes with flexible morning, afternoon, or evening appointment slots.
              </p>
            </Card>

            <Card className="why-card" hoverEffect>
              <div className="why-icon-box">
                <Activity size={28} className="text-primary" />
              </div>
              <h3 className="why-title">Service Tracking</h3>
              <p className="why-text">
                Real-time booking progression from 'Requested' to 'Accepted', 'On the Way', and 'In Progress'.
              </p>
            </Card>

            <Card className="why-card" hoverEffect>
              <div className="why-icon-box">
                <Sparkles size={28} className="text-secondary" />
              </div>
              <h3 className="why-title">Secure Payments</h3>
              <p className="why-text">
                Pay only after you are 100% satisfied with the completed repair work using multiple payment methods.
              </p>
            </Card>

            <Card className="why-card" hoverEffect>
              <div className="why-icon-box">
                <Star size={28} className="text-warning" />
              </div>
              <h3 className="why-title">Customer Reviews</h3>
              <p className="why-text">
                Authentic, verified post-job ratings directly tied to recorded service transactions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-banner-box">
            <div className="cta-content">
              <span className="cta-pill">Immediate Assistance</span>
              <h2 className="cta-title">Need a Repair? We've Got You Covered.</h2>
              <p className="cta-description">
                Book a verified technician in just a few clicks. Experienced pros ready to troubleshoot and repair your home.
              </p>
              <div className="cta-actions">
                <Link to="/customer/book">
                  <Button variant="accent" size="lg" rightIcon={<ArrowRight size={18} />}>
                    Book a Service Now
                  </Button>
                </Link>
                <Link to="/technicians">
                  <Button variant="outline" size="lg" className="cta-secondary-btn">
                    View Verified Experts
                  </Button>
                </Link>
              </div>
            </div>
            <div className="cta-decoration-circle" />
          </div>
        </div>
      </section>
    </div>
  );
}
