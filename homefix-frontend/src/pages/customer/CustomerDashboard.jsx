import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarPlus,
  Users,
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
  Wrench,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Phone,
  User,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_BOOKINGS } from '../../data/bookings';
import { bookingApi } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import './CustomerDashboard.css';

const STATUS_EXPLANATIONS = {
  REQUESTED: {
    title: 'Requested',
    description: 'Your booking has been dispatched to verified local specialists and is awaiting technician acceptance.',
    color: '#D97706',
    step: 'Step 1 of 5'
  },
  ACCEPTED: {
    title: 'Accepted',
    description: 'A verified technician has accepted your request and confirmed their availability for your appointment slot.',
    color: '#0284C7',
    step: 'Step 2 of 5'
  },
  SCHEDULED: {
    title: 'Scheduled',
    description: 'Your doorstep appointment is confirmed on the technician\'s daily service itinerary.',
    color: '#0284C7',
    step: 'Step 2 of 5'
  },
  ON_THE_WAY: {
    title: 'On the Way',
    description: 'The technician is currently in transit to your registered service address.',
    color: '#059669',
    step: 'Step 3 of 5'
  },
  IN_PROGRESS: {
    title: 'In Progress',
    description: 'The specialist is currently on-site performing diagnostic inspection and repair work.',
    color: '#059669',
    step: 'Step 4 of 5'
  },
  COMPLETED: {
    title: 'Completed',
    description: 'Service has been fulfilled, tested, and marked complete. Digital invoice and receipt are available.',
    color: '#064E3B',
    step: 'Fulfilled'
  },
  CANCELLED: {
    title: 'Cancelled',
    description: 'This booking request was cancelled and is no longer active.',
    color: '#DC2626',
    step: 'Terminated'
  }
};

