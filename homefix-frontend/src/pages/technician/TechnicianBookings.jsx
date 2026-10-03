import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Search, Filter } from 'lucide-react';
import { DEMO_BOOKINGS } from '../../data/bookings';
import BookingCard from '../../components/booking/BookingCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

export default function TechnicianBookings() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = DEMO_BOOKINGS.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      b.customer.name.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'ongoing') {
      return ['Accepted', 'Scheduled', 'On the Way', 'In Progress'].includes(b.status);
    }
    if (filterStatus === 'completed') {
      return b.status === 'Completed';
    }
    if (filterStatus === 'cancelled') {
      return b.status === 'Cancelled';
    }
    return true;
  });

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assigned Customer Jobs</h1>
          <p className="page-subtitle">Manage dispatch lifecycle, enter charges, and inspect job history</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="tabs-group">
          {['all', 'ongoing', 'completed', 'cancelled'].map((tab) => (
            <Button
              key={tab}
              variant={filterStatus === tab ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilterStatus(tab)}
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>

        <div style={{ maxWidth: '320px', width: '100%' }}>
          <Input
            placeholder="Search by ID, trade or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
            wrapperClassName="mb-0"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((booking) => (
            <BookingCard key={booking.id} booking={booking} role="technician" />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs matching filter"
          description="There are no jobs corresponding to this criteria."
        />
      )}
    </div>
  );
}
