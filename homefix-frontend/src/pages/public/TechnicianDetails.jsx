import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  Clock,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  ThumbsUp
} from 'lucide-react';
import { DEMO_TECHNICIANS } from '../../data/technicians';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import ErrorState from '../../components/common/ErrorState';

export default function TechnicianDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const technician = DEMO_TECHNICIANS.find((t) => t.id === id);

  if (!technician) {
    return (
      <div className="section-padding">
        <div className="container">
          <ErrorState
            title="Technician Not Found"
            message={`No technician profile with ID "${id}" could be located.`}
            onRetry={() => navigate('/technicians')}
            retryLabel="Back to Technicians"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '1080px' }}>
        <Link to="/technicians" className="flex items-center gap-2 text-primary font-semibold mb-6 hover:underline">
          <ArrowLeft size={16} />
          <span>Back to All Technicians</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Quick Info */}
          <Card className="p-6 text-center border border-champagne-dark">
            <div style={{ width: '130px', height: '130px', margin: '0 auto 1.25rem', position: 'relative' }}>
              <img
                src={technician.avatar}
                alt={technician.name}
                style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg, 20px)', objectFit: 'cover' }}
              />
              <span style={{
                position: 'absolute',
                bottom: '-6px',
                right: '-6px',
                backgroundColor: 'var(--emerald-ink, #064E3B)',
                color: '#FFF7E8',
                borderRadius: '50%',
                padding: '4px',
                display: 'flex',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }} title="Government ID & Skill Verified">
                <ShieldCheck size={18} />
              </span>
            </div>

            <h2 className="text-xl font-bold mb-1 font-serif">{technician.name}</h2>
            <p className="text-muted text-sm mb-3">{technician.title}</p>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-surface-raised border border-champagne-dark text-muted mb-4 inline-block">
              ID: {technician.id}
            </span>

            <div className="flex justify-center gap-2 mb-4">
              <StatusBadge status="VERIFIED" size="sm" />
              <span className="badge badge-primary">{technician.category}</span>
            </div>

            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="rating-pill">
                <Star size={14} className="star-icon text-amber-500 fill-amber-500" />
                <span className="rating-val font-bold">{technician.rating}</span>
              </div>
              <span className="text-muted text-xs">({technician.reviewsCount || 48} verified reviews)</span>
            </div>

            <div className="border-t border-border pt-4 text-left">
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-muted">Inspection / Visiting Fee:</span>
                <span className="font-bold text-lg text-primary font-serif">₹{technician.visitingCharge}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Completed Jobs:</span>
                <span className="font-semibold text-text-primary">{technician.completedJobs || 120}+</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-muted">Experience:</span>
                <span className="font-semibold text-text-primary">{technician.experience || '6+ years'}</span>
              </div>
            </div>

            <div className="mt-6">
              <Link to={`/customer/book?technicianId=${technician.id}&service=${technician.category}`}>
                <Button variant="primary" fullWidth size="lg" rightIcon={<ArrowRight size={16} />}>
                  Book This Professional
                </Button>
              </Link>
            </div>
          </Card>

          {/* Right Column: Bio, Skills, Experience & Reviews Breakdown */}
          <div className="flex flex-col gap-6 md:col-span-2">
            <Card className="p-6 border border-champagne-dark">
              <h3 className="text-lg font-bold mb-3 font-serif">Professional Background</h3>
              <p className="text-secondary text-sm mb-4 leading-relaxed">
                {technician.bio}
              </p>
              <p className="text-secondary text-sm leading-relaxed">
                {technician.about}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 p-4 rounded-lg bg-surface-raised border border-champagne-dark">
                <div>
                  <div className="text-xs text-muted mb-1">Service Coverage Area</div>
                  <div className="text-sm font-semibold flex items-center gap-1.5">
                    <MapPin size={16} className="text-primary" />
                    <span>{technician.serviceArea}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted mb-1">Current Availability</div>
                  <div className="text-sm font-semibold text-success flex items-center gap-1.5">
                    <Clock size={16} />
                    <span>{technician.availability}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-champagne-dark">
              <h3 className="text-lg font-bold mb-3 font-serif">Specialized Skills & Certifications</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {technician.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="skill-chip"
                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)' }}
                  >
                    <CheckCircle2 size={14} className="text-primary inline mr-1" />
                    {skill}
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-bold mb-3 font-serif">Verified Customer Feedback</h3>
              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-lg bg-surface-raised border border-champagne-dark">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm">Sunil Mehta</span>
                    <div className="flex text-amber-500">
                      <Star size={14} fill="#f59e0b" /><Star size={14} fill="#f59e0b" /><Star size={14} fill="#f59e0b" /><Star size={14} fill="#f59e0b" /><Star size={14} fill="#f59e0b" />
                    </div>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    "Punctual, carried all specialized tools, and solved our leaking main pipe within 45 minutes. Transparent pricing and neat cleanup."
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-surface-raised border border-champagne-dark">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm">Kavita Rao</span>
                    <div className="flex text-amber-500">
                      <Star size={14} fill="#f59e0b" /><Star size={14} fill="#f59e0b" /><Star size={14} fill="#f59e0b" /><Star size={14} fill="#f59e0b" /><Star size={14} />
                    </div>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    "Very courteous and clean execution. Explained the root cause and provided upfront cost estimate before starting the repair."
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
