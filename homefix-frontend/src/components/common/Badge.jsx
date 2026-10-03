import React from 'react';
import './Badge.css';

/**
 * Reusable Badge component for status badges, tags, and role pills.
 */
export default function Badge({
  children,
  variant = 'default', // 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
  status,              // 'Requested' | 'Accepted' | 'Scheduled' | 'On the Way' | 'In Progress' | 'Completed' | 'Cancelled' | 'Paid' | 'Pending' | 'Verified' | 'Rejected'
  size = 'md',         // 'sm' | 'md'
  dot = false,
  className = '',
}) {
  // Map common status values to visual styling automatically
  let resolvedVariant = variant;

  if (status) {
    const s = String(status).toLowerCase();
    if (s.includes('completed') || s.includes('verified') || s.includes('paid') || s.includes('approved')) {
      resolvedVariant = 'success';
    } else if (s.includes('progress') || s.includes('accepted') || s.includes('on the way')) {
      resolvedVariant = 'info';
    } else if (s.includes('scheduled') || s.includes('primary')) {
      resolvedVariant = 'primary';
    } else if (s.includes('requested') || s.includes('pending') || s.includes('waiting')) {
      resolvedVariant = 'warning';
    } else if (s.includes('cancelled') || s.includes('rejected') || s.includes('failed') || s.includes('suspended')) {
      resolvedVariant = 'error';
    }
  }

  const content = children || status;

  return (
    <span className={`badge badge-${resolvedVariant} badge-${size} ${className}`}>
      {dot && <span className="badge-dot" aria-hidden="true" />}
      <span className="badge-text">{content}</span>
    </span>
  );
}
