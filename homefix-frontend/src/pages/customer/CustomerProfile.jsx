import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function CustomerProfile() {
  const { currentUser } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-wrapper max-w-3xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your contact information and preferences</p>
        </div>
      </div>

      <Card className="p-6" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--line)' }}>
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
            alt=""
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
          />
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text)' }}>{name}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customer ID: {currentUser?.id || 'USR-CUST-01'}</p>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Verified Customer Member</span>
          </div>
        </div>

        {saved && (
          <div className="alert-box alert-success">
            <CheckCircle2 size={16} />
            <span>Profile information successfully updated!</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input
              label="Full Name"
              required
              leftIcon={<User size={16} />}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Email Address"
              type="email"
              required
              leftIcon={<Mail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Phone Number"
              type="tel"
              required
              leftIcon={<Phone size={16} />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button type="submit" variant="primary" leftIcon={<Save size={16} />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
