import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import './TechnicianCard.css';

export default function TechnicianCard({ technician, onSelect, showSelectButton = false }) {
  return (
    <Card hoverEffect className="technician-card">
      {/* Demo watermark banner */}
      <div className="tech-card-header">
        <span className="demo-badge-pill">Demo Profile</span>
        <Badge status={technician.status} size="sm" dot>
          {technician.status} (Demo)
        </Badge>
      </div>

      <div className="tech-profile-top">
        <div className="tech-avatar-wrap">
          <img
            src={technician.avatar}
            alt={technician.name}
            className="tech-avatar-img"
          />
          <div className="tech-experience-pill">
            <Award size={12} />
            <span>{technician.experience}</span>
          </div>
        </div>

        <div className="tech-main-meta">
          <div className="tech-name-row">
            <h3 className="tech-name">{technician.name}</h3>
            <span className="tech-id-tag">{technician.id}</span>
          </div>
          <p className="tech-title">{technician.title}</p>

          <div className="tech-rating-row">
            <div className="rating-pill">
              <Star size={14} className="star-icon" />
              <span className="rating-val">{technician.rating}</span>
            </div>
            <span className="reviews-count">({technician.reviewsCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* Service Area & Availability */}
      <div className="tech-details-grid">
        <div className="tech-detail-item">
          <MapPin size={15} className="detail-icon" />
          <span className="detail-text" title={technician.serviceArea}>
            {technician.serviceArea}
          </span>
        </div>
        <div className="tech-detail-item">
          <Clock size={15} className="detail-icon" />
          <span className="detail-text text-success font-medium">
            {technician.availability}
          </span>
        </div>
      </div>

      {/* Skills Tags */}
      <div className="tech-skills-wrap">
        {technician.skills.slice(0, 3).map((skill, index) => (
          <span key={index} className="skill-chip">
            {skill}
          </span>
        ))}
        {technician.skills.length > 3 && (
          <span className="skill-chip more">+{technician.skills.length - 3}</span>
        )}
      </div>

      {/* Card Footer with Visiting Charge & CTA */}
      <div className="tech-card-footer">
        <div className="visiting-fee-box">
          <span className="fee-label">Visiting Charge</span>
          <span className="fee-value">₹{technician.visitingCharge}</span>
        </div>

        <div className="tech-actions">
          {showSelectButton ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onSelect && onSelect(technician)}
            >
              Select Expert
            </Button>
          ) : (
            <Link to={`/technicians/${technician.id}`}>
              <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                View Profile
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
