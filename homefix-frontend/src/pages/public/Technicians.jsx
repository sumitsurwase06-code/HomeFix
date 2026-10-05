import React, { useState, useMemo } from 'react';
import { Search, Filter, ShieldCheck, SlidersHorizontal, Star, Award, RotateCcw } from 'lucide-react';
import { DEMO_TECHNICIANS } from '../../data/technicians';
import { SERVICE_CATEGORIES } from '../../data/services';
import TechnicianCard from '../../components/technician/TechnicianCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

export default function Technicians() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minRating, setMinRating] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');

  const filteredTechs = useMemo(() => {
    let list = DEMO_TECHNICIANS.filter((tech) => {
      const matchesSearch =
        tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.serviceArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.skills.some((sk) => sk.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || tech.category === selectedCategory;

      const matchesRating =
        minRating === 'all' || tech.rating >= parseFloat(minRating);

      return matchesSearch && matchesCategory && matchesRating;
    });

    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price_low') {
      list.sort((a, b) => a.visitingCharge - b.visitingCharge);
    } else if (sortBy === 'experience') {
      list.sort((a, b) => (parseInt(b.experience) || 0) - (parseInt(a.experience) || 0));
    }

    return list;
  }, [searchTerm, selectedCategory, minRating, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setMinRating('all');
    setSortBy('recommended');
  };

  return (
    <div className="section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-eyebrow">Expert Service Network</span>
          <h1 className="section-title">Verified Household Technicians</h1>
          <p className="section-subtitle">
            Find certified master technicians with verified credentials, customer ratings, and transparent upfront rates.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="card p-6 mb-8 border border-champagne-dark bg-surface">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="input-label mb-1 block">Search Specialist or Area</label>
              <Input
                placeholder="Search by name, skill (e.g., wiring, leak), or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={18} />}
                wrapperClassName="mb-0"
              />
            </div>

            <div>
              <label className="input-label mb-1 block">Trade Category</label>
              <select
                className="input-control"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by Trade Category"
              >
                <option value="all">All Service Trades</option>
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label mb-1 block">Sort By</label>
              <select
                className="input-control"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort Technicians"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest Rated (★ 4.5+)</option>
                <option value="experience">Most Experienced</option>
                <option value="price_low">Lowest Visiting Fee</option>
              </select>
            </div>
          </div>

          {/* Quick Category Pills & Count */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-4 border-t border-border">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-muted uppercase tracking-wider mr-1">Quick Select:</span>
              <button
                type="button"
                className={`btn btn-xs ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </button>
              {SERVICE_CATEGORIES.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`btn btn-xs ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="text-xs font-semibold text-secondary">
              Showing <strong>{filteredTechs.length}</strong> verified professionals
            </div>
          </div>
        </div>

        {/* Technicians Grid */}
        {filteredTechs.length > 0 ? (
          <div className="technicians-grid">
            {filteredTechs.map((tech) => (
              <TechnicianCard key={tech.id} technician={tech} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No Technicians Found"
            description="We couldn't find any technicians matching your search criteria. Try adjusting your filters or search terms."
            actionText="Reset All Filters"
            onAction={handleResetFilters}
          />
        )}
      </div>
    </div>
  );
}
