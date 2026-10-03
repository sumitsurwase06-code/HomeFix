import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';
import './EmptyState.css';

/**
 * Reusable EmptyState component when no records, bookings, or data exist.
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items to display at this time.',
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-icon-wrapper">
        <Icon size={36} className="empty-state-icon" />
      </div>
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="md"
          onClick={onAction}
          leftIcon={actionIcon}
          className="empty-state-action"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
