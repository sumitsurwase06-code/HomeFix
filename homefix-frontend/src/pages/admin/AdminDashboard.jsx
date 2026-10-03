import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  HardHat,
  UserCheck,
  Clock,
  CalendarCheck,
  CheckCircle,
  XCircle,
  CircleDollarSign,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Eye
} from 'lucide-react';
import { DEMO_TECHNICIANS } from '../../data/technicians';
import { DEMO_BOOKINGS } from '../../data/bookings';
import StatCard from '../../components/dashboard/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function AdminDashboard() {
  const pendingTechnicians = DEMO_TECHNICIANS.filter((t) => t.status === 'Pending');

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-xl bg-gradient-to-r from-[#171e1a] to-[#202923] border border-[var(--line)] text-[var(--text)] shadow-lg">
        <div>
          <span className="text-xs uppercase tracking-wider text-[var(--primary)] font-bold">Platform Super Admin Control</span>
          <h1 className="text-2xl font-bold mt-1 text-[var(--text)]">HomeFix Operations Executive Console</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Real-time multi-tenant monitoring: technician verification, booking throughput, and platform revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/verification">
            <Button variant="primary" size="sm" rightIcon={<UserCheck size={16} />}>
              Review Partner Verifications ({pendingTechnicians.length})
            </Button>
          </Link>
          <Link to="/admin/revenue">
            <Button variant="outline" size="sm">
              Financial Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Demo Metrics Banner */}
      <div className="demo-banner" style={{ borderRadius: 'var(--radius-md)' }}>
        <AlertCircle size={15} />
        <span>
          <strong>Academic Demonstration Mode:</strong> All administrative metrics, platform revenue, and logs represent simulated demo data.
        </span>
      </div>

      {/* Primary KPI Grid (8 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value="1,420"
          subtitle="Registered accounts"
          icon={Users}
          colorScheme="primary"
          trend="12%"
        />

        <StatCard
          title="Total Technicians"
          value={DEMO_TECHNICIANS.length + 78}
          subtitle="Registered partners"
          icon={HardHat}
          colorScheme="info"
        />

        <StatCard
          title="Verified Technicians"
          value="76 Verified"
          subtitle="Active on marketplace"
          icon={UserCheck}
          colorScheme="secondary"
        />

        <StatCard
          title="Pending Verification"
          value={pendingTechnicians.length + 7}
          subtitle="Awaiting ID review"
          icon={Clock}
          colorScheme="warning"
        />

        <StatCard
          title="Total Bookings"
          value="3,290"
          subtitle="Cumulative platform jobs"
          icon={CalendarCheck}
          colorScheme="primary"
          trend="18%"
        />

        <StatCard
          title="Completed Bookings"
          value="2,950"
          subtitle="89.6% fulfillment rate"
          icon={CheckCircle}
          colorScheme="secondary"
        />

        <StatCard
          title="Cancelled Bookings"
          value="120"
          subtitle="3.6% cancellation rate"
          icon={XCircle}
          colorScheme="error"
        />

        <StatCard
          title="Platform Net Commission"
          value="₹1,48,500"
          subtitle="Excludes technician payout"
          icon={CircleDollarSign}
          colorScheme="secondary"
          trend="15%"
        />
      </div>

      {/* Middle Section: Revenue Trend (CSS Bar Chart) & Verification Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Revenue / Booking Distribution Chart (2 cols) */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-[var(--line)]">
            <div>
              <h3 className="font-bold text-base text-[var(--text)]">Monthly Platform Revenue Trend</h3>
              <p className="text-xs text-[var(--text-muted)]">Gross Service Commission (10%) vs Monthly Volume</p>
            </div>
            <span className="text-xs font-semibold text-[var(--primary)] bg-[rgba(212,239,105,0.1)] border border-[rgba(212,239,105,0.25)] px-2 py-1 rounded">
              ↑ 18.4% YoY Growth
            </span>
          </div>

          {/* Pure CSS Bar / Distribution Chart */}
          <div className="h-64 flex items-end justify-between gap-4 pt-6 px-4 bg-[var(--surface-raised)] rounded-xl border border-[var(--line)]">
            {[
              { month: 'May', height: '45%', amount: '₹95,000' },
              { month: 'Jun', height: '58%', amount: '₹1,12,000' },
              { month: 'Jul', height: '65%', amount: '₹1,24,000' },
              { month: 'Aug', height: '78%', amount: '₹1,36,000' },
              { month: 'Sep', height: '88%', amount: '₹1,42,000' },
              { month: 'Oct', height: '95%', amount: '₹1,48,500' },
            ].map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-semibold text-[var(--text-muted)] group-hover:text-[var(--primary)]">
                  {bar.amount}
                </span>
                <div
                  style={{ height: bar.height }}
                  className="w-full max-w-[48px] bg-gradient-to-t from-[var(--surface-soft)] to-[var(--primary)] rounded-t-md transition-all group-hover:brightness-125 shadow-sm"
                />
                <span className="text-xs font-bold text-[var(--text-secondary)]">{bar.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mt-4 pt-2 border-t border-[var(--line)]">
            <span><strong>Rule Compliant:</strong> Platform Commission strictly distinguished from Technician Payout.</span>
            <Link to="/admin/revenue" className="text-[var(--primary)] font-semibold hover:underline">
              Inspect Payout Ledger →
            </Link>
          </div>
        </Card>

        {/* Verification Queue (1 col) */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--line)]">
              <h3 className="font-bold text-base text-[var(--text)]">Partner Verification Queue</h3>
              <Badge status="Pending" dot>{pendingTechnicians.length} Pending</Badge>
            </div>

            <p className="text-xs text-[var(--text-muted)] mb-4">
              Newly registered trade technicians requiring certificate check before marketplace listing.
            </p>

            <div className="space-y-3">
              {DEMO_TECHNICIANS.slice(4, 6).map((tech) => (
                <div key={tech.id} className="p-3 bg-[var(--surface-raised)] rounded-xl border border-[var(--line)]">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-xs text-[var(--text)]">{tech.name}</span>
                    <Badge status={tech.status} size="sm">{tech.status}</Badge>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">{tech.title} • {tech.experience}</p>
                  <p className="text-[11px] text-[var(--text-light)] truncate mt-0.5">{tech.serviceArea}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Link to="/admin/verification">
              <Button variant="primary" size="sm" fullWidth rightIcon={<ArrowRight size={14} />}>
                Go to Verification Center
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Bookings Administration Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--line)]">
          <h3 className="font-bold text-base text-[var(--text)]">Recent Platform Dispatch Bookings</h3>
          <Link to="/admin/bookings" className="text-xs font-semibold text-[var(--primary)] hover:underline">
            View All ({DEMO_BOOKINGS.length})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-xs text-[var(--text-muted)] uppercase tracking-wider">
                <th className="pb-3">Booking ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Technician</th>
                <th className="pb-3">Service Trade</th>
                <th className="pb-3">Customer Total</th>
                <th className="pb-3">Commission (10%)</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {DEMO_BOOKINGS.map((b) => (
                <tr key={b.id} className="hover:bg-[var(--surface-raised)] transition-colors">
                  <td className="py-3 font-mono font-bold text-xs text-[var(--primary)]">{b.id}</td>
                  <td className="py-3 font-medium text-xs text-[var(--text)]">{b.customer.name}</td>
                  <td className="py-3 text-xs text-[var(--text-secondary)]">{b.technicianName}</td>
                  <td className="py-3 text-xs text-[var(--text-muted)]">{b.serviceName}</td>
                  <td className="py-3 font-bold text-xs text-[var(--text)]">₹{b.pricing.customerTotal}</td>
                  <td className="py-3 font-semibold text-xs text-[var(--primary)]">₹{b.pricing.platformFee}</td>
                  <td className="py-3"><Badge status={b.status} size="sm" dot>{b.status}</Badge></td>
                  <td className="py-3 text-right">
                    <Link to={`/admin/bookings/${b.id}`}>
                      <Button variant="ghost" size="sm">Inspect</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
