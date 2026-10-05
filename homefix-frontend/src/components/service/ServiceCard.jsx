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
  ArrowRight,
  ChevronRight
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

const SERVICE_IMAGES = {
  plumbing: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80',
  electrical: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
  carpentry: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80',
  'furniture-repair': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
  painting: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
  'appliance-repair': 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80',
  'leakage-repair': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
  cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
};

export default function ServiceCard({ service, onSelect }) {
  const IconComponent = ICON_MAP[service.iconName] || Wrench;
  const imageSrc = service.image || SERVICE_IMAGES[service.id] || SERVICE_IMAGES.plumbing;

  return (
    <div className="luxury-service-card" onClick={onSelect}>
      <div className="service-card-image-wrap">
        <img src={imageSrc} alt={service.name} className="service-card-img" />
        {service.popular && (
          <span className="service-popular-pill">Popular</span>
        )}
      </div>

      <div className="service-card-info-row">
        <div className="service-icon-circle">
          <IconComponent size={20} className="service-icon-svg" />
        </div>

        <div className="service-text-content">
          <h3 className="service-card-title">{service.name}</h3>
          <span className="service-card-price">Starts ₹{service.startingPrice}</span>
        </div>

        <Link
          to={`/customer/book?service=${service.id}`}
          className="service-arrow-circle-btn"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Book ${service.name}`}
        >
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
