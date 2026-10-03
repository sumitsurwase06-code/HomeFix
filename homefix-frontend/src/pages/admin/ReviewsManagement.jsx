import React, { useState } from 'react';
import { Star, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState([
    {
      id: 'REV-01',
      customer: 'Rohan Sharma',
      technician: 'Rajesh Kumar (Plumbing)',
      rating: 5,
      date: 'Oct 02, 2026',
      comment: 'Arrived right on time with proper replacement Teflon seals. Cleaned up after work. Very satisfied.',
      status: 'Approved',
    },
    {
      id: 'REV-02',
      customer: 'Pooja Verma',
      technician: 'Amit Sharma (Electrical)',
      rating: 5,
      date: 'Sep 28, 2026',
      comment: 'Diagnosed electrical thermostat issue quickly and charged exactly as estimated.',
      status: 'Approved',
    },
    {
      id: 'REV-03',
      customer: 'Aditi Nair',
      technician: 'Vikram Saini (Carpentry)',
      rating: 4,
      date: 'Sep 15, 2026',
      comment: 'Good craftsmanship, explained how to avoid future grease blockages.',
      status: 'Approved',
    },
    {
      id: 'REV-04',
      customer: 'Anonymous User',
      technician: 'Sunil Rao (General Fix)',
      rating: 1,
      date: 'Sep 10, 2026',
      comment: 'Late arrival, did not have proper drill bits.',
      status: 'Under Review',
    },
  ]);

  const handleToggle = (id) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === 'Approved' ? 'Hidden' : 'Approved' }
          : r
      )
    );
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Reviews & Ratings Moderation</h1>
          <p className="page-subtitle">Supervise verified customer feedback to maintain marketplace service quality</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reviews.map((rev) => (
          <Card key={rev.id} className="p-5" style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>{rev.id}</span>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginTop: '0.15rem' }}>{rev.customer} <span style={{ color: 'var(--text-muted)' }}>→</span> {rev.technician}</h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                  ))}
                </div>
                <Badge status={rev.status === 'Approved' ? 'Completed' : 'Pending'} size="sm">
                  {rev.status}
                </Badge>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', backgroundColor: 'var(--surface-raised)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)', fontStyle: 'italic', lineHeight: 1.5 }}>
              "{rev.comment}"
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.75rem', borderTop: '1px solid var(--line)' }}>
              <span>Submitted on {rev.date}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggle(rev.id)}
              >
                {rev.status === 'Approved' ? 'Hide / Moderate' : 'Approve & Publish'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
