import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DEMO_BOOKINGS } from '../../data/bookings';
import { bookingApi } from '../../services/api';
import BookingTimeline from '../../components/booking/BookingTimeline';
import './TechnicianPortal.css';

const STATUS_PROGRESSION_STEPS = [
  'Requested',
  'Accepted',
  'Scheduled',
  'On the Way',
  'In Progress',
  'Completed',
  'Cancelled'
];

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('Accepted');
  const [repairLabor, setRepairLabor] = useState(350);
  const [materialCharge, setMaterialCharge] = useState(150);
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Lightbox modal state for customer uploaded photographs
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);
        const data = await bookingApi.getBookingById(id);
        const found = data || DEMO_BOOKINGS.find((b) => b.id === id || b.bookingReference === id) || DEMO_BOOKINGS[0];
        setJob(found);
        setCurrentStatus(found?.status || 'Accepted');
        setRepairLabor(found?.pricing?.repairLabor || 350);
        setMaterialCharge(found?.pricing?.materialCharge || 120);
      } catch (err) {
        console.error('Error loading job details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [id]);

  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeLightboxImg) {
        setActiveLightboxImg(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxImg]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (loading) {
    return (
      <div className="portal-page">
        <div className="portal-loading">
          <div className="portal-spinner"></div>
          <p>Loading full job record & diagnostics...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="portal-page">
        <div className="portal-empty-state">
          <div className="empty-icon">⚠️</div>
          <h3 className="empty-title">Job Record Not Found</h3>
          <p className="empty-desc">No service dispatch record found matching reference #{id}.</p>
          <Link to="/technician/bookings" className="portal-btn portal-btn-primary mt-3">
            Back to Assigned Jobs
          </Link>
        </div>
      </div>
    );
  }

  const visitingFee = job.pricing?.visitingCharge || 199;
  const calculatedTotal = Number(visitingFee) + Number(repairLabor) + Number(materialCharge);
  const platformFee = Math.round(calculatedTotal * 0.10);
  const technicianPayout = calculatedTotal - platformFee;

  // Open Lightbox at index
  const openLightbox = (index) => {
    if (job.problemImages && job.problemImages[index]) {
      setLightboxIndex(index);
      setActiveLightboxImg(job.problemImages[index]);
    }
  };

  // Quick State Action button (e.g. Mark On the Way, Start Job, Complete Job)
  const handleQuickTransition = async (nextStatus) => {
    setIsUpdating(true);
    try {
      await bookingApi.updateStatus(job.id, nextStatus, `Status transitioned to ${nextStatus} by technician.`);
      setJob((prev) => ({ ...prev, status: nextStatus }));
      setCurrentStatus(nextStatus);
      showToast(`Job updated: Marked as ${nextStatus}!`);
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Save Quotation & Status
  const handleSaveQuotation = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await bookingApi.updateStatus(job.id, currentStatus, statusNote || 'Quotation & progress updated');
      setJob((prev) => ({
        ...prev,
        status: currentStatus,
        pricing: {
          ...prev.pricing,
          visitingCharge: visitingFee,
          repairLabor: Number(repairLabor),
          materialCharge: Number(materialCharge),
          customerTotal: calculatedTotal,
          platformFee: platformFee,
          technicianPayout: technicianPayout
        }
      }));
      showToast('Quotation and job status successfully saved!');
    } catch (err) {
      alert('Failed to save quotation.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="portal-page">
      {toastMessage && (
        <div className="portal-toast">
          ✓ {toastMessage}
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="portal-breadcrumb-bar">
        <Link to="/technician/bookings" className="breadcrumb-back-link">
          ← Back to My Jobs
        </Link>
        <div className="flex items-center gap-2">
          <span className={`status-pill status-${job.status?.toLowerCase().replace(/\s+/g, '-')}`}>
            Status: {job.status}
          </span>
          <span className={`status-pill ${job.paymentStatus === 'Paid' ? 'status-completed' : 'status-requested'}`}>
            Payment: {job.paymentStatus || 'Pending Settlement'}
          </span>
        </div>
      </div>

      {/* Main Job Container */}
      <div className="portal-section-card">
        {/* Job Header */}
        <div className="job-details-header">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-category">{job.serviceCategory || job.serviceName || 'Home Repair'}</span>
              <span className="booking-ref font-mono">{job.bookingReference || job.id}</span>
            </div>
            <h1 className="job-header-title font-serif">
              {job.problemTitle || `${job.serviceCategory} Service`}
            </h1>
          </div>

          <div className="job-header-payout-box">
            <span className="payout-label">Your Estimated Net Payout</span>
            <div className="payout-amount font-serif">₹{technicianPayout.toLocaleString()}</div>
            <span className="payout-subtext">(Customer Total: ₹{calculatedTotal} - 10% platform fee)</span>
          </div>
        </div>

        {/* Quick Action Progression Bar */}
        <div className="quick-transition-banner">
          <span className="quick-transition-label">Quick Actions:</span>
          <div className="quick-transition-btns">
            {job.status === 'Accepted' && (
              <button
                type="button"
                className="portal-btn portal-btn-primary portal-btn-sm"
                disabled={isUpdating}
                onClick={() => handleQuickTransition('On the Way')}
              >
                🚗 Mark "On the Way"
              </button>
            )}
            {job.status === 'On the Way' && (
              <button
                type="button"
                className="portal-btn portal-btn-primary portal-btn-sm"
                disabled={isUpdating}
                onClick={() => handleQuickTransition('In Progress')}
              >
                🔧 Start Repair ("In Progress")
              </button>
            )}
            {job.status === 'In Progress' && (
              <button
                type="button"
                className="portal-btn portal-btn-primary portal-btn-sm"
                disabled={isUpdating}
                onClick={() => handleQuickTransition('Completed')}
              >
                ✓ Complete Job & Submit Invoice
              </button>
            )}
            {job.status === 'Completed' && (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg">
                ✓ Job Fulfilled and Completed
              </span>
            )}
          </div>
        </div>

        {/* Lifecycle Progress Timeline */}
        <div className="job-lifecycle-wrap">
          <h4 className="lifecycle-heading">Service Lifecycle Stage</h4>
          <BookingTimeline currentStatus={job.status} />
        </div>

        {/* 2-Column Details Body */}
        <div className="portal-grid-2col mt-6">
          {/* Left Column: Customer Details, Address, Problem Notes & Photos */}
          <div className="flex flex-col gap-5">
            {/* Customer Details Card */}
            <div className="details-info-box">
              <h3 className="box-title">👤 Customer Information</h3>
              <div className="info-grid-2">
                <div>
                  <span className="info-k">Full Name</span>
                  <p className="info-v font-semibold">{job.customer?.name || 'HomeFix Customer'}</p>
                </div>
                <div>
                  <span className="info-k">Contact Phone</span>
                  <p className="info-v">
                    <a href={`tel:${job.customer?.phone || '+91 98765 43210'}`} className="phone-link">
                      📞 {job.customer?.phone || '+91 98765 43210'}
                    </a>
                  </p>
                </div>
              </div>

              <div className="address-block mt-3">
                <span className="info-k">Service Address & Landmark</span>
                <p className="address-text">
                  📍 {job.address?.street || 'Flat 402, Tower B, Green Valley'}, {job.customer?.locality || job.address?.locality || 'Indirapuram'}, {job.customer?.city || job.address?.city || 'Noida'} - {job.address?.postalCode || '201014'}
                </p>
              </div>

              <div className="slot-block mt-3">
                <span className="info-k">Scheduled Appointment Slot</span>
                <p className="slot-text">
                  📅 {job.scheduledDate || 'Today'} · ⏰ {job.scheduledTimeSlot || '10:00 AM - 12:00 PM'}
                </p>
              </div>
            </div>

            {/* Problem Description Box */}
            <div className="details-info-box">
              <h3 className="box-title">📝 Customer Problem Notes</h3>
              <p className="problem-notes-quote">
                "{job.problemDescription || 'Customer did not specify additional diagnostic notes.'}"
              </p>
            </div>

            {/* Customer-Uploaded Problem Photographs Gallery (Section 9) */}
            <div className="details-info-box">
              <div className="flex justify-between items-center mb-3">
                <h3 className="box-title mb-0">📷 Customer-Uploaded Problem Photographs</h3>
                <span className="text-xs text-[var(--color-text-muted)] font-semibold">
                  {job.problemImages?.length || 0} {job.problemImages?.length === 1 ? 'image attached' : 'images attached'}
                </span>
              </div>

              {job.problemImages && job.problemImages.length > 0 ? (
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-3">
                    Click any thumbnail below to inspect the full high-resolution image in the lightbox gallery.
                  </p>
                  <div className="photo-gallery-grid">
                    {job.problemImages.map((imgUrl, idx) => (
                      <div 
                        key={idx} 
                        className="gallery-thumbnail-card"
                        onClick={() => openLightbox(idx)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Open problem photo ${idx + 1}`}
                      >
                        <img 
                          src={imgUrl} 
                          alt={`Customer problem upload ${idx + 1}`} 
                          className="gallery-img"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500'; }}
                        />
                        <div className="gallery-hover-overlay">
                          <span>🔍 Enlarge Photo #{idx + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="no-photos-box">
                  <span className="no-photos-icon">🖼️</span>
                  <p className="no-photos-text">No diagnostic photographs were attached for this booking.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Pricing Breakdown & Quote Editor */}
          <div className="flex flex-col gap-5">
            {/* Quotation & Lifecycle Status Form */}
            <form onSubmit={handleSaveQuotation} className="details-info-box pricing-editor-card">
              <h3 className="box-title">💼 Job Progress & Quotation Breakdown</h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">
                Update job status and specify itemized charges for customer review and final invoice settlement.
              </p>

              {/* Status Selector */}
              <div className="form-group mb-4">
                <label className="form-label font-semibold text-xs block mb-1">Update Status Stage:</label>
                <select
                  className="portal-select w-full"
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                >
                  {STATUS_PROGRESSION_STEPS.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Itemized Pricing Inputs */}
              <div className="pricing-items-stack">
                <div className="pricing-row-read">
                  <span className="price-k">Doorstep Visiting Fee (Fixed)</span>
                  <span className="price-v font-bold">₹{visitingFee}</span>
                </div>

                <div className="form-group">
                  <label className="form-label font-semibold text-xs block mb-1">
                    Repair Labor Charge (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    className="portal-input w-full"
                    value={repairLabor}
                    onChange={(e) => setRepairLabor(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label font-semibold text-xs block mb-1">
                    Materials / Spare Parts (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    className="portal-input w-full"
                    value={materialCharge}
                    onChange={(e) => setMaterialCharge(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Financial Calculation Box */}
              <div className="payout-breakdown-box">
                <div className="breakdown-line">
                  <span>Gross Customer Charge:</span>
                  <span className="font-bold text-[var(--color-text-main)]">₹{calculatedTotal}</span>
                </div>
                <div className="breakdown-line text-xs text-[var(--color-text-muted)]">
                  <span>Less Platform Fee (10%):</span>
                  <span>- ₹{platformFee}</span>
                </div>
                <div className="breakdown-line font-bold text-base text-[var(--color-primary)] border-t border-[var(--color-border-champagne)] pt-2 mt-2">
                  <span>Net Technician Payout:</span>
                  <span className="font-serif text-lg">₹{technicianPayout}</span>
                </div>
              </div>

              {/* Technician Notes */}
              <div className="form-group mt-4">
                <label className="form-label font-semibold text-xs block mb-1">
                  Service Notes / Work Performed:
                </label>
                <textarea
                  rows="3"
                  className="portal-textarea w-full"
                  placeholder="E.g., Replaced 1/2-inch brass washer valve, tested water flow and pressure."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="portal-btn portal-btn-primary w-full mt-4"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving Changes...' : '💾 Save Quotation & Status'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Lightbox Modal (Section 9) */}
      {activeLightboxImg && (
        <div 
          className="portal-lightbox-backdrop" 
          onClick={() => setActiveLightboxImg(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged Problem Photograph"
        >
          <div className="portal-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <span className="lightbox-title">
                Problem Photograph ({lightboxIndex + 1} of {job.problemImages.length})
              </span>
              <button 
                className="lightbox-close-btn" 
                onClick={() => setActiveLightboxImg(null)}
                aria-label="Close Lightbox (Esc)"
              >
                ✕ Close (Esc)
              </button>
            </div>
            <div className="lightbox-img-wrap">
              <img 
                src={activeLightboxImg} 
                alt="Problem full view" 
                className="lightbox-full-img"
              />
            </div>
            {job.problemImages.length > 1 && (
              <div className="lightbox-nav-footer">
                <button
                  type="button"
                  className="portal-btn portal-btn-ghost portal-btn-sm"
                  onClick={() => {
                    const prevIdx = (lightboxIndex - 1 + job.problemImages.length) % job.problemImages.length;
                    setLightboxIndex(prevIdx);
                    setActiveLightboxImg(job.problemImages[prevIdx]);
                  }}
                >
                  ← Previous Image
                </button>
                <button
                  type="button"
                  className="portal-btn portal-btn-ghost portal-btn-sm"
                  onClick={() => {
                    const nextIdx = (lightboxIndex + 1) % job.problemImages.length;
                    setLightboxIndex(nextIdx);
                    setActiveLightboxImg(job.problemImages[nextIdx]);
                  }}
                >
                  Next Image →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
