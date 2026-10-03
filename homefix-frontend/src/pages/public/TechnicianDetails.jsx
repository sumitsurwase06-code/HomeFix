import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  Clock,
  Award,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Phone,
  Mail,
  ArrowLeft,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { DEMO_TECHNICIANS } from '../../data/technicians';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
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
            message={`No technician profile with ID "${id}" could be located in our demo registry.`}
            onRetry={() => navigate('/technicians')}
            retryLabel="Back to Technicians"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '980px' }}>
        <Link to="/technicians" className="flex items-center gap-2 text-primary font-medium mb-6">
          <ArrowLeft size={16} />
          <span>Back to All Technicians</span>
        </Link>

        {/* Demo Warning */}
        <div className="demo-banner mb-6" style={{ borderRadius: 'var(--radius-md)' }}>
          <AlertCircle size={16} />
          <span>
            <strong>Demo Profile Notice:</strong> {technician.name} is a simulated technician profile for this academic project.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Quick Info */}
          <Card className="p-6 text-center">
            <div style={{ width: '130px', height: '130px', margin: '0 auto 1.25rem' }}>
              <img
                src={technician.avatar}
                alt={technician.name}
                style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover' }}
              />
            </div>

            <h2 className="text-xl font-bold mb-1">{technician.name}</h2>
            <p className="text-muted text-sm mb-3">{technician.title}</p>
            <span className="tech-id-tag mb-4 inline-block">{technician.id}</span>

            <div className="flex justify-center gap-2 mb-4">
              <Badge status={technician.status} dot>
                {technician.status} (Demo)
              </Badge>
              <Badge variant="primary">
                {technician.category}
              </Badge>
            </div>

            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="rating-pill">
                <Star size={14} className="star-icon" />
                <span className="rating-val">{technician.rating}</span>
              </div>
              <span className="text-muted text-xs">({technician.reviewsCount} verified reviews)</span>
            </div>

            <div className="border-t pt-4 text-left">
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-muted">Visiting Charge:</span>
                <span className="font-bold text-lg text-primary">₹{technician.visitingCharge}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Jobs Completed:</span>
                <span className="font-semibold">{technician.completedJobs}+</span>
              </div>
            </div>

            <div className="mt-6">
              <Link to={`/customer/book?technicianId=${technician.id}&service=${technician.category}`}>
                <Button variant="primary" fullWidth rightIcon={<ArrowRight size={16} />}>
                  Book This Expert
                </Button>
              </Link>
            </div>
          </Card>

          {/* Right Column: Bio, Skills, Experience & Reviews Breakdown */}
          <div className="flex flex-col gap-6" style={{ gridColumn: 'span 2' }}>
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-3">About & Professional Experience</h3>
              <p className="text-secondary text-sm mb-4 leading-relaxed">
                {technician.bio}
              </p>
              <p className="text-secondary text-sm leading-relaxed">
                {technician.about}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6 p-4 rounded-lg bg-alt">
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

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-3">Specialized Trade Skills</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {technician.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="skill-chip"
                    style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-bold mb-3">Recent Customer Reviews</h3>
              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-lg bg-alt">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm">Sunil Mehta</span>
                    <div className="flex text-amber-500"><Star size={14} fill="#f59e0b" /><Star size={14} fill="#f59e0b" /><Star size={14} fill="#f59e0b" /><Star size={14} fill="#f59e0b" /><Star size={14} fill="#f59e0b" /></div>
                  </div>
                  <p className="text-xs text-secondary">
                    "Punctual, carried all specialized tools, and solved our leaking main pipe within 45 minutes. Highly recommended!"
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-alt">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm">Kavita Rao</span>
                    <div className="flex text-amber-500"><Star size={14} fill="#f59e0b" /><Star size={14} fill="#f59e0b" /><Star size={14} fill="#f59e0b" /><Star size={14} fill="#f59e0b" /><Star size={14} /></div>
                  </div>
                  <p className="text-xs text-secondary">
                    "Very courteous and neat work. Explained the root cause and gave upfront estimate before opening the panel."
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
