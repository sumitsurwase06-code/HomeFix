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
  Check,
  Copy,
  ExternalLink,
  DollarSign,
  X,
  ChevronRight,
  Printer,
  Share2,
  Send,
  Info,
  History,
  ShieldAlert,
  RefreshCw
} from 'lucide-react';
import { DEMO_BOOKINGS } from '../../data/bookings';
import { bookingApi, priceChangeApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import ProblemImageGallery from '../../components/booking/ProblemImageGallery';
import Skeleton from '../../components/common/Skeleton';
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
  const { currentUser } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('Accepted');
  const [visitingFee, setVisitingFee] = useState(199);
  const [repairLabor, setRepairLabor] = useState(350);
  const [materialCharge, setMaterialCharge] = useState(150);
  const [changeReason, setChangeReason] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  // Price revision proposal states
  const [pendingProposal, setPendingProposal] = useState(null);
  const [proposalHistory, setProposalHistory] = useState([]);
  const [proposalSuccessModal, setProposalSuccessModal] = useState(null);

  // Modals states
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isInvoiceSummaryOpen, setIsInvoiceSummaryOpen] = useState(false);
  const [workVerifiedChecked, setWorkVerifiedChecked] = useState(false);

  // Load Job details, authorization check, and pricing history
  useEffect(() => {
    async function loadJob() {
      if (!id) {
        setLoadError({
          type: 'MISSING_ID',
          title: 'Missing Booking Reference',
          message: 'No booking identifier was provided in the route path.',
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setLoadError(null);

        let found = null;
        try {
          found = await bookingApi.getBookingById(id);
        } catch {
          found = DEMO_BOOKINGS.find((b) => b.id === id || b.bookingReference === id);
        }

        if (!found) {
          setLoadError({
            type: 'NOT_FOUND',
            title: 'Job Record Not Found',
            message: `No active dispatch record could be retrieved for reference #${id}. It may have been archived, completed, or cancelled.`,
          });
          setJob(null);
          return;
        }

        // Authorization check: Verify if booking belongs to another technician
        if (
          found.isOtherTechnician ||
          (currentUser?.role === 'technician' && found.technicianId === 'TECH-999')
        ) {
          setLoadError({
            type: 'UNAUTHORIZED',
            title: 'Access Restricted: Assigned to Another Technician',
            message: `This service dispatch (${found.bookingReference || id}) is assigned to another technician partner (${found.technicianName || 'Partner ID: ' + found.technicianId}). You do not have permission to view or manage another technician's private diagnostic workspace.`,
          });
          setJob(null);
          return;
        }

        setJob(found);
        setCurrentStatus(found?.status || 'Accepted');
        setVisitingFee(found?.pricing?.visitingCharge ?? 199);
        setRepairLabor(found?.pricing?.repairLabor ?? 350);
        setMaterialCharge(found?.pricing?.materialCharge ?? 120);

        if (found?.statusHistory?.length) {
          const latestNote = found.statusHistory[found.statusHistory.length - 1]?.note;
          if (latestNote) setStatusNote(latestNote);
        }

        // Fetch price change history and check for pending proposal
        try {
          const history = await priceChangeApi.getBookingHistory(found?.id || id);
          setProposalHistory(history || []);
          const pending = (history || []).find((p) => p.status === 'PENDING_CUSTOMER_APPROVAL');
          setPendingProposal(pending || null);
        } catch (err) {
          console.warn('Could not load proposal history', err);
        }
      } catch (err) {
        console.error('Error loading job details:', err);
        setLoadError({
          type: 'API_ERROR',
          title: 'Failed to Retrieve Job Diagnostics',
          message: 'Unable to communicate with the service dispatch server. Please check your network connection and try again.',
        });
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [id, currentUser]);

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

  // Currently approved baseline charges (unchanged until customer approval)
  const approvedVisiting = job?.pricing?.visitingCharge ?? 199;
  const approvedLabor = job?.pricing?.repairLabor ?? 0;
  const approvedMaterial = job?.pricing?.materialCharge ?? 0;
  const approvedTotal = job?.pricing?.customerTotal ?? (approvedVisiting + approvedLabor + approvedMaterial);
  const approvedPlatformFee = job?.pricing?.platformFee ?? Math.round(approvedTotal * 0.10);
  const approvedTechnicianPayout = job?.pricing?.technicianPayout ?? (approvedTotal - approvedPlatformFee);

  // Proposed charges dynamically calculated
  const proposedVisiting = Number(visitingFee || 0);
  const proposedLabor = Number(repairLabor || 0);
  const proposedMaterial = Number(materialCharge || 0);
  const proposedTotal = proposedVisiting + proposedLabor + proposedMaterial;

  const diffAmount = proposedTotal - approvedTotal;
  const diffPercent = approvedTotal > 0 ? ((diffAmount / approvedTotal) * 100).toFixed(1) : '0.0';

  const proposedPlatformFee = Math.round(proposedTotal * 0.10);
  const proposedTechnicianPayout = proposedTotal - proposedPlatformFee;

  const isPriceModified = (
    proposedVisiting !== approvedVisiting ||
    proposedLabor !== approvedLabor ||
    proposedMaterial !== approvedMaterial
  );

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

  // Reset proposed inputs to currently approved baseline
  const handleResetPricingToApproved = () => {
    setVisitingFee(approvedVisiting);
    setRepairLabor(approvedLabor);
    setMaterialCharge(approvedMaterial);
    setChangeReason('');
    setFormErrors({});
  };

  // Submit revised pricing proposal for customer approval
  const handleSubmitPriceChange = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (pendingProposal) {
      showToast('A price revision request is already awaiting customer approval.');
      return;
    }

    if (job.status === 'Completed' || job.status === 'Cancelled') {
      showToast('Cannot modify charges for completed or cancelled bookings.');
      return;
    }

    if (job.paymentStatus === 'Paid') {
      showToast('Payment is already settled for this booking. Quotation cannot be modified.');
      return;
    }

    const errors = {};

    if (isNaN(proposedVisiting) || proposedVisiting < 0) {
      errors.visitingFee = 'Visiting fee must be a valid, non-negative monetary amount.';
    }

    if (isNaN(proposedLabor) || proposedLabor < 0) {
      errors.repairLabor = 'Repair labor must be a valid, non-negative monetary amount.';
    }

    if (isNaN(proposedMaterial) || proposedMaterial < 0) {
      errors.materialCharge = 'Material charges must be a valid, non-negative monetary amount.';
    }

    if (!changeReason || !changeReason.trim()) {
      errors.changeReason = 'Please enter a clear explanation for this price revision for the customer.';
    }

    if (!isPriceModified) {
      errors.general = 'No charges were modified. Please adjust at least one charge before submitting.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstMsg = Object.values(errors)[0];
      showToast(firstMsg);
      return;
    }

    setFormErrors({});
    setIsSubmittingProposal(true);

    try {
      const result = await priceChangeApi.submitProposal(job.id, {
        visitingCharge: proposedVisiting,
        laborCharge: proposedLabor,
        materialCharge: proposedMaterial,
        reason: changeReason.trim(),
      });

      setPendingProposal(result);
      setProposalHistory((prev) => [result, ...prev]);
      setChangeReason('');
      setFormErrors({});
      setProposalSuccessModal(result);
      showToast('Price revision proposal submitted! Customer has been notified for approval.');
    } catch (err) {
      console.error('Error submitting price proposal:', err);
      showToast(err.message || 'Failed to submit price change request.');
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  // Routine update of status and work notes without altering customer invoice
  const handleSaveNotesOnly = async (e) => {
    if (e) e.preventDefault();
    setIsUpdating(true);
    try {
      const noteToSave = statusNote || 'Work progress notes recorded by technician.';
      await bookingApi.updateStatus(job.id, currentStatus, noteToSave);

      const updatedHistory = [
        ...(job.statusHistory || []),
        { status: currentStatus, timestamp: new Date().toISOString(), note: noteToSave }
      ];

      setJob((prev) => ({
        ...prev,
        status: currentStatus,
        statusHistory: updatedHistory,
      }));
      showToast('Status and technician work notes saved!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save status notes.');
    } finally {
      setIsUpdating(false);
    }
  };



  // Quick Chips for Technician Work Notes
  const handleAddNoteChip = (chipText) => {
    setStatusNote((prev) => (prev ? `${prev.trim()} ${chipText}` : chipText));
  };

  if (loading) {
    return (
      <div className="job-workspace-container" aria-busy="true" aria-label="Loading job diagnostic workspace">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <Skeleton width="130px" height="28px" borderRadius="9999px" />
          <Skeleton width="90px" height="28px" borderRadius="9999px" />
        </div>

        {/* Header Skeleton */}
        <div className="job-header-card animate-pulse">
          <div className="space-y-2 flex-1">
            <div className="flex gap-2">
              <Skeleton width="120px" height="24px" borderRadius="8px" />
              <Skeleton width="100px" height="24px" borderRadius="8px" />
              <Skeleton width="90px" height="24px" borderRadius="8px" />
            </div>
            <Skeleton width="60%" height="32px" borderRadius="8px" />
            <Skeleton width="40%" height="18px" borderRadius="6px" />
          </div>
          <div className="flex gap-3">
            <Skeleton width="150px" height="42px" borderRadius="10px" />
            <Skeleton width="170px" height="42px" borderRadius="10px" />
          </div>
        </div>

        {/* 2-Column Grid Skeletons */}
        <div className="job-workspace-grid">
          <div className="job-main-column space-y-4">
            <div className="job-card p-6 space-y-4">
              <Skeleton width="40%" height="24px" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton height="90px" borderRadius="12px" />
                <Skeleton height="90px" borderRadius="12px" />
              </div>
            </div>
            <div className="job-card p-6 space-y-3">
              <Skeleton width="35%" height="24px" />
              <Skeleton height="70px" borderRadius="10px" />
            </div>
            <div className="job-card p-6 space-y-3">
              <Skeleton width="45%" height="24px" />
              <div className="grid grid-cols-3 gap-3">
                <Skeleton height="160px" borderRadius="12px" />
                <Skeleton height="160px" borderRadius="12px" />
                <Skeleton height="160px" borderRadius="12px" />
              </div>
            </div>
          </div>
          <div className="job-side-column space-y-4">
            <div className="job-card p-6 space-y-4">
              <Skeleton width="50%" height="24px" />
              <Skeleton height="100px" borderRadius="12px" />
              <Skeleton height="45px" borderRadius="10px" />
            </div>
            <div className="job-card p-6 space-y-4">
              <Skeleton width="60%" height="24px" />
              <Skeleton height="150px" borderRadius="12px" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !job) {
    const errorDetails = loadError || {
      type: 'NOT_FOUND',
      title: 'Job Record Not Found',
      message: `No active dispatch record could be retrieved for reference #${id}.`,
    };
    const isUnauthorized = errorDetails.type === 'UNAUTHORIZED';

    return (
      <div className="job-workspace-container">
        <div className="job-card text-center py-12 px-6 max-w-xl mx-auto my-8">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              isUnauthorized
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'bg-amber-50 text-amber-600 border border-amber-200'
            }`}
          >
            {isUnauthorized ? <ShieldAlert size={30} /> : <AlertCircle size={30} />}
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">{errorDetails.title}</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
            {errorDetails.message}
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/technician/bookings"
              className="job-back-link"
              title="Return to My Jobs"
            >
              <ArrowLeft size={15} />
              <span>Return to Assigned Jobs</span>
            </Link>
            {errorDetails.type === 'API_ERROR' && (
              <button
                type="button"
                className="job-back-link"
                onClick={() => window.location.reload()}
              >
                <RefreshCw size={14} />
                <span>Retry Connection</span>
              </button>
            )}
          </div>
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
        <div className="job-breadcrumb-trail">
          <Link to="/technician/dashboard" className="breadcrumb-nav-link">
            Technician Dashboard
          </Link>
          <span className="breadcrumb-nav-separator">›</span>
          <Link to="/technician/bookings" className="breadcrumb-nav-link">
            My Jobs
          </Link>
          <span className="breadcrumb-nav-separator">›</span>
          <span className="breadcrumb-nav-current">
            Job Details ({job.bookingReference || job.id})
          </span>
        </div>

        <div className="job-quick-nav-actions">
          <Link to="/technician/bookings" className="job-back-link" title="Return to My Jobs">
            <ArrowLeft size={15} />
            <span>Back to My Jobs</span>
          </Link>
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

          {/* 3. Customer-Uploaded Problem Photographs Card (Standardized 3:4 Gallery & Lightbox) */}
          <div className="job-card">
            <ProblemImageGallery
              images={job.problemImages || []}
              title="Customer Problem Photographs"
              helperText="Review customer problem photos before accepting the request or beginning on-site repair."
              emptyMessage="No problem photos attached."
            />
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

          {/* Section B: Quotation & Customer Approval Workflow Card */}
          <div className="quotation-card">
            <div className="job-card-header">
              <div className="job-card-title-wrap">
                <div className="job-card-icon-badge">
                  <DollarSign size={17} />
                </div>
                <h2 className="job-card-title">Quotation & Pricing Workflow</h2>
              </div>
              {pendingProposal ? (
                <span className="status-badge-pending-pcr">
                  <Clock size={12} />
                  <span>Awaiting Customer Approval</span>
                </span>
              ) : (
                <span className="job-card-badge">Financials</span>
              )}
            </div>

            {/* Awaiting Customer Approval Banner */}
            {pendingProposal && (
              <div className="pending-pcr-banner">
                <div className="pending-pcr-header">
                  <div className="pending-pcr-title-row">
                    <Clock size={16} className="text-amber-800" />
                    <span className="pending-pcr-title">Pending Customer Decision</span>
                  </div>
                  <span className="pending-pcr-date">
                    {new Date(pendingProposal.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="pending-pcr-desc">
                  You submitted a proposed revision of <strong>₹{pendingProposal.proposedCustomerTotal}</strong> (Previous: ₹{pendingProposal.originalCustomerTotal}).
                  The customer has been notified and must approve before the invoice is updated.
                </p>
                <div className="pending-pcr-reason-box">
                  <span className="pending-pcr-reason-label">Technician Reason:</span>
                  <p className="pending-pcr-reason-text">"{pendingProposal.technicianReason}"</p>
                </div>
                <div className="pending-pcr-notice">
                  <Info size={13} />
                  <span>Submitting a new revision is paused until customer responds to this request.</span>
                </div>
              </div>
            )}

            {/* Hero Net Payout Card (Calculated from Proposed or Approved) */}
            <div className="payout-hero-banner">
              <span className="payout-hero-caption">
                {isPriceModified ? 'Proposed Net Payout (Post-Approval)' : 'Your Approved Net Payout'}
              </span>
              <div className="payout-hero-amount-row">
                <span className="payout-hero-currency">₹</span>
                <span className="payout-hero-amount">
                  {(isPriceModified ? proposedTechnicianPayout : approvedTechnicianPayout).toLocaleString()}
                </span>
                {isPriceModified && diffAmount !== 0 && (
                  <span className={`payout-hero-diff ${diffAmount > 0 ? 'text-emerald-300' : 'text-amber-300'}`}>
                    ({diffAmount > 0 ? '+' : ''}₹{diffAmount} / {diffPercent}%)
                  </span>
                )}
              </div>
              <span className="payout-hero-subtext">
                (Customer Total: ₹{isPriceModified ? proposedTotal : approvedTotal} less 10% platform fee)
              </span>
            </div>

            {/* Editable Pricing Form Fields */}
            <form className="pricing-workflow-form" onSubmit={handleSubmitPriceChange} noValidate>
              {formErrors.general && (
                <div className="pricing-general-error" role="alert">
                  {formErrors.general}
                </div>
              )}

              <div className="pricing-form-fields">
                {/* Doorstep Visiting / Inspection Fee (Editable) */}
                <div className="pricing-field-group">
                  <div className="pricing-field-label-row">
                    <label htmlFor="visiting-fee-input" className="pricing-field-label">
                      Visiting / Inspection Fee
                    </label>
                    <span className="text-xs text-[var(--text-muted)]">Base Doorstep Rate</span>
                  </div>
                  <div className="pricing-currency-input-wrap">
                    <span className="pricing-currency-symbol">₹</span>
                    <input
                      id="visiting-fee-input"
                      name="visitingCharge"
                      type="number"
                      min="0"
                      step="any"
                      disabled={!!pendingProposal || job.status === 'Completed' || job.paymentStatus === 'Paid'}
                      className={`pricing-currency-input ${formErrors.visitingFee ? 'has-error' : ''}`}
                      value={visitingFee}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setVisitingFee(val);
                        if (formErrors.visitingFee || formErrors.general) {
                          setFormErrors((prev) => ({ ...prev, visitingFee: null, general: null }));
                        }
                      }}
                    />
                  </div>
                  {formErrors.visitingFee && (
                    <span className="pricing-field-error">{formErrors.visitingFee}</span>
                  )}
                  {!pendingProposal && (
                    <div className="pricing-quick-steppers">
                      <button
                        type="button"
                        className="stepper-micro-btn"
                        onClick={() => {
                          setVisitingFee((prev) => Math.max(0, prev - 50));
                          if (formErrors.visitingFee || formErrors.general) {
                            setFormErrors((prev) => ({ ...prev, visitingFee: null, general: null }));
                          }
                        }}
                      >
                        - ₹50
                      </button>
                      <button
                        type="button"
                        className="stepper-micro-btn"
                        onClick={() => {
                          setVisitingFee((prev) => prev + 50);
                          if (formErrors.visitingFee || formErrors.general) {
                            setFormErrors((prev) => ({ ...prev, visitingFee: null, general: null }));
                          }
                        }}
                      >
                        + ₹50
                      </button>
                    </div>
                  )}
                </div>

                {/* Repair Labor Charges (Editable) */}
                <div className="pricing-field-group">
                  <div className="pricing-field-label-row">
                    <label htmlFor="repair-labor-input" className="pricing-field-label">
                      Repair Labor Charges
                    </label>
                    <span className="text-xs text-[var(--text-muted)]">Labor & Diagnostics</span>
                  </div>
                  <div className="pricing-currency-input-wrap">
                    <span className="pricing-currency-symbol">₹</span>
                    <input
                      id="repair-labor-input"
                      name="laborCharge"
                      type="number"
                      min="0"
                      step="any"
                      disabled={!!pendingProposal || job.status === 'Completed' || job.paymentStatus === 'Paid'}
                      className={`pricing-currency-input ${formErrors.repairLabor ? 'has-error' : ''}`}
                      value={repairLabor}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setRepairLabor(val);
                        if (formErrors.repairLabor || formErrors.general) {
                          setFormErrors((prev) => ({ ...prev, repairLabor: null, general: null }));
                        }
                      }}
                    />
                  </div>
                  {formErrors.repairLabor && (
                    <span className="pricing-field-error">{formErrors.repairLabor}</span>
                  )}
                  {!pendingProposal && (
                    <div className="pricing-quick-steppers">
                      <button
                        type="button"
                        className="stepper-micro-btn"
                        onClick={() => {
                          setRepairLabor((prev) => Math.max(0, prev - 50));
                          if (formErrors.repairLabor || formErrors.general) {
                            setFormErrors((prev) => ({ ...prev, repairLabor: null, general: null }));
                          }
                        }}
                      >
                        - ₹50
                      </button>
                      <button
                        type="button"
                        className="stepper-micro-btn"
                        onClick={() => {
                          setRepairLabor((prev) => prev + 50);
                          if (formErrors.repairLabor || formErrors.general) {
                            setFormErrors((prev) => ({ ...prev, repairLabor: null, general: null }));
                          }
                        }}
                      >
                        + ₹50
                      </button>
                      <button
                        type="button"
                        className="stepper-micro-btn"
                        onClick={() => {
                          setRepairLabor((prev) => prev + 100);
                          if (formErrors.repairLabor || formErrors.general) {
                            setFormErrors((prev) => ({ ...prev, repairLabor: null, general: null }));
                          }
                        }}
                      >
                        + ₹100
                      </button>
                    </div>
                  )}
                </div>

                {/* Materials & Spare Parts (Editable) */}
                <div className="pricing-field-group">
                  <div className="pricing-field-label-row">
                    <label htmlFor="materials-input" className="pricing-field-label">
                      Materials & Spare Parts Charges
                    </label>
                    <span className="text-xs text-[var(--text-muted)]">Hardware / Consumables</span>
                  </div>
                  <div className="pricing-currency-input-wrap">
                    <span className="pricing-currency-symbol">₹</span>
                    <input
                      id="materials-input"
                      name="materialCharge"
                      type="number"
                      min="0"
                      step="any"
                      disabled={!!pendingProposal || job.status === 'Completed' || job.paymentStatus === 'Paid'}
                      className={`pricing-currency-input ${formErrors.materialCharge ? 'has-error' : ''}`}
                      value={materialCharge}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setMaterialCharge(val);
                        if (formErrors.materialCharge || formErrors.general) {
                          setFormErrors((prev) => ({ ...prev, materialCharge: null, general: null }));
                        }
                      }}
                    />
                  </div>
                  {formErrors.materialCharge && (
                    <span className="pricing-field-error">{formErrors.materialCharge}</span>
                  )}
                  {!pendingProposal && (
                    <div className="pricing-quick-steppers">
                      <button
                        type="button"
                        className="stepper-micro-btn"
                        onClick={() => {
                          setMaterialCharge((prev) => Math.max(0, prev - 50));
                          if (formErrors.materialCharge || formErrors.general) {
                            setFormErrors((prev) => ({ ...prev, materialCharge: null, general: null }));
                          }
                        }}
                      >
                        - ₹50
                      </button>
                      <button
                        type="button"
                        className="stepper-micro-btn"
                        onClick={() => {
                          setMaterialCharge((prev) => prev + 50);
                          if (formErrors.materialCharge || formErrors.general) {
                            setFormErrors((prev) => ({ ...prev, materialCharge: null, general: null }));
                          }
                        }}
                      >
                        + ₹50
                      </button>
                      <button
                        type="button"
                        className="stepper-micro-btn"
                        onClick={() => {
                          setMaterialCharge((prev) => prev + 100);
                          if (formErrors.materialCharge || formErrors.general) {
                            setFormErrors((prev) => ({ ...prev, materialCharge: null, general: null }));
                          }
                        }}
                      >
                        + ₹100
                      </button>
                    </div>
                  )}
                </div>

                {/* Reason for Price Change Textarea */}
                <div className="pricing-field-group">
                  <div className="pricing-field-label-row">
                    <label htmlFor="price-change-reason" className="pricing-field-label">
                      Reason for Price Revision {isPriceModified && <span className="text-red-500">*</span>}
                    </label>
                    <span className="text-xs text-[var(--text-muted)]">Sent to customer for approval</span>
                  </div>
                  <textarea
                    id="price-change-reason"
                    name="changeReason"
                    rows="2"
                    disabled={!!pendingProposal || job.status === 'Completed' || job.paymentStatus === 'Paid'}
                    className={`pricing-reason-textarea ${formErrors.changeReason ? 'has-error' : ''}`}
                    placeholder={
                      isPriceModified
                        ? "State specifically why charges changed (e.g., replaced brass valve, extra wiring labor)..."
                        : "Modify charges above to submit a price change request."
                    }
                    value={changeReason}
                    onChange={(e) => {
                      setChangeReason(e.target.value);
                      if (formErrors.changeReason) {
                        setFormErrors((prev) => ({ ...prev, changeReason: null }));
                      }
                    }}
                  />
                  {formErrors.changeReason && (
                    <span className="pricing-field-error">{formErrors.changeReason}</span>
                  )}
                </div>
              </div>

              {/* Itemized Comparison & Payout Ledger Table */}
              <div className="comparison-ledger-table-wrap">
                <span className="comparison-ledger-title">
                  {isPriceModified ? 'Price Comparison & Proposed Invoice' : 'Approved Active Invoice'}
                </span>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Charge Item</th>
                      <th className="text-right">Approved</th>
                      <th className="text-right">Proposed</th>
                      <th className="text-right">Diff</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Visiting Fee</td>
                      <td className="text-right">₹{approvedVisiting}</td>
                      <td className="text-right font-medium">₹{proposedVisiting}</td>
                      <td className="text-right">
                        {proposedVisiting - approvedVisiting !== 0 ? (
                          <span className={proposedVisiting > approvedVisiting ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                            {proposedVisiting > approvedVisiting ? '+' : ''}₹{proposedVisiting - approvedVisiting}
                          </span>
                        ) : '—'}
                      </td>
                    </tr>
                    <tr>
                      <td>Repair Labor</td>
                      <td className="text-right">₹{approvedLabor}</td>
                      <td className="text-right font-medium">₹{proposedLabor}</td>
                      <td className="text-right">
                        {proposedLabor - approvedLabor !== 0 ? (
                          <span className={proposedLabor > approvedLabor ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                            {proposedLabor > approvedLabor ? '+' : ''}₹{proposedLabor - approvedLabor}
                          </span>
                        ) : '—'}
                      </td>
                    </tr>
                    <tr>
                      <td>Materials & Parts</td>
                      <td className="text-right">₹{approvedMaterial}</td>
                      <td className="text-right font-medium">₹{proposedMaterial}</td>
                      <td className="text-right">
                        {proposedMaterial - approvedMaterial !== 0 ? (
                          <span className={proposedMaterial > approvedMaterial ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                            {proposedMaterial > approvedMaterial ? '+' : ''}₹{proposedMaterial - approvedMaterial}
                          </span>
                        ) : '—'}
                      </td>
                    </tr>
                    <tr className="row-total">
                      <td>Customer Total</td>
                      <td className="text-right">₹{approvedTotal}</td>
                      <td className="text-right font-bold text-[var(--emerald-ink)]">₹{proposedTotal}</td>
                      <td className="text-right font-bold">
                        {diffAmount !== 0 ? (
                          <span className={diffAmount > 0 ? 'text-amber-800' : 'text-emerald-800'}>
                            {diffAmount > 0 ? '+' : ''}₹{diffAmount} ({diffPercent}%)
                          </span>
                        ) : '₹0'}
                      </td>
                    </tr>
                    <tr className="row-subdued">
                      <td>Platform Fee (10%)</td>
                      <td className="text-right">- ₹{approvedPlatformFee}</td>
                      <td className="text-right">- ₹{proposedPlatformFee}</td>
                      <td className="text-right">—</td>
                    </tr>
                    <tr className="row-payout">
                      <td>Tech Net Payout</td>
                      <td className="text-right">₹{approvedTechnicianPayout}</td>
                      <td className="text-right font-bold text-emerald-800">₹{proposedTechnicianPayout}</td>
                      <td className="text-right font-semibold">
                        {proposedTechnicianPayout - approvedTechnicianPayout !== 0 ? (
                          <span>{proposedTechnicianPayout > approvedTechnicianPayout ? '+' : ''}₹{proposedTechnicianPayout - approvedTechnicianPayout}</span>
                        ) : '—'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="pcr-actions-container">
                {/* Submit Price Change Button */}
                <button
                  type="submit"
                  disabled={
                    !!pendingProposal ||
                    isSubmittingProposal ||
                    job.status === 'Completed' ||
                    job.status === 'Cancelled' ||
                    job.paymentStatus === 'Paid'
                  }
                  className="submit-price-proposal-btn"
                  title={
                    pendingProposal
                      ? "A revision is already pending customer approval"
                      : job.status === 'Completed' || job.status === 'Cancelled'
                      ? "Booking is already finalized"
                      : "Submit revised pricing for customer approval"
                  }
                >
                  <Send size={15} />
                  <span>
                    {isSubmittingProposal
                      ? 'Submitting Proposal...'
                      : 'Submit Price Change for Customer Approval'}
                  </span>
                </button>

                {/* Reset button when prices modified */}
                {isPriceModified && !pendingProposal && (
                  <button
                    type="button"
                    onClick={handleResetPricingToApproved}
                    className="reset-pricing-btn"
                  >
                    Reset to Approved (₹{approvedTotal})
                  </button>
                )}

                {/* Routine status/notes update */}
                <button
                  type="button"
                  onClick={handleSaveNotesOnly}
                  disabled={isUpdating}
                  className="save-notes-secondary-btn"
                >
                  <Check size={14} />
                  <span>{isUpdating ? 'Saving...' : 'Save Work Notes & Status Only'}</span>
                </button>
              </div>
            </form>

            {/* Proposal History Section */}
            {proposalHistory && proposalHistory.length > 0 && (
              <div className="proposal-history-section">
                <div className="proposal-history-header">
                  <div className="flex items-center gap-1.5">
                    <History size={14} className="text-[var(--emerald-ink)]" />
                    <span className="proposal-history-title">Price Change History ({proposalHistory.length})</span>
                  </div>
                </div>

                <div className="proposal-history-list">
                  {proposalHistory.map((p) => {
                    const isPending = p.status === 'PENDING_CUSTOMER_APPROVAL';
                    const isApproved = p.status === 'APPROVED';
                    const isRejected = p.status === 'REJECTED';

                    return (
                      <div key={p.id} className={`proposal-history-item status-${p.status?.toLowerCase()}`}>
                        <div className="proposal-item-top">
                          <span className={`proposal-status-chip chip-${p.status?.toLowerCase()}`}>
                            {isPending && 'Pending Customer Decision'}
                            {isApproved && 'Approved by Customer'}
                            {isRejected && 'Rejected by Customer'}
                          </span>
                          <span className="proposal-item-time">
                            {new Date(p.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <div className="proposal-item-amounts">
                          <span className="text-xs text-[var(--text-muted)]">
                            ₹{p.originalCustomerTotal} → <strong className="text-[var(--text-primary)]">₹{p.proposedCustomerTotal}</strong>
                          </span>
                          <span className={`proposal-item-diff ${p.difference >= 0 ? 'text-amber-800' : 'text-emerald-800'}`}>
                            {p.difference >= 0 ? '+' : ''}₹{p.difference} ({p.percentageChange}%)
                          </span>
                        </div>

                        <p className="proposal-item-reason">"{p.technicianReason}"</p>

                        {isRejected && p.customerRejectionReason && (
                          <div className="proposal-rejection-remark">
                            <span className="font-semibold text-red-800">Customer feedback: </span>
                            <span>"{p.customerRejectionReason}"</span>
                          </div>
                        )}
                        {isApproved && p.decidedAt && (
                          <div className="proposal-approved-remark">
                            <CheckCircle2 size={12} className="text-emerald-700" />
                            <span>Invoice updated to ₹{p.proposedCustomerTotal} on {new Date(p.decidedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

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
              <span className="font-bold text-[var(--text-primary)]">₹{approvedTotal.toLocaleString()}</span>
            </div>
            <div className="completion-summary-row border-t border-[var(--champagne-dark)] pt-2 mt-1">
              <span className="font-bold text-[var(--emerald-ink)]">Your Net Payout:</span>
              <span className="font-bold text-lg text-[var(--emerald-ink)] font-serif">
                ₹{approvedTechnicianPayout.toLocaleString()}
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
                <span>₹{(isPriceModified ? proposedTotal : approvedTotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-[var(--emerald-ink)] font-semibold">
                <span>Technician Net Payout</span>
                <span>₹{(isPriceModified ? proposedTechnicianPayout : approvedTechnicianPayout).toLocaleString()}</span>
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

      {/* ====================================================================
          CONFIRMATION MODAL: PRICE REVISION PROPOSAL SUBMITTED
          ==================================================================== */}
      {proposalSuccessModal && (
        <Modal
          isOpen={!!proposalSuccessModal}
          onClose={() => setProposalSuccessModal(null)}
          title="Price Change Proposal Submitted"
          subtitle={`Booking Reference: #${proposalSuccessModal.bookingReference}`}
          maxWidth="480px"
        >
          <div className="pcr-modal-success-content">
            <div className="pcr-modal-icon-badge">
              <CheckCircle2 size={36} className="text-emerald-700" />
            </div>
            <h4 className="pcr-modal-success-title">Quotation Sent for Customer Approval</h4>
            <p className="pcr-modal-success-desc">
              Your revised total of <strong>₹{proposalSuccessModal.proposedCustomerTotal}</strong> has been transmitted to customer <strong>{proposalSuccessModal.customerName || job.customer?.name}</strong>.
            </p>

            <div className="pcr-modal-summary-card">
              <div className="pcr-summary-row">
                <span>Original Approved Total:</span>
                <span className="font-medium">₹{proposalSuccessModal.originalCustomerTotal}</span>
              </div>
              <div className="pcr-summary-row">
                <span>Proposed Customer Total:</span>
                <span className="font-bold text-[var(--emerald-ink)]">₹{proposalSuccessModal.proposedCustomerTotal}</span>
              </div>
              <div className="pcr-summary-row">
                <span>Total Difference:</span>
                <span className="font-semibold text-amber-800">
                  {proposalSuccessModal.difference >= 0 ? '+' : ''}₹{proposalSuccessModal.difference} ({proposalSuccessModal.percentageChange}%)
                </span>
              </div>
              <div className="pcr-summary-row pt-1.5 border-t border-[var(--champagne-dark)]">
                <span>Proposed Technician Payout:</span>
                <span className="font-bold text-emerald-800">₹{proposalSuccessModal.proposedTechnicianPayout}</span>
              </div>
            </div>

            <div className="pcr-modal-note-box">
              <Info size={14} className="text-[var(--emerald-ink)] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--text-secondary)] m-0">
                <strong>Important:</strong> The customer's current payable amount remains <strong>₹{proposalSuccessModal.originalCustomerTotal}</strong> until they explicitly accept this proposal in their My Bookings portal.
              </p>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="primary-workflow-btn w-full"
                onClick={() => setProposalSuccessModal(null)}
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
