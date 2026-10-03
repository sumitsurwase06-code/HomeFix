import React, { forwardRef } from 'react';
import './Input.css';

/**
 * Reusable Form Input component with label, error text, helper text, and icon support.
 */
const Input = forwardRef(function Input(
  {
    label,
    id,
    type = 'text',
    error,
    helperText,
    leftIcon,
    rightIcon,
    required = false,
    className = '',
    wrapperClassName = '',
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`input-group ${error ? 'has-error' : ''} ${wrapperClassName}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="input-field-wrapper">
        {leftIcon && <span className="input-icon input-icon-left">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`input-control ${leftIcon ? 'with-left-icon' : ''} ${
            rightIcon ? 'with-right-icon' : ''
          } ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          required={required}
          {...props}
        />
        {rightIcon && <span className="input-icon input-icon-right">{rightIcon}</span>}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="input-error-msg" role="alert">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={`${inputId}-helper`} className="input-helper-msg">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
