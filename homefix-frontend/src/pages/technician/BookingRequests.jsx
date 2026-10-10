import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      alert('Failed to decline request.');
    } finally {
      setIsRejectSubmitting(false);
    }
  };

  return (
    <div className="portal-page">
      {toastMessage && (
        <div className="portal-toast">
          ✓ {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">New Job Requests</h1>
          <p className="portal-page-subtitle">
            Inspect customer diagnostic notes, review uploaded problem photographs, and accept dispatch appointments.
          </p>
        </div>
        <div className="portal-badge-counter">
          {requests.length} {requests.length === 1 ? 'Job Awaiting Decision' : 'Jobs Awaiting Decision'}
        </div>
      </div>

      {loading ? (
        <div className="portal-loading">
          <div className="portal-spinner"></div>
          <p>Loading incoming dispatch requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="portal-empty-state">
          <div className="empty-icon">✓</div>
          <h3 className="empty-title">You're all caught up!</h3>
          <p className="empty-desc">
            No new job requests waiting for your response. Check your Schedule to review confirmed assignments.
          </p>
          <div className="mt-4 flex gap-3 justify-center">
            <Link to="/technician/schedule" className="portal-btn portal-btn-primary">
              View Work Schedule
            </Link>
            <Link to="/technician/bookings" className="portal-btn portal-btn-outline">
              My Active Jobs
            </Link>
          </div>
        </div>
      ) : (
        <div className="request-cards-stack">
          {requests.map((job) => (
            <div key={job.id} className="job-request-card">
              <div className="job-card-top">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge-category">{job.serviceCategory || 'Home Repair'}</span>
                    <span className="badge-new-lead">New Lead</span>
                  </div>
                  <h2 className="job-problem-title font-serif">
                    {job.problemTitle || `${job.serviceCategory} Service`}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="job-ref-tag">{job.bookingReference || job.id}</span>
                  <div className="text-xs text-[var(--color-text-muted)] mt-1">Visiting Fee: <strong className="text-[var(--color-primary)]">₹{job.pricing?.visitingCharge || 199}</strong></div>
                </div>
              </div>

              <div className="job-card-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Customer Name</span>
                  <span className="meta-val font-semibold">{job.customer?.name || 'HomeFix Customer'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Service Locality</span>
                  <span className="meta-val">📍 {job.customer?.locality || job.address?.locality || 'Sector 62'}, {job.customer?.city || job.address?.city || 'Noida'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Requested Date</span>
                  <span className="meta-val">📅 {job.scheduledDate || 'Flexible / Today'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Preferred Time Slot</span>
                  <span className="meta-val">⏰ {job.scheduledTimeSlot || '10:00 AM - 12:00 PM'}</span>
                </div>
              </div>

              {job.problemDescription && (
                <div className="job-problem-box">
                  <span className="box-label">Customer Problem Description:</span>
                  <p className="box-text">"{job.problemDescription}"</p>
                </div>
              )}

              {/* Uploaded Customer Photos Thumbnail Strip */}
              {job.problemImages && job.problemImages.length > 0 && (
                <div className="job-photos-preview-strip">
                  <span className="photos-strip-title">
                    📷 {job.problemImages.length} Customer Problem {job.problemImages.length === 1 ? 'Photo' : 'Photos'} Attached:
                  </span>
                  <div className="photos-thumbs-row">
                    {job.problemImages.map((imgUrl, idx) => (
                      <Link 
                        key={idx} 
                        to={`/technician/bookings/${job.id}`}
                        title="Click to inspect full high-resolution image"
                        className="photo-thumb-wrap"
                      >
                        <img 
                          src={imgUrl} 
                          alt={`Problem detail ${idx + 1}`} 
                          className="photo-thumb-img"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400'; }}
                        />
                        <span className="photo-zoom-hint">🔍 Zoom</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="job-card-actions">
                <Link to={`/technician/bookings/${job.id}`} className="portal-btn portal-btn-outline">
                  View Full Job Details & Pricing
                </Link>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="portal-btn portal-btn-ghost"
                    onClick={() => handleOpenRejectModal(job)}
                    disabled={actionLoadingId === job.id}
                  >
                    Reject Request
                  </button>
                  <button
                    type="button"
                    className="portal-btn portal-btn-primary"
                    disabled={actionLoadingId === job.id}
                    onClick={() => handleAccept(job)}
                  >
                    {actionLoadingId === job.id ? 'Accepting...' : '✓ Accept Job'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      {rejectingJob && (
        <div className="portal-modal-backdrop" onClick={() => !isRejectSubmitting && setRejectingJob(null)}>
          <div className="portal-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Decline Job Request</h3>
              <button 
                className="modal-close-btn"
                onClick={() => setRejectingJob(null)}
                disabled={isRejectSubmitting}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-lead">
                Are you sure you want to decline request <strong>{rejectingJob.bookingReference || rejectingJob.id}</strong> ({rejectingJob.problemTitle || rejectingJob.serviceCategory})?
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">
                This will release the request back to the dispatch pool so another nearby partner can be assigned.
              </p>

              <label className="form-label font-semibold text-xs block mb-1">
                Reason for Declining:
              </label>
              <select 
                className="portal-select w-full mb-3"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              >
                {REJECTION_REASONS.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
              </select>

              <label className="form-label font-semibold text-xs block mb-1">
                Additional Note (Optional):
              </label>
              <textarea
                className="portal-textarea w-full"
                rows="2"
                placeholder="E.g. Unavailable before 4 PM..."
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="portal-btn portal-btn-ghost"
                onClick={() => setRejectingJob(null)}
                disabled={isRejectSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="portal-btn portal-btn-danger"
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
