import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Filter, CheckCircle2, ArrowRight } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../data/services';
import ServiceCard from '../../components/service/ServiceCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function Services() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPopular, setFilterPopular] = useState(false);
  const navigate = useNavigate();

  const filtered = SERVICE_CATEGORIES.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shortDesc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPopular = filterPopular ? s.popular : true;
    return matchesSearch && matchesPopular;
  });

  return (
    <div className="section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-eyebrow">Service Catalog</span>
          <h1 className="section-title">All Household Trades & Repairs</h1>
          <p className="section-subtitle">
            Transparent pricing, skilled and verified technicians, backed by quality assurance.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div style={{ maxWidth: '400px', width: '100%' }}>
            <Input
              placeholder="Search services (e.g., plumbing, ac, lock)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={18} />}
              wrapperClassName="mb-0"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={!filterPopular ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterPopular(false)}
            >
              All Services ({SERVICE_CATEGORIES.length})
            </Button>
            <Button
              variant={filterPopular ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterPopular(true)}
              leftIcon={<Sparkles size={14} />}
            >
              Popular Only
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="service-categories-grid">
          {filtered.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={() => navigate(`/customer/book?service=${service.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
