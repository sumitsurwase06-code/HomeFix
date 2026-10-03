import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, AlertCircle } from 'lucide-react';
import { DEMO_TECHNICIANS } from '../../data/technicians';
import { SERVICE_CATEGORIES } from '../../data/services';
import TechnicianCard from '../../components/technician/TechnicianCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function Technicians() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTechs = DEMO_TECHNICIANS.filter((tech) => {
    const matchesSearch =
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.serviceArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.skills.some((sk) => sk.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || tech.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-eyebrow">Service Professionals</span>
          <h1 className="section-title">Verified Household Technicians</h1>
          <p className="section-subtitle">
            Browse technician experience, customer reviews, trade skills, and visiting charges.
          </p>

          <div className="demo-banner mt-4" style={{ borderRadius: 'var(--radius-md)' }}>
            <AlertCircle size={16} />
            <span>
              <strong>Note:</strong> All profiles below are simulated demo profiles for academic demonstration. Not real persons.
            </span>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div style={{ maxWidth: '380px', width: '100%' }}>
            <Input
              placeholder="Search by name, skill, or area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={18} />}
              wrapperClassName="mb-0"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Trades
            </Button>
            {SERVICE_CATEGORIES.slice(0, 5).map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Technicians Grid */}
        <div className="technicians-grid">
          {filteredTechs.map((tech) => (
            <TechnicianCard key={tech.id} technician={tech} />
          ))}
        </div>
      </div>
    </div>
  );
}
