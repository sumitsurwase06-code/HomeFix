import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarPlus,
  Users,
  CalendarCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  MapPin,
  Wrench,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_BOOKINGS } from '../../data/bookings';
import StatCard from '../../components/dashboard/StatCard';
import BookingCard from '../../components/booking/BookingCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function CustomerDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Find active / upcoming bookings for this customer
  const activeBooking = DEMO_BOOKINGS.find((b) => b.status === 'In Progress' || b.status === 'On the Way');
  const upcomingBooking = DEMO_BOOKINGS.find((b) => b.status === 'Scheduled' || b.status === 'Requested');
  const completedBookings = DEMO_BOOKINGS.filter((b) => b.status === 'Completed');

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-xl bg-gradient-to-r from-[#171e1a] to-[#202923] border border-[var(--line)] text-[var(--text)] shadow-lg">
        <div>
          <span className="text-xs uppercase tracking-wider text-[var(--primary)] font-bold">Customer Control Center</span>
          <h1 className="text-2xl font-bold mt-1 text-[var(--text)]">Welcome back, {currentUser?.name || 'Customer'}!</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Need household repairs today? Book verified local specialists with transparent pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/customer/book">
            <Button variant="primary" size="md" rightIcon={<CalendarPlus size={16} />}>
              Book a Service
            </Button>
          </Link>
          <Link to="/customer/technicians">
            <Button variant="outline" size="md">
              Find Expert
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Repairs"
          value={activeBooking ? '1 Active' : '0 Active'}
          subtitle={activeBooking ? 'Technician currently dispatched' : 'No active repairs right now'}
          icon={Clock}
          colorScheme="info"
        />

        <StatCard
          title="Upcoming Appointments"
          value={upcomingBooking ? '1 Scheduled' : '0 Scheduled'}
          subtitle={upcomingBooking ? `Scheduled on ${upcomingBooking.appointmentDate}` : 'All caught up'}
          icon={CalendarCheck}
          colorScheme="primary"
        />

        <StatCard
          title="Completed Services"
          value={completedBookings.length}
          subtitle="Lifetime fulfilled repairs"
          icon={CheckCircle}
          colorScheme="secondary"
        />

        <StatCard
          title="Saved Addresses"
          value="2 Places"
          subtitle="Home & Workplace"
          icon={MapPin}
          colorScheme="warning"
        />
      </div>

      {/* Active Service Tracking Card (if any in progress) */}
      {activeBooking && (
        <Card className="border-l-4 border-l-[var(--primary)] p-6 bg-[var(--surface-raised)]">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--primary)]"></span>
              </span>
              <h3 className="font-bold text-base text-[var(--text)]">Active Service In Progress</h3>
            </div>
            <Badge status={activeBooking.status} dot>{activeBooking.status}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
            <div>
              <span className="text-xs text-[var(--text-muted)] block">Service:</span>
              <span className="font-semibold text-[var(--text)]">{activeBooking.serviceName}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--text-muted)] block">Assigned Technician:</span>
              <span className="font-semibold text-[var(--text)]">{activeBooking.technicianName}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--text-muted)] block">Location:</span>
              <span className="font-semibold text-[var(--text)]">{activeBooking.address.locality}, {activeBooking.address.city}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <Link to={`/customer/bookings/${activeBooking.id}`}>
              <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
                Track Live Progress & Receipt
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Main Grid: Recent Bookings & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings List (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--text)]">Recent Service Bookings</h2>
            <Link to="/customer/bookings" className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1">
              <span>View All ({DEMO_BOOKINGS.length})</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {DEMO_BOOKINGS.slice(0, 3).map((booking) => (
              <BookingCard key={booking.id} booking={booking} role="customer" />
            ))}
          </div>
        </div>

        {/* Quick Action Shortcuts (1 col) */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-[var(--text)]">Quick Shortcuts</h2>

          <Card className="p-4 hover:border-[var(--primary)] transition-all cursor-pointer" onClick={() => navigate('/customer/book')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(212,239,105,0.12)] text-[var(--primary)] flex items-center justify-center flex-shrink-0">
                <CalendarPlus size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--text)]">New Booking</h4>
                <p className="text-xs text-[var(--text-muted)]">Step-by-step multi-trade wizard</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:border-[var(--secondary)] transition-all cursor-pointer" onClick={() => navigate('/customer/technicians')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(45,212,191,0.12)] text-[var(--secondary)] flex items-center justify-center flex-shrink-0">
                <Users size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--text)]">Search Technicians</h4>
                <p className="text-xs text-[var(--text-muted)]">Filter by distance, charges & rating</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:border-[var(--warning)] transition-all cursor-pointer" onClick={() => navigate('/customer/addresses')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(251,191,36,0.12)] text-[var(--warning)] flex items-center justify-center flex-shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--text)]">Manage Addresses</h4>
                <p className="text-xs text-[var(--text-muted)]">Pre-fill doorstep repair locations</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-[var(--surface-raised)] border border-[var(--line)] rounded-xl">
            <div className="flex items-start gap-3">
              <ShieldCheck size={24} className="text-[var(--primary)] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-[var(--text)]">HomeFix Quality Assurance</h4>
                <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                  Every booking includes standardized diagnostic inspection, verified parts receipt, and digital payment security.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
