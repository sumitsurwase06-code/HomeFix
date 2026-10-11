import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  X,
  MapPin,
  Sparkles,
  Clock,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  ShieldCheck,
  Layers,
  Wrench,
  Zap,
  Hammer,
  Armchair,
  Droplets,
  Paintbrush,
  Cpu,
  PenTool,
  RotateCcw,
  Check
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../data/services';
import { customerApi } from '../../services/api';
import ServiceCard from '../../components/service/ServiceCard';
import Modal from '../../components/common/Modal';
import './Services.css';

const CATEGORY_ICONS = {
  all: Layers,
  plumbing: Wrench,
  electrical: Zap,
  carpentry: Hammer,
  'furniture-repair': Armchair,
  'leakage-repair': Droplets,
  painting: Paintbrush,
  'appliance-repair': Cpu,
  cleaning: Sparkles,
  'other-maintenance': PenTool,
};

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search & Filter state
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [filterPopularOnly, setFilterPopularOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended' | 'price-asc' | 'price-desc' | 'time' | 'name'

  // Location selector state
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Indirapuram, Noida');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const locationMenuRef = useRef(null);

  // "What's Included" Modal state
  const [activeServiceForModal, setActiveServiceForModal] = useState(null);

  // Sync search from URL query parameter if user searches via Navbar
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null && q !== searchTerm) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  // Load customer saved addresses
  useEffect(() => {
    async function fetchAddresses() {
      try {
        const res = await customerApi.getSavedAddresses();
        const addrs = res?.data || [];
        setSavedAddresses(addrs);
        if (addrs.length > 0) {
          const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
          setSelectedLocation(`${defaultAddr.locality}, ${defaultAddr.city}`);
        }
      } catch (err) {
        console.error('Failed to load saved addresses:', err);
      }
    }
    fetchAddresses();
  }, []);

  // Handle clicking outside location menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationMenuRef.current && !locationMenuRef.current.contains(event.target)) {
        setIsLocationDropdownOpen(false);
      }
    }
    if (isLocationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLocationDropdownOpen]);

  // Clear search handler
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchParams((prev) => {
      const copy = new URLSearchParams(prev);
      copy.delete('search');
      return copy;
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setFilterPopularOnly(false);
    setSortBy('recommended');
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredServices = useMemo(() => {
    return SERVICE_CATEGORIES.filter((service) => {
      // 1. Search Query Match (Service name, short description, or popular services keywords)
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        service.name.toLowerCase().includes(q) ||
        service.shortDesc.toLowerCase().includes(q) ||
        (service.popularServices || []).some((item) => item.toLowerCase().includes(q));

      // 2. Category Match
      const matchesCategory =
        selectedCategory === 'all' || service.id === selectedCategory;

      // 3. Popularity Toggle
      const matchesPopular = filterPopularOnly ? service.popular : true;

      return matchesSearch && matchesCategory && matchesPopular;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.startingPrice - b.startingPrice;
      if (sortBy === 'price-desc') return b.startingPrice - a.startingPrice;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'time') {
        const extractMins = (str) => {
          const match = str.match(/\d+/);
          return match ? parseInt(match[0], 10) : 999;
        };
        return extractMins(a.estimatedTime || '') - extractMins(b.estimatedTime || '');
      }
      // 'recommended' (popular services first, then default order)
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return 0;
    });
  }, [searchTerm, selectedCategory, filterPopularOnly, sortBy]);

  // Category filter tabs data
  const categoryChips = useMemo(() => {
    return [
      { id: 'all', name: 'All Services', count: SERVICE_CATEGORIES.length },
      ...SERVICE_CATEGORIES.map((s) => ({
        id: s.id,
        name: s.name,
        count: 1
      }))
    ];
  }, []);

  return (
    <div className="services-catalog-page">
      <div className="services-catalog-container">
        {/* 1. Breadcrumb Bar & Location Selector */}
        <div className="services-breadcrumb-bar">
          <nav className="services-breadcrumb-links" aria-label="Breadcrumb">
            <Link to="/" className="services-breadcrumb-link">
              Home
            </Link>
            <span className="services-breadcrumb-separator">/</span>
            <span className="services-breadcrumb-current">Services</span>
          </nav>

          {/* Location Selector Dropdown */}
          <div className="relative" ref={locationMenuRef}>
            <button
              type="button"
              className="services-location-pill"
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              title="Change Service Location"
            >
              <MapPin size={13} className="text-[var(--emerald-ink)]" />
              <span>Service Area: <strong>{selectedLocation}</strong></span>
              <ChevronDown size={13} className="text-[var(--text-muted)]" />
            </button>

            {isLocationDropdownOpen && (
              <div className="location-dropdown-menu">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block p-2">
                  Service Deliverable Area
                </span>
                <button
                  type="button"
                  className="w-full text-left p-2 text-xs font-semibold rounded-lg hover:bg-[var(--champagne-light)] flex items-center justify-between"
                  onClick={() => {
                    setSelectedLocation('Indirapuram, Noida');
                    setIsLocationDropdownOpen(false);
                  }}
                >
                  <span>Indirapuram, Noida (Default)</span>
                  {selectedLocation === 'Indirapuram, Noida' && <Check size={13} className="text-[var(--emerald-ink)]" />}
                </button>
                {savedAddresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    className="w-full text-left p-2 text-xs font-semibold rounded-lg hover:bg-[var(--champagne-light)] flex items-center justify-between"
                    onClick={() => {
                      setSelectedLocation(`${addr.locality}, ${addr.city}`);
                      setIsLocationDropdownOpen(false);
                    }}
                  >
                    <span>{addr.type}: {addr.locality}, {addr.city}</span>
                    {selectedLocation === `${addr.locality}, ${addr.city}` && (
                      <Check size={13} className="text-[var(--emerald-ink)]" />
                    )}
                  </button>
                ))}
                <button
                  type="button"
                  className="w-full text-left p-2 text-xs font-semibold rounded-lg hover:bg-[var(--champagne-light)] flex items-center justify-between border-t border-[var(--champagne-border)] mt-1"
                  onClick={() => {
                    setSelectedLocation('All Delhi NCR Localities');
                    setIsLocationDropdownOpen(false);
                  }}
                >
                  <span>All Covered Localities</span>
                  {selectedLocation === 'All Delhi NCR Localities' && (
                    <Check size={13} className="text-[var(--emerald-ink)]" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. Premium Page Header Card */}
        <header className="services-hero-header-card">
          <div className="services-header-text-group">
            <span className="services-hero-badge">
              <Sparkles size={13} />
              <span>Verified HomeFix Quality Guarantee</span>
            </span>
            <h1 className="services-hero-title">Explore Home Services</h1>
            <p className="services-hero-subtitle">
              Find trusted professionals for repairs, maintenance, and everyday home needs.
            </p>
          </div>

          {/* Integrated Search Field & Counters */}
          <div className="services-header-controls-bar">
            <div className="services-search-input-wrap">
              <Search size={18} className="services-search-icon" />
              <input
                type="text"
                className="services-search-input"
                placeholder="What service do you need? (e.g. plumbing, fan repair, leak)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search home services"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="services-search-clear-btn"
                  onClick={handleClearSearch}
                  aria-label="Clear search query"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="services-meta-counters">
              <span className="services-count-pill">
                Showing <strong>{filteredServices.length}</strong> of {SERVICE_CATEGORIES.length} services
              </span>
            </div>
          </div>
        </header>

        {/* 3. Interactive Category Filter Chips & Sort Toolbar */}
        <div className="services-filter-toolbar">
          {/* Horizontal Category Chips */}
          <div className="services-category-chips-scroll" role="tablist" aria-label="Service Categories">
            {categoryChips.map((chip) => {
              const Icon = CATEGORY_ICONS[chip.id] || Wrench;
              const isActive = selectedCategory === chip.id;

              return (
                <button
                  key={chip.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`category-filter-chip ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(chip.id);
                    setSearchParams((prev) => {
                      const copy = new URLSearchParams(prev);
                      if (chip.id === 'all') {
                        copy.delete('category');
                      } else {
                        copy.set('category', chip.id);
                      }
                      return copy;
                    });
                  }}
                >
                  <span className="category-chip-icon">
                    <Icon size={15} />
                  </span>
                  <span>{chip.name}</span>
                </button>
              );
            })}
          </div>

          {/* Subtoolbar: Quick Toggles & Sorting */}
          <div className="services-subtoolbar">
            <div className="services-quick-toggles">
              <button
                type="button"
                className={`quick-toggle-btn ${filterPopularOnly ? 'active' : ''}`}
                onClick={() => setFilterPopularOnly(!filterPopularOnly)}
              >
                <Sparkles size={13} className={filterPopularOnly ? 'text-[var(--emerald-ink)]' : 'text-amber-500'} />
                <span>Popular Trades Only</span>
              </button>

              {(searchTerm || selectedCategory !== 'all' || filterPopularOnly || sortBy !== 'recommended') && (
                <button
                  type="button"
                  className="quick-toggle-btn text-[var(--emerald-ink)] hover:underline"
                  onClick={handleResetFilters}
                >
                  <RotateCcw size={12} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            <div className="services-sort-wrapper">
              <label htmlFor="service-sort-select" className="services-sort-label">
                Sort By:
              </label>
              <select
                id="service-sort-select"
                className="services-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommended">Recommended & Popular</option>
                <option value="price-asc">Visiting Fee: Low to High</option>
                <option value="price-desc">Visiting Fee: High to Low</option>
                <option value="time">Fastest Response / Duration</option>
                <option value="name">Service Name (A - Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Responsive Service Grid (3-4 desktop, 2-3 laptop, 2 tablet, 1-2 mobile) */}
        {filteredServices.length > 0 ? (
          <main className="services-responsive-grid" aria-label="Available Services Grid">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={() => navigate(`/customer/book?service=${service.id}`)}
                onExplore={(srv) => setActiveServiceForModal(srv)}
              />
            ))}
          </main>
        ) : (
          /* 5. Helpful Empty State */
          <div className="services-empty-state-card">
            <div className="services-empty-icon-wrap">
              <Search size={28} />
            </div>
            <h2 className="services-empty-title">No matching services found</h2>
            <p className="services-empty-desc">
              We couldn't find any home service matching "{searchTerm || selectedCategory}". Try adjusting your keywords, selecting a different category, or clearing your active filters.
            </p>
            <button
              type="button"
              className="service-book-now-btn"
              onClick={handleResetFilters}
            >
              <RotateCcw size={14} />
              <span>View All Services</span>
            </button>
          </div>
        )}
      </div>

      {/* ====================================================================
          "WHAT'S INCLUDED" SERVICE INSPECTION MODAL
          ==================================================================== */}
      {activeServiceForModal && (
        <Modal
          isOpen={Boolean(activeServiceForModal)}
          onClose={() => setActiveServiceForModal(null)}
          title={`${activeServiceForModal.name} Services`}
          subtitle={`Doorstep Visiting Fee from ₹${activeServiceForModal.startingPrice} · Estimated Time: ${activeServiceForModal.estimatedTime || '45 - 90 mins'}`}
          maxWidth="560px"
        >
          <div className="service-modal-content">
            <div className="service-modal-hero">
              <img
                src={activeServiceForModal.image || 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300'}
                alt={activeServiceForModal.name}
                className="service-modal-img"
              />
              <div>
                <h4 className="text-sm font-bold text-[var(--emerald-dark)] m-0">
                  {activeServiceForModal.name} Overview
                </h4>
                <p className="text-xs text-[var(--text-muted)] m-0 mt-1 leading-relaxed">
                  {activeServiceForModal.shortDesc}
                </p>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--emerald-ink)] block mb-2">
                Popular Inclusions & Trade Repairs:
              </span>
              <div className="service-modal-inclusions-list">
                {activeServiceForModal.popularServices?.map((item, idx) => (
                  <div key={idx} className="service-inclusion-item">
                    <CheckCircle2 size={16} className="service-inclusion-icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="service-modal-guarantees-grid">
              <div className="guarantee-mini-badge">
                <ShieldCheck size={15} className="text-[var(--emerald-ink)]" />
                <span>Verified Specialists</span>
              </div>
              <div className="guarantee-mini-badge">
                <Clock size={15} className="text-[var(--emerald-ink)]" />
                <span>Transparent Upfront Rates</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--champagne-dark)]">
              <button
                type="button"
                className="service-explore-btn px-4 py-2"
                onClick={() => setActiveServiceForModal(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="service-book-now-btn"
                onClick={() => {
                  const srvId = activeServiceForModal.id;
                  setActiveServiceForModal(null);
                  navigate(`/customer/book?service=${srvId}`);
                }}
              >
                <span>Book This Service</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
