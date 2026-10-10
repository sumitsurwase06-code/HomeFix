import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Star,
  MessageSquare,
  Award,
  ShieldCheck,
  Search,
  X,
  SlidersHorizontal,
  ThumbsUp,
  MapPin,
  ExternalLink,
  Copy,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import './TechnicianPortal.css';

// Initial verified customer reviews dataset
const INITIAL_REVIEWS_DATA = [
  {
    id: 1,
    customer: 'Rohan Sharma',
    avatarInitials: 'RS',
    locality: 'Indirapuram, Ghaziabad',
    rating: 5,
    date: '02 Oct 2026',
    timestamp: 1790900000000,
    service: 'Tap & Mixer Leakage Repair',
    bookingRef: 'HF-BK-8901',
    verified: true,
    comment: 'Arrived right on time with proper replacement Teflon seals and precision tools. He diagnosed the concealed wall leakage cleanly, replaced the mixer cartridge within 30 minutes, and left the bathroom completely dry. Highly recommended!',
  },
  {
    id: 2,
    customer: 'Pooja Verma',
    avatarInitials: 'PV',
    locality: 'Sector 62, Noida',
    rating: 5,
    date: '28 Sep 2026',
    timestamp: 1790500000000,
    service: 'Geyser Inlet Valve Replacement',
    bookingRef: 'HF-BK-8742',
    verified: true,
    comment: 'Diagnosed electrical thermostat issue quickly and charged exactly as estimated upfront. Very courteous and polite behavior. Workmanship was top-tier.',
  },
  {
    id: 3,
    customer: 'Aditi Nair',
    avatarInitials: 'AN',
    locality: 'Sector 18, Noida',
    rating: 4,
    date: '15 Sep 2026',
    timestamp: 1789400000000,
    service: 'Kitchen Sink Drain Unblocking',
    bookingRef: 'HF-BK-8519',
    verified: true,
    comment: 'Good craftsmanship and efficient drain machine usage. He also kindly explained preventive measures to avoid future grease blockages in the kitchen pipeline.',
  },
  {
    id: 4,
    customer: 'Vikram Mehta',
    avatarInitials: 'VM',
    locality: 'Vaishali, Ghaziabad',
    rating: 5,
    date: '30 Aug 2026',
    timestamp: 1788100000000,
    service: 'Main Pipeline Valve Overhaul',
    bookingRef: 'HF-BK-8304',
    verified: true,
    comment: 'Very professional, courteous, and polite. Solved a persistent high-pressure hammering issue seamlessly without damaging surrounding tiles.',
  },
  {
    id: 5,
    customer: 'Sunil Mathur',
    avatarInitials: 'SM',
    locality: 'Sector 50, Noida',
    rating: 5,
    date: '18 Aug 2026',
    timestamp: 1787000000000,
    service: 'Submersible Pump Valve Fitting',
    bookingRef: 'HF-BK-8110',
    verified: true,
    comment: 'Exceptional service! Quick diagnosis and high-grade CPVC fittings used. The water tank inflow is now completely balanced.',
  },
  {
    id: 6,
    customer: 'Meera Deshmukh',
    avatarInitials: 'MD',
    locality: 'Sector 76, Noida',
    rating: 4,
    date: '04 Aug 2026',
    timestamp: 1785800000000,
    service: 'Bathroom Shower Panel Repair',
    bookingRef: 'HF-BK-7950',
    verified: true,
    comment: 'Prompt response and genuine spare parts. Slight delay in reaching due to heavy rain, but he communicated in advance and completed the job thoroughly.',
  },
  {
    id: 7,
    customer: 'Kavita Joshi',
    avatarInitials: 'KJ',
    locality: 'Sector 137, Noida',
    rating: 5,
    date: '22 Jul 2026',
    timestamp: 1784700000000,
    service: 'RO Water Purifier Inlet Installation',
    bookingRef: 'HF-BK-7801',
    verified: true,
    comment: 'Flawless pipe routing and clean pressure adjustment. Provided a clear invoice with spare parts guarantee.',
  }
];

