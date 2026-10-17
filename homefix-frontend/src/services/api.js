import axios from 'axios';
import { SERVICE_CATEGORIES } from '../data/services';
import { DEMO_TECHNICIANS } from '../data/technicians';
import { DEMO_BOOKINGS } from '../data/bookings';
import { DEMO_USERS } from '../data/demoUsers';

// Environment-configured API Base URL for future Spring Boot REST API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token when Spring Security backend is integrated
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('homefix_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unified error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Future handler for token expiration
      console.warn('Session expired or unauthorized request to backend.');
    }
    return Promise.reject(error);
  }
);

/* ==========================================================================
   Modular API Services
   Current stage: Resolves realistic demo data via Promises
   Future stage: Easily point endpoints to apiClient.get/post/put/delete
   ========================================================================== */

export const authApi = {
  login: async (credentials) => {
    // Simulated mock authentication with demo credentials
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = DEMO_USERS.find(
          (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
        );
        if (found) {
          resolve({
            data: {
              token: 'mock-jwt-token-' + Date.now(),
              user: found,
            },
          });
        } else {
          // Allow login as a new customer if email doesn't match predefined
          resolve({
            data: {
              token: 'mock-jwt-token-' + Date.now(),
              user: {
                id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
                name: credentials.email.split('@')[0],
                email: credentials.email,
                role: credentials.role || 'customer',
              },
            },
          });
        }
      }, 400);
    });
  },

  register: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            message: 'Registration successful. Please verify OTP.',
            tempUserId: 'TEMP-' + Date.now(),
            user: userData,
          },
        });
      }, 500);
    });
  },

  verifyOtp: async (otp) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp === '123456' || otp.length === 6) {
          resolve({ data: { verified: true, message: 'OTP verified successfully.' } });
        } else {
          reject(new Error('Invalid OTP. Please enter 123456 for demo verification.'));
        }
      }, 400);
    });
  },
};

export const customerApi = {
  getProfile: async () => {
    return new Promise((resolve) => {
      resolve({ data: DEMO_USERS[0] });
    });
  },

  getSavedAddresses: async () => {
    return new Promise((resolve) => {
      resolve({
        data: [
          {
            id: 'ADDR-1',
            type: 'Home',
            street: 'Flat 402, Sunshine Heights, Sector 62',
            locality: 'Indirapuram',
            city: 'Noida',
            postalCode: '201309',
            isDefault: true,
          },
          {
            id: 'ADDR-2',
            type: 'Office',
            street: 'Tower B, 5th Floor, Logix Cyber Park',
            locality: 'Sector 62',
            city: 'Noida',
            postalCode: '201309',
            isDefault: false,
          },
        ],
      });
    });
  },
};

export const technicianApi = {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: DEMO_TECHNICIANS }), 300);
    });
  },

  getById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tech = DEMO_TECHNICIANS.find((t) => t.id === id);
        if (tech) resolve({ data: tech });
        else reject(new Error('Technician not found'));
      }, 200);
    });
  },

  updateAvailability: async (techId, availabilitySchedule) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: { success: true, availabilitySchedule } }), 300);
    });
  },
};

