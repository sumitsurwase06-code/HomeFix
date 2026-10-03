import React from 'react';
import { Outlet } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

export default function PublicLayout() {
  return (
    <div className="public-layout-root flex flex-col min-h-screen">
      {/* Demo Notification Banner */}
      <aside className="demo-banner" aria-label="Demo notice">
        <AlertCircle size={15} />
        <span>
          <strong>Academic BTech Demonstration:</strong> All metrics, services, and technician profiles shown are simulated demo data.
        </span>
      </aside>

      {/* Main Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="public-main-content flex-grow" id="main-content">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
