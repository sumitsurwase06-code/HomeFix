import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarPlus, Search, X, AlertTriangle, ArrowRight } from 'lucide-react';
import { DEMO_BOOKINGS } from '../../data/bookings';
import { useCustomerNotifications } from '../../context/CustomerNotificationContext';
import BookingCard from '../../components/booking/BookingCard';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import './MyBookings.css';

export default function MyBookings() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = location.state?.tab || queryParams.get('tab') || 'all';

  const [activeTab, setActiveTab] = useState(initialTab); // 'all' | 'active' | 'completed' | 'cancelled' | 'pending'
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingsList, setBookingsList] = useState(DEMO_BOOKINGS);
  const { pendingProposals, pendingCount, openReviewModal } = useCustomerNotifications();

  useEffect(() => {
    const tabParam = location.state?.tab || new URLSearchParams(location.search).get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.state, location.search]);

  const handleCancel = (bookingId) => {
    setBookingsList((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    );
  };

  // Counts for each tab
  const tabCounts = useMemo(() => {
    const all = bookingsList.length;
    const active = bookingsList.filter((b) =>
      ['Requested', 'Accepted', 'Scheduled', 'On the Way', 'In Progress'].includes(b.status)
    ).length;
    const completed = bookingsList.filter((b) => b.status === 'Completed').length;
    const cancelled = bookingsList.filter((b) => b.status === 'Cancelled').length;
    const pending = pendingCount;
    return { all, active, completed, cancelled, pending };
  }, [bookingsList, pendingCount]);

  const filtered = useMemo(() => {
    return bookingsList.filter((b) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.id.toLowerCase().includes(q) ||
        b.serviceName.toLowerCase().includes(q) ||
        (b.technicianName && b.technicianName.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (activeTab === 'pending') {
        return pendingProposals.some(
          (p) => p.bookingId === b.id || p.bookingReference === b.id || p.bookingReference === b.bookingReference
        );
      }
      if (activeTab === 'active') {
        return ['Requested', 'Accepted', 'Scheduled', 'On the Way', 'In Progress'].includes(b.status);
      }
      if (activeTab === 'completed') {
        return b.status === 'Completed';
      }
      if (activeTab === 'cancelled') {
        return b.status === 'Cancelled';
      }
      return true;
    });
  }, [bookingsList, searchTerm, activeTab, pendingProposals]);

  return (
    <div className="my-bookings-page">
      {/* Page Header */}
      <div className="my-bookings-header">
        <div>
          <h1 className="my-bookings-title">My Service Bookings</h1>
          <p className="my-bookings-subtitle">
            Track and manage your ongoing and past maintenance appointments
          </p>
        </div>

        <Link to="/customer/book">
          <Button variant="primary" size="md" rightIcon={<CalendarPlus size={16} />}>
            New Booking
          </Button>
        </Link>
      </div>

      {/* Action Required: Pending Price Revisions Notification Banner */}
      {pendingCount > 0 && pendingProposals.length > 0 && (
        <div className="my-bookings-pcr-banner">
          <div className="pcr-banner-icon-badge">
            <AlertTriangle size={20} className="text-amber-800" />
          </div>
          <div className="pcr-banner-content">
            <h4 className="pcr-banner-title">
              Technician Requested a Price Revision ({pendingCount} Pending)
            </h4>
            <p className="pcr-banner-desc">
              Your technician submitted revised service charges. Your current payable amount remains unchanged until you review and approve or reject.
            </p>
          </div>
          <button
            type="button"
            className="pcr-banner-btn cursor-pointer"
            onClick={() => openReviewModal(pendingProposals[0])}
          >
            <span>Review Revision (#{pendingProposals[0].bookingReference || pendingProposals[0].bookingId})</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Filter Toolbar: Tabs & Search */}
      <div className="my-bookings-toolbar">
        <div className="bookings-tabs-wrap" role="tablist" aria-label="Booking Status Filter">
          {[
            { id: 'all', label: 'All Bookings', count: tabCounts.all },
            { id: 'pending', label: 'Pending Approvals', count: tabCounts.pending, isPending: true },
            { id: 'active', label: 'Active', count: tabCounts.active },
            { id: 'completed', label: 'Completed', count: tabCounts.completed },
            { id: 'cancelled', label: 'Cancelled', count: tabCounts.cancelled },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`booking-tab-pill ${isActive ? 'active' : ''} ${tab.isPending && tab.count > 0 ? 'pending-highlight' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
                <span className={`tab-count-badge ${tab.isPending && tab.count > 0 ? 'bg-amber-500 text-white' : ''}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input with clear button */}
        <div className="bookings-search-wrapper">
          <Search size={15} className="bookings-search-icon" />
          <input
            type="text"
            className="bookings-search-input"
            placeholder="Search booking or technician..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search bookings"
          />
          {searchTerm && (
            <button
              type="button"
              className="bookings-search-clear"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Bookings List Grid */}
      {filtered.length > 0 ? (
        <div className="my-bookings-grid">
          {filtered.map((booking) => {
            const proposalForBooking = pendingProposals.find(
              (p) => p.bookingId === booking.id || p.bookingReference === booking.id
            );

            return (
              <BookingCard
                key={booking.id}
                booking={booking}
                role="customer"
                onCancel={handleCancel}
                pendingProposal={proposalForBooking}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No bookings found"
          description={
            searchTerm
              ? `No bookings matched your search query "${searchTerm}".`
              : `You have no ${activeTab !== 'all' ? activeTab : ''} bookings at the moment.`
          }
          actionLabel="Book a Repair Service"
          onAction={() => (window.location.href = '/customer/book')}
          actionIcon={<CalendarPlus size={16} />}
        />
      )}
    </div>
  );
}
