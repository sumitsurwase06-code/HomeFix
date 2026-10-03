import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';
import './ErrorState.css';

/**
 * Reusable ErrorState component for handling API failures, not-found states, or broken requests.
 */
export default function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while processing your request. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  className = '',
}) {
  return (
    <div className={`error-state ${className}`} role="alert">
      <div className="error-state-icon-wrapper">
        <AlertCircle size={36} className="error-state-icon" />
      </div>
      <h4 className="error-state-title">{title}</h4>
      <p className="error-state-message">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="md"
          onClick={onRetry}
          leftIcon={<RotateCcw size={16} />}
          className="error-state-action"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
