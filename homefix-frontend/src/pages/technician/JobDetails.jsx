import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  Truck,
  Wrench,
  Camera,
  Check,
  Copy,
  ExternalLink,
  DollarSign,
  X,
  ChevronRight,
  ChevronLeft,
  Printer,
  Share2,
  ZoomIn
} from 'lucide-react';
import { DEMO_BOOKINGS } from '../../data/bookings';
import { bookingApi } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import './JobDetails.css';

const LIFECYCLE_STEPS = [
  { id: 'Requested', label: 'Requested', icon: Clock },
  { id: 'Accepted', label: 'Accepted', icon: Check },
  { id: 'Scheduled', label: 'Scheduled', icon: Calendar },
  { id: 'On the Way', label: 'On The Way', icon: Truck },
  { id: 'In Progress', label: 'In Progress', icon: Wrench },
  { id: 'Completed', label: 'Completed', icon: CheckCircle2 }
];

const STATUS_PROGRESSION_OPTIONS = [
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

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('Accepted');
  const [repairLabor, setRepairLabor] = useState(350);
  const [materialCharge, setMaterialCharge] = useState(150);
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals & Lightbox states
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isInvoiceSummaryOpen, setIsInvoiceSummaryOpen] = useState(false);
  const [workVerifiedChecked, setWorkVerifiedChecked] = useState(false);

  // Load Job details
  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);
        const data = await bookingApi.getBookingById(id);
        const found =
          data ||
          DEMO_BOOKINGS.find((b) => b.id === id || b.bookingReference === id) ||
          DEMO_BOOKINGS[0];

        setJob(found);
        setCurrentStatus(found?.status || 'Accepted');
        setRepairLabor(found?.pricing?.repairLabor ?? 350);
        setMaterialCharge(found?.pricing?.materialCharge ?? 120);
        if (found?.statusHistory?.length) {
          const latestNote = found.statusHistory[found.statusHistory.length - 1]?.note;
          if (latestNote) setStatusNote(latestNote);
        }
      } catch (err) {
        console.error('Error loading job details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [id]);

  // Handle ESC and Arrow keys for Lightbox navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeLightboxImg || !job?.problemImages?.length) return;

      if (e.key === 'Escape') {
        setActiveLightboxImg(null);
      } else if (e.key === 'ArrowRight') {
        const nextIdx = (lightboxIndex + 1) % job.problemImages.length;
        setLightboxIndex(nextIdx);
        setActiveLightboxImg(job.problemImages[nextIdx]);
      } else if (e.key === 'ArrowLeft') {
        const prevIdx =
          (lightboxIndex - 1 + job.problemImages.length) % job.problemImages.length;
        setLightboxIndex(prevIdx);
        setActiveLightboxImg(job.problemImages[prevIdx]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxImg, lightboxIndex, job]);

  // Toast feedback helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Clipboard copy helper
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  // Financial calculations
  const visitingFee = job?.pricing?.visitingCharge ?? 199;
  const calculatedTotal = useMemo(() => {
    return Number(visitingFee) + Number(repairLabor || 0) + Number(materialCharge || 0);
  }, [visitingFee, repairLabor, materialCharge]);

  const platformFee = useMemo(() => {
    return Math.round(calculatedTotal * 0.10);
  }, [calculatedTotal]);

  const technicianPayout = useMemo(() => {
    return calculatedTotal - platformFee;
  }, [calculatedTotal, platformFee]);

  const [todayDateStr] = useState(() =>
    new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  );

  // Contextual Primary Workflow Action based on job.status
  const workflowAction = useMemo(() => {
    switch (job?.status) {
      case 'Requested':
        return {
          label: 'Accept Service Dispatch',
          nextStatus: 'Accepted',
          icon: Check,
          description: 'Acknowledge and claim this booking'
        };
      case 'Accepted':
      case 'Scheduled':
        return {
          label: 'Mark "On the Way"',
          nextStatus: 'On the Way',
          icon: Truck,
          description: 'Notify customer you are traveling to site'
        };
      case 'On the Way':
        return {
          label: 'Start Diagnostic & Repair',
          nextStatus: 'In Progress',
          icon: Wrench,
          description: 'Begin on-site work ("In Progress")'
        };
      case 'In Progress':
        return {
          label: 'Complete Job & Finalize',
          nextStatus: 'Completed',
          icon: CheckCircle2,
          description: 'Review final settlement and mark completed',
          requiresConfirmation: true
        };
      case 'Completed':
        return {
          label: 'Job Completed',
          disabled: true,
          icon: CheckCircle2,
          description: 'Service completed & settlement posted'
        };
      case 'Cancelled':
        return {
          label: 'Booking Cancelled',
          disabled: true,
          icon: X,
          description: 'This booking has been cancelled'
        };
      default:
        return {
          label: 'Update Status',
          nextStatus: 'In Progress',
          icon: Wrench
        };
    }
  }, [job?.status]);

  // Handle stage transition
  const handleTransition = async (nextStatus) => {
    if (nextStatus === 'Completed') {
      setIsCompleteModalOpen(true);
      return;
    }
    executeStatusUpdate(nextStatus, `Status transitioned to ${nextStatus} by technician.`);
  };

  // Execute status update via API
  const executeStatusUpdate = async (nextStatus, noteText) => {
    setIsUpdating(true);
    try {
      await bookingApi.updateStatus(job.id, nextStatus, noteText);
      const updatedHistory = [
        ...(job.statusHistory || []),
        { status: nextStatus, timestamp: new Date().toISOString(), note: noteText }
      ];

      setJob((prev) => ({
        ...prev,
        status: nextStatus,
        statusHistory: updatedHistory
      }));
      setCurrentStatus(nextStatus);
      showToast(`Status updated: Job marked as "${nextStatus}"`);
    } catch (err) {
      console.error(err);
      showToast('Error updating status. Please try again.');
    } finally {
      setIsUpdating(false);
      setIsCompleteModalOpen(false);
    }
  };

  // Save Quotation, Pricing & Work notes
  const handleSaveQuotation = async (e) => {
    if (e) e.preventDefault();
    setIsUpdating(true);
    try {
      const noteToSave = statusNote || 'Quotation & work progress updated by technician.';
      await bookingApi.updateStatus(job.id, currentStatus, noteToSave);

      const updatedHistory = [
        ...(job.statusHistory || []),
        { status: currentStatus, timestamp: new Date().toISOString(), note: noteToSave }
      ];

      setJob((prev) => ({
        ...prev,
        status: currentStatus,
        statusHistory: updatedHistory,
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
      showToast('Quotation breakdown and work notes saved!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save quotation.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Open Lightbox
  const openLightbox = (index) => {
    if (job?.problemImages?.[index]) {
      setLightboxIndex(index);
      setActiveLightboxImg(job.problemImages[index]);
    }
  };

  // Quick Chips for Technician Work Notes
  const handleAddNoteChip = (chipText) => {
    setStatusNote((prev) => (prev ? `${prev.trim()} ${chipText}` : chipText));
  };

  if (loading) {
    return (
      <div className="job-workspace-container">
        <div className="job-card text-center py-16">
          <div className="inline-block animate-spin rounded-full h-9 w-9 border-b-2 border-[var(--emerald-ink)] mb-3"></div>
          <p className="text-sm font-semibold text-[var(--emerald-ink)]">
            Loading dispatch record & diagnostic workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-workspace-container">
        <div className="job-card text-center py-16">
          <AlertCircle size={40} className="text-amber-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Job Record Not Found</h2>
          <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto mb-5">
            No active dispatch record could be retrieved for reference #{id}.
          </p>
          <Link to="/technician/bookings" className="job-back-link">
            <ArrowLeft size={14} />
            <span>Return to Assigned Jobs</span>
          </Link>
        </div>
      </div>
    );
  }

  // Get index of current step in lifecycle
  const currentStepIndex = LIFECYCLE_STEPS.findIndex(
    (s) => s.label.toLowerCase() === (job.status || '').toLowerCase().replace(/_/g, ' ')
  );

  return (
    <div className="job-workspace-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="job-floating-toast" role="status" aria-live="polite">
          <CheckCircle2 size={18} className="text-[var(--champagne)]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation & Breadcrumb */}
      <nav className="job-workspace-nav" aria-label="Job Navigation">
        <Link to="/technician/bookings" className="job-back-link">
          <ArrowLeft size={15} />
          <span>Back to My Jobs</span>
        </Link>

        <div className="job-quick-nav-actions">
          <button
            type="button"
            className="job-back-link"
            onClick={() => setIsInvoiceSummaryOpen(true)}
            title="Preview Printable Job Sheet"
          >
            <Printer size={14} />
            <span>Job Sheet</span>
          </button>
          <button
            type="button"
            className="job-back-link"
            onClick={() => copyToClipboard(window.location.href, 'Workspace Link')}
            title="Share or Copy Link"
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>
        </div>
      </nav>

      {/* Compact Page Header Card */}
      <header className="job-header-card">
        <div className="job-header-main">
          <div className="job-header-meta-row">
            <span className="job-ref-tag">
              <span>Ref: {job.bookingReference || job.id}</span>
              <button
                type="button"
                className="job-copy-btn"
                onClick={() => copyToClipboard(job.bookingReference || job.id, 'Booking reference')}
                title="Copy reference number"
              >
                <Copy size={13} />
              </button>
            </span>
            <span className="job-service-category-badge">
              {job.serviceCategory || job.serviceName || 'Home Repair'}
            </span>
            <StatusBadge status={job.status} size="sm" />
            <span className={`status-badge status-badge-sm ${job.paymentStatus === 'Paid' ? 'status-approved' : 'status-pending'}`}>
              <span className="status-badge-text">Payment: {job.paymentStatus || 'Pending'}</span>
            </span>
          </div>

          <div className="job-title-row">
            <h1 className="job-workspace-title">
              {job.problemTitle || `${job.serviceCategory || 'HomeFix'} Service`}
            </h1>
          </div>
          <span className="job-header-subtext">
            Customer Dispatch & Technical Diagnostics Workspace
          </span>
        </div>

        <div className="job-header-right">
          {/* Scheduled Slot Badge */}
          <div className="job-header-slot-pill">
            <Calendar size={15} className="job-header-slot-icon" />
            <span>{job.appointmentDate || job.scheduledDate || 'Today'}</span>
            <span className="text-[var(--text-light)]">·</span>
            <Clock size={15} className="job-header-slot-icon" />
            <span>{job.appointmentTime || job.scheduledTimeSlot || 'Standard Slot'}</span>
          </div>

          {/* Contextual Primary Action Button */}
          {!workflowAction.disabled && (
            <button
              type="button"
              className="primary-workflow-btn"
              disabled={isUpdating}
              onClick={() => handleTransition(workflowAction.nextStatus)}
            >
              <workflowAction.icon size={16} />
              <span>{isUpdating ? 'Updating...' : workflowAction.label}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Responsive Grid Layout (65% Main / 35% Side) */}
      <main className="job-workspace-grid">
        {/* ================================================================
            MAIN COLUMN (~65%): Details, Problem, Photos, Lifecycle, Notes
            ================================================================ */}
        <section className="job-main-column">
          {/* 1. Customer & Location Card */}
          <div className="job-card">
            <div className="job-card-header">
              <div className="job-card-title-wrap">
                <div className="job-card-icon-badge">
                  <Phone size={17} />
                </div>
                <h2 className="job-card-title">Customer & Service Location</h2>
              </div>
              <span className="job-card-badge">Verified Customer</span>
            </div>

            <div className="customer-summary-grid">
              {/* Customer Profile & Direct Contact */}
              <div className="customer-profile-block">
                <div className="customer-avatar-box">
                  {(job.customer?.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div className="customer-meta-info">
                  <h3 className="customer-name">{job.customer?.name || 'HomeFix Client'}</h3>
                  <span className="customer-type-tag">Homeowner</span>

                  <div className="customer-actions-row">
                    <a
                      href={`tel:${job.customer?.phone || '+919876543210'}`}
                      className="contact-action-btn primary-call"
                    >
                      <Phone size={13} />
                      <span>{job.customer?.phone || '+91 98765 43210'}</span>
                    </a>
                    <button
                      type="button"
                      className="contact-action-btn secondary-copy"
                      onClick={() => copyToClipboard(job.customer?.phone || '+919876543210', 'Phone number')}
                      title="Copy Phone"
                    >
                      <Copy size={12} />
                      <span>Copy</span>
                    </button>
                  </div>
                  {job.customer?.email && (
                    <span className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1">
                      <Mail size={12} />
                      {job.customer.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Service Address & Navigation */}
              <div className="address-summary-block">
                <div className="address-header-row">
                  <span className="address-title">
                    <MapPin size={13} />
                    <span>Service Address & Landmark</span>
                  </span>
                  <span className="text-xs font-semibold text-[var(--emerald-medium)]">
                    {job.address?.label || 'Residential'}
                  </span>
                </div>

                <p className="address-text">
                  {job.address?.street || 'Flat 402, Sunshine Heights'},{' '}
                  {job.address?.locality || job.customer?.locality || 'Indirapuram'},{' '}
                  {job.address?.city || job.customer?.city || 'Noida'} -{' '}
                  {job.address?.postalCode || '201309'}
                </p>

                <div className="address-tools-row">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${job.address?.street || ''} ${job.address?.locality || ''} ${job.address?.city || ''} ${job.address?.postalCode || ''}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="address-link-btn"
                  >
                    <ExternalLink size={12} />
                    <span>Open in Maps</span>
                  </a>
                  <button
                    type="button"
                    className="address-link-btn"
                    onClick={() =>
                      copyToClipboard(
                        `${job.address?.street || ''}, ${job.address?.locality || ''}, ${job.address?.city || ''} - ${job.address?.postalCode || ''}`,
                        'Full address'
                      )
                    }
                  >
                    <Copy size={12} />
                    <span>Copy Address</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Customer Problem Diagnosis & Scope Card */}
          <div className="job-card">
            <div className="job-card-header">
              <div className="job-card-title-wrap">
                <div className="job-card-icon-badge">
                  <FileText size={17} />
                </div>
                <h2 className="job-card-title">Customer Problem Diagnostic</h2>
              </div>
              <span className="job-card-badge">{job.serviceName || 'Service Request'}</span>
            </div>

            <div className="problem-diagnosis-body">
              <div className="problem-headline-row">
                <h3 className="problem-headline-text">
                  {job.problemTitle || 'Diagnostic assessment requested by customer'}
                </h3>
              </div>

              <div className="problem-quote-box">
                <p className="problem-quote-text">
                  "{job.problemDescription || 'Customer did not specify additional diagnostic notes during online dispatch.'}"
                </p>
              </div>

              <div className="problem-reported-meta">
                <Clock size={12} />
                <span>
                  Dispatched on {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'} · Category: {job.serviceCategory || 'General Maintenance'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Customer-Uploaded Problem Photographs Card (Gallery & Lightbox) */}
          <div className="job-card">
            <div className="job-card-header">
              <div className="job-card-title-wrap">
                <div className="job-card-icon-badge">
                  <Camera size={17} />
                </div>
                <h2 className="job-card-title">Customer Problem Photographs</h2>
              </div>
              <span className="job-card-badge">
                {job.problemImages?.length || 0} {job.problemImages?.length === 1 ? 'image' : 'images'}
              </span>
            </div>

            <div className="photos-grid-wrapper">
              {job.problemImages && job.problemImages.length > 0 ? (
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-3">
                    Click any thumbnail below to open the full high-resolution diagnostic lightbox inspection view.
                  </p>
                  <div className="photos-grid">
                    {job.problemImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="photo-thumbnail-card"
                        onClick={() => openLightbox(idx)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Inspect problem photograph ${idx + 1}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openLightbox(idx);
                          }
                        }}
                      >
                        <img
                          src={imgUrl}
                          alt={`Customer problem upload ${idx + 1}`}
                          className="photo-thumbnail-img"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500';
                          }}
                        />
                        <div className="photo-thumbnail-overlay">
                          <span className="photo-badge-label">Photo #{idx + 1}</span>
                          <span className="photo-zoom-icon">
                            <ZoomIn size={14} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="photos-empty-state">
                  <div className="photos-empty-icon">
                    <Camera size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] m-0">No photos uploaded</h4>
                    <p className="photos-empty-text">
                      The customer did not attach diagnostic photos for this service request. Perform on-site visual diagnosis.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Service Lifecycle Progress Timeline Card */}
          <div className="job-card">
            <div className="job-card-header">
              <div className="job-card-title-wrap">
                <div className="job-card-icon-badge">
                  <Truck size={17} />
                </div>
                <h2 className="job-card-title">Service Lifecycle Progression</h2>
              </div>
              <span className="job-card-badge">Stage: {job.status}</span>
            </div>

            <div className="lifecycle-stepper-container">
              <div className="lifecycle-track">
                {LIFECYCLE_STEPS.map((step, idx) => {
                  const isCompleted = currentStepIndex >= 0 && idx < currentStepIndex;
                  const isCurrent = currentStepIndex === idx;
                  const Icon = step.icon;

                  // Find history record for this status if available
                  const historyItem = job.statusHistory?.find(
                    (h) => h.status.toLowerCase() === step.id.toLowerCase()
                  );

                  return (
                    <div
                      key={step.id}
                      className={`lifecycle-step-node ${isCompleted ? 'completed' : ''} ${
                        isCurrent ? 'current' : ''
                      }`}
                    >
                      {/* Step Connector Line */}
                      {idx < LIFECYCLE_STEPS.length - 1 && (
                        <div
                          className={`lifecycle-connector-line ${
                            idx < currentStepIndex ? 'filled' : ''
                          }`}
                        />
                      )}

                      <div className="lifecycle-icon-circle">
                        <Icon size={16} />
                      </div>

                      <span className="lifecycle-step-label">{step.label}</span>
                      {historyItem?.timestamp && (
                        <span className="lifecycle-step-time">
                          {new Date(historyItem.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 5. Technician Work Log & Diagnostic Notes Card */}
          <div className="job-card">
            <div className="job-card-header">
              <div className="job-card-title-wrap">
                <div className="job-card-icon-badge">
                  <Wrench size={17} />
                </div>
                <h2 className="job-card-title">Technician Work Notes & Findings</h2>
              </div>
              <span className="job-card-badge">Service Documentation</span>
            </div>

            <div className="worklog-editor-area">
              <div className="worklog-quick-chips">
                <span className="worklog-chip-label">Quick insert:</span>
                <button
                  type="button"
                  className="worklog-chip-btn"
                  onClick={() => handleAddNoteChip('Replaced washer & rubber valve.')}
                >
                  + Replaced washer/valve
                </button>
                <button
                  type="button"
                  className="worklog-chip-btn"
                  onClick={() => handleAddNoteChip('Leak & pressure testing completed.')}
                >
                  + Pressure test passed
                </button>
                <button
                  type="button"
                  className="worklog-chip-btn"
                  onClick={() => handleAddNoteChip('Customer briefed on maintenance.')}
                >
                  + Maintenance briefed
                </button>
                <button
                  type="button"
                  className="worklog-chip-btn"
                  onClick={() => handleAddNoteChip('Work area cleaned & sanitized.')}
                >
                  + Site sanitized
                </button>
              </div>

              <textarea
                className="worklog-textarea"
                rows="3"
                placeholder="Document diagnostics findings, specific parts replaced (model, size), test outcomes, or future recommendations..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />

              <div className="worklog-footer-bar">
                <span>Notes are recorded in the customer's permanent job audit log.</span>
                <span>{statusNote.length} characters</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SIDE COLUMN (~35%): Action Controls, Quotation Breakdown, Utilities
            ================================================================ */}
        <aside className="job-side-column">
          {/* Section A: Contextual Job Workflow Action Card */}
          <div className="job-actions-card">
            <div className="action-status-banner">
              <div className="action-status-left">
                <span className="action-status-k">Current Dispatch Status</span>
                <span className="text-sm font-bold text-[var(--emerald-ink)]">{job.status}</span>
              </div>
              <StatusBadge status={job.status} size="sm" />
            </div>

            {/* Primary Workflow Transition */}
            {!workflowAction.disabled ? (
              <div>
                <button
                  type="button"
                  className="primary-workflow-btn"
                  disabled={isUpdating}
                  onClick={() => handleTransition(workflowAction.nextStatus)}
                >
                  <workflowAction.icon size={17} />
                  <span>{isUpdating ? 'Updating Status...' : workflowAction.label}</span>
                </button>
                <p className="text-xs text-[var(--text-muted)] text-center mt-2 mb-0">
                  {workflowAction.description}
                </p>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <CheckCircle2 size={24} className="text-emerald-700 mx-auto mb-1" />
                <span className="text-sm font-bold text-emerald-900 block">Job Completed</span>
                <span className="text-xs text-emerald-700">All lifecycle steps have been fulfilled.</span>
              </div>
            )}

            {/* Manual Status Override Selector */}
            <div className="status-override-block">
              <label htmlFor="status-override-select" className="status-override-label">
                Manual Status Override:
              </label>
              <select
                id="status-override-select"
                className="status-override-select"
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
              >
                {STATUS_PROGRESSION_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section B: Quotation & Financial Settlement Card */}
          <form onSubmit={handleSaveQuotation} className="quotation-card">
            <div className="job-card-header">
              <div className="job-card-title-wrap">
                <div className="job-card-icon-badge">
                  <DollarSign size={17} />
                </div>
                <h2 className="job-card-title">Quotation & Settlement</h2>
              </div>
              <span className="job-card-badge">Financials</span>
            </div>

            {/* Hero Net Payout Card */}
            <div className="payout-hero-banner">
              <span className="payout-hero-caption">Your Estimated Net Payout</span>
              <div className="payout-hero-amount-row">
                <span className="payout-hero-currency">₹</span>
                <span className="payout-hero-amount">{technicianPayout.toLocaleString()}</span>
              </div>
              <span className="payout-hero-subtext">
                (Customer Total: ₹{calculatedTotal} less 10% platform fee)
              </span>
            </div>

            {/* Pricing Form Fields */}
            <div className="pricing-form-fields">
              {/* Doorstep Visiting Fee (Fixed) */}
              <div className="pricing-field-group">
                <div className="pricing-field-label-row">
                  <label className="pricing-field-label">Doorstep Visiting Fee</label>
                  <span className="pricing-field-fixed-pill">Fixed Rate</span>
                </div>
                <div className="pricing-currency-input-wrap">
                  <span className="pricing-currency-symbol">₹</span>
                  <input
                    type="text"
                    readOnly
                    className="pricing-currency-input bg-[#FAF6EF] cursor-not-allowed"
                    value={visitingFee}
                  />
                </div>
              </div>

              {/* Repair Labor Charge */}
              <div className="pricing-field-group">
                <div className="pricing-field-label-row">
                  <label htmlFor="repair-labor-input" className="pricing-field-label">
                    Repair Labor Charge
                  </label>
                  <span className="text-xs text-[var(--text-muted)]">Labor & Diagnostic</span>
                </div>
                <div className="pricing-currency-input-wrap">
                  <span className="pricing-currency-symbol">₹</span>
                  <input
                    id="repair-labor-input"
                    type="number"
                    min="0"
                    step="10"
                    className="pricing-currency-input"
                    value={repairLabor}
                    onChange={(e) => setRepairLabor(Number(e.target.value))}
                  />
                </div>
                <div className="pricing-quick-steppers">
                  <button
                    type="button"
                    className="stepper-micro-btn"
                    onClick={() => setRepairLabor((prev) => Math.max(0, prev - 50))}
                  >
                    - ₹50
                  </button>
                  <button
                    type="button"
                    className="stepper-micro-btn"
                    onClick={() => setRepairLabor((prev) => prev + 50)}
                  >
                    + ₹50
                  </button>
                  <button
                    type="button"
                    className="stepper-micro-btn"
                    onClick={() => setRepairLabor((prev) => prev + 100)}
                  >
                    + ₹100
                  </button>
                </div>
              </div>

              {/* Materials & Spare Parts */}
              <div className="pricing-field-group">
                <div className="pricing-field-label-row">
                  <label htmlFor="materials-input" className="pricing-field-label">
                    Materials & Spare Parts
                  </label>
                  <span className="text-xs text-[var(--text-muted)]">Hardware / Consumables</span>
                </div>
                <div className="pricing-currency-input-wrap">
                  <span className="pricing-currency-symbol">₹</span>
                  <input
                    id="materials-input"
                    type="number"
                    min="0"
                    step="10"
                    className="pricing-currency-input"
                    value={materialCharge}
                    onChange={(e) => setMaterialCharge(Number(e.target.value))}
                  />
                </div>
                <div className="pricing-quick-steppers">
                  <button
                    type="button"
                    className="stepper-micro-btn"
                    onClick={() => setMaterialCharge((prev) => Math.max(0, prev - 50))}
                  >
                    - ₹50
                  </button>
                  <button
                    type="button"
                    className="stepper-micro-btn"
                    onClick={() => setMaterialCharge((prev) => prev + 50)}
                  >
                    + ₹50
                  </button>
                  <button
                    type="button"
                    className="stepper-micro-btn"
                    onClick={() => setMaterialCharge((prev) => prev + 100)}
                  >
                    + ₹100
                  </button>
                </div>
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="pricing-ledger-box">
              <div className="ledger-row">
                <span>Visiting Charge (Base):</span>
                <span>₹{visitingFee}</span>
              </div>
              <div className="ledger-row">
                <span>Repair Labor:</span>
                <span>₹{repairLabor}</span>
              </div>
              <div className="ledger-row">
                <span>Materials / Parts:</span>
                <span>₹{materialCharge}</span>
              </div>
              <div className="ledger-divider"></div>
              <div className="ledger-row total">
                <span>Gross Customer Charge:</span>
                <span>₹{calculatedTotal}</span>
              </div>
              <div className="ledger-row subdued">
                <span>HomeFix Platform Fee (10%):</span>
                <span>- ₹{platformFee}</span>
              </div>
              <div className="ledger-divider"></div>
              <div className="ledger-row payout">
                <span>Net Technician Payout:</span>
                <span>₹{technicianPayout}</span>
              </div>
            </div>

            {/* Save Button */}
            <button type="submit" className="save-quotation-btn" disabled={isUpdating}>
              <Check size={16} />
              <span>{isUpdating ? 'Saving...' : 'Save Quotation & Status'}</span>
            </button>
          </form>

          {/* Section C: Field Quick Utilities Card */}
          <div className="fast-utilities-card">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Field Operations Tools
            </span>
            <a
              href={`tel:${job.customer?.phone || '+919876543210'}`}
              className="fast-utility-item"
            >
              <div className="utility-left">
                <Phone size={14} className="text-[var(--emerald-ink)]" />
                <span>Call Customer Directly</span>
              </div>
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${job.address?.street || ''} ${job.address?.locality || ''} ${job.address?.city || ''} ${job.address?.postalCode || ''}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="fast-utility-item"
            >
              <div className="utility-left">
                <MapPin size={14} className="text-[var(--emerald-ink)]" />
                <span>Navigate via Google Maps</span>
              </div>
              <ExternalLink size={14} className="text-[var(--text-muted)]" />
            </a>
            <button
              type="button"
              className="fast-utility-item"
              onClick={() => setIsInvoiceSummaryOpen(true)}
            >
              <div className="utility-left">
                <FileText size={14} className="text-[var(--emerald-ink)]" />
                <span>View Job Settlement Sheet</span>
              </div>
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            </button>
          </div>
        </aside>
      </main>

      {/* ====================================================================
          LIGHTBOX MODAL FOR CUSTOMER PROBLEM PHOTOGRAPHS
          ==================================================================== */}
      {activeLightboxImg && (
        <div
          className="job-lightbox-backdrop"
          onClick={() => setActiveLightboxImg(null)}
          role="dialog"
          aria-modal="true"
          aria-label="High-resolution diagnostic photograph"
        >
          <div className="job-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <div className="job-lightbox-header">
              <span className="job-lightbox-title">
                Customer Problem Photograph ({lightboxIndex + 1} of {job.problemImages.length})
              </span>
              <button
                type="button"
                className="job-lightbox-close"
                onClick={() => setActiveLightboxImg(null)}
                aria-label="Close Lightbox (Esc)"
              >
                <X size={18} />
              </button>
            </div>

            <div className="job-lightbox-body">
              <img
                src={activeLightboxImg}
                alt={`Problem full view ${lightboxIndex + 1}`}
                className="job-lightbox-full-img"
              />
            </div>

            <div className="job-lightbox-footer">
              <span className="text-xs text-[var(--text-muted)]">
                Press Esc to close · Use Left/Right keys to navigate
              </span>
              {job.problemImages.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="job-lightbox-nav-btn"
                    onClick={() => {
                      const prevIdx =
                        (lightboxIndex - 1 + job.problemImages.length) % job.problemImages.length;
                      setLightboxIndex(prevIdx);
                      setActiveLightboxImg(job.problemImages[prevIdx]);
                    }}
                  >
                    <ChevronLeft size={14} />
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    className="job-lightbox-nav-btn"
                    onClick={() => {
                      const nextIdx = (lightboxIndex + 1) % job.problemImages.length;
                      setLightboxIndex(nextIdx);
                      setActiveLightboxImg(job.problemImages[nextIdx]);
                    }}
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          CONFIRMATION MODAL: COMPLETE JOB & SUBMIT INVOICE
          ==================================================================== */}
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        title="Complete Job & Finalize Settlement"
        subtitle={`Booking Reference: ${job.bookingReference || job.id}`}
        maxWidth="520px"
      >
        <div className="completion-modal-body">
          <div className="completion-summary-box">
            <div className="completion-summary-row">
              <span className="text-[var(--text-muted)]">Customer:</span>
              <span className="font-semibold">{job.customer?.name}</span>
            </div>
            <div className="completion-summary-row">
              <span className="text-[var(--text-muted)]">Service:</span>
              <span className="font-semibold">{job.serviceName || job.serviceCategory}</span>
            </div>
            <div className="completion-summary-row">
              <span className="text-[var(--text-muted)]">Total Billable Amount:</span>
              <span className="font-bold text-[var(--text-primary)]">₹{calculatedTotal}</span>
            </div>
            <div className="completion-summary-row border-t border-[var(--champagne-dark)] pt-2 mt-1">
              <span className="font-bold text-[var(--emerald-ink)]">Your Net Payout:</span>
              <span className="font-bold text-lg text-[var(--emerald-ink)] font-serif">
                ₹{technicianPayout}
              </span>
            </div>
          </div>

          <label className="completion-checkbox-label">
            <input
              type="checkbox"
              checked={workVerifiedChecked}
              onChange={(e) => setWorkVerifiedChecked(e.target.checked)}
            />
            <span>
              I confirm that all diagnostic and repair work has been tested, the work site is clean, and the outcome has been demonstrated to the customer.
            </span>
          </label>

          <div className="completion-modal-actions">
            <button
              type="button"
              className="job-back-link"
              onClick={() => setIsCompleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="primary-workflow-btn w-auto px-5"
              disabled={!workVerifiedChecked || isUpdating}
              onClick={() =>
                executeStatusUpdate(
                  'Completed',
                  statusNote || 'Job successfully completed and verified by technician.'
                )
              }
            >
              <CheckCircle2 size={16} />
              <span>Confirm & Complete Job</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* ====================================================================
          JOB SHEET / INVOICE SUMMARY MODAL
          ==================================================================== */}
      <Modal
        isOpen={isInvoiceSummaryOpen}
        onClose={() => setIsInvoiceSummaryOpen(false)}
        title="Field Service Dispatch Sheet"
        subtitle={`Reference #${job.bookingReference || job.id} · Generated on ${todayDateStr}`}
        maxWidth="600px"
      >
        <div className="completion-modal-body">
          <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[var(--champagne-border)] text-sm space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--champagne-dark)]">
              <div>
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider block">Customer</span>
                <span className="font-bold text-[var(--text-primary)]">{job.customer?.name}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider block">Contact</span>
                <span className="font-semibold">{job.customer?.phone}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider block">Address</span>
              <p className="m-0 text-xs text-[var(--text-secondary)]">
                {job.address?.street}, {job.address?.locality}, {job.address?.city} - {job.address?.postalCode}
              </p>
            </div>

            <div className="border-t border-[var(--champagne-dark)] pt-3 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--emerald-ink)] block">
                Itemized Settlement
              </span>
              <div className="flex justify-between text-xs">
                <span>Visiting Charge</span>
                <span>₹{visitingFee}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Labor Charge</span>
                <span>₹{repairLabor}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Materials & Spares</span>
                <span>₹{materialCharge}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-2 border-t border-[var(--champagne-dark)]">
                <span>Customer Total</span>
                <span>₹{calculatedTotal}</span>
              </div>
              <div className="flex justify-between text-xs text-[var(--emerald-ink)] font-semibold">
                <span>Technician Net Payout</span>
                <span>₹{technicianPayout}</span>
              </div>
            </div>

            {statusNote && (
              <div className="border-t border-[var(--champagne-dark)] pt-2">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider block">Work Notes</span>
                <p className="text-xs italic text-[var(--text-primary)] m-0">"{statusNote}"</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="job-back-link"
              onClick={() => window.print()}
            >
              <Printer size={14} />
              <span>Print Job Sheet</span>
            </button>
            <button
              type="button"
              className="primary-workflow-btn w-auto px-4"
              onClick={() => setIsInvoiceSummaryOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
