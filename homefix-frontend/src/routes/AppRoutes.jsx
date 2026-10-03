import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import TechnicianLayout from '../layouts/TechnicianLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import Home from '../pages/public/Home';
import Services from '../pages/public/Services';
import Technicians from '../pages/public/Technicians';
import TechnicianDetails from '../pages/public/TechnicianDetails';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import OTPVerification from '../pages/auth/OTPVerification';

// Customer Pages
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import BookService from '../pages/customer/BookService';
import TechnicianSearch from '../pages/customer/TechnicianSearch';
import BookingDetails from '../pages/customer/BookingDetails';
import MyBookings from '../pages/customer/MyBookings';
import Addresses from '../pages/customer/Addresses';
import CustomerProfile from '../pages/customer/CustomerProfile';
import WriteReview from '../pages/customer/WriteReview';

// Technician Pages
import TechnicianDashboard from '../pages/technician/TechnicianDashboard';
import BookingRequests from '../pages/technician/BookingRequests';
import TechnicianBookings from '../pages/technician/TechnicianBookings';
import JobDetails from '../pages/technician/JobDetails';
import Availability from '../pages/technician/Availability';
import Earnings from '../pages/technician/Earnings';
import Reviews from '../pages/technician/Reviews';
import TechnicianProfile from '../pages/technician/TechnicianProfile';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageCustomers from '../pages/admin/ManageCustomers';
import ManageTechnicians from '../pages/admin/ManageTechnicians';
import TechnicianVerification from '../pages/admin/TechnicianVerification';
import ManageBookings from '../pages/admin/ManageBookings';
import AdminBookingDetails from '../pages/admin/AdminBookingDetails';
import Revenue from '../pages/admin/Revenue';
import ReviewsManagement from '../pages/admin/ReviewsManagement';
import ServiceCategories from '../pages/admin/ServiceCategories';
import AuditLogs from '../pages/admin/AuditLogs';

// Route Guards
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/technicians" element={<Technicians />} />
        <Route path="/technicians/:id" element={<TechnicianDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth Pages (Independent) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<OTPVerification />} />

      {/* Customer Portal */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="book" element={<BookService />} />
        <Route path="technicians" element={<TechnicianSearch />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="bookings/:id" element={<BookingDetails />} />
        <Route path="addresses" element={<Addresses />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="reviews" element={<WriteReview />} />
      </Route>

      {/* Technician Portal */}
      <Route
        path="/technician"
        element={
          <ProtectedRoute allowedRoles={['technician', 'admin']}>
            <TechnicianLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TechnicianDashboard />} />
        <Route path="requests" element={<BookingRequests />} />
        <Route path="bookings" element={<TechnicianBookings />} />
        <Route path="bookings/:id" element={<JobDetails />} />
        <Route path="availability" element={<Availability />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="profile" element={<TechnicianProfile />} />
      </Route>

      {/* Admin Portal */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="customers" element={<ManageCustomers />} />
        <Route path="technicians" element={<ManageTechnicians />} />
        <Route path="verification" element={<TechnicianVerification />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="bookings/:id" element={<AdminBookingDetails />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="reviews" element={<ReviewsManagement />} />
        <Route path="services" element={<ServiceCategories />} />
        <Route path="audit-logs" element={<AuditLogs />} />
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
