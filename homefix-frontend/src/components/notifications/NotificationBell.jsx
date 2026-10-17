import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, ArrowRight, CheckCircle2, UserCheck, Check } from 'lucide-react';
import { useCustomerNotifications } from '../../context/CustomerNotificationContext';
import './NotificationBell.css';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { pendingProposals, pendingCount, openReviewModal } = useCustomerNotifications();

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleOpenItem = (proposal) => {
    setIsOpen(false);
    openReviewModal(proposal);
  };

  return (
    <div className="cust-bell-container" ref={containerRef}>
      <button
        type="button"
        className={`cust-bell-btn ${pendingCount > 0 ? 'has-pending' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Pending Price Approval Notifications"
        aria-expanded={isOpen}
        title={pendingCount > 0 ? `${pendingCount} Price Revision(s) Pending Approval` : 'Notifications'}
      >
        <Bell size={18} />
        {pendingCount > 0 && (
          <span className="cust-bell-badge" aria-hidden="true">
            {pendingCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="cust-bell-dropdown" role="region" aria-label="Pending Approvals">
          <div className="cust-bell-dropdown-header">
            <h3 className="cust-bell-dropdown-title">
              <AlertTriangle size={16} className="text-amber-300" />
              <span>Pending Price Approvals</span>
            </h3>
            {pendingCount > 0 && (
              <span className="cust-bell-header-pill">{pendingCount} Action Required</span>
            )}
          </div>

          <div className="cust-bell-dropdown-list">
            {pendingCount === 0 ? (
              <div className="cust-bell-empty">
                <div className="cust-bell-empty-icon">
                  <Check size={20} />
                </div>
                <p className="cust-bell-empty-text">All quotations approved</p>
                <span className="text-xs text-gray-500">No pending price updates at this time.</span>
              </div>
            ) : (
              pendingProposals.map((proposal) => {
                const diff = proposal.difference || (proposal.proposedCustomerTotal - proposal.originalCustomerTotal);
                const isInc = diff > 0;
                return (
                  <div key={proposal.id} className="cust-bell-item">
                    <div className="cust-bell-item-top">
                      <span className="cust-bell-item-booking">
                        #{proposal.bookingReference || proposal.bookingId}
                      </span>
                      <span className="cust-bell-item-diff">
                        {isInc ? '+' : ''}₹{diff}
                      </span>
                    </div>

                    <p className="cust-bell-item-service">
                      {proposal.serviceName || 'Home Repair Service'}
                    </p>

                    <span className="cust-bell-item-tech">
                      <UserCheck size={12} />
                      <span>{proposal.technicianName || 'Specialist'}</span>
                    </span>

                    <div className="cust-bell-item-actions">
                      <span className="cust-bell-item-total">
                        New Total: <strong>₹{proposal.proposedCustomerTotal}</strong>
                      </span>
                      <button
                        type="button"
                        className="cust-bell-item-btn"
                        onClick={() => handleOpenItem(proposal)}
                      >
                        <span>Review</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