export default function Reviews() {
  const { currentUser } = useAuth();
  const toast = useToast();

  const [reviews] = useState(INITIAL_REVIEWS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStarFilter, setSelectedStarFilter] = useState('ALL'); // 'ALL', '5', '4', '3_BELOW'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'highest', 'lowest'
  const [expandedReviews, setExpandedReviews] = useState({});
  const [selectedReviewModal, setSelectedReviewModal] = useState(null);

  // Dynamic Rating & KPI Calculations from data
  const {
    totalReviewsCount,
    averageRating,
    fiveStarCount,
    fiveStarPercentage,
    ratingDistribution,
    mostReviewedService,
    positiveSentimentRate
  } = useMemo(() => {
    const total = reviews.length;
    if (total === 0) {
      return {
        totalReviewsCount: 0,
        averageRating: '0.0',
        fiveStarCount: 0,
        fiveStarPercentage: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        mostReviewedService: 'N/A',
        positiveSentimentRate: 0
      };
    }

    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    const serviceCounts = {};

    reviews.forEach((r) => {
      sum += r.rating;
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      dist[star] = (dist[star] || 0) + 1;
      serviceCounts[r.service] = (serviceCounts[r.service] || 0) + 1;
    });

    let topService = 'Plumbing & Water Systems';
    let topServiceCount = 0;
    Object.entries(serviceCounts).forEach(([srv, count]) => {
      if (count > topServiceCount) {
        topService = srv;
        topServiceCount = count;
      }
    });

    const avg = (sum / total).toFixed(1);
    const count5 = dist[5] || 0;
    const count4 = dist[4] || 0;
    const pct5 = Math.round((count5 / total) * 100);
    const positiveRate = Math.round(((count5 + count4) / total) * 100);

    return {
      totalReviewsCount: 142, // Total lifetime aggregate
      averageRating: avg,
      fiveStarCount: count5,
      fiveStarPercentage: pct5,
      ratingDistribution: dist,
      mostReviewedService: topService,
      positiveSentimentRate: positiveRate
    };
  }, [reviews]);

  // Filter & Search Logic
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        // Star filter
        if (selectedStarFilter === '5' && r.rating !== 5) return false;
        if (selectedStarFilter === '4' && r.rating !== 4) return false;
        if (selectedStarFilter === '3_BELOW' && r.rating > 3) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCustomer = r.customer.toLowerCase().includes(q);
          const matchService = r.service.toLowerCase().includes(q);
          const matchLocality = r.locality.toLowerCase().includes(q);
          const matchComment = r.comment.toLowerCase().includes(q);
          const matchBooking = r.bookingRef.toLowerCase().includes(q);
          return matchCustomer || matchService || matchLocality || matchComment || matchBooking;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') {
          return b.timestamp - a.timestamp;
        }
        if (sortBy === 'highest') {
          return b.rating - a.rating;
        }
        if (sortBy === 'lowest') {
          return a.rating - b.rating;
        }
        return 0;
      });
  }, [reviews, selectedStarFilter, searchQuery, sortBy]);

  // Toggle Read More
  const toggleExpand = (id) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Copy Feedback
  const handleCopyFeedback = (rev) => {
    const textToCopy = `"${rev.comment}" — ${rev.customer} (${rev.rating}★ on ${rev.service})`;
    navigator.clipboard.writeText(textToCopy);
    if (toast) {
      toast.success('Customer review copied to clipboard.', 'Copied');
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStarFilter('ALL');
    setSortBy('recent');
  };

  return (
    <div className="portal-page">
      {/* Page Header */}
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">Customer Reviews & Reputation</h1>
          <p className="portal-page-subtitle">
            Understand your field performance, customer feedback, and build marketplace trust with every completed job.
          </p>
        </div>

        <div className="portal-status-toggle-wrap">
          <div className="status-indicator-dot">
            <span className="status-dot online"></span>
            <span className="status-text">Top 5% Rated Partner</span>
          </div>
        </div>
      </div>

      {/* 4 Aligned Rating Summary KPI Cards */}
      <div className="reviews-kpi-grid">
        {/* Card 1: Average Rating */}
        <div className="review-kpi-card highlight-emerald">
          <div className="review-kpi-header">
            <span className="review-kpi-label">Average Rating</span>
            <div className="review-kpi-icon-wrap amber">
              <Star size={18} fill="#D97706" color="#D97706" />
            </div>
          </div>
          <div className="review-kpi-metric-row">
            <span className="review-kpi-val">{averageRating}</span>
            <span className="review-kpi-val-sub">/ 5.0</span>
          </div>
          <p className="review-kpi-footer">
            <span className="text-emerald-700 font-bold">★★★★★</span>
            <span>Lifetime satisfaction score</span>
          </p>
        </div>

        {/* Card 2: Total Reviews */}
        <div className="review-kpi-card">
          <div className="review-kpi-header">
            <span className="review-kpi-label">Total Reviews</span>
            <div className="review-kpi-icon-wrap">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="review-kpi-metric-row">
            <span className="review-kpi-val">{totalReviewsCount}</span>
            <span className="review-kpi-val-sub">Verified</span>
          </div>
          <p className="review-kpi-footer">
            <CheckCircle2 size={13} className="text-emerald-700 inline" />
            <span>100% verified post-job feedback</span>
          </p>
        </div>

        {/* Card 3: 5-Star Reviews */}
        <div className="review-kpi-card">
          <div className="review-kpi-header">
            <span className="review-kpi-label">Five-Star Reviews</span>
            <div className="review-kpi-icon-wrap amber">
              <Award size={18} />
            </div>
          </div>
          <div className="review-kpi-metric-row">
            <span className="review-kpi-val">{fiveStarPercentage}%</span>
            <span className="review-kpi-val-sub">({fiveStarCount} of {reviews.length})</span>
          </div>
          <p className="review-kpi-footer">
            <ThumbsUp size={13} className="text-emerald-700 inline" />
            <span>Highest rating proportion</span>
          </p>
        </div>

        {/* Card 4: Recent Performance / Quality */}
        <div className="review-kpi-card">
          <div className="review-kpi-header">
            <span className="review-kpi-label">Quality Score</span>
            <div className="review-kpi-icon-wrap">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="review-kpi-metric-row">
            <span className="review-kpi-val">{positiveSentimentRate}%</span>
            <span className="review-kpi-val-sub">Positive</span>
          </div>
          <p className="review-kpi-footer">
            <ShieldCheck size={13} className="text-emerald-700 inline" />
            <span>Top tier NCR partner ranking</span>
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="reviews-main-layout">
        {/* Left Column: Toolbar + Review Cards Feed */}
        <div>
          {/* Toolbar & Filters */}
          <div className="reviews-toolbar-card">
            {/* Search and Sort Row */}
            <div className="reviews-search-row">
              <div className="reviews-search-wrap">
                <Search size={16} className="reviews-search-icon" />
                <input
                  type="text"
                  className="reviews-search-input"
                  placeholder="Search customer, service, booking ref, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="reviews-search-clear"
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="reviews-sort-wrap">
                <SlidersHorizontal size={15} className="text-slate-400" />
                <label htmlFor="reviewSortSelect" className="reviews-sort-label">Sort by:</label>
                <select
                  id="reviewSortSelect"
                  className="reviews-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rated (5★ → 1★)</option>
                  <option value="lowest">Lowest Rated (1★ → 5★)</option>
                </select>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="reviews-filter-pills">
              <button
                type="button"
                className={`review-filter-pill ${selectedStarFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedStarFilter('ALL')}
              >
                All Reviews
                <span className="review-pill-count">{reviews.length}</span>
              </button>

              <button
                type="button"
                className={`review-filter-pill ${selectedStarFilter === '5' ? 'active' : ''}`}
                onClick={() => setSelectedStarFilter('5')}
              >
                <Star size={13} fill={selectedStarFilter === '5' ? '#FFFFFF' : '#D97706'} color={selectedStarFilter === '5' ? '#FFFFFF' : '#D97706'} />
                5-Star
                <span className="review-pill-count">{ratingDistribution[5]}</span>
              </button>

              <button
                type="button"
                className={`review-filter-pill ${selectedStarFilter === '4' ? 'active' : ''}`}
                onClick={() => setSelectedStarFilter('4')}
              >
                <Star size={13} fill={selectedStarFilter === '4' ? '#FFFFFF' : '#D97706'} color={selectedStarFilter === '4' ? '#FFFFFF' : '#D97706'} />
                4-Star
                <span className="review-pill-count">{ratingDistribution[4]}</span>
              </button>

              <button
                type="button"
                className={`review-filter-pill ${selectedStarFilter === '3_BELOW' ? 'active' : ''}`}
                onClick={() => setSelectedStarFilter('3_BELOW')}
              >
                3-Star & Below
                <span className="review-pill-count">
                  {(ratingDistribution[3] || 0) + (ratingDistribution[2] || 0) + (ratingDistribution[1] || 0)}
                </span>
              </button>

              {(searchQuery || selectedStarFilter !== 'ALL') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-red-600 hover:text-red-800 ml-auto flex items-center gap-1 cursor-pointer"
                >
                  <X size={13} /> Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Review Cards Feed */}
          {filteredReviews.length === 0 ? (
            /* Professional Empty State */
            <div className="reviews-empty-state-card">
              <div className="reviews-empty-icon">
                <MessageSquare size={28} />
              </div>
              <h3 className="reviews-empty-title">No Reviews Found</h3>
              <p className="reviews-empty-desc">
                No customer ratings match your current search filters. Try adjusting your search query or reset the star filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="profile-btn profile-btn-primary"
                style={{ display: 'inline-flex', width: 'auto' }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="reviews-feed-container">
              {filteredReviews.map((rev) => {
                const isExpanded = expandedReviews[rev.id];
                const isLong = rev.comment.length > 130;
                const displayText = isLong && !isExpanded
                  ? `${rev.comment.slice(0, 130)}...`
                  : rev.comment;

                return (
                  <div key={rev.id} className="review-card-item">
                    {/* Header Row */}
                    <div className="review-card-header">
                      <div className="review-customer-profile">
                        <div className="review-avatar-squircle">
                          {rev.avatarInitials}
                        </div>
                        <div className="review-customer-meta">
                          <div className="review-customer-name-row">
                            <h4 className="review-customer-name">{rev.customer}</h4>
                            {rev.verified && (
                              <span className="review-verified-tag">
                                <ShieldCheck size={11} /> Verified Customer
                              </span>
                            )}
                          </div>
                          <span className="review-date-sub">Reviewed on {rev.date}</span>
                        </div>
                      </div>

                      {/* Star Rating Box */}
                      <div className="review-rating-score-box" aria-label={`${rev.rating} out of 5 stars`}>
                        <div className="review-stars-display">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              fill={s <= rev.rating ? '#D97706' : 'none'}
                              color={s <= rev.rating ? '#D97706' : '#D1D5DB'}
                            />
                          ))}
                        </div>
                        <span className="review-score-num">{rev.rating}.0</span>
                      </div>
                    </div>

                    {/* Service & Location Row */}
                    <div className="review-service-badge-bar">
                      <span className="review-service-pill">
                        <Briefcase size={12} />
                        {rev.service}
                      </span>
                      <span className="review-location-pill">
                        <MapPin size={12} className="text-emerald-700" />
                        {rev.locality}
                      </span>
                    </div>

                    {/* Review Comment Quote */}
                    <div className="review-comment-quote-box">
                      "{displayText}"
                      {isLong && (
                        <button
                          type="button"
                          onClick={() => toggleExpand(rev.id)}
                          className="review-expand-btn"
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>

                    {/* Footer Row */}
                    <div className="review-card-footer">
                      <div className="review-booking-ref-badge">
                        Booking Ref: <strong>{rev.bookingRef}</strong>
                      </div>

                      <div className="review-card-actions">
                        <button
                          type="button"
                          onClick={() => handleCopyFeedback(rev)}
                          className="review-action-btn-sm"
                          title="Copy customer review"
                        >
                          <Copy size={12} />
                          Copy Review
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedReviewModal(rev)}
                          className="review-action-btn-sm"
                        >
                          View Details
                        </button>

                        <Link
                          to={`/technician/bookings`}
                          className="review-action-btn-sm text-emerald-800 font-bold"
                          title="View booking order details"
                        >
                          View Job
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Rating Distribution & Performance Insights */}
        <div>
          {/* Rating Distribution Breakdown Card */}
          <div className="rating-breakdown-card">
            <div className="rating-breakdown-header">
              <span>Rating Distribution</span>
              <span className="text-xs text-[var(--emerald-ink)] font-bold">
                {reviews.length} Ratings
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingDistribution[star] || 0;
                const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                const isActive = (selectedStarFilter === String(star)) || (star <= 3 && selectedStarFilter === '3_BELOW');

                return (
                  <div
                    key={star}
                    role="button"
                    tabIndex={0}
                    aria-label={`Filter by ${star} star reviews: ${count} reviews (${pct}%)`}
                    className={`rating-bar-row ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedStarFilter(selectedStarFilter === String(star) ? 'ALL' : String(star))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedStarFilter(selectedStarFilter === String(star) ? 'ALL' : String(star));
                      }
                    }}
                  >
                    <span className="rating-star-label">
                      {star} <Star size={12} fill="#D97706" color="#D97706" />
                    </span>

                    <div
                      className="rating-progress-track"
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="rating-progress-fill"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>

                    <span className="rating-count-label">
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Insights Panel */}
          <div className="performance-insights-card">
            <div className="performance-insights-header">
              <TrendingUp size={18} className="text-emerald-700" />
              Your Performance Insights
            </div>

            <div className="insight-metric-item">
              <span className="insight-metric-title">30-Day Quality Score</span>
              <span className="insight-metric-value text-emerald-800">4.9 / 5.0</span>
            </div>

            <div className="insight-metric-item">
              <span className="insight-metric-title">Positive Sentiment</span>
              <span className="insight-metric-value text-emerald-800">{positiveSentimentRate}%</span>
            </div>

            <div className="insight-metric-item">
              <span className="insight-metric-title">Most Reviewed Service</span>
              <span className="insight-metric-value text-right text-xs max-w-[150px] truncate" title={mostReviewedService}>
                {mostReviewedService}
              </span>
            </div>

            <div className="insight-metric-item">
              <span className="insight-metric-title">On-Time Arrival Rate</span>
              <span className="insight-metric-value text-emerald-800">99.4%</span>
            </div>

            <div className="insight-metric-item">
              <span className="insight-metric-title">Customer Repeat Rate</span>
              <span className="insight-metric-value text-emerald-800">42%</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 mt-4 text-xs text-emerald-900 leading-relaxed">
              💡 <strong>Pro Reputation Tip:</strong> Arriving within 10 minutes of appointment start time increases 5-star ratings by over 28%.
            </div>
          </div>
        </div>
      </div>

      {/* Review Detail Modal Popup */}
      {selectedReviewModal && (
        <div
          className="review-modal-backdrop"
          onClick={() => setSelectedReviewModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="review-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <MessageSquare size={20} className="text-emerald-800" />
                <h3 className="font-primary font-bold text-lg text-[var(--text-primary)]">
                  Verified Customer Review
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReviewModal(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="review-avatar-squircle" style={{ width: '38px', height: '38px', fontSize: '0.9rem' }}>
                  {selectedReviewModal.avatarInitials}
                </div>
                <div>
                  <h4 className="font-primary font-bold text-sm text-[var(--text-primary)]">
                    {selectedReviewModal.customer}
                  </h4>
                  <span className="text-xs text-slate-400">
                    {selectedReviewModal.locality} · {selectedReviewModal.date}
                  </span>
                </div>
              </div>

              <div className="review-rating-score-box">
                <div className="review-stars-display">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      fill={s <= selectedReviewModal.rating ? '#D97706' : 'none'}
                      color={s <= selectedReviewModal.rating ? '#D97706' : '#D1D5DB'}
                    />
                  ))}
                </div>
                <span className="review-score-num">{selectedReviewModal.rating}.0</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-sm text-slate-800 leading-relaxed italic">
              "{selectedReviewModal.comment}"
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 block mb-0.5">Service Rendered</span>
                <strong className="text-slate-800">{selectedReviewModal.service}</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 block mb-0.5">Booking Reference</span>
                <strong className="text-emerald-800 font-mono">{selectedReviewModal.bookingRef}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleCopyFeedback(selectedReviewModal)}
                className="profile-btn profile-btn-secondary"
                style={{ minHeight: '38px', padding: '0.4rem 1rem', fontSize: '0.82rem' }}
              >
                <Copy size={14} /> Copy Feedback
              </button>
              <button
                type="button"
                onClick={() => setSelectedReviewModal(null)}
                className="profile-btn profile-btn-primary"
                style={{ minHeight: '38px', padding: '0.4rem 1.25rem', fontSize: '0.82rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
