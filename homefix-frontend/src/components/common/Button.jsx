import React from 'react';
import './Button.css';

/**
 * Reusable Button component with multiple variants, sizes, and states.
 */
export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent'
  size = 'md',          // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full-width' : ''} ${isLoading ? 'btn-loading' : ''} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : (
        leftIcon && <span className="btn-icon btn-icon-left">{leftIcon}</span>
      )}
      <span className="btn-text">{children}</span>
      {!isLoading && rightIcon && (
        <span className="btn-icon btn-icon-right">{rightIcon}</span>
      )}
    </button>
  );
}
