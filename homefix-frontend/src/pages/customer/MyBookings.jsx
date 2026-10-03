import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, Search, Filter } from 'lucide-react';
import { DEMO_BOOKINGS } from '../../data/bookings';
import BookingCard from '../../components/booking/BookingCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'completed' | 'cancelled'
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingsList, setBookingsList] = useState(DEMO_BOOKINGS);

  const handleCancel = (bookingId) => {
    setBookingsList((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    );
  };

  const filtered = bookingsList.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.technicianName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

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

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Service Bookings</h1>
          <p className="page-subtitle">Track and manage your ongoing and past maintenance appointments</p>
        </div>

        <Link to="/customer/book">
          <Button variant="primary" size="md" rightIcon={<CalendarPlus size={16} />}>
            New Booking
          </Button>
        </Link>
      </div>

      {/* Tabs and Search Bar */}
      <div className="filter-bar">
        <div className="tabs-group">
          {['all', 'active', 'completed', 'cancelled'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>

        <div style={{ maxWidth: '320px', width: '100%' }}>
          <Input
            placeholder="Search bookings or technician..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={16} />}
            wrapperClassName="mb-0"
          />
        </div>
      </div>

      {/* Bookings List */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              role="customer"
              onCancel={handleCancel}
            />
          ))}
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
