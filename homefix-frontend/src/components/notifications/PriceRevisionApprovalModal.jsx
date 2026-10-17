import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Wrench,
  ShieldAlert,
  X,
  FileText,
  UserCheck
} from 'lucide-react';
import './PriceRevisionApprovalModal.css';

export default function PriceRevisionApprovalModal({
  proposal,
  isOpen,
  onApprove,
  onReject,
  onReviewLater,
  isProcessing = false
}) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Handle ESC key to dismiss (Review Later)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isProcessing) {
        onReviewLater();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing, onReviewLater]);

  if (!isOpen || !proposal) return null;

  const origVisiting = Number(proposal.originalVisitingCharge || 0);
  const origLabor = Number(proposal.originalLaborCharge || 0);
  const origMaterial = Number(proposal.originalMaterialCharge || 0);
  const origTotal = Number(proposal.originalCustomerTotal || (origVisiting + origLabor + origMaterial));

  const propVisiting = Number(proposal.proposedVisitingCharge || 0);
  const propLabor = Number(proposal.proposedLaborCharge || 0);
  const propMaterial = Number(proposal.proposedMaterialCharge || 0);
  const propTotal = Number(proposal.proposedCustomerTotal || (propVisiting + propLabor + propMaterial));

  const diffAmount = propTotal - origTotal;
  const isIncrease = diffAmount > 0;
  const diffPercent = origTotal > 0 ? ((Math.abs(diffAmount) / origTotal) * 100).toFixed(1) : 0;

  const handleConfirmReject = () => {
    onReject(proposal.id, rejectionReason);
  };

  return (
    <div className="pcr-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="pcr-title">
      <div className="pcr-modal-container">
        {/* Modal Header */}
        <div className="pcr-modal-header">
          <div className="pcr-header-icon-wrap">
            <AlertTriangle size={24} />
          </div>

          <div className="pcr-header-text">
            <div className="pcr-header-top-row">
              <h2 id="pcr-title" className="pcr-header-title">
                Price Update Requires Your Approval
              </h2>
              <span className="pcr-status-badge">
                <span className="pcr-status-dot" />
                Pending Your Approval
              </span>
            </div>
            <p className="pcr-header-subtitle">
              Your technician has proposed a price change for your booking. Please review the updated charges and approve or reject the changes.
            </p>
          </div>

          <button
            type="button"
            className="pcr-close-btn"
            onClick={onReviewLater}
            disabled={isProcessing}
            title="Review Later (Dismiss)"
            aria-label="Dismiss and review later"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="pcr-modal-body">
          {/* Metadata Strip */}
          <div className="pcr-meta-strip">
            <div className="pcr-meta-item">
              <span className="pcr-meta-label">Booking & Service</span>
              <span className="pcr-meta-value">
                <Wrench size={14} className="text-primary" />
                <span>
                  #{proposal.bookingReference || proposal.bookingId} — {proposal.serviceName || 'Home Service'}
                </span>
              </span>
            </div>
            <div className="pcr-meta-item">
              <span className="pcr-meta-label">Assigned Technician</span>
              <span className="pcr-meta-value">
                <UserCheck size={14} className="text-emerald-700" />
                <span>{proposal.technicianName || 'Verified Specialist'}</span>
              </span>
            </div>
          </div>

          {/* Reason Callout */}
          {proposal.technicianReason && (
            <div className="pcr-reason-box">
              <div className="pcr-reason-header">
                <FileText size={14} />
                <span>Reason for Price Revision</span>
              </div>
              <p className="pcr-reason-text">"{proposal.technicianReason}"</p>
            </div>
          )}

          {/* Total Comparison Hero */}
          <div className="pcr-total-comparison-hero">
            <div className="pcr-price-pill">
              <span className="pcr-price-pill-label">Previous Approved Price</span>
              <span className="pcr-price-pill-amount approved">₹{origTotal}</span>
            </div>

            <div className="pcr-price-arrow">
              <ArrowRight size={20} />
            </div>

            <div className="pcr-price-pill">
              <span className="pcr-price-pill-label">Proposed Updated Price</span>
              <span className="pcr-price-pill-amount proposed">₹{propTotal}</span>
            </div>

            <div className={`pcr-diff-badge ${isIncrease ? 'increase' : 'decrease'}`}>
              {isIncrease ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
              <span>
                {isIncrease ? '+' : ''}₹{diffAmount} ({diffPercent}%)
              </span>
            </div>
          </div>

          {/* Itemized Comparison Breakdown */}
          <div className="pcr-breakdown-card">
            <div className="pcr-breakdown-header">
              <span>Itemized Charge Comparison</span>
            </div>
            <table className="pcr-breakdown-table">
              <thead>
                <tr>
                  <th>Charge Item</th>
                  <th className="text-right">Previous</th>
                  <th className="text-right">Proposed</th>
                  <th className="text-right">Difference</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Visiting / Inspection Fee</td>
                  <td className="text-right">₹{origVisiting}</td>
                  <td className="text-right font-semibold">₹{propVisiting}</td>
                  <td className="text-right">
                    {propVisiting - origVisiting !== 0 ? (
                      <span className={propVisiting > origVisiting ? 'pcr-diff-up' : 'pcr-diff-down'}>
                        {propVisiting > origVisiting ? '+' : ''}₹{propVisiting - origVisiting}
                      </span>
                    ) : '—'}
                  </td>
                </tr>
                <tr>
                  <td>Repair Labor Charges</td>
                  <td className="text-right">₹{origLabor}</td>
                  <td className="text-right font-semibold">₹{propLabor}</td>
                  <td className="text-right">
                    {propLabor - origLabor !== 0 ? (
                      <span className={propLabor > origLabor ? 'pcr-diff-up' : 'pcr-diff-down'}>
                        {propLabor > origLabor ? '+' : ''}₹{propLabor - origLabor}
                      </span>
                    ) : '—'}
                  </td>
                </tr>
                <tr>
                  <td>Materials & Spare Parts</td>
                  <td className="text-right">₹{origMaterial}</td>
                  <td className="text-right font-semibold">₹{propMaterial}</td>
                  <td className="text-right">
                    {propMaterial - origMaterial !== 0 ? (
                      <span className={propMaterial > origMaterial ? 'pcr-diff-up' : 'pcr-diff-down'}>
                        {propMaterial > origMaterial ? '+' : ''}₹{propMaterial - origMaterial}
                      </span>
                    ) : '—'}
                  </td>
                </tr>
                <tr className="row-total">
                  <td>Customer Total</td>
                  <td className="text-right text-gray-500">₹{origTotal}</td>
                  <td className="text-right font-bold text-emerald-800">₹{propTotal}</td>
                  <td className="text-right font-bold">
                    <span className={isIncrease ? 'pcr-diff-up' : 'pcr-diff-down'}>
                      {isIncrease ? '+' : ''}₹{diffAmount}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Rejection Note Expansion */}
          {showRejectInput && (
            <div className="pcr-rejection-box">
              <label htmlFor="pcr-rejection-reason" className="pcr-rejection-label">
                Feedback for Technician (Optional):
              </label>
              <textarea
                id="pcr-rejection-reason"
                className="pcr-rejection-textarea"
                placeholder="Explain why you are declining this price revision (e.g., exceeds budget, need further inspection)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                disabled={isProcessing}
              />
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="pcr-modal-footer">
          <div className="pcr-footer-left">
            <button
              type="button"
              className="pcr-btn-later"
              onClick={onReviewLater}
              disabled={isProcessing}
              title="Dismiss for now. Revision remains pending in your notification center."
            >
              <Clock size={16} />
              <span>Review Later</span>
            </button>
          </div>

          <div className="pcr-footer-right">
            {!showRejectInput ? (
              <button
                type="button"
                className="pcr-btn-reject"
                onClick={() => setShowRejectInput(true)}
                disabled={isProcessing}
              >
                <XCircle size={16} />
                <span>Reject Changes</span>
              </button>
            ) : (
              <button
                type="button"
                className="pcr-btn-reject"
                onClick={handleConfirmReject}
                disabled={isProcessing}
              >
                <XCircle size={16} />
                <span>{isProcessing ? 'Rejecting...' : 'Confirm Rejection'}</span>
              </button>
            )}

            <button
              type="button"
              className="pcr-btn-approve"
              onClick={() => onApprove(proposal.id)}
              disabled={isProcessing}
            >
              <CheckCircle size={17} />
              <span>{isProcessing ? 'Processing...' : 'Review & Approve Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
