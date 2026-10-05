import React from 'react';
import { Check } from 'lucide-react';
import './Stepper.css';

/**
 * Reusable Stepper component for multi-step wizards
 * @param {Array} steps - [{ id: 1, title: 'Service', subtitle: 'Category' }, ...]
 * @param {number} activeStep - 1-based current step index
 * @param {Function} onStepClick - optional callback if jumping is allowed
 */
export default function Stepper({ steps = [], activeStep = 1, onStepClick }) {
  return (
    <div className="stepper-container" aria-label="Progress Steps">
      <div className="stepper-list">
        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isCompleted = stepNumber < activeStep;
          const isActive = stepNumber === activeStep;
          const isPending = stepNumber > activeStep;

          return (
            <div
              key={step.id || idx}
              className={`stepper-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} ${isPending ? 'pending' : ''}`}
            >
              <div className="stepper-content-wrapper">
                <button
                  type="button"
                  className={`stepper-indicator ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                  disabled={!onStepClick || isPending}
                  onClick={() => onStepClick && onStepClick(stepNumber)}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check size={16} strokeWidth={3} className="stepper-check-icon" />
                  ) : (
                    <span className="stepper-number">{stepNumber}</span>
                  )}
                </button>
                <div className="stepper-text">
                  <span className="stepper-title">{step.title}</span>
                  {step.subtitle && <span className="stepper-subtitle">{step.subtitle}</span>}
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`stepper-divider ${stepNumber < activeStep ? 'completed' : ''}`}
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