export const bookingApi = {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(DEMO_BOOKINGS), 150);
    });
  },

  getById: async (bookingId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bk = DEMO_BOOKINGS.find((b) => b.id === bookingId || b.bookingReference === bookingId);
        if (bk) resolve(bk);
        else reject(new Error('Booking not found'));
      }, 100);
    });
  },

  getBookingById: async (bookingId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bk = DEMO_BOOKINGS.find((b) => b.id === bookingId || b.bookingReference === bookingId);
        if (bk) resolve(bk);
        else reject(new Error('Booking not found'));
      }, 100);
    });
  },

  getTechnicianBookings: async (techId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return active dispatch list from DEMO_BOOKINGS excluding other technicians' private jobs
        resolve(DEMO_BOOKINGS.filter((b) => !b.isOtherTechnician));
      }, 150);
    });
  },

  getCustomerBookings: async (customerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DEMO_BOOKINGS);
      }, 150);
    });
  },

  create: async (bookingPayload) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBooking = {
          id: 'HF-BK-' + Math.floor(1000 + Math.random() * 9000),
          bookingReference: 'HF-BK-' + Math.floor(1000 + Math.random() * 9000),
          ...bookingPayload,
          status: 'Requested',
          paymentStatus: 'Pending',
          createdAt: new Date().toISOString(),
          statusHistory: [
            {
              status: 'Requested',
              timestamp: new Date().toISOString(),
              note: 'Booking submitted by customer',
            },
          ],
        };
        DEMO_BOOKINGS.unshift(newBooking);
        resolve({ data: newBooking });
      }, 300);
    });
  },

  updateStatus: async (bookingId, newStatus, note = '') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const target = DEMO_BOOKINGS.find((b) => b.id === bookingId || b.bookingReference === bookingId);
        if (target) {
          target.status = newStatus;
          if (!target.statusHistory) target.statusHistory = [];
          target.statusHistory.push({
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: note || `Status transitioned to ${newStatus}`
          });
        }
        resolve({
          data: {
            bookingId,
            status: newStatus,
            note,
            updatedAt: new Date().toISOString(),
          },
        });
      }, 200);
    });
  },
};

export const adminApi = {
  getStats: async () => {
    return new Promise((resolve) => {
      resolve({
        data: {
          totalCustomers: 1420,
          totalTechnicians: 84,
          verifiedTechnicians: 76,
          pendingTechnicians: 8,
          totalBookings: 3290,
          completedBookings: 2950,
          cancelledBookings: 120,
          monthlyPlatformRevenue: 148500, // Platform commission only
          customerGrossGMV: 980400,
        },
      });
    });
  },

  verifyTechnician: async (technicianId, decision) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { technicianId, status: decision } });
      }, 400);
    });
  },
};

export const paymentApi = {
  processMockPayment: async (bookingId, amount) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            transactionId: 'TXN-MOCK-' + Date.now(),
            bookingId,
            amount,
            status: 'Paid',
            timestamp: new Date().toISOString(),
          },
        });
      }, 500);
    });
  },
};

export const reviewApi = {
  submitReview: async (reviewData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: 'REV-' + Date.now(),
            ...reviewData,
            createdAt: new Date().toISOString(),
          },
        });
      }, 400);
    });
  },
};

/* ==========================================================================
   Price Modification & Customer Approval Workflow API
   ========================================================================== */
const STORAGE_KEY_PRICE_CHANGES = 'homefix_price_change_requests';
const STORAGE_KEY_NOTIFICATIONS = 'homefix_user_notifications';

const INITIAL_PROPOSALS = [
  {
    id: 'PCR-8901-1',
    bookingId: 'HF-BK-8901',
    bookingReference: 'HF-BK-8901',
    serviceName: 'Plumbing - Tap & Mixer Leakage',
    technicianId: 'TECH-101',
    technicianName: 'Rajesh Kumar (Demo)',
    customerId: 'USR-ROHAN',
    customerName: 'Rohan Sharma',
    customerEmail: 'rohan.sharma@example.com',
    originalVisitingCharge: 199,
    originalLaborCharge: 350,
    originalMaterialCharge: 220,
    originalCustomerTotal: 769,
    proposedVisitingCharge: 199,
    proposedLaborCharge: 550,
    proposedMaterialCharge: 420,
    proposedCustomerTotal: 1169,
    proposedPlatformFee: 117,
    proposedTechnicianPayout: 1052,
    difference: 400,
    percentageChange: 52.02,
    technicianReason: 'Found deep internal hairline crack in mixer manifold requiring heavy brass replacement valve and 45 mins additional copper joint brazing.',
    customerRejectionReason: null,
    status: 'PENDING_CUSTOMER_APPROVAL',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    decidedAt: null,
  },
];

function getStoredProposals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRICE_CHANGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PRICE_CHANGES, JSON.stringify(INITIAL_PROPOSALS));
      return INITIAL_PROPOSALS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROPOSALS;
  }
}

function saveStoredProposals(list) {
  try {
    localStorage.setItem(STORAGE_KEY_PRICE_CHANGES, JSON.stringify(list));
  } catch (err) {
    console.error('Failed saving proposals to localStorage', err);
  }
}

