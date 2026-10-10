import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CalendarDays,
  Wrench,
  CheckCircle2,
  XCircle,
  Search,
  X,
  MapPin,
  Clock,
  Phone,
  User,
  Wallet,
  Camera,
  Eye,
  ArrowRight,
  Check,
  Calendar,
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingApi } from '../../services/api';
import './TechnicianPortal.css';

export default function TechnicianBookings() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-nearest');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Modal states
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await bookingApi.getTechnicianBookings(currentUser?.id || 1);
        setBookings(data || []);
      } catch (err) {
        console.error('Error loading technician bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleQuickTransition = async (jobId, nextStatus) => {
    try {
      setActionLoadingId(jobId);
      await bookingApi.updateStatus(jobId, nextStatus, `Updated status to ${nextStatus}`);
      setBookings((prev) =>
        prev.map((b) => (b.id === jobId ? { ...b, status: nextStatus } : b))
      );
      if (selectedJobForDetails?.id === jobId) {
        setSelectedJobForDetails((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }
      showToast(`Job ${jobId} updated to "${nextStatus}" successfully.`);
    } catch (err) {
      alert('Failed to update job status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Exclude unaccepted "Requested" leads since those belong in "New Job Requests"
  const partnerJobs = bookings.filter((b) => b.status !== 'Requested');
  const pendingRequestsCount = bookings.filter((b) => b.status === 'Requested').length;

  const upcomingCount = partnerJobs.filter((b) => ['Accepted', 'Scheduled'].includes(b.status)).length;
  const inProgressCount = partnerJobs.filter((b) => ['On the Way', 'In Progress'].includes(b.status)).length;
  const completedCount = partnerJobs.filter((b) => b.status === 'Completed').length;
  const cancelledCount = partnerJobs.filter((b) => b.status === 'Cancelled').length;

  // Filter & Search Logic
  const filtered = partnerJobs
    .filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (b.id && b.id.toLowerCase().includes(q)) ||
        (b.bookingReference && b.bookingReference.toLowerCase().includes(q)) ||
        (b.serviceCategory && b.serviceCategory.toLowerCase().includes(q)) ||
        (b.problemTitle && b.problemTitle.toLowerCase().includes(q)) ||
        (b.customer?.name && b.customer.name.toLowerCase().includes(q)) ||
        (b.customer?.locality && b.customer.locality.toLowerCase().includes(q)) ||
        (b.address?.locality && b.address.locality.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (filterStatus === 'upcoming') {
        return ['Accepted', 'Scheduled'].includes(b.status);
      }
      if (filterStatus === 'inprogress') {
        return ['On the Way', 'In Progress'].includes(b.status);
      }
      if (filterStatus === 'completed') {
        return b.status === 'Completed';
      }
      if (filterStatus === 'cancelled') {
        return b.status === 'Cancelled';
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date-nearest') {
        return new Date(a.scheduledDate || a.createdAt || '2026-10-11') - new Date(b.scheduledDate || b.createdAt || '2026-10-11');
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt || '2026-10-11') - new Date(a.createdAt || '2026-10-11');
      }
      if (sortBy === 'payout-highest') {
        const payoutA = a.pricing?.technicianPayout || (a.pricing?.total ? Math.round(a.pricing.total * 0.9) : 450);
        const payoutB = b.pricing?.technicianPayout || (b.pricing?.total ? Math.round(b.pricing.total * 0.9) : 450);
        return payoutB - payoutA;
      }
      return 0;
    });

  return (
    <div className="portal-page my-jobs-page">
      {toastMessage && (
        <div className="portal-toast" role="status">
          <Check size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Professional Page Header */}
      <header className="portal-page-header">
        <div>
          <h1 className="portal-page-title">My Jobs</h1>
          <p className="portal-page-subtitle">
            Manage requests, appointments, and completed work.
          </p>
        </div>
        <Link to="/technician/requests" className="portal-btn portal-btn-outline portal-btn-sm flex items-center gap-2">
          <span>Check New Requests</span>
          {pendingRequestsCount > 0 && (
            <span className="portal-pill-count bg-[var(--secondary)] text-white">
              {pendingRequestsCount}
            </span>
          )}
          <ArrowRight size={14} />
        </Link>
      </header>

      {/* 4 Interactive Summary / KPI Cards */}
      <section className="my-jobs-summary-grid" aria-label="Job Status Summary">
        <div
          className={`my-jobs-summary-card ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-info">
            <span className="kpi-label">All Jobs</span>
            <span className="kpi-metric">{partnerJobs.length}</span>
            <span className="kpi-subtext">Assigned portfolio</span>
          </div>
          <div className="kpi-icon-wrap emerald">
            <Briefcase size={22} />
          </div>
        </div>

        <div
          className={`my-jobs-summary-card ${filterStatus === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilterStatus('upcoming')}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-info">
            <span className="kpi-label">Upcoming / Accepted</span>
            <span className="kpi-metric">{upcomingCount}</span>
            <span className="kpi-subtext">On route schedule</span>
          </div>
          <div className="kpi-icon-wrap champagne">
            <CalendarDays size={22} />
          </div>
        </div>

        <div
          className={`my-jobs-summary-card ${filterStatus === 'inprogress' ? 'active' : ''}`}
          onClick={() => setFilterStatus('inprogress')}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-info">
            <span className="kpi-label">In Progress</span>
            <span className="kpi-metric">{inProgressCount}</span>
            <span className="kpi-subtext">Transit & on-site</span>
          </div>
          <div className="kpi-icon-wrap blue">
            <Wrench size={22} />
          </div>
        </div>

        <div
          className={`my-jobs-summary-card ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-info">
            <span className="kpi-label">Completed</span>
            <span className="kpi-metric">{completedCount}</span>
            <span className="kpi-subtext">Finished & billed</span>
          </div>
          <div className="kpi-icon-wrap purple">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </section>

      {/* Filter and Search Toolbar */}
      <section className="portal-filters-toolbar" aria-label="Job Filters and Search">
        <div className="portal-filter-tabs-row">
          <div className="portal-status-pills">
            <button
              type="button"
              className={`portal-filter-pill ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              <span>All Jobs</span>
              <span className="portal-pill-count">{partnerJobs.length}</span>
            </button>
            <button
              type="button"
              className={`portal-filter-pill ${filterStatus === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilterStatus('upcoming')}
            >
              <span>Upcoming</span>
              <span className="portal-pill-count">{upcomingCount}</span>
            </button>
            <button
              type="button"
              className={`portal-filter-pill ${filterStatus === 'inprogress' ? 'active' : ''}`}
              onClick={() => setFilterStatus('inprogress')}
            >
              <span>In Progress</span>
              <span className="portal-pill-count">{inProgressCount}</span>
            </button>
            <button
              type="button"
              className={`portal-filter-pill ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              <span>Completed</span>
              <span className="portal-pill-count">{completedCount}</span>
            </button>
            <button
              type="button"
              className={`portal-filter-pill ${filterStatus === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilterStatus('cancelled')}
            >
              <span>Cancelled</span>
              <span className="portal-pill-count">{cancelledCount}</span>
            </button>
          </div>

          <div className="portal-sort-wrap">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Sort:</span>
            <select
              className="portal-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort jobs by"
            >
              <option value="date-nearest">Nearest Appointment</option>
              <option value="newest">Newest First</option>
              <option value="payout-highest">Highest Payout</option>
            </select>
          </div>
        </div>

        <div className="portal-search-sort-row">
          <div className="portal-search-wrap">
            <Search size={16} className="portal-search-icon" />
            <input
              type="text"
              className="portal-search-input"
              placeholder="Search by booking reference, service category, customer name, problem or locality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="portal-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      {loading ? (
        <div className="portal-loading">
          <div className="portal-spinner"></div>
          <p>Loading assigned service jobs...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="portal-empty-state">
          <div className="empty-icon">
            <Briefcase size={36} className="text-[var(--secondary)] mx-auto" />
          </div>
          <h3 className="empty-title">No jobs match these filters.</h3>
          <p className="empty-desc">
            Try adjusting your search keywords or switching status tabs to see your assignments.
          </p>
          {(filterStatus !== 'all' || searchQuery) && (
            <button
              type="button"
              className="portal-btn portal-btn-outline portal-btn-sm mt-3"
              onClick={() => {
                setFilterStatus('all');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="my-jobs-grid">
          {filtered.map((job) => {
            const visitingFee = job.pricing?.visitingCharge || 199;
            const labor = job.pricing?.repairLabor || 350;
            const materials = job.pricing?.materialCharge || 120;
            const total = Number(visitingFee) + Number(labor) + Number(materials);
            const payout = job.pricing?.technicianPayout || Math.round(total * 0.9);

            return (
              <article key={job.id} className="my-job-card" aria-label={`Job ${job.bookingReference || job.id}`}>
                {/* Card Top Row */}
                <div className="my-job-card-header">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge-category">{job.serviceCategory || 'Home Repair'}</span>
                      <span className="job-ref-tag font-mono">{job.bookingReference || job.id}</span>
                    </div>
                    <h3 className="my-job-title">
                      {job.problemTitle || `${job.serviceCategory} Service`}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className={`status-pill status-${job.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                      {job.status}
                    </span>
                  </div>
                </div>

                {/* Structured 4-Column Metadata Grid */}
                <div className="my-job-meta-grid">
                  <div className="my-job-meta-item">
                    <span className="my-job-meta-label">
                      <User size={13} />
                      <span>Customer</span>
                    </span>
                    <span className="my-job-meta-val font-semibold">
                      {job.customer?.name || 'HomeFix Client'}
                    </span>
                    <span className="text-[0.72rem] text-[var(--text-muted)] flex items-center gap-1">
                      <Phone size={11} />
                      <span>{job.customer?.phone || '+91 98765 43210'}</span>
                    </span>
                  </div>

                  <div className="my-job-meta-item">
                    <span className="my-job-meta-label">
                      <Clock size={13} />
                      <span>Appointment Slot</span>
                    </span>
                    <span className="my-job-meta-val font-semibold">
                      {job.scheduledDate || 'Today'}
                    </span>
                    <span className="text-[0.72rem] text-[var(--text-muted)]">
                      {job.scheduledTimeSlot || '10:00 AM - 12:00 PM'}
                    </span>
                  </div>

                  <div className="my-job-meta-item">
                    <span className="my-job-meta-label">
                      <MapPin size={13} />
                      <span>Service Location</span>
                    </span>
                    <span className="my-job-meta-val">
                      {job.customer?.locality || job.address?.locality || 'Indirapuram'}
                    </span>
                    <span className="text-[0.72rem] text-[var(--text-muted)]">
                      {job.customer?.city || 'Delhi NCR'}
                    </span>
                  </div>

                  <div className="my-job-meta-item">
                    <span className="my-job-meta-label">
                      <Wallet size={13} />
                      <span>Est. Tech Payout</span>
                    </span>
                    <span className="my-job-meta-val payout-val">
                      ₹{payout.toLocaleString()}
                    </span>
                    <span className="text-[0.7rem] text-[var(--text-muted)]">
                      After 10% platform fee
                    </span>
                  </div>
                </div>

                {/* Problem Description Snippet */}
                {job.problemDescription && (
                  <p className="my-job-desc-snippet line-clamp-2">
                    "{job.problemDescription}"
                  </p>
                )}

                {/* Customer Attached Photos */}
                {job.problemImages && job.problemImages.length > 0 && (
                  <div className="tech-request-photos-row">
                    {job.problemImages.slice(0, 3).map((imgUrl, imgIdx) => (
                      <img
                        key={imgIdx}
                        src={imgUrl}
                        alt="Customer diagnostic evidence"
                        className="tech-photo-thumb"
                        onClick={() => setActiveLightboxImg(imgUrl)}
                        title="Click to enlarge customer photo"
                      />
                    ))}
                    <span className="job-photos-attached-badge">
                      <Camera size={13} />
                      <span>{job.problemImages.length} {job.problemImages.length === 1 ? 'photo' : 'photos'} attached</span>
                    </span>
                  </div>
                )}

                {/* Action Area */}
                <div className="my-job-card-footer">
                  <div className="tech-action-btn-group">
                    {job.status === 'Accepted' && (
                      <button
                        type="button"
                        className="portal-btn portal-btn-primary portal-btn-sm"
                        disabled={actionLoadingId === job.id}
                        onClick={() => handleQuickTransition(job.id, 'On the Way')}
                      >
                        <span>🚗 Mark On the Way</span>
                      </button>
                    )}
                    {job.status === 'On the Way' && (
                      <button
                        type="button"
                        className="portal-btn portal-btn-primary portal-btn-sm"
                        disabled={actionLoadingId === job.id}
                        onClick={() => handleQuickTransition(job.id, 'In Progress')}
                      >
                        <span>🔧 Start Job</span>
                      </button>
                    )}
                    {job.status === 'In Progress' && (
                      <button
                        type="button"
                        className="portal-btn portal-btn-primary portal-btn-sm bg-emerald-700 hover:bg-emerald-800"
                        disabled={actionLoadingId === job.id}
                        onClick={() => handleQuickTransition(job.id, 'Completed')}
                      >
                        <span>✓ Complete Job</span>
                      </button>
                    )}
                    {job.status === 'Completed' && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 inline-flex items-center gap-1.5">
                        <CheckCircle2 size={14} />
                        <span>Job Completed & Billed</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="portal-btn portal-btn-outline portal-btn-sm"
                      onClick={() => setSelectedJobForDetails(job)}
                    >
                      <Eye size={14} />
                      <span>View Job Details</span>
                    </button>
                    <Link
                      to={`/technician/bookings/${job.id}`}
                      className="portal-btn portal-btn-ghost portal-btn-sm text-[var(--emerald-ink)]"
                      title="Open full page"
                    >
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------------
          JOB DETAILS MODAL / DRAWER
          ------------------------------------------------------------------ */}
      {selectedJobForDetails && (
        <div className="portal-modal-backdrop" onClick={() => setSelectedJobForDetails(null)}>
          <div className="portal-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="portal-modal-header">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge-category">{selectedJobForDetails.serviceCategory}</span>
                  <span className="job-ref-tag font-mono">{selectedJobForDetails.bookingReference || selectedJobForDetails.id}</span>
                </div>
                <h3 className="portal-modal-title">
                  {selectedJobForDetails.problemTitle || `${selectedJobForDetails.serviceCategory} Inspection`}
                </h3>
              </div>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setSelectedJobForDetails(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="portal-modal-body">
              {/* Customer Diagnostic Problem */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1 flex items-center gap-1.5">
                  <FileText size={14} />
                  <span>Customer Issue & Notes</span>
                </h4>
                <div className="p-3 bg-[var(--surface-raised)] border border-[var(--champagne-border)] rounded-xl text-sm text-[var(--text-primary)]">
                  {selectedJobForDetails.problemDescription || 'No detailed problem notes provided by customer.'}
                </div>
              </div>

              {/* Uploaded Photos Gallery */}
              {selectedJobForDetails.problemImages && selectedJobForDetails.problemImages.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
                    <Camera size={14} />
                    <span>Customer-Uploaded Photographs ({selectedJobForDetails.problemImages.length})</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedJobForDetails.problemImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Evidence ${idx + 1}`}
                        className="w-full h-20 rounded-lg object-cover border border-[var(--champagne-border)] cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setActiveLightboxImg(img)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Appointment & Customer Address */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-[var(--border-light)] rounded-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1 flex items-center gap-1">
                    <Clock size={12} />
                    <span>Appointment</span>
                  </span>
                  <div className="text-sm font-bold text-[var(--emerald-ink)]">
                    {selectedJobForDetails.scheduledDate || 'Today'}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {selectedJobForDetails.scheduledTimeSlot || '10:00 AM - 12:00 PM'}
                  </div>
                </div>

                <div className="p-3 bg-white border border-[var(--border-light)] rounded-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1 flex items-center gap-1">
                    <User size={12} />
                    <span>Customer & Contact</span>
                  </span>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    {selectedJobForDetails.customer?.name || 'HomeFix Customer'}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    📞 {selectedJobForDetails.customer?.phone || '+91 98765 43210'}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">
                    📍 {selectedJobForDetails.customer?.locality || selectedJobForDetails.address?.locality || 'Noida'}
                  </div>
                </div>
              </div>

              {/* Financial & Payout Summary */}
              <div className="p-3.5 bg-[var(--emerald-subtle)] border border-[rgba(6,78,59,0.2)] rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--emerald-ink)]">
                    Financial Breakdown
                  </span>
                  <span className="text-sm font-extrabold text-[var(--emerald-ink)]">
                    Status: {selectedJobForDetails.paymentStatus || 'Pending Settlement'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs border-t border-[rgba(6,78,59,0.15)] pt-2">
                  <div>
                    <span className="text-[var(--text-muted)] block">Visiting Fee</span>
                    <span className="font-bold">₹{selectedJobForDetails.pricing?.visitingCharge || 199}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block">Estimated Labor</span>
                    <span className="font-bold">₹{selectedJobForDetails.pricing?.repairLabor || 350}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block">Net Partner Payout</span>
                    <span className="font-extrabold text-[var(--emerald-ink)] text-sm">
                      ₹{(selectedJobForDetails.pricing?.technicianPayout || 495).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="portal-modal-footer">
              <Link
                to={`/technician/bookings/${selectedJobForDetails.id}`}
                className="portal-btn portal-btn-outline portal-btn-sm"
              >
                <span>Full Diagnostics Page →</span>
              </Link>
              {selectedJobForDetails.status === 'Accepted' && (
                <button
                  type="button"
                  className="portal-btn portal-btn-primary portal-btn-sm"
                  disabled={actionLoadingId === selectedJobForDetails.id}
                  onClick={() => handleQuickTransition(selectedJobForDetails.id, 'On the Way')}
                >
                  <span>Mark On the Way</span>
                </button>
              )}
              {selectedJobForDetails.status === 'On the Way' && (
                <button
                  type="button"
                  className="portal-btn portal-btn-primary portal-btn-sm"
                  disabled={actionLoadingId === selectedJobForDetails.id}
                  onClick={() => handleQuickTransition(selectedJobForDetails.id, 'In Progress')}
                >
                  <span>Start Job</span>
                </button>
              )}
              {selectedJobForDetails.status === 'In Progress' && (
                <button
                  type="button"
                  className="portal-btn portal-btn-primary portal-btn-sm bg-emerald-700 hover:bg-emerald-800"
                  disabled={actionLoadingId === selectedJobForDetails.id}
                  onClick={() => handleQuickTransition(selectedJobForDetails.id, 'Completed')}
                >
                  <span>Complete Job</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          PHOTO LIGHTBOX MODAL
          ------------------------------------------------------------------ */}
      {activeLightboxImg && (
        <div className="tech-lightbox-backdrop" onClick={() => setActiveLightboxImg(null)}>
          <div className="tech-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="tech-lightbox-close"
              onClick={() => setActiveLightboxImg(null)}
              aria-label="Close photo preview"
            >
              <X size={22} />
            </button>
            <img
              src={activeLightboxImg}
              alt="Full resolution preview"
              className="tech-lightbox-img"
            />
            <div className="tech-lightbox-caption">
              Customer Uploaded Diagnostic Evidence
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
