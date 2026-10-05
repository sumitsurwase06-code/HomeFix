import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Award, Save, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';

export default function TechnicianProfile() {
  const { currentUser } = useAuth();

  const [name, setName] = useState(currentUser?.name || 'Rajesh Kumar');
  const [email, setEmail] = useState(currentUser?.email || 'technician@homefix.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [experience, setExperience] = useState('8 Years');
  const [skills, setSkills] = useState('Pipe Leakages, Drain Unclogging, Geyser Installation, Motor Pumps');
  const [serviceArea, setServiceArea] = useState('Sector 62, Indirapuram, Noida');
  const [visitingCharge, setVisitingCharge] = useState(199);
  const [saved, setSaved] = useState(false);

  const verificationStatus = currentUser?.verificationStatus || 'Verified';

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-wrapper max-w-4xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Technician Partner Profile</h1>
          <p className="page-subtitle">Manage your trade credentials, visiting fee, and dispatch area</p>
        </div>

        <StatusBadge status={verificationStatus} size="md" />
      </div>

      {verificationStatus === 'Pending' && (
        <div className="alert-box alert-warning">
          <AlertTriangle size={20} style={{ color: 'var(--warning)', flexShrink: 0 }} />
          <div>
            <strong>Pending Admin Verification:</strong> Your profile is currently awaiting document review. You are not publicly bookable by homeowners until the operations supervisor approves your trade license.
          </div>
        </div>
      )}

      {saved && (
        <div className="alert-box alert-success">
          <CheckCircle2 size={16} />
          <span>Technician profile details updated successfully!</span>
        </div>
      )}

      <Card className="p-6" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--line)' }}>
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200'}
            alt=""
            style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '2px solid var(--primary)' }}
          />
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text)' }}>{name}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Partner ID: {currentUser?.id || 'TECH-101'}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'rgba(212, 239, 105, 0.1)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-xs)', border: '1px solid rgba(212, 239, 105, 0.25)' }}>
                Trade: Plumbing
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text)', backgroundColor: 'var(--surface-raised)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--line)' }}>
                Visiting: ₹{visitingCharge}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <Input
              label="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Contact Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Mobile Phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              label="Experience Level"
              required
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />

            <Input
              label="Standard Doorstep Visiting Charge (₹)"
              type="number"
              required
              value={visitingCharge}
              onChange={(e) => setVisitingCharge(Number(e.target.value))}
            />

            <Input
              label="Primary Service Dispatch Area"
              required
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
            />
          </div>

          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label">Specialized Trade Skills (Comma Separated)</label>
            <textarea
              rows={2}
              className="input-control"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary" leftIcon={<Save size={16} />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
