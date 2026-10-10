import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Wrench, Shield, ArrowRight, X } from 'lucide-react';
import './RoleSelectModal.css';

export default function RoleSelectModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectRole = (role) => {
    onClose();
    navigate(`/login?role=${role}`);
  };

  return (
    <div
      className="role-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Choose Account Type"
    >
      <div className="role-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="role-modal-header">
          <h2 className="role-modal-title">Welcome to HomeFix</h2>
          <p className="role-modal-subtitle">
            Choose your account type to proceed to the appropriate portal
          </p>
          <button
            type="button"
            className="role-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Account Type Options */}
        <div className="role-modal-body">
          {/* 1. Customer Account */}
          <button
            type="button"
            className="role-choice-card customer-card"
            onClick={() => handleSelectRole('customer')}
          >
            <div className="role-card-left">
              <div className="role-card-icon-wrap customer-icon">
                <User size={22} />
              </div>
              <div className="role-card-text">
                <div className="role-card-title">
                  <span>Customer Account</span>
                  <span className="role-badge-pill">Homeowner</span>
                </div>
                <p className="role-card-desc">
                  Book verified home repairs, track technicians & manage household appointments
                </p>
              </div>
            </div>
            <div className="role-card-action-btn">
              <span>Continue</span>
              <ArrowRight size={14} />
            </div>
          </button>

          {/* 2. Technician Partner */}
          <button
            type="button"
            className="role-choice-card tech-card"
            onClick={() => handleSelectRole('technician')}
          >
            <div className="role-card-left">
              <div className="role-card-icon-wrap tech-icon">
                <Wrench size={22} />
              </div>
              <div className="role-card-text">
                <div className="role-card-title">
                  <span>Technician Partner</span>
                  <span className="role-badge-pill">Field Partner</span>
                </div>
                <p className="role-card-desc">
                  Receive job dispatch requests, inspect problem photos & manage daily work schedule
                </p>
              </div>
            </div>
            <div className="role-card-action-btn">
              <span>Continue</span>
              <ArrowRight size={14} />
            </div>
          </button>

          {/* 3. Administrator */}
          <button
            type="button"
            className="role-choice-card admin-card"
            onClick={() => handleSelectRole('admin')}
          >
            <div className="role-card-left">
              <div className="role-card-icon-wrap admin-icon">
                <Shield size={22} />
              </div>
              <div className="role-card-text">
                <div className="role-card-title">
                  <span>Platform Administrator</span>
                  <span className="role-badge-pill">Operations</span>
                </div>
                <p className="role-card-desc">
                  Operations oversight, technician verification, platform analytics & business audit logs
                </p>
              </div>
            </div>
            <div className="role-card-action-btn">
              <span>Continue</span>
              <ArrowRight size={14} />
            </div>
          </button>
        </div>

        {/* Modal Footer */}
        <div className="role-modal-footer">
          <span>New to HomeFix platform?</span>
          <Link to="/register" onClick={onClose}>
            Create Customer / Partner Account →
          </Link>
        </div>
      </div>
    </div>
  );
}
