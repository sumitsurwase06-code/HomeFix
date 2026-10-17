import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CustomerNotificationProvider } from './context/CustomerNotificationContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CustomerNotificationProvider>
            <AppRoutes />
          </CustomerNotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
