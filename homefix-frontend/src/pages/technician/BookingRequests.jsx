import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Check,
  X
} from 'lucide-react';
import { DEMO_BOOKINGS } from '../../data/bookings';
import { bookingApi } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';

export default function BookingRequests() {
  const [requests, setRequests] = useState(() =>
    DEMO_BOOKINGS.filter((b) => b.status === 'Requested')
  );
  const [actionNotice, setActionNotice] = useState('');

  const handleAccept = async (id) => {
    await bookingApi.updateStatus(id, 'Accepted', 'Technician accepted booking request');
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setActionNotice(`Booking ${id} accepted! Shifted to Assigned Jobs.`);
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleReject = async (id) => {
    await bookingApi.updateStatus(id, 'Cancelled', 'Technician declined request');
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setActionNotice(`Booking ${id} declined.`);
    setTimeout(() => setActionNotice(''), 4000);
  };

  return (
    <div className="page-wrapper max-w-4xl" style={{ margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">New Booking Requests</h1>
          <p className="page-subtitle">
            Review customer repair descriptions, attached diagnostic photos, and accept dispatch jobs
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="alert-box alert-success">
          <CheckCircle size={16} />
          <span>{actionNotice}</span>
        </div>
      )}

      {requests.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.map((req) => (
            <Card key={req.id} className="p-6" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--line)', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'rgba(212, 239, 105, 0.1)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-xs)', border: '1px solid rgba(212, 239, 105, 0.25)' }}>
                      {req.id}
                    </span>
                    <Badge status="Requested" dot>New Request</Badge>
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text)', marginTop: '0.25rem' }}>{req.serviceName}</h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Doorstep Visiting Fee</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>₹{req.pricing.visitingCharge}</span>
                </div>
              </div>

              {/* Customer & Problem Info */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>{req.problemTitle}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>{req.problemDescription}</p>

                {req.problemImages && req.problemImages.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Attached Problem Photos:</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {req.problemImages.map((src, i) => (
                        <img key={i} src={src} alt="Issue" style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--line)' }} />
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.8rem', backgroundColor: 'var(--surface-raised)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={14} style={{ color: 'var(--primary)' }} />
                    <span>{req.appointmentDate}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} style={{ color: 'var(--primary)' }} />
                    <span>{req.appointmentTime}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={14} style={{ color: 'var(--primary)' }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.address.locality}, {req.address.city}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
                <Link to={`/technician/bookings/${req.id}`}>
                  <Button variant="ghost" size="sm" leftIcon={<Eye size={14} />}>
                    Full Job Details
                  </Button>
                </Link>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<X size={14} />}
                    onClick={() => handleReject(req.id)}
                  >
                    Decline
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Check size={14} />}
                    onClick={() => handleAccept(req.id)}
                  >
                    Accept Lead
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Pending Lead Requests"
          description="You are caught up! When nearby customers book your trade skills, new requests will appear here."
        />
      )}
    </div>
  );
}
