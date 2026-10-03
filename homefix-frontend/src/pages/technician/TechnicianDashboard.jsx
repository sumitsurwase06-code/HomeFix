import React from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  CheckCircle,
  Clock,
  Wallet,
  Star,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_BOOKINGS } from '../../data/bookings';
import StatCard from '../../components/dashboard/StatCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function TechnicianDashboard() {
  const { currentUser } = useAuth();

  const isVerified = currentUser?.verificationStatus !== 'Pending';
  const newRequests = DEMO_BOOKINGS.filter((b) => b.status === 'Requested');
  const upcomingJobs = DEMO_BOOKINGS.filter((b) => ['Accepted', 'Scheduled', 'On the Way', 'In Progress'].includes(b.status));
  const completedJobs = DEMO_BOOKINGS.filter((b) => b.status === 'Completed');

  return (
    <div className="flex flex-col gap-6">
      {/* Top Verification Status Banner */}
      {!isVerified ? (
        <div className="p-4 rounded-xl bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.3)] text-[#fde68a] flex items-center justify-between flex-wrap gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} className="text-[var(--warning)] flex-shrink-0" />
            <div>
              <h3 className="font-bold text-sm">Account Status: Pending Admin Verification</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Your submitted documents and skill certifications are currently under review by our operations supervisor. You will be publicly bookable once approved.
              </p>
            </div>
          </div>
          <Link to="/technician/profile">
            <Button variant="outline" size="sm" className="border-[rgba(251,191,36,0.4)] text-[#fde68a]">
              Check Documents
            </Button>
          </Link>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[rgba(212,239,105,0.1)] border border-[rgba(212,239,105,0.3)] text-[var(--text)] flex items-center justify-between flex-wrap gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} className="text-[var(--primary)] flex-shrink-0" />
            <div>
              <h3 className="font-bold text-sm">Account Status: Verified Service Partner (Active)</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                You are live on the customer marketplace. Ready to receive dispatch requests in your designated area.
              </p>
            </div>
          </div>
          <Badge status="Verified" dot size="md">Online & Receiving Leads</Badge>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="New Requests"
          value={newRequests.length}
          subtitle="Waiting for your acceptance"
          icon={Inbox}
          colorScheme="warning"
        />

        <StatCard
          title="Upcoming Appointments"
          value={upcomingJobs.length}
          subtitle="Scheduled this week"
          icon={Clock}
          colorScheme="info"
        />

        <StatCard
          title="Completed Jobs"
          value={completedJobs.length + 38}
          subtitle="Lifetime fulfilled repairs"
          icon={CheckCircle}
          colorScheme="secondary"
        />

        <StatCard
          title="Monthly Payouts"
          value="₹24,850"
          subtitle="Estimated net technician payout"
          icon={Wallet}
          colorScheme="primary"
          trend="14%"
        />
      </div>

      {/* Main Grid: Pending Requests & Active Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Booking Requests (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--text)]">Incoming Booking Requests</h2>
            <Link to="/technician/requests" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              View All Requests ({newRequests.length})
            </Link>
          </div>

          {newRequests.length > 0 ? (
            newRequests.map((req) => (
              <Card key={req.id} className="p-5 border-l-4 border-l-[var(--warning)]">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-[var(--text-muted)]">{req.id}</span>
                    <h3 className="text-base font-bold text-[var(--text)] mt-1">{req.serviceName}</h3>
                  </div>
                  <Badge status="Requested" dot>New Lead</Badge>
                </div>

                <p className="text-sm text-[var(--text-secondary)] mb-3">{req.problemTitle}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-[var(--text-muted)] bg-[var(--surface-raised)] border border-[var(--line)] p-3 rounded-lg mb-4">
                  <div>Date: <strong className="text-[var(--text)]">{req.appointmentDate}</strong></div>
                  <div>Time: <strong className="text-[var(--text)]">{req.appointmentTime}</strong></div>
                  <div>Visiting Fee: <strong className="text-[var(--primary)]">₹{req.pricing.visitingCharge}</strong></div>
                  <div className="col-span-2 sm:col-span-3">Locality: <strong className="text-[var(--text)]">{req.address.locality}, {req.address.city}</strong></div>
                </div>

                <div className="flex justify-end gap-2">
                  <Link to={`/technician/bookings/${req.id}`}>
                    <Button variant="primary" size="sm">
                      Inspect & Accept Request
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center text-[var(--text-muted)] text-sm">
              No new unassigned requests at the moment.
            </Card>
          )}
        </div>

        {/* Right Column: Performance & Availability */}
        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <h3 className="font-bold text-base text-[var(--text)] mb-3">Service Partner Rating</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl font-extrabold text-[var(--text)] flex items-center gap-1">
                <Star size={26} className="fill-amber-400 text-amber-400" />
                <span>4.8</span>
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                <div>Based on 142 customer reviews</div>
                <div className="text-[var(--primary)] font-semibold">98% 5-star positive satisfaction</div>
              </div>
            </div>

            <Link to="/technician/reviews">
              <Button variant="outline" size="sm" fullWidth>
                View Customer Reviews
              </Button>
            </Link>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-base text-[var(--text)] mb-2">Availability Status</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">
              You are currently marked as available for instant emergency bookings.
            </p>
            <Link to="/technician/availability">
              <Button variant="secondary" size="sm" fullWidth leftIcon={<Calendar size={14} />}>
                Configure Weekly Slots
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
