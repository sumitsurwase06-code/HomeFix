import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { priceChangeApi } from '../services/api';
import PriceRevisionApprovalModal from '../components/notifications/PriceRevisionApprovalModal';

const CustomerNotificationContext = createContext(null);

export function CustomerNotificationProvider({ children }) {
  const { currentUser, isAuthenticated, userRole } = useAuth();
  const { showToast } = useToast();

  const [pendingProposals, setPendingProposals] = useState([]);
  const [activePopupProposal, setActivePopupProposal] = useState(null);
  const [dismissedProposalIds, setDismissedProposalIds] = useState(() => new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(Date.now());

  // Check whether user is a logged-in customer
  const isCustomer = Boolean(isAuthenticated && userRole === 'customer');

  // Fetch pending proposals from API
  const fetchPendingProposals = useCallback(async (autoTriggerPopup = true) => {
    if (!isCustomer) {
      setPendingProposals([]);
      setActivePopupProposal(null);
      return;
    }

    try {
      const email = currentUser?.email || 'customer@example.com';
      const list = await priceChangeApi.getPendingForCustomer(email);
      const safeList = Array.isArray(list) ? list : [];
      setPendingProposals(safeList);
      setLastCheckTime(Date.now());

      // If there are pending proposals and auto-trigger is allowed
      if (autoTriggerPopup && safeList.length > 0) {
        // Find first proposal not dismissed in this session
        setDismissedProposalIds((prevDismissed) => {
          const unDismissed = safeList.find((p) => !prevDismissed.has(p.id));
          if (unDismissed) {
            setActivePopupProposal((current) => current || unDismissed);
          }
          return prevDismissed;
        });
      } else if (safeList.length === 0) {
        setActivePopupProposal(null);
      }
    } catch (err) {
      console.warn('CustomerNotificationProvider: could not load pending proposals', err);
    }
  }, [isCustomer, currentUser]);

  // Initial load & Polling interval
  useEffect(() => {
    if (!isCustomer) {
      setPendingProposals([]);
      setActivePopupProposal(null);
      return;
    }

    // Immediate initial fetch on login / mount
    fetchPendingProposals(true);

    // Reliable background polling every 6 seconds
    const intervalId = setInterval(() => {
      fetchPendingProposals(true);
    }, 6000);

    // Cross-tab and in-tab event listeners for instantaneous 0ms reactivity
    const handlePriceChangeEvent = (event) => {
      fetchPendingProposals(true);
    };

    const handleStorageChange = (e) => {
      if (e.key === 'homefix_price_change_proposals' || e.key === 'homefix_notifications') {
        fetchPendingProposals(true);
      }
    };

    window.addEventListener('homefix:price_change_event', handlePriceChangeEvent);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('homefix:price_change_event', handlePriceChangeEvent);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isCustomer, fetchPendingProposals]);

  // Open review modal manually for a specific proposal (from bell, banner, or bookings)
  const openReviewModal = useCallback((proposal) => {
    if (!proposal) return;
    setActivePopupProposal(proposal);
  }, []);

  // Dismiss popup temporarily ("Review Later")
  const dismissPopup = useCallback((proposalId) => {
    if (proposalId) {
      setDismissedProposalIds((prev) => {
        const next = new Set(prev);
        next.add(proposalId);
        return next;
      });
    }
    setActivePopupProposal(null);
    showToast('Price revision saved for later. You can review it in My Bookings or the notification bell.');
  }, [showToast]);

  // Approve a proposal
  const approveProposal = useCallback(async (proposalId) => {
    setIsProcessing(true);
    try {
      const result = await priceChangeApi.approveProposal(proposalId);
      showToast(`Success: Revised pricing of ₹${result.proposedCustomerTotal} approved! Active invoice updated.`);
      
      // Remove from active modal & refresh
      setActivePopupProposal(null);
      await fetchPendingProposals(false);

      // Broadcast update event to all components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('homefix:price_change_event', {
          detail: { action: 'approved', proposalId, result }
        }));
      }
    } catch (err) {
      console.error('Error approving price proposal:', err);
      showToast(err.message || 'Failed to approve revised charges.');
    } finally {
      setIsProcessing(false);
    }
  }, [fetchPendingProposals, showToast]);

  // Reject a proposal
  const rejectProposal = useCallback(async (proposalId, reason) => {
    setIsProcessing(true);
    try {
      const result = await priceChangeApi.rejectProposal(proposalId, reason);
      showToast('Price revision rejected. Previous approved invoice remains active.');

      // Remove from active modal & refresh
      setActivePopupProposal(null);
      await fetchPendingProposals(false);

      // Broadcast update event to all components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('homefix:price_change_event', {
          detail: { action: 'rejected', proposalId, result }
        }));
      }
    } catch (err) {
      console.error('Error rejecting price proposal:', err);
      showToast(err.message || 'Failed to reject revised charges.');
    } finally {
      setIsProcessing(false);
    }
  }, [fetchPendingProposals, showToast]);

  const value = {
    pendingProposals,
    pendingCount: pendingProposals.length,
    activePopupProposal,
    openReviewModal,
    dismissPopup,
    approveProposal,
    rejectProposal,
    refreshPending: () => fetchPendingProposals(false),
    lastCheckTime
  };

  return (
    <CustomerNotificationContext.Provider value={value}>
      {children}

      {/* Global Application-Wide Instant Popup Modal */}
      {isCustomer && activePopupProposal && (
        <PriceRevisionApprovalModal
          isOpen={Boolean(activePopupProposal)}
          proposal={activePopupProposal}
          onApprove={approveProposal}
          onReject={rejectProposal}
          onReviewLater={() => dismissPopup(activePopupProposal?.id)}
          isProcessing={isProcessing}
        />
      )}
    </CustomerNotificationContext.Provider>
  );
}

export function useCustomerNotifications() {
  const context = useContext(CustomerNotificationContext);
  if (!context) {
    return {
      pendingProposals: [],
      pendingCount: 0,
      activePopupProposal: null,
      openReviewModal: () => {},
      dismissPopup: () => {},
      approveProposal: async () => {},
      rejectProposal: async () => {},
      refreshPending: () => {}
    };
  }
  return context;
}
