import React from 'react';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import Card from '../../components/common/Card';

export default function Reviews() {
  const reviews = [
    {
      id: 1,
      customer: 'Rohan Sharma',
      rating: 5,
      date: 'Oct 02, 2026',
      service: 'Tap & Mixer Leakage',
      comment: 'Arrived right on time with proper replacement Teflon seals. Cleaned up after work. Very satisfied.',
    },
    {
      id: 2,
      customer: 'Pooja Verma',
      rating: 5,
      date: 'Sep 28, 2026',
      service: 'Geyser Inlet Replacement',
      comment: 'Diagnosed electrical thermostat issue quickly and charged exactly as estimated.',
    },
    {
      id: 3,
      customer: 'Aditi Nair',
      rating: 4,
      date: 'Sep 15, 2026',
      service: 'Sink Drain Unblock',
      comment: 'Good craftsmanship, explained how to avoid future grease blockages.',
    },
  ];

  return (
    <div className="page-wrapper max-w-4xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Ratings & Reviews</h1>
          <p className="page-subtitle">Verified feedback submitted by customers after job completion</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <Card className="p-5" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Star size={30} className="fill-amber-400 text-amber-400" style={{ color: '#fbbf24', fill: '#fbbf24' }} />
            <span>4.8</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Average Rating</span>
        </Card>

        <Card className="p-5" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.25rem' }}>142</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Total Verified Reviews</span>
        </Card>

        <Card className="p-5" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, color: 'var(--success-text)', marginBottom: '0.25rem' }}>98%</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>5-Star Satisfaction</span>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reviews.map((rev) => (
          <Card key={rev.id} className="p-5" style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{rev.customer}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{rev.service}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                ))}
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem', fontStyle: 'italic' }}>"{rev.comment}"</p>

            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{rev.date}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
