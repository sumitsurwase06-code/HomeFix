import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Eye, Filter } from 'lucide-react';
import { DEMO_TECHNICIANS } from '../../data/technicians';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function ManageTechnicians() {
  const [search, setSearch] = useState('');

  const filtered = DEMO_TECHNICIANS.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Registered Technicians Directory</h1>
          <p className="page-subtitle">Overview of all technician profiles, ratings, and active statuses</p>
        </div>

        <Link to="/admin/verification">
          <Button variant="primary" size="sm">
            Verification Queue
          </Button>
        </Link>
      </div>

      <div className="filter-bar">
        <div style={{ maxWidth: '320px', width: '100%' }}>
          <Input
            placeholder="Search technicians..."
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
                <th>Technician</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Visiting Fee</th>
                <th>Completed Jobs</th>
                <th>Verification</th>
                <th style={{ textAlign: 'right' }}>Profile</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tech) => (
                <tr key={tech.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={tech.avatar} alt="" style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--line)' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)' }}>{tech.name}</div>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{tech.id}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)', textTransform: 'capitalize' }}>{tech.category}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#fbbf24' }}>★ {tech.rating}</span> <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({tech.reviewsCount})</span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--text)' }}>₹{tech.visitingCharge}</td>
                  <td>{tech.completedJobs} jobs</td>
                  <td><Badge status={tech.status} size="sm" dot>{tech.status}</Badge></td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/technicians/${tech.id}`}>
                      <Button variant="ghost" size="sm" leftIcon={<Eye size={14} />}>View</Button>
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
