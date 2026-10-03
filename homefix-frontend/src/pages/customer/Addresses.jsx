import React, { useState } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

export default function Addresses() {
  const [addresses, setAddresses] = useState([
    {
      id: 'ADDR-1',
      type: 'Home',
      street: 'Flat 402, Sunshine Heights, Sector 62',
      locality: 'Indirapuram',
      city: 'Noida',
      postalCode: '201309',
      isDefault: true,
    },
    {
      id: 'ADDR-2',
      type: 'Office',
      street: 'Tower B, 5th Floor, Logix Cyber Park',
      locality: 'Sector 62',
      city: 'Noida',
      postalCode: '201309',
      isDefault: false,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAddr, setNewAddr] = useState({
    type: 'Home',
    street: '',
    locality: '',
    city: '',
    postalCode: '',
  });

  const handleAddAddress = (e) => {
    e.preventDefault();
    const created = {
      id: 'ADDR-' + Date.now(),
      ...newAddr,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, created]);
    setIsModalOpen(false);
    setNewAddr({ type: 'Home', street: '', locality: '', city: '', postalCode: '' });
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div className="page-wrapper max-w-4xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Saved Addresses</h1>
          <p className="page-subtitle">Manage doorstep locations for rapid repair appointments</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus size={16} />}
        >
          Add New Address
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {addresses.map((addr) => (
          <Card key={addr.id} className="p-5 flex flex-col justify-between" style={{ padding: '1.25rem' }}>
            <div>
              <div className="flex justify-between items-center mb-3" style={{ marginBottom: '0.75rem' }}>
                <span style={{ 
                  fontWeight: 700, 
                  fontSize: '0.75rem', 
                  color: 'var(--primary)', 
                  backgroundColor: 'rgba(212, 239, 105, 0.1)', 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(212, 239, 105, 0.25)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {addr.type}
                </span>
                {addr.isDefault && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={13} /> Default
                  </span>
                )}
              </div>
              <p style={{ fontWeight: 600, fontSize: '0.925rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{addr.street}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {addr.locality}, {addr.city} - {addr.postalCode}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid var(--line)' }}>
              {!addr.isDefault ? (
                <button
                  type="button"
                  onClick={() => handleSetDefault(addr.id)}
                  style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Make Default
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => handleDelete(addr.id)}
                style={{ fontSize: '0.75rem', color: 'var(--coral)', cursor: 'pointer', padding: '0.25rem' }}
                aria-label="Delete address"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Delivery / Repair Address"
      >
        <form onSubmit={handleAddAddress}>
          <div className="input-group mb-3">
            <label className="input-label">Address Label Type</label>
            <select
              className="input-control"
              value={newAddr.type}
              onChange={(e) => setNewAddr({ ...newAddr, type: e.target.value })}
            >
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <Input
            label="Street Address / Building"
            required
            placeholder="Flat / Floor / Street"
            value={newAddr.street}
            onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Locality"
              required
              placeholder="e.g. Indirapuram"
              value={newAddr.locality}
              onChange={(e) => setNewAddr({ ...newAddr, locality: e.target.value })}
            />
            <Input
              label="City"
              required
              placeholder="e.g. Noida"
              value={newAddr.city}
              onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
            />
          </div>

          <Input
            label="Postal Code"
            required
            placeholder="e.g. 201309"
            value={newAddr.postalCode}
            onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
