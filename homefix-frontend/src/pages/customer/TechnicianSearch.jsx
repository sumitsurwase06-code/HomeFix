import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ShieldCheck, MapPin, Star } from 'lucide-react';
import { DEMO_TECHNICIANS } from '../../data/technicians';
import { SERVICE_CATEGORIES } from '../../data/services';
import TechnicianCard from '../../components/technician/TechnicianCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function TechnicianSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const navigate = useNavigate();

  const filtered = DEMO_TECHNICIANS.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.serviceArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.skills.some((sk) => sk.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = category === 'all' || t.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Find Certified Technicians</h1>
          <p className="page-subtitle">Filter by category, rating, location and instant booking availability</p>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="filter-bar">
        <div style={{ maxWidth: '360px', width: '100%' }}>
          <Input
            placeholder="Search by name, skill, or area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={16} />}
            wrapperClassName="mb-0"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={category === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setCategory('all')}
          >
            All
          </Button>
          {SERVICE_CATEGORIES.slice(0, 5).map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filtered.map((tech) => (
          <TechnicianCard
            key={tech.id}
            technician={tech}
            showSelectButton
            onSelect={(t) => navigate(`/customer/book?technicianId=${t.id}&service=${t.category}`)}
          />
        ))}
      </div>
    </div>
  );
}
