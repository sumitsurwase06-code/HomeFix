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
  FileCheck,
  Save
} from 'lucide-react';
import { DEMO_BOOKINGS } from '../../data/bookings';
import { bookingApi } from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorState from '../../components/common/ErrorState';

const STATUS_PROGRESSION = [
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
  const navigate = useNavigate();

  const [job, setJob] = useState(() => {
    return DEMO_BOOKINGS.find((b) => b.id === id) || DEMO_BOOKINGS[0];
  });

  const [currentStatus, setCurrentStatus] = useState(job?.status || 'In Progress');
  const [repairLabor, setRepairLabor] = useState(job?.pricing?.repairLabor || 350);
  const [materialCharge, setMaterialCharge] = useState(job?.pricing?.materialCharge || 220);
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!job) {
    return (
      <ErrorState
        title="Job Record Not Found"
        message={`No job assigned with reference ${id}.`}
        onRetry={() => navigate('/technician/bookings')}
        retryLabel="Back to Jobs"
      />
    );
  }

  const visitingFee = job.pricing.visitingCharge;
  const calculatedTotal = Number(visitingFee) + Number(repairLabor) + Number(materialCharge);

  // Update status & final charges
  const handleUpdateJob = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await bookingApi.updateStatus(job.id, currentStatus, statusNote);
      setJob((prev) => ({
        ...prev,
        status: currentStatus,
        pricing: {
          ...prev.pricing,
          repairLabor: Number(repairLabor),
          materialCharge: Number(materialCharge),
          customerTotal: calculatedTotal,
        },
      }));
      setSuccessMsg('Job status and billing quote successfully saved!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="page-wrapper max-w-4xl" style={{ margin: '0 auto' }}>
      <div className="flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/technician/bookings" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
          <ArrowLeft size={16} />
          <span>Back to Assigned Jobs</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Badge status={job.status} dot>{job.status}</Badge>
          <Badge status={job.paymentStatus === 'Paid' ? 'Paid' : 'Pending'}>
            Pay: {job.paymentStatus}
          </Badge>
        </div>
      </div>

      {successMsg && (
        <div className="alert-box alert-success">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Job Card */}
      <Card className="p-6" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--line)', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'rgba(212, 239, 105, 0.1)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-xs)', border: '1px solid rgba(212, 239, 105, 0.25)' }}>
              {job.id}
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginTop: '0.35rem' }}>{job.serviceName}</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{job.problemTitle}</p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Current Total</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>₹{calculatedTotal}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Customer & Location Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--surface-raised)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>Customer Details</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>{job.customer.name}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Phone: <strong style={{ color: 'var(--text)' }}>{job.customer.phone}</strong></div>
              <div style={{ color: 'var(--text-secondary)' }}>Email: {job.customer.email}</div>
              <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--line)', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                <strong style={{ color: 'var(--text)' }}>Address:</strong> {job.address.street}, {job.address.locality}, {job.address.city} - {job.address.postalCode}
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'var(--surface-raised)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>Appointment Slot</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>{job.appointmentDate}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Window: {job.appointmentTime}</div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'var(--surface-raised)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', fontSize: '0.8rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', display: 'block', marginBottom: '0.35rem' }}>Problem Description</span>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{job.problemDescription}</p>
            </div>
          </div>

          {/* Technician Status Progression & Pricing Entry */}
          <form onSubmit={handleUpdateJob} style={{ padding: '1.25rem', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-raised)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', paddingBottom: '0.5rem', borderBottom: '1px solid var(--line)' }}>
              Job Progression & Charges Entry
            </h3>

            {/* Status Dropdown */}
            <div className="input-group">
              <label className="input-label">Update Job Status *</label>
              <select
                className="input-control font-semibold text-primary"
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
              >
                {STATUS_PROGRESSION.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Diagnostic Charges Entry */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Visiting Fee (Standard):</span>
                <span style={{ fontWeight: 700, color: 'var(--text)' }}>₹{visitingFee}</span>
              </div>

              <div>
                <label className="input-label">Repair Labor Charge (₹) *</label>
                <input
                  type="number"
                  min={0}
                  className="input-control"
                  value={repairLabor}
                  onChange={(e) => setRepairLabor(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="input-label">Material / Spare Parts Charge (₹)</label>
                <input
                  type="number"
                  min={0}
                  className="input-control"
                  value={materialCharge}
                  onChange={(e) => setMaterialCharge(Number(e.target.value))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--line)', fontSize: '0.925rem', fontWeight: 700 }}>
                <span>Final Customer Total:</span>
                <span style={{ fontSize: '1.25rem', color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>₹{calculatedTotal}</span>
              </div>
            </div>

            <div className="input-group" style={{ paddingTop: '0.5rem' }}>
              <label className="input-label">Status Progression Note (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Replaced leaking valve, water pressure tested OK"
                className="input-control"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isUpdating}
              rightIcon={<Save size={16} />}
            >
              Update Job Status & Quote
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
