import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';
import { useCustomerNotifications } from '../../context/CustomerNotificationContext';
import './PendingPriceBanner.css';

export default function PendingPriceBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const { pendingProposals, pendingCount, openReviewModal } = useCustomerNotifications();

  if (pendingCount === 0 || isDismissed) return null;

  const topProposal = pendingProposals[0];
  const diff = topProposal.difference || (topProposal.proposedCustomerTotal - topProposal.originalCustomerTotal);

  return (
    <aside className="pcr-global-alert-banner" role="alert" aria-label="Pending price approval notification">
      <div className="pcr-banner-left">
        <div className="pcr-banner-icon-wrap">
          <AlertTriangle size={18} />
        </div>
        <div className="pcr-banner-text">
          <h4 className="pcr-banner-title">
            <span>Price Update Requires Your Approval</span>
            {pendingCount > 1 && (
              <span className="pcr-banner-badge">{pendingCount} Pending</span>
            )}
          </h4>
          <p className="pcr-banner-desc">
            Technician <strong>{topProposal.technicianName || 'Specialist'}</strong> proposed revised charges of{' '}
            <strong>₹{topProposal.proposedCustomerTotal}</strong> (Diff: {diff > 0 ? '+' : ''}₹{diff}) for booking{' '}
            <strong>#{topProposal.bookingReference || topProposal.bookingId}</strong>.
          </p>
        </div>
      </div>

      <div className="pcr-banner-actions">
        <button
          type="button"
          className="pcr-banner-btn-review"
          onClick={() => openReviewModal(topProposal)}
        >
          <span>Review & Approve</span>
          <ArrowRight size={14} />
        </button>

        <button
          type="button"
          className="pcr-banner-btn-dismiss"
          onClick={() => setIsDismissed(true)}
          title="Dismiss banner for now"
          aria-label="Dismiss banner"
        >
          <X size={18} />
        </button>
      </div>
    </aside>
  );
}
