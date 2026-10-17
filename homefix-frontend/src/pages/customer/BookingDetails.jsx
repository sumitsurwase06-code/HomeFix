import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  Star,
  Phone,
  ExternalLink,
  Printer,
  AlertTriangle,
  Wrench,
  HelpCircle,
  DollarSign,
  Check,
  X,
  Info,
  History,
  Sparkles
} from 'lucide-react';
import { DEMO_BOOKINGS } from '../../data/bookings';
import { DEMO_TECHNICIANS } from '../../data/technicians';
import { paymentApi, bookingApi, priceChangeApi } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ErrorState from '../../components/common/ErrorState';
import BookingTimeline from '../../components/booking/BookingTimeline';
import './BookingDetails.css';

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find booking by ID or bookingReference
  const [booking, setBooking] = useState(() => {
    return (
      DEMO_BOOKINGS.find((b) => b.id === id || b.bookingReference === id) ||
      DEMO_BOOKINGS[0]
    );
  });

  // Modal states
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(false);

  // Price revision and approval states
  const [pendingProposal, setPendingProposal] = useState(null);
  const [proposalHistory, setProposalHistory] = useState([]);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isDeciding, setIsDeciding] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load authoritative booking and proposals on mount
  useEffect(() => {
    async function loadData() {
      try {
        const freshBooking = await bookingApi.getBookingById(id);
        if (freshBooking) {
          setBooking(freshBooking);
        }
      } catch (err) {
        console.warn('Using existing booking state', err);
      }

      try {
        const history = await priceChangeApi.getBookingHistory(id);
        setProposalHistory(history || []);
        const pending = (history || []).find((p) => p.status === 'PENDING_CUSTOMER_APPROVAL');
        setPendingProposal(pending || null);
      } catch (err) {
        console.warn('Could not load booking price proposals', err);
      }
    }
    loadData();

    const handlePriceChange = () => {
      loadData();
    };
    window.addEventListener('homefix:price_change_event', handlePriceChange);
    return () => window.removeEventListener('homefix:price_change_event', handlePriceChange);
  }, [id]);

  // Customer accepts price change proposal
  const handleConfirmAccept = async () => {
    if (!pendingProposal) return;
    setIsDeciding(true);
    try {
      const updated = await priceChangeApi.approveProposal(pendingProposal.id);
      // Atomically update approved charges on the active invoice
      setBooking((prev) => ({
        ...prev,
        pricing: {
          visitingCharge: updated.proposedVisitingCharge,
          repairLabor: updated.proposedLaborCharge,
          materialCharge: updated.proposedMaterialCharge,
          customerTotal: updated.proposedCustomerTotal,
          platformFee: updated.proposedPlatformFee,
          technicianPayout: updated.proposedTechnicianPayout,
        },
        statusHistory: [
          ...(prev.statusHistory || []),
          {
            status: prev.status,
            timestamp: new Date().toISOString(),
            note: `Customer approved revised charges: ₹${updated.originalCustomerTotal} → ₹${updated.proposedCustomerTotal}. New approved invoice active.`
          }
        ]
      }));

      setPendingProposal(null);
      setProposalHistory((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setIsAcceptModalOpen(false);
      showToast(`Revised quotation of ₹${updated.proposedCustomerTotal} approved! Active invoice updated.`);
    } catch (err) {
      console.error('Failed to accept proposal:', err);
      showToast(err.message || 'Failed to approve proposal.');
    } finally {
      setIsDeciding(false);
    }
  };

  // Customer declines price change proposal
  const handleConfirmReject = async () => {
    if (!pendingProposal) return;
    setIsDeciding(true);
    try {
      const updated = await priceChangeApi.rejectProposal(pendingProposal.id, rejectionReason.trim());
      setBooking((prev) => ({
        ...prev,
        statusHistory: [
          ...(prev.statusHistory || []),
          {
            status: prev.status,
            timestamp: new Date().toISOString(),
            note: `Customer declined proposed charge of ₹${updated.proposedCustomerTotal}.${rejectionReason ? ` Reason: "${rejectionReason.trim()}".` : ''} Previous approved quotation (₹${updated.originalCustomerTotal}) remains active.`
          }
        ]
      }));

      setPendingProposal(null);
      setProposalHistory((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setIsRejectModalOpen(false);
      setRejectionReason('');
      showToast(`Price revision declined. Previous approved quotation of ₹${booking.pricing.customerTotal} preserved.`);
    } catch (err) {
      console.error('Failed to reject proposal:', err);
      showToast(err.message || 'Failed to decline proposal.');
    } finally {
      setIsDeciding(false);
    }
  };

  // Lookup assigned technician full details
  const technician = useMemo(() => {
    if (!booking) return null;
    const matched = DEMO_TECHNICIANS.find((t) => t.id === booking.technicianId);
    return (
      matched || {
        id: booking.technicianId || 'TECH-101',
        name: booking.technicianName || 'Rajesh Kumar (Demo)',
        avatar: booking.technicianAvatar,
        title: 'Senior Certified Technician',
        category: booking.serviceId || 'General Maintenance',
        rating: 4.8,
        reviewsCount: 142,
        experience: '8 Years',
        status: 'Verified',
        phone: '+91 98765 43210',
        serviceArea: `${booking.address?.locality || 'Local Area'}, ${booking.address?.city || ''}`,
      }
    );
  }, [booking]);

  // Format date helpers
  const formattedCreatedDate = (() => {
    if (!booking?.createdAt) return '';
    try {
      return new Date(booking.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return booking.createdAt;
    }
  })();

  const formattedAppointmentDate = (() => {
    if (!booking?.appointmentDate) return '';
    try {
      const d = new Date(booking.appointmentDate + 'T00:00:00');
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return booking.appointmentDate;
    }
  })();

  if (!booking) {
    return (
      <div className="booking-details-page">
        <ErrorState
          title="Booking Not Found"
          message={`We could not locate booking reference "${id}".`}
          onRetry={() => navigate('/customer/bookings')}
          retryLabel="Back to All Bookings"
        />
      </div>
    );
  }

  // Handle mock payment
  const handlePayment = async () => {
    setIsPaying(true);
    try {
      await paymentApi.processMockPayment(booking.id, booking.pricing.customerTotal);
      setBooking((prev) => ({
        ...prev,
        paymentStatus: 'Paid',
      }));
      setPaymentSuccess(true);
      setTimeout(() => {
        setIsPayModalOpen(false);
        setPaymentSuccess(false);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPaying(false);
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    await bookingApi.updateStatus(booking.id, 'Cancelled', 'Cancelled by customer');
    setBooking((prev) => ({
      ...prev,
      status: 'Cancelled',
    }));
    setIsCancelModalOpen(false);
  };

  return (
    <div className="booking-details-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="details-floating-toast" role="status" aria-live="polite">
          <CheckCircle2 size={18} className="text-[var(--champagne)]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Action Bar */}
      <nav className="details-top-bar" aria-label="Booking breadcrumbs">
        <Link to="/customer/bookings" className="details-back-link">
          <ArrowLeft size={16} />
          <span>Back to My Bookings</span>
        </Link>

        <div className="details-top-actions">
          <button
            type="button"
            className="details-action-btn-sm"
            onClick={() => window.print()}
            title="Print or save booking receipt"
          >
            <Printer size={14} />
            <span>Print Receipt</span>
          </button>
        </div>
      </nav>

      {/* ====================================================================
          A. BOOKING HEADER CARD
          ==================================================================== */}
      <section className="booking-header-card" aria-label="Booking Overview Header">
        <div className="header-top-row">
          {/* Left Column: Reference, Service Title, Description */}
          <div className="header-title-col">
            <div className="reference-pill-group">
              <span className="reference-id-pill" title="Unique Booking Reference ID">
                #{booking.id}
              </span>
              <span className="reference-date-sub">
                Placed on {formattedCreatedDate}
              </span>
            </div>

            <h1 className="service-main-heading">{booking.serviceName}</h1>

            {booking.problemTitle && (
              <p className="service-problem-desc">{booking.problemTitle}</p>
            )}
          </div>

          {/* Right Column: Status Badges & Total Amount */}
          <div className="header-summary-col">
            <div className="header-badges-row">
              <StatusBadge status={booking.status} size="md" />
              <span
                className={`status-badge status-badge-md ${
                  booking.paymentStatus === 'Paid'
                    ? 'status-approved'
                    : 'status-warning'
                }`}
              >
                Payment: {booking.paymentStatus}
              </span>
            </div>

            <div className="header-total-amount-box">
              <span className="total-amount-label">Total Amount</span>
              <span className="total-amount-val">
                ₹{booking.pricing.customerTotal}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          B. SERVICE PROGRESS TIMELINE (Dedicated Card Below Header)
          ==================================================================== */}
      <section className="booking-timeline-card" aria-label="Service Progress Lifecycle">
        <div className="timeline-card-header">
          <div className="timeline-card-title-wrap">
            <div className="timeline-card-title-icon">
              <Clock size={16} />
            </div>
            <h2 className="timeline-card-heading">Service Progress & Status Tracker</h2>
          </div>

          <span className="timeline-status-hint">
            Current Stage: <strong>{booking.status}</strong>
          </span>
        </div>

        {/* Reusable timeline with completed, current, and upcoming stages */}
        <BookingTimeline currentStatus={booking.status} />
      </section>

      {/* ====================================================================
          C. MAIN DETAILS GRID (Left: Specs, Right: Financials & Actions)
          ==================================================================== */}
      <div className="details-main-grid">
        {/* ----------------- LEFT COLUMN ----------------- */}
        <div className="details-column">
          {/* 1. Professional Assigned Technician Card */}
          <article className="detail-card" aria-label="Assigned Technician Profile">
            <div className="detail-card-header">
              <div className="detail-card-title-group">
                <div className="detail-card-icon-box">
                  <User size={18} />
                </div>
                <h3 className="detail-card-title">Assigned Professional Technician</h3>
              </div>
              <span className="tech-id-chip">ID: {technician?.id}</span>
            </div>

            {/* Passport-style 3:4 aspect ratio photo + clean info beside */}
            <div className="technician-profile-layout">
              {/* Passport Photo (3:4 ratio, 120px x 160px) */}
              <div className="technician-photo-wrapper">
                {technician?.avatar && !imgLoadError ? (
                  <img
                    src={technician.avatar}
                    alt={technician.name}
                    className="technician-photo-img"
                    onError={() => setImgLoadError(true)}
                  />
                ) : (
                  <div className="technician-photo-fallback">
                    <span className="fallback-initials">
                      {technician?.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('') || 'TC'}
                    </span>
                    <User size={20} />
                  </div>
                )}
              </div>

              {/* Technician Info */}
              <div className="technician-info-grid">
                <div className="tech-name-badge-row">
                  <h4 className="tech-fullname">{technician?.name}</h4>
                </div>

                <p className="tech-specialization-text">
                  {technician?.title || 'Senior Certified Home Specialist'}
                </p>

                {/* Badges: Verified, Rating, Experience */}
                <div className="tech-badges-wrap">
                  <span className="tech-verified-pill" title="Government ID & Skill Verified">
                    <ShieldCheck size={13} />
                    <span>Verified Partner</span>
                  </span>

                  {technician?.rating && (
                    <span className="tech-rating-pill">
                      <Star size={12} className="fill-amber-500 text-amber-500" />
                      <span>{technician.rating}</span>
                      <span className="text-[10px] text-muted">
                        ({technician.reviewsCount || 45})
                      </span>
                    </span>
                  )}

                  {technician?.experience && (
                    <span className="tech-experience-pill">
                      <span>{technician.experience} Experience</span>
                    </span>
                  )}
                </div>

                {/* Location / Service Area */}
                {technician?.serviceArea && (
                  <div className="tech-meta-details-row">
                    <span className="tech-meta-detail-item">
                      <MapPin size={13} className="text-muted" />
                      <span>{technician.serviceArea}</span>
                    </span>
                  </div>
                )}

                {/* Contact & Profile Action Row */}
                <div className="tech-contact-action-row">
                  {technician?.phone && (
                    <a
                      href={`tel:${technician.phone}`}
                      className="tech-phone-btn"
                      title={`Call ${technician.name}`}
                    >
                      <Phone size={14} />
                      <span>{technician.phone}</span>
                    </a>
                  )}

                  {technician?.id && (
                    <Link
                      to={`/technicians/${technician.id}`}
                      className="tech-profile-link"
                    >
                      <span>View Full Profile</span>
                      <ExternalLink size={13} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* 2. Appointment Slot & Doorstep Location Card */}
          <article className="detail-card" aria-label="Appointment and Doorstep Location">
            <div className="detail-card-header">
              <div className="detail-card-title-group">
                <div className="detail-card-icon-box">
                  <Calendar size={18} />
                </div>
                <h3 className="detail-card-title">Appointment & Service Address</h3>
              </div>
            </div>

            {/* Date & Time Slot Grid */}
            <div className="appointment-grid">
              <div className="appointment-meta-box">
                <div className="appointment-meta-icon">
                  <Calendar size={18} />
                </div>
                <div className="appointment-meta-text">
                  <span className="appointment-meta-caption">Appointment Date</span>
                  <span className="appointment-meta-val">{formattedAppointmentDate}</span>
                </div>
              </div>

              <div className="appointment-meta-box">
                <div className="appointment-meta-icon">
                  <Clock size={18} />
                </div>
                <div className="appointment-meta-text">
                  <span className="appointment-meta-caption">Arrival Window</span>
                  <span className="appointment-meta-val">{booking.appointmentTime}</span>
                </div>
              </div>
            </div>

            {/* Doorstep Location Details */}
            <div className="location-address-box">
              <div className="location-icon-wrapper">
                <MapPin size={20} />
              </div>
              <div className="location-content-col">
                <div className="location-title-row">
                  <strong className="text-sm font-bold text-[var(--text-primary)]">
                    Service Doorstep Address
                  </strong>
                  {booking.address?.label && (
                    <span className="location-badge-pill">{booking.address.label}</span>
                  )}
                </div>
                <p className="location-address-text">
                  {booking.address?.street}, {booking.address?.locality},{' '}
                  {booking.address?.city} — {booking.address?.postalCode}
                </p>
              </div>
            </div>
          </article>

          {/* 3. Problem Symptoms & Inspection Photos Card */}
          <article className="detail-card" aria-label="Problem Description and Photos">
            <div className="detail-card-header">
              <div className="detail-card-title-group">
                <div className="detail-card-icon-box">
                  <Wrench size={18} />
                </div>
                <h3 className="detail-card-title">Reported Problem Symptoms</h3>
              </div>
            </div>

            {/* Problem Description */}
            <p className="problem-full-text">
              {booking.problemDescription ||
                'The customer requested inspection and repair for tap leakage and drainage flow.'}
            </p>

            {/* Uploaded Problem Photos */}
            {booking.problemImages && booking.problemImages.length > 0 && (
              <div className="problem-photos-container">
                <span className="photos-section-label">
                  Inspection Photos Attached ({booking.problemImages.length})
                </span>
                <div className="problem-photos-grid">
                  {booking.problemImages.map((src, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="problem-photo-thumbnail-btn"
                      onClick={() => setSelectedPhotoModal(src)}
                      title="Click to view full photo"
                    >
                      <img
                        src={src}
                        alt={`Inspection issue photo ${idx + 1}`}
                        className="problem-photo-img"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>

        {/* ----------------- RIGHT COLUMN ----------------- */}
        <div className="details-column">
          {/* A. Pending Price Change Proposal Card (Prominent Action Required) */}
          {pendingProposal && (
            <article className="detail-card pending-proposal-card" aria-label="Technician Requested Price Update">
              <div className="detail-card-header pending-proposal-header">
                <div className="detail-card-title-group">
                  <div className="detail-card-icon-box pcr-icon-box">
                    <AlertTriangle size={18} className="text-amber-700" />
                  </div>
                  <div>
                    <h3 className="detail-card-title text-amber-900">Technician Requested a Price Update</h3>
                    <span className="text-xs text-amber-800 font-medium">Customer decision required to proceed</span>
                  </div>
                </div>
                <span className="pcr-status-badge">Awaiting Your Approval</span>
              </div>

              {/* Proposal Metadata Summary */}
              <div className="pcr-meta-summary">
                <div className="pcr-meta-item">
                  <span className="pcr-meta-label">Technician:</span>
                  <span className="pcr-meta-value font-semibold">{pendingProposal.technicianName || technician?.name}</span>
                </div>
                <div className="pcr-meta-item">
                  <span className="pcr-meta-label">Proposed On:</span>
                  <span className="pcr-meta-value">
                    {new Date(pendingProposal.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Technician's Explanation */}
              <div className="pcr-reason-quote-box">
                <span className="pcr-reason-title">Technician's Explanation for Revision:</span>
                <p className="pcr-reason-quote">"{pendingProposal.technicianReason}"</p>
              </div>

              {/* Itemized Comparison Table */}
              <div className="pcr-comparison-wrap">
                <table className="pcr-comparison-table">
                  <thead>
                    <tr>
                      <th>Charge Item</th>
                      <th className="text-right">Original</th>
                      <th className="text-right">Proposed</th>
                      <th className="text-right">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Visiting / Inspection Fee</td>
                      <td className="text-right">₹{pendingProposal.originalVisitingCharge}</td>
                      <td className="text-right font-medium">₹{pendingProposal.proposedVisitingCharge}</td>
                      <td className="text-right font-semibold">
                        {pendingProposal.proposedVisitingCharge - pendingProposal.originalVisitingCharge !== 0 ? (
                          <span className={pendingProposal.proposedVisitingCharge > pendingProposal.originalVisitingCharge ? 'text-amber-800' : 'text-emerald-800'}>
                            {pendingProposal.proposedVisitingCharge > pendingProposal.originalVisitingCharge ? '+' : ''}
                            ₹{pendingProposal.proposedVisitingCharge - pendingProposal.originalVisitingCharge}
                          </span>
                        ) : '₹0'}
                      </td>
                    </tr>
                    <tr>
                      <td>Repair Labor</td>
                      <td className="text-right">₹{pendingProposal.originalLaborCharge}</td>
                      <td className="text-right font-medium">₹{pendingProposal.proposedLaborCharge}</td>
                      <td className="text-right font-semibold">
                        {pendingProposal.proposedLaborCharge - pendingProposal.originalLaborCharge !== 0 ? (
                          <span className={pendingProposal.proposedLaborCharge > pendingProposal.originalLaborCharge ? 'text-amber-800' : 'text-emerald-800'}>
                            {pendingProposal.proposedLaborCharge > pendingProposal.originalLaborCharge ? '+' : ''}
                            ₹{pendingProposal.proposedLaborCharge - pendingProposal.originalLaborCharge}
                          </span>
                        ) : '₹0'}
                      </td>
                    </tr>
                    <tr>
                      <td>Materials / Spare Parts</td>
                      <td className="text-right">₹{pendingProposal.originalMaterialCharge}</td>
                      <td className="text-right font-medium">₹{pendingProposal.proposedMaterialCharge}</td>
                      <td className="text-right font-semibold">
                        {pendingProposal.proposedMaterialCharge - pendingProposal.originalMaterialCharge !== 0 ? (
                          <span className={pendingProposal.proposedMaterialCharge > pendingProposal.originalMaterialCharge ? 'text-amber-800' : 'text-emerald-800'}>
                            {pendingProposal.proposedMaterialCharge > pendingProposal.originalMaterialCharge ? '+' : ''}
                            ₹{pendingProposal.proposedMaterialCharge - pendingProposal.originalMaterialCharge}
                          </span>
                        ) : '₹0'}
                      </td>
                    </tr>
                    <tr className="pcr-total-row">
                      <td>Customer Total</td>
                      <td className="text-right">₹{pendingProposal.originalCustomerTotal}</td>
                      <td className="text-right font-bold text-[var(--emerald-ink)]">₹{pendingProposal.proposedCustomerTotal}</td>
                      <td className="text-right font-bold text-amber-900">
                        {pendingProposal.difference >= 0 ? '+' : ''}₹{pendingProposal.difference} ({pendingProposal.percentageChange}%)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Protection & Settlement Notice */}
              <div className="pcr-guarantee-box">
                <ShieldCheck size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--text-secondary)] m-0 leading-relaxed">
                  <strong>HomeFix Customer Guarantee:</strong> Your payable amount remains <strong>₹{pendingProposal.originalCustomerTotal}</strong> until you explicitly accept. If declined, the original price stands.
                </p>
              </div>

              {/* Customer Decision Actions */}
              <div className="pcr-decision-actions-row">
                <button
                  type="button"
                  className="btn-pcr-accept"
                  onClick={() => setIsAcceptModalOpen(true)}
                  disabled={isDeciding}
                >
                  <Check size={16} />
                  <span>Accept Updated Charges (₹{pendingProposal.proposedCustomerTotal})</span>
                </button>
                <button
                  type="button"
                  className="btn-pcr-reject"
                  onClick={() => setIsRejectModalOpen(true)}
                  disabled={isDeciding}
                >
                  <X size={16} />
                  <span>Reject Proposal</span>
                </button>
              </div>
            </article>
          )}

          {/* 1. Itemized Financial Summary Card */}
          <article className="detail-card" aria-label="Itemized Invoice Summary">
            <div className="detail-card-header">
              <div className="detail-card-title-group">
                <div className="detail-card-icon-box">
                  <CreditCard size={18} />
                </div>
                <h3 className="detail-card-title">
                  {pendingProposal ? 'Approved Active Invoice' : 'Itemized Invoice Summary'}
                </h3>
              </div>
              {pendingProposal && (
                <span className="invoice-pending-pill">
                  Revision Pending Decision
                </span>
              )}
            </div>

            {/* Invoice Line Items */}
            <div className="invoice-items-list">
              <div className="invoice-item-row">
                <span className="invoice-item-label">Visiting / Inspection Fee:</span>
                <span className="invoice-item-value">₹{booking.pricing.visitingCharge}</span>
              </div>

              <div className="invoice-item-row">
                <span className="invoice-item-label">Repair Labor Charges:</span>
                <span className="invoice-item-value">₹{booking.pricing.repairLabor}</span>
              </div>

              <div className="invoice-item-row">
                <span className="invoice-item-label">Spare Parts & Materials:</span>
                <span className="invoice-item-value">₹{booking.pricing.materialCharge}</span>
              </div>

              <div className="invoice-divider" />

              <div className="invoice-total-row">
                <span>Customer Total Amount:</span>
                <span className="invoice-total-amount">₹{booking.pricing.customerTotal}</span>
              </div>

              {/* Payment Status Block */}
              <div className="payment-status-block">
                <span className="payment-status-caption">Payment Settlement</span>
                <span
                  className={`status-badge status-badge-sm ${
                    booking.paymentStatus === 'Paid'
                      ? 'status-approved'
                      : 'status-warning'
                  }`}
                >
                  {booking.paymentStatus}
                </span>
              </div>
            </div>

            {/* Permitted Booking Actions */}
            <div className="invoice-actions-group">
              {/* Pay Now if Pending and not cancelled */}
              {booking.paymentStatus === 'Pending' && booking.status !== 'Cancelled' && (
                <button
                  type="button"
                  className="btn-invoice-primary"
                  onClick={() => setIsPayModalOpen(true)}
                >
                  <CreditCard size={16} />
                  <span>Pay Now (₹{booking.pricing.customerTotal})</span>
                </button>
              )}

              {/* Write Review if Completed */}
              {booking.status === 'Completed' && (
                <Link
                  to={`/customer/reviews?bookingId=${booking.id}`}
                  className="btn-invoice-outline"
                >
                  <Star size={16} />
                  <span>Write Service Review</span>
                </Link>
              )}

              {/* Cancel Appointment if still active */}
              {booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
                <button
                  type="button"
                  className="btn-invoice-danger"
                  onClick={() => setIsCancelModalOpen(true)}
                >
                  <AlertTriangle size={15} />
                  <span>Cancel Appointment</span>
                </button>
              )}
            </div>

            {/* Trust Warranty Note */}
            <div className="invoice-guarantee-note">
              <ShieldCheck size={16} className="flex-shrink-0" />
              <span>
                Protected by HomeFix 30-Day Service Warranty & Transparent Pricing Guarantee.
              </span>
            </div>
          </article>

          {/* 2. Customer Assistance / Support Card */}
          <article className="detail-card" aria-label="Customer Support and Assistance">
            <div className="detail-card-header">
              <div className="detail-card-title-group">
                <div className="detail-card-icon-box">
                  <HelpCircle size={18} />
                </div>
                <h3 className="detail-card-title">Need Help with this Booking?</h3>
              </div>
            </div>

            <div className="support-card-content">
              <p className="support-desc-text">
                Have questions regarding technician arrival, parts warranty, or reschedule requests?
                Our customer support desk is available 8:00 AM – 9:00 PM every day.
              </p>

              <a href="tel:1800-HOME-FIX" className="support-hotline-box">
                <div className="support-hotline-icon">
                  <Phone size={16} />
                </div>
                <div className="support-hotline-text">
                  <span className="support-hotline-title">Toll-Free Helpline</span>
                  <span className="support-hotline-num">1800-HOME-FIX (4663-349)</span>
                </div>
              </a>
            </div>
          </article>

          {/* 3. Pricing Proposals & Quotation History Card */}
          {proposalHistory && proposalHistory.length > 0 && (
            <article className="detail-card" aria-label="Pricing Quotation Audit History">
              <div className="detail-card-header">
                <div className="detail-card-title-group">
                  <div className="detail-card-icon-box">
                    <History size={18} />
                  </div>
                  <h3 className="detail-card-title">Pricing & Revision History</h3>
                </div>
                <span className="text-xs text-[var(--text-muted)] font-semibold">
                  {proposalHistory.length} Record{proposalHistory.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="customer-pcr-history-list">
                {proposalHistory.map((p) => {
                  const isPending = p.status === 'PENDING_CUSTOMER_APPROVAL';
                  const isApproved = p.status === 'APPROVED';
                  const isRejected = p.status === 'REJECTED';

                  return (
                    <div key={p.id} className={`customer-pcr-item status-${p.status?.toLowerCase()}`}>
                      <div className="customer-pcr-top">
                        <span className={`customer-pcr-chip chip-${p.status?.toLowerCase()}`}>
                          {isPending && 'Pending Decision'}
                          {isApproved && 'Approved'}
                          {isRejected && 'Declined'}
                        </span>
                        <span className="customer-pcr-date">
                          {new Date(p.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="customer-pcr-amounts">
                        <span className="text-xs text-[var(--text-muted)]">
                          ₹{p.originalCustomerTotal} → <strong className="text-[var(--text-primary)]">₹{p.proposedCustomerTotal}</strong>
                        </span>
                        <span className={`customer-pcr-diff ${p.difference >= 0 ? 'text-amber-800' : 'text-emerald-800'}`}>
                          {p.difference >= 0 ? '+' : ''}₹{p.difference} ({p.percentageChange}%)
                        </span>
                      </div>

                      <p className="customer-pcr-reason">"{p.technicianReason}"</p>

                      {isApproved && p.decidedAt && (
                        <div className="customer-pcr-decision-note text-emerald-800">
                          <CheckCircle2 size={13} className="flex-shrink-0" />
                          <span>Approved by you on {new Date(p.decidedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}. Active invoice updated.</span>
                        </div>
                      )}

                      {isRejected && (
                        <div className="customer-pcr-decision-note text-red-800">
                          <AlertTriangle size={13} className="flex-shrink-0" />
                          <span>Declined by you. Original quotation of ₹{p.originalCustomerTotal} preserved.{p.customerRejectionReason ? ` Note: "${p.customerRejectionReason}"` : ''}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          )}
        </div>
      </div>

      {/* ====================================================================
          MODALS: PAYMENT, CANCEL, & PHOTO PREVIEW
          ==================================================================== */}

      {/* Pay Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Simulated Payment Gateway"
        subtitle="Secure checkout for verified HomeFix services"
      >
        {paymentSuccess ? (
          <div className="text-center py-6">
            <CheckCircle2 size={46} className="text-emerald-700 mx-auto mb-3" />
            <h4 className="font-bold text-lg text-[var(--text-primary)]">
              Payment Completed Successfully!
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Your transaction has settled. Status marked as Paid.
            </p>
          </div>
        ) : (
          <div>
            <div className="p-4 bg-[var(--champagne-light)] border border-[var(--champagne-border)] rounded-xl mb-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Booking Reference:</span>
                <span className="font-mono font-bold text-[var(--emerald-ink)]">
                  #{booking.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Service:</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {booking.serviceName}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[var(--champagne-border)]">
                <span className="font-bold text-[var(--text-primary)]">Amount to Pay:</span>
                <span className="font-bold text-lg text-[var(--emerald-ink)]">
                  ₹{booking.pricing.customerTotal}
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] mb-5">
              Simulated demonstration gateway. In production, this connects to Razorpay / Stripe via Spring Boot backend webhooks.
            </p>

            <Button
              variant="primary"
              fullWidth
              size="lg"
              isLoading={isPaying}
              onClick={handlePayment}
            >
              Confirm Mock Payment (₹{booking.pricing.customerTotal})
            </Button>
          </div>
        )}
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Appointment"
        subtitle={`Booking Reference: #${booking.id}`}
      >
        <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
          Are you sure you want to cancel this appointment with technician{' '}
          <strong>{technician?.name || booking.technicianName}</strong>? This slot will be released immediately.
        </p>

        <div className="flex justify-end gap-2.5">
          <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>
            Keep Booking
          </Button>
          <Button variant="danger" onClick={handleCancelBooking}>
            Confirm Cancellation
          </Button>
        </div>
      </Modal>

      {/* Photo Zoom Modal */}
      {selectedPhotoModal && (
        <Modal
          isOpen={Boolean(selectedPhotoModal)}
          onClose={() => setSelectedPhotoModal(null)}
          title="Inspection Photo Preview"
          subtitle="Customer uploaded issue evidence"
          maxWidth="640px"
        >
          <div className="flex flex-col items-center">
            <img
              src={selectedPhotoModal}
              alt="Inspection photo preview"
              className="max-h-[70vh] w-auto rounded-lg object-contain border border-[var(--border-color)]"
            />
            <button
              type="button"
              className="btn btn-outline btn-sm mt-4"
              onClick={() => setSelectedPhotoModal(null)}
            >
              Close Preview
            </button>
          </div>
        </Modal>
      )}

      {/* ====================================================================
          MODALS: CUSTOMER PRICE PROPOSAL DECISION (ACCEPT & REJECT)
          ==================================================================== */}

      {/* Accept Proposal Modal */}
      {pendingProposal && (
        <Modal
          isOpen={isAcceptModalOpen}
          onClose={() => !isDeciding && setIsAcceptModalOpen(false)}
          title="Accept Updated Charges"
          subtitle={`Booking Reference: #${booking.bookingReference || booking.id}`}
          maxWidth="500px"
        >
          <div className="pcr-decision-modal-body">
            <div className="pcr-decision-modal-icon accept">
              <CheckCircle2 size={32} className="text-emerald-700" />
            </div>

            <h4 className="pcr-decision-modal-heading">
              Confirm New Invoice Total of ₹{pendingProposal.proposedCustomerTotal}
            </h4>

            <p className="pcr-decision-modal-text">
              You are approving the revised charges submitted by technician <strong>{technician?.name || booking.technicianName}</strong>.
            </p>

            <div className="pcr-decision-breakdown-card">
              <div className="pcr-modal-row">
                <span>Visiting / Inspection Fee:</span>
                <span className="font-semibold">₹{pendingProposal.proposedVisitingCharge}</span>
              </div>
              <div className="pcr-modal-row">
                <span>Repair Labor Charges:</span>
                <span className="font-semibold">₹{pendingProposal.proposedLaborCharge}</span>
              </div>
              <div className="pcr-modal-row">
                <span>Materials & Spare Parts:</span>
                <span className="font-semibold">₹{pendingProposal.proposedMaterialCharge}</span>
              </div>
              <div className="pcr-modal-divider" />
              <div className="pcr-modal-row highlight">
                <span>New Approved Total:</span>
                <span className="font-bold text-lg text-[var(--emerald-ink)]">
                  ₹{pendingProposal.proposedCustomerTotal}
                </span>
              </div>
              <div className="pcr-modal-row subdued">
                <span>Difference from Original:</span>
                <span className="font-semibold text-amber-800">
                  {pendingProposal.difference >= 0 ? '+' : ''}₹{pendingProposal.difference} ({pendingProposal.percentageChange}%)
                </span>
              </div>
            </div>

            <div className="pcr-modal-guarantee-note">
              <ShieldCheck size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-[var(--text-secondary)]">
                The updated amount will become your active payable invoice immediately. Technician will be authorized to continue with repair.
              </span>
            </div>

            <div className="pcr-modal-actions-row">
              <Button
                variant="outline"
                disabled={isDeciding}
                onClick={() => setIsAcceptModalOpen(false)}
              >
                Go Back
              </Button>
              <Button
                variant="primary"
                isLoading={isDeciding}
                onClick={handleConfirmAccept}
                rightIcon={<Check size={16} />}
              >
                Confirm & Accept Revised Invoice
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Proposal Modal */}
      {pendingProposal && (
        <Modal
          isOpen={isRejectModalOpen}
          onClose={() => !isDeciding && setIsRejectModalOpen(false)}
          title="Decline Price Revision"
          subtitle={`Booking Reference: #${booking.bookingReference || booking.id}`}
          maxWidth="500px"
        >
          <div className="pcr-decision-modal-body">
            <div className="pcr-decision-modal-icon reject">
              <AlertTriangle size={32} className="text-amber-700" />
            </div>

            <h4 className="pcr-decision-modal-heading">
              Decline Proposed Total of ₹{pendingProposal.proposedCustomerTotal}
            </h4>

            <p className="pcr-decision-modal-text">
              The revised charges of ₹{pendingProposal.proposedCustomerTotal} will be declined.
              Your previously approved invoice of <strong>₹{pendingProposal.originalCustomerTotal}</strong> will remain active and untouched.
            </p>

            <div className="pcr-rejection-field-group">
              <label htmlFor="customer-rejection-reason" className="pcr-rejection-label">
                Feedback for Technician (Optional):
              </label>
              <textarea
                id="customer-rejection-reason"
                rows="3"
                className="pcr-rejection-textarea"
                placeholder="State why this proposal was declined (e.g., labor charges exceed budget, please proceed with inspection only)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>

            <div className="pcr-modal-guarantee-note">
              <ShieldCheck size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-[var(--text-secondary)]">
                HomeFix guarantees that unapproved technician price changes will never alter your bill.
              </span>
            </div>

            <div className="pcr-modal-actions-row">
              <Button
                variant="outline"
                disabled={isDeciding}
                onClick={() => setIsRejectModalOpen(false)}
              >
                Keep Under Review
              </Button>
              <Button
                variant="danger"
                isLoading={isDeciding}
                onClick={handleConfirmReject}
                rightIcon={<X size={16} />}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
