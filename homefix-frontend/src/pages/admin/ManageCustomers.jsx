import React, { useState } from 'react';
import { Search, Mail, Phone, Calendar, UserCheck, Shield } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function ManageCustomers() {
  const [search, setSearch] = useState('');

  const customers = [
    {
      id: 'CUST-001',
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      phone: '+91 98711 22334',
      totalBookings: 6,
      spent: '₹4,850',
      joined: 'Jan 2026',
      status: 'Active',
    },
    {
      id: 'CUST-002',
      name: 'Pooja Verma',
      email: 'pooja.verma@example.com',
      phone: '+91 98112 33445',
      totalBookings: 3,
      spent: '₹2,199',
      joined: 'Feb 2026',
      status: 'Active',
    },
    {
      id: 'CUST-003',
      name: 'Aditi Nair',
      email: 'aditi.nair@example.com',
      phone: '+91 99223 34455',
      totalBookings: 1,
      spent: '₹249',
      joined: 'Mar 2026',
      status: 'Active',
    },
  ];

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Registered Customer Accounts</h1>
          <p className="page-subtitle">Monitor consumer engagement, booking frequencies, and account activity</p>
        </div>
      </div>

      <div className="filter-bar">
        <div style={{ maxWidth: '320px', width: '100%' }}>
          <Input
            placeholder="Search customer by name or email..."
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
                <th>Customer ID</th>
                <th>Name</th>
                <th>Contact Email</th>
                <th>Phone</th>
                <th>Bookings</th>
                <th>Total Spend</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: 'var(--primary)' }}>{c.id}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text)' }}>{c.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{c.email}</td>
                  <td>{c.phone}</td>
                  <td style={{ fontWeight: 600 }}>{c.totalBookings} orders</td>
                  <td style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>{c.spent}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{c.joined}</td>
                  <td><Badge status="Completed" size="sm">Active</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
