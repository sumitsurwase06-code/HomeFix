import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  CalendarDays,
  Wrench,
  Wallet,
  Clock,
  MapPin,
  Camera,
  Check,
  X,
  Eye,
  ArrowRight,
  ShieldCheck,
  Star,
  DollarSign,
  AlertCircle,
  Phone,
  User,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingApi } from '../../services/api';
import './TechnicianPortal.css';

const REJECTION_REASONS = [
  'Schedule conflict / Already on another job',
  'Location is outside my service coverage area',
  'Requires specialized heavy machinery/parts unavailable today',
  'Personal emergency / Off duty',
  'Other'
];

export default function TechnicianDashboard() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Modal states
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);
  const [rejectingJob, setRejectingJob] = useState(null);
  const [rejectReason, setRejectReason] = useState(REJECTION_REASONS[0]);
  const [rejectNotes, setRejectNotes] = useState('');
  const [isRejectSubmitting, setIsRejectSubmitting] = useState(false);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const data = await bookingApi.getTechnicianBookings(currentUser?.id || 1);
        setBookings(data || []);
      } catch (err) {
        console.error('Error fetching dashboard jobs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [currentUser]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAcceptRequest = async (jobId) => {
    try {
      setActionLoadingId(jobId);
      await bookingApi.updateStatus(jobId, 'Accepted', 'Accepted via Partner Quick Dashboard');
      setBookings((prev) =>
        prev.map((b) => (b.id === jobId ? { ...b, status: 'Accepted' } : b))
      );
      if (selectedJobForDetails?.id === jobId) {
        setSelectedJobForDetails(null);
      }
      showToast(`Job ${jobId} accepted successfully! Moved to your Schedule.`);
    } catch (err) {
      alert('Failed to accept request.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenRejectModal = (job, e) => {
    if (e) e.stopPropagation();
    setRejectingJob(job);
    setRejectReason(REJECTION_REASONS[0]);
    setRejectNotes('');
  };

  const handleConfirmReject = async () => {
    if (!rejectingJob) return;
    try {
      setIsRejectSubmitting(true);
      const note = `Declined by technician: ${rejectReason}${rejectNotes ? ` (${rejectNotes})` : ''}`;
      await bookingApi.updateStatus(rejectingJob.id, 'Cancelled', note);
      setBookings((prev) => prev.filter((b) => b.id !== rejectingJob.id));
      if (selectedJobForDetails?.id === rejectingJob.id) {
        setSelectedJobForDetails(null);
      }
      showToast(`Request ${rejectingJob.bookingReference || rejectingJob.id} was declined.`);
      setRejectingJob(null);
    } catch (err) {
      alert('Failed to decline request.');
    } finally {
      setIsRejectSubmitting(false);
    }
  };

  const handleToggleAvailability = () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    showToast(
      nextState
        ? 'Status updated: You are now Online and accepting job requests.'
        : 'Status updated: You are now Offline. No new dispatch alerts.'
    );
  };

  const newRequests = bookings.filter((b) => b.status === 'Requested');
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayJobs = bookings.filter(
    (b) =>
      ['Accepted', 'Scheduled', 'On the Way', 'In Progress'].includes(b.status) &&
      (b.scheduledDate === todayDateStr || !b.scheduledDate || b.scheduledDate === '2026-10-11' || b.scheduledDate === 'Today')
  );
  const inProgressJobs = bookings.filter((b) =>
    ['Accepted', 'On the Way', 'In Progress'].includes(b.status)
  );
  const completedJobs = bookings.filter((b) => b.status === 'Completed');

  // Derive net earnings from actual completed jobs + base ledger
  const totalNetEarnings = completedJobs.reduce((acc, b) => {
    if (b.pricing?.technicianPayout) return acc + b.pricing.technicianPayout;
    if (b.pricing?.total) return acc + Math.round(b.pricing.total * 0.9);
    return acc + 450;
  }, 3850);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = currentUser?.name || 'Rajesh';

  return (
    <div className="portal-page">
      {toastMessage && (
        <div className="portal-toast" role="status">
          <Check size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <header className="portal-page-header">
        <div>
          <h1 className="portal-page-title">
            {getGreeting()}, {displayName}
          </h1>
          <p className="portal-page-subtitle">
            Here is your workday at a glance.
          </p>
        </div>

        {/* Polished Availability Control */}
        <div className="portal-status-toggle-wrap">
          <div className="status-indicator-dot">
            <span className={`status-dot ${isAvailable ? 'online' : 'offline'}`}></span>
            <span className="status-text">
              {isAvailable ? 'Available for Jobs' : 'Offline / Unavailable'}
            </span>
          </div>
          <button
            type="button"
            className={`tech-avail-toggle-btn ${isAvailable ? 'online' : 'offline'}`}
            onClick={handleToggleAvailability}
            title={isAvailable ? 'Click to pause incoming requests' : 'Click to start accepting requests'}
          >
            {isAvailable ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </header>

      {/* 4 Compact KPI Metric Cards */}
      <section className="portal-kpi-grid" aria-label="Key Performance Metrics">
        <Link to="/technician/requests" className="kpi-card highlight-emerald">
          <div className="kpi-info">
            <span className="kpi-label">New Requests</span>
            <span className="kpi-metric">{newRequests.length}</span>
            <span className="kpi-subtext">Awaiting decision</span>
          </div>
          <div className="kpi-icon-wrap emerald">
            <Inbox size={22} />
          </div>
        </Link>

        <Link to="/technician/schedule" className="kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Today's Jobs</span>
            <span className="kpi-metric">{todayJobs.length}</span>
            <span className="kpi-subtext">Confirmed schedule</span>
          </div>
          <div className="kpi-icon-wrap champagne">
            <CalendarDays size={22} />
          </div>
        </Link>

        <Link to="/technician/bookings" className="kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">In Progress</span>
            <span className="kpi-metric">{inProgressJobs.length}</span>
            <span className="kpi-subtext">Active transit or repair</span>
          </div>
          <div className="kpi-icon-wrap blue">
            <Wrench size={22} />
          </div>
        </Link>

        <Link to="/technician/earnings" className="kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Net Earnings</span>
            <span className="kpi-metric">₹{totalNetEarnings.toLocaleString()}</span>
            <span className="kpi-subtext">After 10% platform fee</span>
          </div>
          <div className="kpi-icon-wrap purple">
            <Wallet size={22} />
          </div>
        </Link>
      </section>

      {loading ? (
        <div className="portal-loading">
          <div className="portal-spinner"></div>
          <p>Loading technician operations hub...</p>
        </div>
      ) : (
        <>
          {/* Main 2-Column Section: New Requests (Left) vs Today's Schedule (Right) */}
          <div className="portal-grid-2col">
            {/* Left: New Job Requests */}
            <section className="portal-section-card" aria-label="New Job Requests">
              <div className="section-card-header">
                <div>
                  <h2 className="section-title">
                    <Inbox size={20} className="text-[var(--emerald-medium)]" />
                    <span>New Job Requests</span>
                    {newRequests.length > 0 && (
                      <span className="tech-section-count">{newRequests.length}</span>
                    )}
                  </h2>
                  <p className="section-subtitle">
                    Review requests and decide which jobs to accept.
                  </p>
                </div>
                <Link to="/technician/requests" className="section-link">
                  <span>View All Requests</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {newRequests.length === 0 ? (
                <div className="portal-empty-state">
                  <div className="empty-icon">
                    <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                  </div>
                  <h3 className="empty-title">You're all caught up!</h3>
                  <p className="empty-desc">
                    New job requests from customers in your coverage area will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="request-cards-stack">
                  {newRequests.slice(0, 3).map((req) => (
                    <div key={req.id} className="job-request-card">
                      <div className="job-card-top">
                        <div>
                          <span className="badge-category">{req.serviceCategory || 'Home Repair'}</span>
                          <h3 className="job-problem-title">
                            {req.problemTitle || `${req.serviceCategory} Inspection`}
                          </h3>
                        </div>
                        <div className="tech-request-fee-box">
                          <span className="tech-request-fee-label">Visiting Fee</span>
                          <span className="tech-request-fee-val">₹{req.pricing?.visitingCharge || 199}</span>
                        </div>
                      </div>

                      {/* Meta information with Lucide icons */}
                      <div className="job-card-meta-grid">
                        <div className="tech-meta-item">
                          <Clock size={14} className="tech-meta-icon" />
                          <span>{req.scheduledDate || 'Today'} · {req.scheduledTimeSlot || '10:00 AM - 12:00 PM'}</span>
                        </div>
                        <div className="tech-meta-item">
                          <MapPin size={14} className="tech-meta-icon" />
                          <span>{req.customer?.locality || req.address?.locality || 'Noida'}, {req.customer?.city || 'NCR'}</span>
                        </div>
                        <div className="tech-meta-item">
                          <span className="job-ref-tag">{req.bookingReference || req.id}</span>
                        </div>
                      </div>

                      {req.problemDescription && (
                        <p className="job-card-desc line-clamp-2">
                          "{req.problemDescription}"
                        </p>
                      )}

                      {/* Problem Photos Preview */}
                      {req.problemImages && req.problemImages.length > 0 && (
                        <div className="tech-request-photos-row">
                          {req.problemImages.slice(0, 3).map((imgUrl, imgIdx) => (
                            <img
                              key={imgIdx}
                              src={imgUrl}
                              alt="Problem evidence"
                              className="tech-photo-thumb"
                              onClick={() => setActiveLightboxImg(imgUrl)}
                              title="Click to view full photo"
                            />
                          ))}
                          <span className="job-photos-attached-badge">
                            <Camera size={13} />
                            <span>{req.problemImages.length} {req.problemImages.length === 1 ? 'photo' : 'photos'}</span>
                          </span>
                        </div>
                      )}

                      {/* Card Actions */}
                      <div className="job-card-actions">
                        <button
                          type="button"
                          className="portal-btn portal-btn-outline portal-btn-sm"
                          onClick={() => setSelectedJobForDetails(req)}
                        >
                          <Eye size={14} />
                          <span>View Details</span>
                        </button>
                        <div className="tech-action-btn-group">
                          <button
                            type="button"
                            className="portal-btn portal-btn-ghost portal-btn-sm"
                            onClick={(e) => handleOpenRejectModal(req, e)}
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                          <button
                            type="button"
                            className="portal-btn portal-btn-primary portal-btn-sm"
                            disabled={actionLoadingId === req.id}
                            onClick={() => handleAcceptRequest(req.id)}
                          >
                            <Check size={14} />
                            <span>{actionLoadingId === req.id ? 'Accepting...' : 'Accept Job'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Right: Today's Schedule */}
            <section className="portal-section-card" aria-label="Today's Schedule">
              <div className="section-card-header">
                <div>
                  <h2 className="section-title">
                    <CalendarDays size={20} className="text-[var(--emerald-medium)]" />
                    <span>Today's Schedule</span>
                  </h2>
                  <p className="section-subtitle">Confirmed appointments itinerary</p>
                </div>
                <Link to="/technician/schedule" className="section-link">
                  <span>View Schedule</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {todayJobs.length === 0 ? (
                <div className="portal-empty-state">
                  <div className="empty-icon">
                    <CalendarDays size={32} className="text-[var(--secondary)] mx-auto" />
                  </div>
                  <h3 className="empty-title">No appointments scheduled for today.</h3>
                  <p className="empty-desc">
                    Your itinerary is clear. Accept incoming requests to fill your open slots.
                  </p>
                  <Link to="/technician/requests" className="portal-btn portal-btn-primary portal-btn-sm mt-3">
                    View Requests
                  </Link>
                </div>
              ) : (
                <div className="schedule-timeline-mini">
                  {todayJobs.map((job, idx) => (
                    <div key={job.id} className="timeline-mini-item">
                      <div className="mini-time-badge">
                        <span>{job.scheduledTimeSlot?.split('-')[0] || '10:00 AM'}</span>
                        <small>Stop #{idx + 1}</small>
                      </div>
                      <div className="mini-job-info">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-bold text-sm text-[var(--emerald-ink)] truncate">
                            {job.problemTitle || job.serviceCategory}
                          </h4>
                          <span className={`status-pill status-${job.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                            {job.status}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mt-1 truncate">
                          {job.customer?.name || 'Client'} · {job.customer?.locality || job.address?.locality || 'Noida'}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-mono text-[0.7rem] text-[var(--text-muted)]">
                            {job.bookingReference || job.id}
                          </span>
                          <Link
                            to={`/technician/bookings/${job.id}`}
                            className="text-xs font-semibold text-[var(--emerald-medium)] hover:underline flex items-center gap-1"
                          >
                            <span>Inspect Job</span>
                            <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Bottom Section: Active Jobs & Recent Activity */}
          <div className="portal-grid-2col mt-6">
            {/* Active Jobs */}
            <section className="portal-section-card" aria-label="Active Assigned Jobs">
              <div className="section-card-header">
                <div>
                  <h2 className="section-title">
                    <Wrench size={20} className="text-[var(--emerald-medium)]" />
                    <span>Active Jobs</span>
                  </h2>
                  <p className="section-subtitle">In transit or on-site service in progress</p>
                </div>
                <Link to="/technician/bookings" className="section-link">
                  <span>View All Jobs</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {inProgressJobs.length === 0 ? (
                <div className="portal-empty-state">
                  <div className="empty-icon">
                    <Wrench size={32} className="text-[var(--secondary)] mx-auto" />
                  </div>
                  <h3 className="empty-title">No active jobs right now</h3>
                  <p className="empty-desc">
                    When you accept requests or start appointments, active status tracking will appear here.
                  </p>
                </div>
              ) : (
                <div className="active-jobs-list">
                  {inProgressJobs.map((job) => (
                    <div key={job.id} className="active-job-item">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-mono text-xs font-bold text-[var(--emerald-ink)]">
                          {job.bookingReference || job.id}
                        </span>
                        <span className={`status-pill status-${job.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                          {job.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[var(--text-primary)] mb-1">
                        {job.problemTitle || job.serviceCategory}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] mb-3">
                        Customer: <strong>{job.customer?.name}</strong> · 📍 {job.customer?.locality || job.address?.locality || 'Noida'}
                      </p>
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/technician/bookings/${job.id}`}
                          className="portal-btn portal-btn-primary portal-btn-sm"
                        >
                          <span>Manage Progress & Billing</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Performance Summary & Activity Log */}
            <section className="portal-section-card" aria-label="Recent Activity">
              <div className="section-card-header">
                <div>
                  <h2 className="section-title">
                    <Star size={20} className="text-[var(--secondary)]" />
                    <span>Recent Partner Activity</span>
                  </h2>
                  <p className="section-subtitle">Audit trail of completed jobs and payouts</p>
                </div>
                <Link to="/technician/earnings" className="section-link">
                  <span>Full Ledger</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="activity-stream">
                <div className="activity-item">
                  <div className="activity-dot dot-success">
                    <Check size={13} />
                  </div>
                  <div className="activity-body">
                    <p className="activity-text">
                      Payout of <strong>₹1,850</strong> credited for Job <strong>HF-BK-7821</strong>
                    </p>
                    <span className="activity-time">2 hours ago · Bank Transfer</span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-dot dot-info">
                    <Star size={13} />
                  </div>
                  <div className="activity-body">
                    <p className="activity-text">
                      Received <strong>5.0 rating</strong> from Ananya Roy: <em>"Very quick and professional repair!"</em>
                    </p>
                    <span className="activity-time">Yesterday · Verified Client</span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-dot dot-warning">
                    <ShieldCheck size={13} />
                  </div>
                  <div className="activity-body">
                    <p className="activity-text">
                      Tier 1 Expert Partner status verified for 2026 service cycle
                    </p>
                    <span className="activity-time">System Verified</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </>
      )}

      {/* ------------------------------------------------------------------
          JOB DETAILS MODAL / DRAWER
          ------------------------------------------------------------------ */}
      {selectedJobForDetails && (
        <div className="portal-modal-backdrop" onClick={() => setSelectedJobForDetails(null)}>
          <div className="portal-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="portal-modal-header">
              <div>
                <span className="badge-category">{selectedJobForDetails.serviceCategory}</span>
                <h3 className="portal-modal-title">
                  {selectedJobForDetails.problemTitle || `${selectedJobForDetails.serviceCategory} Service`}
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
              {/* Problem Details */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Customer Problem Description
                </h4>
                <div className="p-3 bg-[var(--surface-raised)] border border-[var(--champagne-border)] rounded-xl text-sm text-[var(--text-primary)]">
                  {selectedJobForDetails.problemDescription || 'No diagnostic notes provided by customer.'}
                </div>
              </div>

              {/* Uploaded Photos */}
              {selectedJobForDetails.problemImages && selectedJobForDetails.problemImages.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
                    <Camera size={14} />
                    <span>Customer Uploaded Photographs ({selectedJobForDetails.problemImages.length})</span>
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
                  <span className="text-xs text-[var(--text-muted)] block mb-0.5">Appointment Window</span>
                  <div className="text-sm font-semibold text-[var(--emerald-ink)]">
                    {selectedJobForDetails.scheduledDate || 'Today'}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {selectedJobForDetails.scheduledTimeSlot || '10:00 AM - 12:00 PM'}
                  </div>
                </div>

                <div className="p-3 bg-white border border-[var(--border-light)] rounded-xl">
                  <span className="text-xs text-[var(--text-muted)] block mb-0.5">Service Location</span>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {selectedJobForDetails.customer?.locality || selectedJobForDetails.address?.locality || 'Indirapuram'}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {selectedJobForDetails.customer?.city || 'Delhi NCR'}
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="p-3.5 bg-[var(--emerald-subtle)] border border-[rgba(6,78,59,0.2)] rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--emerald-ink)]">
                    Guaranteed Visiting Fee
                  </span>
                  <span className="text-lg font-extrabold text-[var(--emerald-ink)]">
                    ₹{selectedJobForDetails.pricing?.visitingCharge || 199}
                  </span>
                </div>
                <p className="text-[0.75rem] text-[var(--text-secondary)] mt-1">
                  Additional labor and materials are billed post-inspection based on standard rate card.
                </p>
              </div>
            </div>

            <div className="portal-modal-footer">
              <button
                type="button"
                className="portal-btn portal-btn-ghost portal-btn-sm"
                onClick={() => {
                  const jobToReject = selectedJobForDetails;
                  setSelectedJobForDetails(null);
                  handleOpenRejectModal(jobToReject);
                }}
              >
                <X size={14} />
                <span>Reject Request</span>
              </button>
              <button
                type="button"
                className="portal-btn portal-btn-primary portal-btn-sm"
                disabled={actionLoadingId === selectedJobForDetails.id}
                onClick={() => handleAcceptRequest(selectedJobForDetails.id)}
              >
                <Check size={14} />
                <span>{actionLoadingId === selectedJobForDetails.id ? 'Accepting...' : 'Accept Job'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          REJECT CONFIRMATION MODAL
          ------------------------------------------------------------------ */}
      {rejectingJob && (
        <div className="portal-modal-backdrop" onClick={() => setRejectingJob(null)}>
          <div className="portal-modal-card max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="portal-modal-header">
              <h3 className="portal-modal-title flex items-center gap-2 text-red-800">
                <AlertCircle size={18} className="text-red-600" />
                <span>Decline Job Request</span>
              </h3>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setRejectingJob(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="portal-modal-body">
              <p className="text-sm text-[var(--text-secondary)]">
                Please select a reason for declining dispatch lead <strong>{rejectingJob.bookingReference || rejectingJob.id}</strong>:
              </p>

              <div className="flex flex-col gap-2">
                {REJECTION_REASONS.map((reason, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 bg-[var(--surface-raised)] border border-[var(--champagne-border)] rounded-lg text-xs font-medium text-[var(--text-primary)] cursor-pointer hover:border-[var(--emerald-medium)]"
                  >
                    <input
                      type="radio"
                      name="rejectReason"
                      value={reason}
                      checked={rejectReason === reason}
                      onChange={() => setRejectReason(reason)}
                      className="accent-[var(--emerald-ink)]"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              {rejectReason === 'Other' && (
                <input
                  type="text"
                  placeholder="Please specify reason..."
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  className="w-full p-2.5 text-xs border border-[var(--champagne-border)] rounded-lg focus:outline-none focus:border-[var(--emerald-medium)]"
                />
              )}
            </div>

            <div className="portal-modal-footer">
              <button
                type="button"
                className="portal-btn portal-btn-outline portal-btn-sm"
                onClick={() => setRejectingJob(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="portal-btn portal-btn-ghost portal-btn-sm bg-red-600 text-white hover:bg-red-700"
                disabled={isRejectSubmitting}
                onClick={handleConfirmReject}
              >
                {isRejectSubmitting ? 'Declining...' : 'Confirm Decline'}
              </button>
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
              alt="Full Preview"
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