export default function CustomerDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState(DEMO_BOOKINGS);
  const [loading, setLoading] = useState(true);

  // Popups state
  const [quickViewBooking, setQuickViewBooking] = useState(null);
  const [statusModalInfo, setStatusModalInfo] = useState(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await bookingApi.getCustomerBookings(currentUser?.id || 1);
        if (data && data.length > 0) {
          setBookings(data);
        }
      } catch (err) {
        console.error('Error fetching customer bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  // Handle ESC key to close any active modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setQuickViewBooking(null);
        setStatusModalInfo(null);
        setIsHelpModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute Metrics
  const activeBookings = bookings.filter((b) => ['On the Way', 'In Progress'].includes(b.status));
  const upcomingBookings = bookings.filter((b) => ['Requested', 'Accepted', 'Scheduled'].includes(b.status));
  const completedBookings = bookings.filter((b) => b.status === 'Completed');

  // Priority algorithm for prominent featured card (Section 5):
  // 1. In Progress / On the Way
  // 2. Accepted / Scheduled
  // 3. Requested
  const nextAppointment =
    activeBookings[0] ||
    upcomingBookings.find((b) => ['Accepted', 'Scheduled'].includes(b.status)) ||
    upcomingBookings[0] ||
    null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = currentUser?.name?.split(' ')[0] || 'Member';

  const handleStatusBadgeClick = (e, status) => {
    e.stopPropagation();
    const key = (status || '').toUpperCase().replace(/[\s-]/g, '_');
    const config = STATUS_EXPLANATIONS[key] || {
      title: status,
      description: `Current service status is ${status}.`,
      color: '#064E3B',
      step: 'Current Stage'
    };
    setStatusModalInfo(config);
  };

  return (
    <div className="cust-dashboard-root">
      {/* 1. Compact Welcome Header */}
      <div className="cust-welcome-header">
        <div className="cust-welcome-text">
          <h1>
            {getGreeting()}, {displayName}
          </h1>
          <p>Manage your bookings and home services in one place.</p>
        </div>

        <Link to="/customer/profile" className="cust-profile-pill" title="View Customer Profile">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt=""
            className="cust-profile-avatar"
          />
          <span>{currentUser?.name || 'My Profile'}</span>
        </Link>
      </div>

      {/* 2. Compact Booking Summary Metrics */}
      <div className="cust-metrics-grid">
        <Link
          to="/customer/bookings"
          state={{ tab: 'active' }}
          className="cust-metric-card active-theme"
          title="View Active Ongoing Services"
        >
          <div className="cust-metric-info">
            <span className="cust-metric-label">Active Services</span>
            <span className="cust-metric-count">{activeBookings.length}</span>
            <span className="cust-metric-hint">
              {activeBookings.length > 0 ? 'In progress or on the way →' : 'No active repairs →'}
            </span>
          </div>
          <div className="cust-metric-icon-wrap emerald">
            <Clock size={22} />
          </div>
        </Link>

        <Link
          to="/customer/bookings"
          state={{ tab: 'active' }}
          className="cust-metric-card upcoming-theme"
          title="View Upcoming Scheduled Appointments"
        >
          <div className="cust-metric-info">
            <span className="cust-metric-label">Upcoming Appointments</span>
            <span className="cust-metric-count">{upcomingBookings.length}</span>
            <span className="cust-metric-hint">View schedule list →</span>
          </div>
          <div className="cust-metric-icon-wrap blue">
            <CalendarCheck size={22} />
          </div>
        </Link>

        <Link
          to="/customer/bookings"
          state={{ tab: 'completed' }}
          className="cust-metric-card completed-theme"
          title="View Completed Service History"
        >
          <div className="cust-metric-info">
            <span className="cust-metric-label">Completed Jobs</span>
            <span className="cust-metric-count">{completedBookings.length}</span>
            <span className="cust-metric-hint">Invoices & receipts →</span>
          </div>
          <div className="cust-metric-icon-wrap champagne">
            <CheckCircle2 size={22} />
          </div>
        </Link>
      </div>

      {/* 3. Prominent Next Appointment / Active Booking Card */}
      {nextAppointment ? (
        <div className={`cust-featured-card ${['In Progress', 'On the Way'].includes(nextAppointment.status) ? 'in-progress-border' : ''}`}>
          <div className="cust-featured-top">
            <div className="cust-featured-badge-group">
              {['In Progress', 'On the Way'].includes(nextAppointment.status) ? (
                <span className="cust-featured-tag live-pulse">
                  <span className="live-dot-ping"></span>
                  Active Service
                </span>
              ) : (
                <span className="cust-featured-tag">Next Appointment</span>
              )}
              <span className="cust-booking-ref-badge">
                {nextAppointment.bookingReference || nextAppointment.id}
              </span>
            </div>

            <button
              type="button"
              className="cust-status-badge-btn"
              onClick={(e) => handleStatusBadgeClick(e, nextAppointment.status)}
              title="Click to view status explanation"
            >
              <StatusBadge status={nextAppointment.status} size="sm" />
            </button>
          </div>

          <div className="cust-featured-body">
            <div>
              <h2 className="cust-featured-title font-serif">
                {nextAppointment.problemTitle || `${nextAppointment.serviceName || nextAppointment.serviceCategory} Service`}
              </h2>

              <div className="cust-featured-meta-row">
                <div className="cust-meta-item">
                  <Clock size={15} />
                  <span>
                    <strong>{nextAppointment.appointmentDate || nextAppointment.scheduledDate || 'Today'}</strong> · {nextAppointment.appointmentTime || nextAppointment.scheduledTimeSlot || '10:00 AM - 12:00 PM'}
                  </span>
                </div>

                <div className="cust-meta-item">
                  <MapPin size={15} />
                  <span>
                    {nextAppointment.address?.locality || nextAppointment.customer?.locality || 'Noida'}, {nextAppointment.address?.city || 'Delhi NCR'}
                  </span>
                </div>

                {nextAppointment.technicianName && (
                  <div className="cust-meta-item">
                    <User size={15} />
                    <span>Technician: <strong>{nextAppointment.technicianName}</strong></span>
                  </div>
                )}
              </div>
            </div>

            <div className="cust-featured-actions">
              <button
                type="button"
                className="cust-btn-quick-view"
                onClick={() => setQuickViewBooking(nextAppointment)}
              >
                Quick View
              </button>

              <Link
                to={`/customer/bookings/${nextAppointment.id}`}
                className="btn btn-primary btn-sm"
              >
                <span>Track Booking</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="cust-featured-empty">
          <div className="cust-empty-info">
            <h3>You don't have an active service right now</h3>
            <p>Ready for a repair or home improvement? Book a verified trade specialist in minutes.</p>
          </div>
          <Link to="/customer/book" className="btn btn-primary btn-sm">
            <CalendarPlus size={15} />
            <span>Book a Service</span>
          </Link>
        </div>
      )}

      {/* 4. Redesigned Quick Actions (Compact 3-Column Grid) */}
      <div className="cust-actions-section">
        <div className="cust-section-title-row">
          <h3 className="cust-section-title">Quick Actions</h3>
          <button
            type="button"
            className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer"
            onClick={() => setIsHelpModalOpen(true)}
          >
            <HelpCircle size={14} />
            <span>Service Guarantee & Help</span>
          </button>
        </div>

        <div className="cust-actions-grid">
          <Link to="/customer/book" className="cust-action-tile">
            <div className="cust-tile-icon-box">
              <CalendarPlus size={20} />
            </div>
            <div className="cust-tile-content">
              <h4>Book a Service</h4>
              <p>Step-by-step diagnostic booking wizard for all household trades</p>
            </div>
          </Link>

          <Link to="/customer/technicians" className="cust-action-tile">
            <div className="cust-tile-icon-box">
              <Users size={20} />
            </div>
            <div className="cust-tile-content">
              <h4>Find a Technician</h4>
              <p>Explore rated plumbing, electrical, carpentry & appliance pros</p>
            </div>
          </Link>

          <Link to="/customer/bookings" className="cust-action-tile">
            <div className="cust-tile-icon-box">
              <CalendarCheck size={20} />
            </div>
            <div className="cust-tile-content">
              <h4>My Bookings</h4>
              <p>Review real-time progress, appointment history, and receipts</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 5. Recent Bookings (Compact Table / Rows) */}
      <div className="cust-recent-container">
        <div className="cust-recent-header">
          <h3 className="cust-section-title">Recent Bookings</h3>
          <Link to="/customer/bookings" className="cust-section-link">
            <span>View all bookings ({bookings.length})</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="cust-booking-rows-list">
          {bookings.slice(0, 3).map((job) => {
            const totalAmount = job.pricing?.customerTotal || job.pricing?.total || 450;

            return (
              <div key={job.id} className="cust-booking-row-item">
                <div className="cust-row-service">
                  <div className="cust-service-avatar-box">
                    <Wrench size={18} />
                  </div>
                  <div className="cust-service-text-group">
                    <span className="cust-row-category">
                      {job.serviceName || job.serviceCategory || 'Home Repair'}
                    </span>
                    <span className="cust-row-title">
                      {job.problemTitle || `${job.serviceName || 'Service'} Visit`}
                    </span>
                    <span className="cust-row-ref">{job.bookingReference || job.id}</span>
                  </div>
                </div>

                <div className="cust-row-datetime">
                  <strong>{job.appointmentDate || job.scheduledDate || 'Today'}</strong>
                  <span>{job.appointmentTime || job.scheduledTimeSlot || '10:00 AM'}</span>
                </div>

                <div>
                  <button
                    type="button"
                    className="cust-status-badge-btn"
                    onClick={(e) => handleStatusBadgeClick(e, job.status)}
                    title="Click to view status info"
                  >
                    <StatusBadge status={job.status} size="sm" />
                  </button>
                </div>

                <div className="cust-row-price">
                  ₹{totalAmount}
                </div>

                <div className="cust-row-actions">
                  <button
                    type="button"
                    className="cust-btn-quick-view"
                    onClick={() => setQuickViewBooking(job)}
                  >
                    Quick View
                  </button>
                  <Link
                    to={`/customer/bookings/${job.id}`}
                    className="cust-btn-full-view"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE POPUPS & MODALS
          ========================================================================= */}

      {/* A. Booking Details Quick View Modal */}
      {quickViewBooking && (
        <div
          className="cust-modal-backdrop"
          onClick={() => setQuickViewBooking(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Booking Quick View"
        >
          <div className="cust-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="cust-modal-header">
              <div className="cust-modal-title-wrap">
                <h3>{quickViewBooking.problemTitle || quickViewBooking.serviceName}</h3>
                <span>Ref: {quickViewBooking.bookingReference || quickViewBooking.id}</span>
              </div>
              <button
                type="button"
                className="cust-modal-close-btn"
                onClick={() => setQuickViewBooking(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="cust-modal-body">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-semibold uppercase">Current Status:</span>
                <StatusBadge status={quickViewBooking.status} size="sm" />
              </div>

              <div className="cust-popup-info-grid">
                <div>
                  <span className="cust-popup-k">Appointment Date</span>
                  <div className="cust-popup-v">
                    📅 {quickViewBooking.appointmentDate || quickViewBooking.scheduledDate || 'Today'}
                  </div>
                </div>
                <div>
                  <span className="cust-popup-k">Time Window</span>
                  <div className="cust-popup-v">
                    ⏰ {quickViewBooking.appointmentTime || quickViewBooking.scheduledTimeSlot || '10:00 AM - 12:00 PM'}
                  </div>
                </div>
                <div>
                  <span className="cust-popup-k">Service Address</span>
                  <div className="cust-popup-v">
                    📍 {quickViewBooking.address?.locality || quickViewBooking.customer?.locality || 'Noida'}, {quickViewBooking.address?.city || 'Delhi NCR'}
                  </div>
                </div>
                <div>
                  <span className="cust-popup-k">Assigned Specialist</span>
                  <div className="cust-popup-v">
                    👤 {quickViewBooking.technicianName || 'Verified Partner'}
                  </div>
                </div>
              </div>

              {quickViewBooking.problemDescription && (
                <div>
                  <span className="cust-popup-k mb-1">Problem Description</span>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 m-0">
                    "{quickViewBooking.problemDescription}"
                  </p>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="cust-popup-pricing-box">
                <span className="cust-popup-k mb-2">Quotation Summary</span>
                <div className="cust-popup-price-line">
                  <span>Visiting & Diagnostic Fee:</span>
                  <span>₹{quickViewBooking.pricing?.visitingCharge || 199}</span>
                </div>
                {quickViewBooking.pricing?.repairLabor > 0 && (
                  <div className="cust-popup-price-line">
                    <span>Labor & Repair Charge:</span>
                    <span>₹{quickViewBooking.pricing.repairLabor}</span>
                  </div>
                )}
                {quickViewBooking.pricing?.materialCharge > 0 && (
                  <div className="cust-popup-price-line">
                    <span>Materials / Parts:</span>
                    <span>₹{quickViewBooking.pricing.materialCharge}</span>
                  </div>
                )}
                <div className="cust-popup-price-total">
                  <span>Total Amount:</span>
                  <span>₹{quickViewBooking.pricing?.customerTotal || quickViewBooking.pricing?.total || 450}</span>
                </div>
              </div>
            </div>

            <div className="cust-modal-footer">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setQuickViewBooking(null)}
              >
                Close
              </button>
              <Link
                to={`/customer/bookings/${quickViewBooking.id}`}
                className="btn btn-primary btn-sm"
                onClick={() => setQuickViewBooking(null)}
              >
                <span>Full Details & Tracking →</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* B. Status Information Popup */}
      {statusModalInfo && (
        <div
          className="cust-modal-backdrop"
          onClick={() => setStatusModalInfo(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Status Information"
        >
          <div className="cust-modal-box" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="cust-modal-header">
              <div className="cust-modal-title-wrap">
                <h3>Status: {statusModalInfo.title}</h3>
                <span>{statusModalInfo.step}</span>
              </div>
              <button
                type="button"
                className="cust-modal-close-btn"
                onClick={() => setStatusModalInfo(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="cust-modal-body">
              <div className="status-definition-card">
                <p className="text-xs text-slate-700 m-0 leading-relaxed">
                  {statusModalInfo.description}
                </p>
              </div>

              <div>
                <span className="cust-popup-k mb-2">Service Lifecycle Stages</span>
                <div className="status-stages-list">
                  {['Requested', 'Accepted', 'On the Way', 'In Progress', 'Completed'].map((stage) => {
                    const isCurrent = stage.toLowerCase() === statusModalInfo.title.toLowerCase();
                    return (
                      <div key={stage} className={`status-stage-item ${isCurrent ? 'current' : 'text-slate-500'}`}>
                        <span>{isCurrent ? '●' : '○'}</span>
                        <span>{stage}</span>
                        {isCurrent && <span className="text-[10px] uppercase font-bold text-emerald-800 ml-auto">(Active)</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="cust-modal-footer">
              <button
                type="button"
                className="btn btn-primary btn-sm w-full"
                onClick={() => setStatusModalInfo(null)}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* C. HomeFix Guarantee & Help Modal */}
      {isHelpModalOpen && (
        <div
          className="cust-modal-backdrop"
          onClick={() => setIsHelpModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Help and Guarantee"
        >
          <div className="cust-modal-box" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
            <div className="cust-modal-header">
              <div className="cust-modal-title-wrap">
                <h3>HomeFix Customer Assistance</h3>
                <span>Guaranteed Service Quality</span>
              </div>
              <button
                type="button"
                className="cust-modal-close-btn"
                onClick={() => setIsHelpModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="cust-modal-body">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <ShieldCheck size={24} className="text-emerald-800 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-emerald-900 m-0">30-Day Service Guarantee</h4>
                  <p className="text-xs text-emerald-800 mt-1 mb-0 leading-relaxed">
                    All completed repairs by verified HomeFix technicians include a 30-day revisit warranty against defect recurrence.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-xs text-slate-600">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span>Customer Care Helpline:</span>
                  <strong className="text-emerald-900">1800-419-HOME (Toll-free)</strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span>Support Email:</span>
                  <strong className="text-emerald-900">support@homefix.demo</strong>
                </div>
              </div>
            </div>

            <div className="cust-modal-footer">
              <button
                type="button"
                className="btn btn-primary btn-sm w-full"
                onClick={() => setIsHelpModalOpen(false)}
              >
                Close Help
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
