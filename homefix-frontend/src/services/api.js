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
        // Return active dispatch list from DEMO_BOOKINGS
        resolve(DEMO_BOOKINGS);
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

export default apiClient;
