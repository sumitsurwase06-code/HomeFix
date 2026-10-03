import React from 'react';
import './Loading.css';

/**
 * Reusable Loading component for async operations and skeleton loading.
 */
export default function Loading({
  message = 'Loading...',
  size = 'md', // 'sm' | 'md' | 'lg'
  fullPage = false,
  className = '',
}) {
  return (
    <div
      className={`loading-container ${fullPage ? 'loading-fullpage' : ''} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className={`loading-spinner loading-spinner-${size}`} />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}

export function Skeleton({
  height = '1rem',
  width = '100%',
  borderRadius = 'var(--radius-sm)',
  className = '',
}) {
  return (
    <div
      className={`skeleton-loader ${className}`}
      style={{ height, width, borderRadius }}
      aria-hidden="true"
    />
  );
}
