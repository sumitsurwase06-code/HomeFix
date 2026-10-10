import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Phone,
  Wrench,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowRight,
  Check,
  Calendar,
  DollarSign,
  Camera,
  X,
  FileText,
  Inbox
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingApi } from '../../services/api';
import './TechnicianPortal.css';

export default function Schedule() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('today'); // 'today', 'week', 'all'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
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
        console.error('Error loading schedule:', err);
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

  // Active bookings on schedule (Accepted, Scheduled, On the Way, In Progress, Completed)
  const activeBookings = bookings
    .filter((b) => ['Accepted', 'Scheduled', 'On the Way', 'In Progress', 'Completed'].includes(b.status))
    .sort((a, b) => new Date(a.scheduledDate || a.createdAt || '2026-10-11') - new Date(b.scheduledDate || b.createdAt || '2026-10-11'));

  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = activeBookings.filter(
    (b) => b.scheduledDate === todayStr || !b.scheduledDate || b.scheduledDate === '2026-10-11' || b.scheduledDate === 'Today'
  );
  const upcomingBookings = activeBookings.filter(
    (b) => b.scheduledDate && b.scheduledDate !== todayStr && b.scheduledDate !== '2026-10-11' && b.scheduledDate !== 'Today'
  );
  const inProgressCount = activeBookings.filter((b) => ['On the Way', 'In Progress'].includes(b.status)).length;

  // Generate 7-day strip based on current selected date
  const generateWeekDays = () => {
    const days = [];
    const baseDate = new Date(selectedDate || todayStr);
    // Find previous Monday or start from current date
    const startOffset = -2; // 2 days before to 4 days after
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + (startOffset + i));
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const count = activeBookings.filter(
        (b) => b.scheduledDate === iso || (iso === todayStr && (!b.scheduledDate || b.scheduledDate === 'Today'))
      ).length;
      days.push({ iso, dayName, dayNum, count, isToday: iso === todayStr });
    }
    return days;
  };

  const weekDays = generateWeekDays();

  // Date Navigation Stepper Handlers
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(todayStr);
    setViewMode('today');
  };

  // Determine which appointments to display
  let displayedAppointments = [];
  if (viewMode === 'today') {
    displayedAppointments = todayBookings;
  } else if (viewMode === 'all') {
    displayedAppointments = activeBookings;
  } else if (viewMode === 'week') {
    displayedAppointments = activeBookings.filter(
      (b) => b.scheduledDate === selectedDate || (selectedDate === todayStr && (!b.scheduledDate || b.scheduledDate === 'Today'))
    );
  }

  const formatDisplayDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="portal-page schedule-page">
      {toastMessage && (
        <div className="portal-toast" role="status">
          <Check size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <header className="portal-page-header">
        <div>
          <h1 className="portal-page-title">My Schedule</h1>
          <p className="portal-page-subtitle">
            Plan your appointments and manage today's jobs.
          </p>
        </div>
        <Link to="/technician/bookings" className="portal-btn portal-btn-outline portal-btn-sm flex items-center gap-2">
          <span>View All Jobs</span>
          <ArrowRight size={14} />
        </Link>
      </header>

      {/* 3 Summary Metrics */}
      <section className="my-jobs-summary-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }} aria-label="Schedule Summary">
        <div
          className={`my-jobs-summary-card ${viewMode === 'today' ? 'active' : ''}`}
          onClick={() => { setViewMode('today'); setSelectedDate(todayStr); }}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-info">
            <span className="kpi-label">Today's Appointments</span>
            <span className="kpi-metric">{todayBookings.length}</span>
            <span className="kpi-subtext">Active on your route</span>
          </div>
          <div className="kpi-icon-wrap emerald">
            <CalendarDays size={22} />
          </div>
        </div>

        <div
          className={`my-jobs-summary-card ${viewMode === 'all' ? 'active' : ''}`}
          onClick={() => setViewMode('all')}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-info">
            <span className="kpi-label">Upcoming Schedule</span>
            <span className="kpi-metric">{upcomingBookings.length}</span>
            <span className="kpi-subtext">Future confirmed slots</span>
          </div>
          <div className="kpi-icon-wrap champagne">
            <Calendar size={22} />
          </div>
        </div>

        <div
          className="my-jobs-summary-card"
          onClick={() => setViewMode('today')}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-info">
            <span className="kpi-label">Jobs In Progress</span>
            <span className="kpi-metric">{inProgressCount}</span>
            <span className="kpi-subtext">Transit & on-site</span>
          </div>
          <div className="kpi-icon-wrap blue">
            <Wrench size={22} />
          </div>
        </div>
      </section>

      {/* Date Navigation & View Toolbar */}
      <section className="schedule-nav-toolbar" aria-label="Date and View Controls">
        <div className="schedule-date-stepper">
          <button
            type="button"
            className="schedule-stepper-btn"
            onClick={handlePrevDay}
            aria-label="Previous day"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="schedule-today-btn"
            onClick={handleToday}
          >
            Today
          </button>
          <button
            type="button"
            className="schedule-stepper-btn"
            onClick={handleNextDay}
            aria-label="Next day"
          >
            <ChevronRight size={16} />
          </button>

          <span className="schedule-current-date-title ml-2">
            {selectedDate === todayStr ? 'Today · ' : ''}{formatDisplayDate(selectedDate)}
          </span>
        </div>

        <div className="schedule-view-pills">
          <button
            type="button"
            className={`schedule-view-btn ${viewMode === 'today' ? 'active' : ''}`}
            onClick={() => { setViewMode('today'); setSelectedDate(todayStr); }}
          >
            Today's Route ({todayBookings.length})
          </button>
          <button
            type="button"
            className={`schedule-view-btn ${viewMode === 'week' ? 'active' : ''}`}
            onClick={() => setViewMode('week')}
          >
            7-Day Week Strip
          </button>
          <button
            type="button"
            className={`schedule-view-btn ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
          >
            All Scheduled ({activeBookings.length})
          </button>
        </div>
      </section>

      {/* 7-Day Interactive Week Strip (Always visible or in Week mode) */}
      {viewMode === 'week' && (
        <section className="schedule-week-strip" aria-label="7-Day Calendar Strip">
          {weekDays.map((day) => (
            <div
              key={day.iso}
              className={`schedule-week-day-card ${selectedDate === day.iso ? 'active' : ''}`}
              onClick={() => setSelectedDate(day.iso)}
              role="button"
              tabIndex={0}
            >
              <span className="schedule-week-day-name">{day.dayName}</span>
              <span className="schedule-week-day-num">{day.dayNum}</span>
              <span className="schedule-week-job-badge">
                {day.count} {day.count === 1 ? 'job' : 'jobs'}
              </span>
            </div>
          ))}
        </section>
      )}

      {/* Schedule Timeline Content */}
      {loading ? (
        <div className="portal-loading">
          <div className="portal-spinner"></div>
          <p>Loading your appointments schedule...</p>
        </div>
      ) : displayedAppointments.length === 0 ? (
        <div className="portal-empty-state">
          <div className="empty-icon">
            <CalendarDays size={36} className="text-[var(--secondary)] mx-auto" />
          </div>
          <h3 className="empty-title">No appointments scheduled for this date.</h3>
          <p className="empty-desc">
            Your itinerary is open. Check incoming job requests to accept new dispatch assignments.
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <button
              type="button"
              className="portal-btn portal-btn-outline portal-btn-sm"
              onClick={handleToday}
            >
              Return to Today
            </button>
            <Link to="/technician/requests" className="portal-btn portal-btn-primary portal-btn-sm">
              Browse New Requests
            </Link>
          </div>
        </div>
      ) : (
        <div className="schedule-timeline-container">
          {displayedAppointments.map((job, idx) => {
            const visitingFee = job.pricing?.visitingCharge || 199;
            const payout = job.pricing?.technicianPayout || 495;

            return (
              <React.Fragment key={job.id}>
                <article className="schedule-timeline-card" aria-label={`Appointment stop ${idx + 1}`}>
                  {/* Left Column: Time & Stop Index */}
                  <div className="schedule-timeline-time-col">
                    <span className="schedule-stop-num">Stop #{idx + 1}</span>
                    <span className="schedule-time-val">
                      {job.scheduledTimeSlot?.split('-')[0] || '10:00 AM'}
                    </span>
                    <span className="text-[0.7rem] text-[var(--text-muted)] font-medium">
                      {job.scheduledDate || 'Today'}
                    </span>
                    <div className="mt-1">
                      <span className={`status-pill status-${job.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Appointment Body */}
                  <div className="schedule-timeline-body">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
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
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase block">Est. Payout</span>
                        <span className="text-base font-extrabold text-[var(--emerald-ink)]">₹{payout}</span>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="my-job-meta-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
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
                          <MapPin size={13} />
                          <span>Location</span>
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
                          <Clock size={13} />
                          <span>Arrival Window</span>
                        </span>
                        <span className="my-job-meta-val">
                          {job.scheduledTimeSlot || '10:00 AM - 12:00 PM'}
                        </span>
                        <span className="text-[0.72rem] text-[var(--text-muted)]">
                          Visiting Fee: ₹{visitingFee}
                        </span>
                      </div>
                    </div>

                    {job.problemDescription && (
                      <p className="my-job-desc-snippet line-clamp-2">
                        "{job.problemDescription}"
                      </p>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--border-light)] flex-wrap">
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
                      </div>

                      <button
                        type="button"
                        className="portal-btn portal-btn-outline portal-btn-sm"
                        onClick={() => setSelectedJobForDetails(job)}
                      >
                        <Eye size={14} />
                        <span>Inspect Job Details</span>
                      </button>
                    </div>
                  </div>
                </article>

                {/* Available Time Slot indicator between stops */}
                {idx < displayedAppointments.length - 1 && (
                  <div className="schedule-available-slot">
                    <span className="flex items-center gap-2">
                      <Clock size={15} />
                      <span>Open Transit / Service Window</span>
                    </span>
                    <span className="text-xs font-semibold text-[var(--text-muted)]">
                      Available for dispatch assignment
                    </span>
                  </div>
                )}
              </React.Fragment>
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
              {/* Customer Problem Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1 flex items-center gap-1.5">
                  <FileText size={14} />
                  <span>Customer Diagnostic Notes</span>
                </h4>
                <div className="p-3 bg-[var(--surface-raised)] border border-[var(--champagne-border)] rounded-xl text-sm text-[var(--text-primary)]">
                  {selectedJobForDetails.problemDescription || 'No diagnostic notes provided by customer.'}
                </div>
              </div>

              {/* Uploaded Diagnostic Photos */}
              {selectedJobForDetails.problemImages && selectedJobForDetails.problemImages.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
                    <Camera size={14} />
                    <span>Customer Attached Photos ({selectedJobForDetails.problemImages.length})</span>
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
                    <span>Scheduled Slot</span>
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
                    <span>Customer Info</span>
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

              {/* Pricing Breakdown */}
              <div className="p-3.5 bg-[var(--emerald-subtle)] border border-[rgba(6,78,59,0.2)] rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--emerald-ink)]">
                    Visiting Fee
                  </span>
                  <span className="text-sm font-extrabold text-[var(--emerald-ink)]">
                    ₹{selectedJobForDetails.pricing?.visitingCharge || 199}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1 pt-1 border-t border-[rgba(6,78,59,0.15)]">
                  <span className="text-xs text-[var(--text-secondary)]">
                    Net Partner Payout (Est.)
                  </span>
                  <span className="text-base font-extrabold text-[var(--emerald-ink)]">
                    ₹{(selectedJobForDetails.pricing?.technicianPayout || 495).toLocaleString()}
                  </span>
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
