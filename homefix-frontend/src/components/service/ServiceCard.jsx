import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Zap,
  Hammer,
  Armchair,
  Droplets,
  Paintbrush,
  Cpu,
  Sparkles,
  PenTool,
  ArrowRight,
  Clock,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ServiceCard.css';

const ICON_MAP = {
  Wrench,
  Zap,
  Hammer,
  Armchair,
  Droplets,
  Paintbrush,
  Cpu,
  Sparkles,
  Tool: PenTool,
};

const SERVICE_IMAGES = {
  plumbing: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80',
  electrical: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
  carpentry: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80',
  'furniture-repair': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
  painting: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
  'appliance-repair': 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80',
  'leakage-repair': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
  cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
  'other-maintenance': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
};

export default function ServiceCard({ service, onSelect, onExplore }) {
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal } = useAuth();
  const IconComponent = ICON_MAP[service.iconName] || Wrench;
  const imageSrc = service.image || SERVICE_IMAGES[service.id] || SERVICE_IMAGES.plumbing;

  const triggerBooking = () => {
    const targetUrl = `/customer/book?service=${service.id}`;
    if (isAuthenticated) {
      navigate(targetUrl);
    } else {
      navigate(`/login?returnTo=${encodeURIComponent(targetUrl)}`);
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(service);
    } else {
      triggerBooking();
    }
  };

  const handleExploreClick = (e) => {
    e.stopPropagation();
    if (onExplore) {
      onExplore(service);
    } else {
      handleCardClick();
    }
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(service);
    } else {
      triggerBooking();
    }
  };

  return (
    <article
      className="luxury-service-card"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`${service.name} service, starting at ₹${service.startingPrice}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* 16:9 Image Wrap with Badges */}
      <div className="service-card-image-wrap">
        <img
          src={imageSrc}
          alt={service.name}
          className="service-card-img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600';
          }}
        />

        <div className="service-card-badge-overlay">
          {service.popular && (
            <span className="service-popular-pill">Popular</span>
          )}

          {service.estimatedTime && (
            <span className="service-time-pill" title="Typical service duration">
              <Clock size={11} />
              <span>{service.estimatedTime}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="service-card-body-content">
        <div className="service-card-title-row">
          <div className="service-icon-circle">
            <IconComponent size={18} className="service-icon-svg" />
          </div>
          <div>
            <h3 className="service-card-title">{service.name}</h3>
            <span className="service-card-price-sub">Visiting fee from ₹{service.startingPrice}</span>
          </div>
        </div>

        {service.shortDesc && (
          <p className="service-card-desc-text">
            {service.shortDesc}
          </p>
        )}

        {service.popularServices && service.popularServices.length > 0 && (
          <div className="service-card-tags-row">
            {service.popularServices.slice(0, 2).map((item, idx) => (
              <span key={idx} className="service-mini-tag">
                {item}
              </span>
            ))}
            {service.popularServices.length > 2 && (
              <span className="service-mini-tag more">
                +{service.popularServices.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="service-card-footer-row">
          <div className="service-starting-rate-block">
            <span className="rate-caption">Starts at</span>
            <span className="rate-amount">₹{service.startingPrice}</span>
          </div>

          <div className="service-btn-group">
            <button
              type="button"
              className="service-details-btn"
              onClick={handleExploreClick}
              title="View inclusions and service details"
            >
              <Info size={13} />
              <span>Details</span>
            </button>
            <button
              type="button"
              className="service-book-action-btn"
              onClick={handleBookClick}
              title={`Book ${service.name}`}
            >
              <span>Book</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
