import React from 'react';
import './Card.css';

/**
 * Reusable Card component for dashboard metrics, service items, technician profiles, etc.
 */
export default function Card({
  children,
  className = '',
  hoverEffect = false,
  bordered = true,
  padding = 'md', // 'none' | 'sm' | 'md' | 'lg'
  onClick,
  ...props
}) {
  const isClickable = Boolean(onClick);

  return (
    <div
      className={`card ${bordered ? 'card-bordered' : ''} ${
        hoverEffect ? 'card-hover' : ''
      } card-padding-${padding} ${isClickable ? 'card-clickable' : ''} ${className}`}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '', ...props }) {
  return (
    <div className={`card-body ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  );
}
