import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, ArrowRight, CreditCard, ChevronRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import './BookingCard.css';

export default function BookingCard({ booking, role = 'customer', onCancel, onStatusUpdate }) {
  const isCompleted = booking.status === 'Completed';
  const isCancelled = booking.status === 'Cancelled';
  const detailUrl = role === 'admin' 
    ? `/admin/bookings/${booking.id}`
    : role === 'technician'
    ? `/technician/bookings/${booking.id}`
    : `/customer/bookings/${booking.id}`;

  return (
    <Card hoverEffect className="booking-card">
      <div className="booking-card-header">
        <div className="booking-id-row">
          <span className="booking-id-tag">{booking.id}</span>
          <span className="booking-date-sub">{new Date(booking.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="booking-badges-row">
          <Badge status={booking.status} dot>
            {booking.status}
          </Badge>
          <Badge status={booking.paymentStatus === 'Paid' ? 'Paid' : 'Pending'}>
            Pay: {booking.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="booking-card-body">
        <h4 className="booking-service-title">{booking.serviceName}</h4>
        <p className="booking-problem-snippet">{booking.problemTitle}</p>

        <div className="booking-meta-grid">
          <div className="booking-meta-item">
            <Calendar size={14} className="meta-icon" />
            <span>{booking.appointmentDate}</span>
          </div>
          <div className="booking-meta-item">
            <Clock size={14} className="meta-icon" />
            <span>{booking.appointmentTime}</span>
          </div>
          <div className="booking-meta-item">
            <User size={14} className="meta-icon" />
            <span>{role === 'technician' ? booking.customer.name : booking.technicianName}</span>
          </div>
          <div className="booking-meta-item">
            <MapPin size={14} className="meta-icon" />
            <span className="truncate-text">{booking.address.locality}, {booking.address.city}</span>
          </div>
        </div>
      </div>

      <div className="booking-card-footer">
        <div className="booking-pricing-brief">
          <span className="price-label">Estimated Total</span>
          <span className="price-total">₹{booking.pricing.customerTotal}</span>
        </div>

        <div className="booking-card-actions">
          {role === 'customer' && isCompleted && (
            <Link to={`/customer/reviews?bookingId=${booking.id}`}>
              <Button variant="outline" size="sm">Review</Button>
            </Link>
          )}

          {role === 'customer' && !isCompleted && !isCancelled && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              className="text-danger"
              onClick={() => onCancel(booking.id)}
            >
              Cancel
            </Button>
          )}

          <Link to={detailUrl}>
            <Button variant="primary" size="sm" rightIcon={<ChevronRight size={14} />}>
              Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
