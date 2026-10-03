import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { DEMO_BOOKINGS } from '../../data/bookings';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import ErrorState from '../../components/common/ErrorState';

export default function AdminBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const booking = DEMO_BOOKINGS.find((b) => b.id === id) || DEMO_BOOKINGS[0];

  if (!booking) {
    return (
      <ErrorState
        title="Booking Not Found"
        message={`No booking record with ID "${id}".`}
        onRetry={() => navigate('/admin/bookings')}
        retryLabel="Back to All Bookings"
      />
    );
  }

  return (
    <div className="page-wrapper max-w-4xl" style={{ margin: '0 auto' }}>
      <div className="flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/admin/bookings" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
          <ArrowLeft size={16} />
          <span>Back to Bookings Administration</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Badge status={booking.status} dot size="md">{booking.status}</Badge>
          <Badge status={booking.paymentStatus === 'Paid' ? 'Paid' : 'Pending'} size="md">
            Payment: {booking.paymentStatus}
          </Badge>
        </div>
      </div>

      <Card className="p-6" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--line)', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'rgba(212, 239, 105, 0.1)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-xs)', border: '1px solid rgba(212, 239, 105, 0.25)' }}>
              {booking.id}
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginTop: '0.35rem' }}>{booking.serviceName}</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{booking.problemTitle}</p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Customer Total Paid</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>₹{booking.pricing.customerTotal}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Customer & Technician Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--surface-raised)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>Customer Record</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>{booking.customer.name}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Email: {booking.customer.email}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Phone: {booking.customer.phone}</div>
              <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--line)', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                <strong style={{ color: 'var(--text)' }}>Address:</strong> {booking.address.street}, {booking.address.locality}, {booking.address.city} - {booking.address.postalCode}
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'var(--surface-raised)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>Assigned Technician</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>{booking.technicianName}</div>
              <div style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>Technician ID: {booking.technicianId}</div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'var(--surface-raised)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', fontSize: '0.8rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', display: 'block', marginBottom: '0.35rem' }}>Customer Problem</span>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{booking.problemDescription}</p>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div style={{ padding: '1.25rem', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-raised)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', paddingBottom: '0.5rem', borderBottom: '1px solid var(--line)' }}>
              Platform & Technician Financial Accounting
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Visiting Charge:</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>₹{booking.pricing.visitingCharge}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Repair Labor:</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>₹{booking.pricing.repairLabor}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Material / Parts Charge:</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>₹{booking.pricing.materialCharge}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.65rem', borderTop: '1px solid var(--line)', fontWeight: 700, color: 'var(--text)' }}>
                <span>Customer Gross Total:</span>
                <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>₹{booking.pricing.customerTotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.65rem', borderTop: '1px solid var(--line)', color: 'var(--warning)', fontWeight: 700 }}>
                <span>Platform Commission (10%):</span>
                <span>₹{booking.pricing.platformFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success-text)', fontWeight: 700 }}>
                <span>Technician Net Payout:</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>₹{booking.pricing.technicianPayout}</span>
              </div>
            </div>

            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--line)', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--text-secondary)' }}>Audit Guarantee:</strong> Platform revenue is recognized solely from the commission fee, while 100% of material and 90% of labor/visiting are disbursed to the service partner.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
