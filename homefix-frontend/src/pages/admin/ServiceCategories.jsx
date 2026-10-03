import React, { useState } from 'react';
import { Layers, Plus, Edit, CheckCircle } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../data/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function ServiceCategories() {
  const [categories, setCategories] = useState(SERVICE_CATEGORIES);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Service Catalog & Categories</h1>
          <p className="page-subtitle">Configure marketplace household trades, base price minimums, and popular badges</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {categories.map((cat) => (
          <Card key={cat.id} className="p-5 flex flex-col justify-between" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>{cat.name}</h3>
                {cat.popular && <Badge status="Scheduled" size="sm">Popular</Badge>}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>{cat.shortDesc}</p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-raised)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div>Min Starting Price: <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>₹{cat.startingPrice}</strong></div>
                <div>Avg Service Duration: <strong style={{ color: 'var(--text)' }}>{cat.estimatedTime}</strong></div>
              </div>
            </div>

            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--line)', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>ID: {cat.id}</span>
              <span style={{ color: 'var(--success-text)', fontWeight: 600 }}>Active in Catalog</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
