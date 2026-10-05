import React from 'react';
import { Clock, CheckCircle2, Calendar, Truck, Wrench, XCircle, Check } from 'lucide-react';
import './BookingTimeline.css';

const LIFECYCLE_STEPS = [
  { id: 'Requested', label: 'Requested', icon: Clock },
  { id: 'Accepted', label: 'Accepted', icon: Check },
  { id: 'Scheduled', label: 'Scheduled', icon: Calendar },
  { id: 'On the Way', label: 'On The Way', icon: Truck },
  { id: 'In Progress', label: 'In Progress', icon: Wrench },
  { id: 'Completed', label: 'Completed', icon: CheckCircle2 }
];

export default function BookingTimeline({ currentStatus = 'Requested', className = '' }) {
  const isCancelled = currentStatus?.toLowerCase() === 'cancelled';

  const getStepIndex = (status) => {
    const normalized = (status || '').toLowerCase().replace(/_/g, ' ');
    return LIFECYCLE_STEPS.findIndex((s) => s.label.toLowerCase() === normalized);
  };

  const currentIndex = getStepIndex(currentStatus);

  if (isCancelled) {
    return (
      <div className={`booking-timeline-container cancelled ${className}`}>
        <div className="timeline-cancelled-banner">
          <XCircle size={22} className="text-danger" />
          <div>
            <div className="timeline-cancelled-title">Booking Cancelled</div>
            <div className="timeline-cancelled-desc">
              This service request has been cancelled and will not progress further.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`booking-timeline-container ${className}`}>
      <div className="timeline-steps-track">
        {LIFECYCLE_STEPS.map((step, idx) => {
          const isPassed = currentIndex >= 0 && idx < currentIndex;
          const isCurrent = currentIndex === idx;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`timeline-step ${isPassed ? 'passed' : ''} ${isCurrent ? 'current' : ''}`}
            >
              <div className="timeline-node-wrapper">
                <div className="timeline-icon-box">
                  <Icon size={16} />
                </div>
                <span className="timeline-label">{step.label}</span>
              </div>
              {idx < LIFECYCLE_STEPS.length - 1 && (
                <div
                  className={`timeline-connector ${idx < currentIndex ? 'passed' : ''}`}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
