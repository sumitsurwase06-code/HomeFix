import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Filter } from 'lucide-react';
import { DEMO_BOOKINGS } from '../../data/bookings';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function ManageBookings() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = DEMO_BOOKINGS.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">All Service Bookings</h1>
          <p className="page-subtitle">Supervise platform dispatch, customer requests, and fulfillment status</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="tabs-group">
          {['all', 'Requested', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'].map((st) => (
            <Button
              key={st}
              variant={statusFilter === st ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </Button>
          ))}
        </div>

        <div style={{ maxWidth: '320px', width: '100%' }}>
          <Input
            placeholder="Search booking ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
            wrapperClassName="mb-0"
          />
        </div>
      </div>

      <Card className="p-6" style={{ padding: '1.5rem' }}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Technician</th>
                <th>Service Trade</th>
                <th>Appointment Slot</th>
                <th>Total Amount</th>
                <th>Payment</th>
                <th>Booking Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: 'var(--primary)' }}>{b.id}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text)' }}>{b.customer.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{b.technicianName}</td>
                  <td style={{ fontWeight: 600 }}>{b.serviceName}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{b.appointmentDate}</td>
                  <td style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>₹{b.pricing.customerTotal}</td>
                  <td><Badge status={b.paymentStatus === 'Paid' ? 'Paid' : 'Pending'} size="sm">{b.paymentStatus}</Badge></td>
                  <td><Badge status={b.status} size="sm" dot>{b.status}</Badge></td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/admin/bookings/${b.id}`}>
                      <Button variant="ghost" size="sm" leftIcon={<Eye size={14} />}>Inspect</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