export const priceChangeApi = {
  /**
   * Technician submits a revised price proposal
   */
  submitProposal: async (bookingId, payload) => {
    try {
      const res = await apiClient.post(`/technician/bookings/${bookingId}/price-change`, payload);
      if (res && res.data) {
        const proposals = getStoredProposals();
        const existingIdx = proposals.findIndex(
          (p) => p.id === res.data.id || String(p.bookingId) === String(bookingId) || p.bookingReference === bookingId
        );
        if (existingIdx >= 0) {
          proposals[existingIdx] = res.data;
        } else {
          proposals.unshift(res.data);
        }
        saveStoredProposals(proposals);

        notificationApi.create({
          recipientEmail: res.data.customerEmail || 'rohan.sharma@example.com',
          title: `Price Revision Requested: #${res.data.bookingReference || bookingId}`,
          message: `Technician submitted revised charges of ₹${res.data.proposedCustomerTotal}. Reason: "${payload.reason.trim()}". Please review and approve or reject.`,
          type: 'PRICE_CHANGE_REQUEST',
          bookingId: res.data.bookingId || bookingId,
        });

        return res.data;
      }
    } catch {
      // Offline / Demo fallback
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const proposals = getStoredProposals();
          const existingPending = proposals.find(
            (p) =>
              (p.bookingId === bookingId || p.bookingReference === bookingId) &&
              p.status === 'PENDING_CUSTOMER_APPROVAL'
          );

          if (existingPending) {
            return reject(
              new Error('A price revision request is already awaiting customer approval for this booking.')
            );
          }

          const targetBooking = DEMO_BOOKINGS.find(
            (b) => b.id === bookingId || b.bookingReference === bookingId
          );

          const origVisiting = Number(targetBooking?.pricing?.visitingCharge ?? 199);
          const origLabor = Number(targetBooking?.pricing?.repairLabor ?? 0);
          const origMaterial = Number(targetBooking?.pricing?.materialCharge ?? 0);
          const origTotal = Number(targetBooking?.pricing?.customerTotal ?? (origVisiting + origLabor + origMaterial));

          const propVisiting = Number(payload.visitingCharge);
          const propLabor = Number(payload.laborCharge);
          const propMaterial = Number(payload.materialCharge);
          const propTotal = propVisiting + propLabor + propMaterial;

          if (
            propVisiting === origVisiting &&
            propLabor === origLabor &&
            propMaterial === origMaterial
          ) {
            return reject(new Error('Proposed charges are identical to currently approved charges.'));
          }

          const platformFee = Math.round(propTotal * 0.10);
          const techPayout = propTotal - platformFee;
          const diff = propTotal - origTotal;
          const pct = origTotal > 0 ? Number(((diff / origTotal) * 100).toFixed(2)) : 0;

          const newProposal = {
            id: 'PCR-' + Date.now(),
            bookingId: targetBooking?.id || bookingId,
            bookingReference: targetBooking?.bookingReference || targetBooking?.id || bookingId,
            serviceName: targetBooking?.serviceName || 'HomeFix Maintenance',
            technicianId: targetBooking?.technicianId || 'TECH-101',
            technicianName: targetBooking?.technicianName || 'Technician',
            customerId: targetBooking?.customer?.id || 'CUST-101',
            customerName: targetBooking?.customer?.name || 'Customer',
            customerEmail: targetBooking?.customer?.email || 'customer@example.com',
            originalVisitingCharge: origVisiting,
            originalLaborCharge: origLabor,
            originalMaterialCharge: origMaterial,
            originalCustomerTotal: origTotal,
            proposedVisitingCharge: propVisiting,
            proposedLaborCharge: propLabor,
            proposedMaterialCharge: propMaterial,
            proposedCustomerTotal: propTotal,
            proposedPlatformFee: platformFee,
            proposedTechnicianPayout: techPayout,
            difference: diff,
            percentageChange: pct,
            technicianReason: payload.reason.trim(),
            customerRejectionReason: null,
            status: 'PENDING_CUSTOMER_APPROVAL',
            createdAt: new Date().toISOString(),
            decidedAt: null,
          };

          proposals.unshift(newProposal);
          saveStoredProposals(proposals);

          // Record notification
          notificationApi.create({
            recipientEmail: newProposal.customerEmail,
            title: `Price Revision Requested: #${newProposal.bookingReference}`,
            message: `Technician ${newProposal.technicianName} submitted revised charges of ₹${propTotal} (Diff: ${diff >= 0 ? '+' : ''}₹${diff}). Reason: "${payload.reason.trim()}". Please review and approve or reject.`,
            type: 'PRICE_CHANGE_REQUEST',
            bookingId: newProposal.bookingId,
          });

          resolve(newProposal);
        }, 300);
      });
    }
  },

  /**
   * Get all pending price proposals for customer
   */
  getPendingForCustomer: async (customerEmail) => {
    try {
      const res = await apiClient.get('/customer/price-changes/pending');
      return res.data;
    } catch {
      return new Promise((resolve) => {
        setTimeout(() => {
          const list = getStoredProposals().filter(
            (p) =>
              p.status === 'PENDING_CUSTOMER_APPROVAL' &&
              (!customerEmail || !p.customerEmail || p.customerEmail.toLowerCase() === customerEmail.toLowerCase())
          );
          resolve(list);
        }, 150);
      });
    }
  },

  /**
   * Get all price revision proposals in system
   */
  getAllProposals: async () => {
    return getStoredProposals();
  },

  /**
   * Get proposals for a specific booking
   */
  getBookingHistory: async (bookingId) => {
    try {
      let res;
      try {
        res = await apiClient.get(`/technician/bookings/${bookingId}/price-change/history`);
      } catch {
        res = await apiClient.get(`/customer/bookings/${bookingId}/price-change/history`);
      }
      if (res && res.data && res.data.length > 0) {
        return res.data;
      }
      throw new Error('No backend history, fallback to local');
    } catch {
      return new Promise((resolve) => {
        setTimeout(() => {
          const list = getStoredProposals().filter(
            (p) => p.bookingId === bookingId || p.bookingReference === bookingId
          );
          resolve(list);
        }, 150);
      });
    }
  },

  /**
   * Customer accepts revised proposal
   */
  approveProposal: async (requestId) => {
    try {
      const res = await apiClient.post(`/customer/price-changes/${requestId}/approve`);
      if (res.data) {
        const proposals = getStoredProposals();
        const p = proposals.find((x) => x.id === requestId || String(x.id) === String(res.data.id));
        if (p) {
          p.status = 'APPROVED';
          p.decidedAt = res.data.decidedAt || new Date().toISOString();
          saveStoredProposals(proposals);
        }
        const b = DEMO_BOOKINGS.find(
          (item) => item.id === res.data.bookingId || item.bookingReference === res.data.bookingId
        );
        if (b) {
          b.pricing = {
            visitingCharge: res.data.proposedVisitingCharge,
            repairLabor: res.data.proposedLaborCharge,
            materialCharge: res.data.proposedMaterialCharge,
            customerTotal: res.data.proposedCustomerTotal,
            platformFee: res.data.proposedPlatformFee,
            technicianPayout: res.data.proposedTechnicianPayout,
          };
        }
        return res.data;
      }
      throw new Error('Approval response empty');
    } catch {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const proposals = getStoredProposals();
          const req = proposals.find((p) => p.id === requestId);
          if (!req) return reject(new Error('Price change proposal not found'));
          if (req.status !== 'PENDING_CUSTOMER_APPROVAL') {
            return reject(new Error(`This proposal has already been ${req.status}`));
          }

          req.status = 'APPROVED';
          req.decidedAt = new Date().toISOString();
          saveStoredProposals(proposals);

          // Update active booking pricing atomically
          const b = DEMO_BOOKINGS.find(
            (item) => item.id === req.bookingId || item.bookingReference === req.bookingId
          );
          if (b) {
            b.pricing = {
              visitingCharge: req.proposedVisitingCharge,
              repairLabor: req.proposedLaborCharge,
              materialCharge: req.proposedMaterialCharge,
              customerTotal: req.proposedCustomerTotal,
              platformFee: req.proposedPlatformFee,
              technicianPayout: req.proposedTechnicianPayout,
            };
            if (!b.statusHistory) b.statusHistory = [];
            b.statusHistory.push({
              status: b.status,
              timestamp: new Date().toISOString(),
              note: `Customer approved revised charges: ₹${req.originalCustomerTotal} → ₹${req.proposedCustomerTotal}. New invoice active.`,
            });
          }

          notificationApi.create({
            recipientEmail: req.technicianId,
            title: `Charges Approved: #${req.bookingReference}`,
            message: `Customer ${req.customerName} approved your revised quotation of ₹${req.proposedCustomerTotal}. You may proceed with the service.`,
            type: 'PRICE_CHANGE_APPROVED',
            bookingId: req.bookingId,
          });

          resolve(req);
        }, 300);
      });
    }
  },

  /**
   * Customer declines revised proposal
   */
  rejectProposal: async (requestId, reason = '') => {
    try {
      const res = await apiClient.post(`/customer/price-changes/${requestId}/reject`, {
        reason: reason,
      });
      if (res.data) {
        const proposals = getStoredProposals();
        const p = proposals.find((x) => x.id === requestId || String(x.id) === String(res.data.id));
        if (p) {
          p.status = 'REJECTED';
          p.customerRejectionReason = reason;
          p.decidedAt = res.data.decidedAt || new Date().toISOString();
          saveStoredProposals(proposals);
        }
        return res.data;
      }
      throw new Error('Rejection response empty');
    } catch {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const proposals = getStoredProposals();
          const req = proposals.find((p) => p.id === requestId);
          if (!req) return reject(new Error('Price change proposal not found'));
          if (req.status !== 'PENDING_CUSTOMER_APPROVAL') {
            return reject(new Error(`This proposal has already been ${req.status}`));
          }

          req.status = 'REJECTED';
          req.customerRejectionReason = reason ? reason.trim() : 'Declined by customer';
          req.decidedAt = new Date().toISOString();
          saveStoredProposals(proposals);

          // Previous approved invoice remains completely unchanged
          const b = DEMO_BOOKINGS.find(
            (item) => item.id === req.bookingId || item.bookingReference === req.bookingId
          );
          if (b) {
            if (!b.statusHistory) b.statusHistory = [];
            b.statusHistory.push({
              status: b.status,
              timestamp: new Date().toISOString(),
              note: `Customer rejected proposed charge of ₹${req.proposedCustomerTotal}.${reason ? ` Reason: "${reason.trim()}".` : ''} Previous approved quotation (₹${req.originalCustomerTotal}) remains active.`,
            });
          }

          notificationApi.create({
            recipientEmail: req.technicianId,
            title: `Charges Rejected: #${req.bookingReference}`,
            message: `Customer ${req.customerName} declined your price revision proposal of ₹${req.proposedCustomerTotal}.${reason ? ` Feedback: "${reason.trim()}".` : ''} Previous quotation of ₹${req.originalCustomerTotal} remains in effect.`,
            type: 'PRICE_CHANGE_REJECTED',
            bookingId: req.bookingId,
          });

          resolve(req);
        }, 300);
      });
    }
  },
};

/* ==========================================================================
   User Notifications API
   ========================================================================== */
export const notificationApi = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/notifications');
      if (res && res.data && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fallback to local storage
    }
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    return raw ? JSON.parse(raw) : [];
  },

  create: (item) => {
    try {
      const list = notificationApi.getAllSync();
      const newItem = {
        id: 'NOTIF-' + Date.now(),
        read: false,
        createdAt: new Date().toISOString(),
        ...item,
      };
      list.unshift(newItem);
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(list));
      return newItem;
    } catch (err) {
      console.error('Error creating notification', err);
    }
  },

  getAllSync: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  markAsRead: async (id) => {
    try {
      if (typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id))) {
        await apiClient.patch(`/notifications/${id}/read`);
      }
    } catch (err) {
      console.warn('Backend mark notification read error:', err);
    }
    try {
      const list = notificationApi.getAllSync();
      const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
    } catch (err) {
      console.error('Error marking notification read', err);
    }
  },
};

export default apiClient;

