import React from 'react';
import { Link } from 'react-router-dom';
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
  ArrowRight
} from 'lucide-react';
import Card from '../common/Card';
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

export default function ServiceCard({ service, onSelect }) {
  const IconComponent = ICON_MAP[service.iconName] || Wrench;

  return (
    <Card hoverEffect className="service-card" onClick={onSelect}>
      <div className="service-card-top">
        <div className="service-icon-box">
          <IconComponent size={28} className="service-icon-svg" />
        </div>
        {service.popular && (
          <span className="service-popular-badge">Popular</span>
        )}
      </div>

      <h3 className="service-card-title">{service.name}</h3>
      <p className="service-card-desc">{service.shortDesc}</p>

      {service.popularServices && (
        <ul className="service-sublist">
          {service.popularServices.slice(0, 3).map((item, idx) => (
            <li key={idx} className="service-subitem">
              <span className="subitem-dot" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="service-card-bottom">
        <div className="service-pricing">
          <span className="price-label">Starts from</span>
          <span className="price-value">₹{service.startingPrice}</span>
        </div>

        <Link
          to={`/customer/book?service=${service.id}`}
          className="service-action-link"
          onClick={(e) => e.stopPropagation()}
        >
          <span>Book Now</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </Card>
  );
}
