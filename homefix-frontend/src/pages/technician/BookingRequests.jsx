import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Check,
  AlertCircle,
  Phone,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingApi } from '../../services/api';
import ProblemImageGallery from '../../components/booking/ProblemImageGallery';
import './TechnicianPortal.css';
import './BookingRequests.css';

const REJECTION_REASONS = [
  'Schedule conflict / Already on another job',
  'Location is outside my service coverage area',
  'Requires specialized heavy machinery/parts unavailable today',
  'Personal emergency / Off duty',
  'Other'
];

export default function BookingRequests() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Reject modal state
  const [rejectingJob, setRejectingJob] = useState(null);
  const [rejectReason, setRejectReason] = useState(REJECTION_REASONS[0]);
  const [rejectNotes, setRejectNotes] = useState('');
  const [isRejectSubmitting, setIsRejectSubmitting] = useState(false);

  // Expand/collapse description tracker: { [jobId]: boolean }
  const [expandedDesc, setExpandedDesc] = useState({});

  const toggleExpandDesc = (jobId) => {
    setExpandedDesc((prev) => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        const data = await bookingApi.getTechnicianBookings(currentUser?.id || 1);
        const pending = (data || []).filter((b) => b.status === 'Requested');
        setRequests(pending);
      } catch (err) {
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRequests();
  }, [currentUser]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAccept = async (job) => {
    try {
      setActionLoadingId(job.id);
      await bookingApi.updateStatus(job.id, 'Accepted', 'Accepted by partner');
      setRequests((prev) => prev.filter((r) => r.id !== job.id));
      showToast(`Success! Job ${job.bookingReference || job.id} accepted. Added to your Schedule & My Jobs.`);
    } catch (err) {
      console.error(err);
      alert('Unable to accept job. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenRejectModal = (job) => {
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
      setRequests((prev) => prev.filter((r) => r.id !== rejectingJob.id));
      showToast(`Request ${rejectingJob.bookingReference || rejectingJob.id} was declined.`);
      setRejectingJob(null);
    } catch (err) {
      console.error(err);
      alert('Failed to decline request.');
    } finally {
      setIsRejectSubmitting(false);
    }
  };

  return (
    <div className="requests-page-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="requests-toast" role="status" aria-live="polite">
          <CheckCircle2 size={18} color="#A7F3D0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header Banner */}
      <header className="requests-header-banner">
        <div className="requests-header-left">
          <h1 className="requests-page-title">New Service Requests</h1>
          <p className="requests-page-subtitle">
            Inspect customer diagnostic notes, review uploaded 3:4 problem photographs, and accept dispatch appointments.
          </p>
        </div>
        <div className="requests-counter-badge">
          <span className="pulse-dot"></span>
          <span>{requests.length} {requests.length === 1 ? 'Request Awaiting Decision' : 'Requests Awaiting Decision'}</span>
        </div>
      </header>

      {/* Content Area */}
      {loading ? (
        <div className="requests-loading-card">
          <div className="requests-spinner"></div>
          <p>Loading incoming dispatch requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="requests-empty-card">
          <div className="empty-check-icon">
            <Check size={28} />
          </div>
          <h3 className="requests-empty-title">You're All Caught Up!</h3>
          <p className="requests-empty-desc">
            No new service requests are waiting for your response. Check your Schedule to review confirmed assignments.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/technician/schedule" className="btn-accept-request text-decoration-none">
              View Work Schedule
            </Link>
            <Link to="/technician/bookings" className="actions-left-link">
              My Active Jobs
            </Link>
          </div>
        </div>
      ) : (
        <div className="requests-stack">
          {requests.map((job) => {
            const isExpanded = !!expandedDesc[job.id];
            const desc = job.problemDescription || '';
            const shouldTruncate = desc.length > 175;
            const displayDesc = shouldTruncate && !isExpanded ? `${desc.slice(0, 175)}...` : desc;
            const isSubmitting = actionLoadingId === job.id;

            return (
              <article key={job.id} className="request-detail-block" aria-label={`Request ${job.bookingReference || job.id}`}>
                {/* ==========================================================
                    A. REQUEST SUMMARY HEADER
                    ========================================================== */}
                <header className="request-summary-header">
                  <div className="summary-header-left">
                    <div className="summary-tags-row">
                      <span className="category-tag">
                        {job.serviceCategory || job.serviceName || 'Home Maintenance'}
                      </span>
                      <span className="new-lead-tag">
                        ⚡ New Dispatch Lead
                      </span>
                    </div>

                    <h2 className="request-problem-title">
                      {job.problemTitle || `${job.serviceCategory || 'Home'} Service Request`}
                    </h2>

                    <div className="summary-schedule-row">
                      <span className="summary-schedule-item">
                        <Calendar size={14} color="#064E3B" />
                        <strong>{job.appointmentDate || job.scheduledDate || 'Flexible / Today'}</strong>
                      </span>
                      <span className="summary-schedule-item">
                        <Clock size={14} color="#064E3B" />
                        <span>{job.appointmentTime || job.scheduledTimeSlot || '10:00 AM - 12:00 PM'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="summary-header-right">
                    <span className="request-ref-pill" title="Unique Booking Reference">
                      #{job.bookingReference || job.id}
                    </span>
                    <div className="request-fee-box">
                      <span className="request-fee-label">Guaranteed Visiting Fee</span>
                      <span className="request-fee-amount">
                        ₹{job.pricing?.visitingCharge || 199}
                      </span>
                    </div>
                  </div>
                </header>

                {/* ==========================================================
                    REQUEST BODY: B, C, D CARDS
                    ========================================================== */}
                <div className="request-detail-body">
                  {/* --------------------------------------------------------
                      B. CUSTOMER INFORMATION CARD
                      -------------------------------------------------------- */}
                  <section className="request-section-card" aria-label="Customer & Service Location Information">
                    <div className="section-card-header">
                      <h3 className="section-card-title">
                        <User size={15} />
                        <span>Customer & Location Information</span>
                      </h3>
                      {job.customer?.phone && (
                        <span className="info-sub font-mono flex items-center gap-1">
                          <Phone size={12} />
                          {job.customer.phone}
                        </span>
                      )}
                    </div>

                    <div className="customer-info-grid">
                      <div className="info-item-box">
                        <span className="info-label">
                          <User size={12} /> Customer Name
                        </span>
                        <span className="info-value">
                          {job.customer?.name || 'HomeFix Customer'}
                        </span>
                        {job.customer?.email && (
                          <span className="info-sub truncate">{job.customer.email}</span>
                        )}
                      </div>

                      <div className="info-item-box">
                        <span className="info-label">
                          <MapPin size={12} /> Service Locality
                        </span>
                        <span className="info-value">
                          {job.customer?.locality || job.address?.locality || 'Sector 62'}
                        </span>
                        <span className="info-sub">
                          {job.customer?.city || job.address?.city || 'Noida'}, {job.address?.postalCode || 'NCR'}
                        </span>
                      </div>

                      <div className="info-item-box">
                        <span className="info-label">
                          <Home size={12} /> Service Address
                        </span>
                        <span className="info-value">
                          {job.address?.street || 'Provided upon booking acceptance'}
                        </span>
                        {job.address?.label && (
                          <span className="info-sub">{job.address.label} Property</span>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* --------------------------------------------------------
                      C. PROBLEM DESCRIPTION CARD
                      -------------------------------------------------------- */}
                  <section className="request-section-card" aria-label="Customer Problem Description">
                    <div className="section-card-header">
                      <h3 className="section-card-title">
                        <FileText size={15} />
                        <span>Customer Problem Description</span>
                      </h3>
                    </div>

                    <div className="problem-desc-content">
                      <p className="problem-desc-text">
                        "{displayDesc || 'No diagnostic notes provided by the customer.'}"
                      </p>

                      {shouldTruncate && (
                        <button
                          type="button"
                          className="desc-expand-btn"
                          onClick={() => toggleExpandDesc(job.id)}
                        >
                          {isExpanded ? (
                            <>
                              <span>Collapse description</span>
                              <ChevronUp size={14} />
                            </>
                          ) : (
                            <>
                              <span>Show full description</span>
                              <ChevronDown size={14} />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </section>

                  {/* --------------------------------------------------------
                      D. CUSTOMER PROBLEM PHOTOS CARD (3:4 Passport Aspect Ratio)
                      -------------------------------------------------------- */}
                  <section className="request-photos-card" aria-label="Customer Problem Photos">
                    <ProblemImageGallery
                      images={job.problemImages || []}
                      title="Customer Problem Photos"
                      helperText="Review the photos before accepting the request."
                      emptyMessage="No problem photos attached."
                    />
                  </section>
                </div>

                {/* ==========================================================
                    E. REQUEST ACTIONS BAR
                    ========================================================== */}
                <footer className="request-actions-bar">
                  <Link
                    to={`/technician/bookings/${job.id}`}
                    className="actions-left-link"
                    title="Open full job details page"
                  >
                    <span>View Full Job Details & Pricing</span>
                    <ExternalLink size={14} />
                  </Link>

                  <div className="actions-right-buttons">
                    <button
                      type="button"
                      className="btn-reject-request"
                      onClick={() => handleOpenRejectModal(job)}
                      disabled={isSubmitting}
                      title="Decline this service request"
                    >
                      <XCircle size={16} />
                      <span>Reject Request</span>
                    </button>

                    <button
                      type="button"
                      className="btn-accept-request"
                      onClick={() => handleAccept(job)}
                      disabled={isSubmitting}
                      title="Claim and accept this service request"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="requests-spinner" style={{ width: 14, height: 14, borderWidth: 2 }}></div>
                          <span>Accepting...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Accept Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </footer>
              </article>
            );
          })}
        </div>
      )}

      {/* ====================================================================
          Reject Confirmation Dialog Modal
          ==================================================================== */}
      {rejectingJob && (
        <div
          className="reject-modal-backdrop"
          onClick={() => !isRejectSubmitting && setRejectingJob(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-dialog-title"
        >
          <div className="reject-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="reject-modal-header">
              <h3 id="reject-dialog-title" className="reject-modal-title">
                <AlertCircle size={18} />
                <span>Decline Service Request</span>
              </h3>
              <button
                type="button"
                className="reject-modal-close"
                onClick={() => setRejectingJob(null)}
                disabled={isRejectSubmitting}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="reject-modal-body">
              <p className="reject-lead-text">
                Are you sure you want to decline request <strong>#{rejectingJob.bookingReference || rejectingJob.id}</strong> ({rejectingJob.problemTitle || rejectingJob.serviceCategory})?
              </p>
              <p className="reject-warning-text">
                Declining will release this job back to the regional dispatch pool so another nearby partner can accept it.
              </p>

              <div className="reject-form-group">
                <label htmlFor="rejectReasonSelect" className="reject-label">
                  Reason for Declining:
                </label>
                <select
                  id="rejectReasonSelect"
                  className="reject-select"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  disabled={isRejectSubmitting}
                >
                  {REJECTION_REASONS.map((r, i) => (
                    <option key={i} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="reject-form-group">
                <label htmlFor="rejectNotesTextarea" className="reject-label">
                  Additional Note (Optional):
                </label>
                <textarea
                  id="rejectNotesTextarea"
                  className="reject-textarea"
                  rows="3"
                  placeholder="E.g., Fully booked during the requested afternoon window..."
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  disabled={isRejectSubmitting}
                />
              </div>
            </div>

            <div className="reject-modal-footer">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setRejectingJob(null)}
                disabled={isRejectSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-modal-confirm-reject"
                disabled={isRejectSubmitting}
                onClick={handleConfirmReject}
              >
                {isRejectSubmitting ? 'Declining...' : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
