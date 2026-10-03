import React from 'react';
import { CircleDollarSign, TrendingUp, ArrowDownRight, ArrowUpRight, DollarSign, AlertCircle, Download } from 'lucide-react';
import Card from '../../components/common/Card';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function Revenue() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Platform Revenue & Commission Accounting</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Strict separation between customer gross payments, technician disbursements, and platform commission
          </p>
        </div>

        <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>
          Export Financial Ledger (Demo)
        </Button>
      </div>

      <div className="demo-banner" style={{ borderRadius: 'var(--radius-md)' }}>
        <AlertCircle size={15} />
        <span>
          <strong>Accounting Architecture:</strong> HomeFix recognizes only the platform commission fee (10%) as operating revenue. Gross customer billings are held in escrow and disbursed to partners.
        </span>
      </div>

      {/* Top Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Customer Gross GMV"
          value="₹9,80,400"
          subtitle="Total customer payments"
          icon={TrendingUp}
          colorScheme="primary"
          trend="16%"
        />

        <StatCard
          title="Platform Net Revenue"
          value="₹1,48,500"
          subtitle="Net platform service fee"
          icon={CircleDollarSign}
          colorScheme="secondary"
          trend="18%"
        />

        <StatCard
          title="Technician Payouts"
          value="₹8,24,100"
          subtitle="Disbursed to partners"
          icon={ArrowUpRight}
          colorScheme="info"
        />

        <StatCard
          title="Processed Refunds"
          value="₹7,800"
          subtitle="0.79% refund rate"
          icon={ArrowDownRight}
          colorScheme="error"
        />
      </div>

      {/* Revenue Breakdown Comparison Card */}
      <Card className="p-6">
        <h3 className="font-bold text-base text-[var(--text)] mb-4 pb-2 border-b border-[var(--line)]">
          Itemized Financial Ledger & Escrow Settlement
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-xs text-[var(--text-muted)] uppercase tracking-wider">
                <th className="pb-3">Reference</th>
                <th className="pb-3">Visiting Fee</th>
                <th className="pb-3">Repair Labor</th>
                <th className="pb-3">Material Charge</th>
                <th className="pb-3">Customer Total</th>
                <th className="pb-3 text-[var(--primary)]">Platform Commission (10%)</th>
                <th className="pb-3 text-[var(--secondary)]">Technician Payout</th>
                <th className="pb-3">Refund Status</th>
                <th className="pb-3">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] text-xs">
              <tr className="hover:bg-[var(--surface-raised)] transition-colors">
                <td className="py-3 font-mono font-bold text-[var(--primary)]">HF-BK-8901</td>
                <td className="py-3 text-[var(--text-secondary)]">₹199</td>
                <td className="py-3 text-[var(--text-secondary)]">₹350</td>
                <td className="py-3 text-[var(--text-secondary)]">₹220</td>
                <td className="py-3 font-bold text-[var(--text)]">₹769</td>
                <td className="py-3 font-bold text-[var(--primary)]">₹70</td>
                <td className="py-3 font-bold text-[var(--secondary)]">₹699</td>
                <td className="py-3 text-[var(--text-muted)]">None</td>
                <td className="py-3"><Badge status="Pending" size="sm">Pending</Badge></td>
              </tr>
              <tr className="hover:bg-[var(--surface-raised)] transition-colors">
                <td className="py-3 font-mono font-bold text-[var(--primary)]">HF-BK-8902</td>
                <td className="py-3 text-[var(--text-secondary)]">₹199</td>
                <td className="py-3 text-[var(--text-secondary)]">₹0</td>
                <td className="py-3 text-[var(--text-secondary)]">₹0</td>
                <td className="py-3 font-bold text-[var(--text)]">₹199</td>
                <td className="py-3 font-bold text-[var(--primary)]">₹20</td>
                <td className="py-3 font-bold text-[var(--secondary)]">₹179</td>
                <td className="py-3 text-[var(--text-muted)]">None</td>
                <td className="py-3"><Badge status="Pending" size="sm">Pending</Badge></td>
              </tr>
              <tr className="hover:bg-[var(--surface-raised)] transition-colors">
                <td className="py-3 font-mono font-bold text-[var(--primary)]">HF-BK-8903</td>
                <td className="py-3 text-[var(--text-secondary)]">₹249</td>
                <td className="py-3 text-[var(--text-secondary)]">₹450</td>
                <td className="py-3 text-[var(--text-secondary)]">₹550</td>
                <td className="py-3 font-bold text-[var(--text)]">₹1,249</td>
                <td className="py-3 font-bold text-[var(--primary)]">₹125</td>
                <td className="py-3 font-bold text-[var(--secondary)]">₹1,124</td>
                <td className="py-3 text-[var(--text-muted)]">None</td>
                <td className="py-3"><Badge status="Paid" size="sm">Paid</Badge></td>
              </tr>
              <tr className="hover:bg-[var(--surface-raised)] transition-colors">
                <td className="py-3 font-mono font-bold text-[var(--primary)]">HF-BK-8840</td>
                <td className="py-3 text-[var(--text-secondary)]">₹149</td>
                <td className="py-3 text-[var(--text-secondary)]">₹200</td>
                <td className="py-3 text-[var(--text-secondary)]">₹0</td>
                <td className="py-3 font-bold text-[var(--text)]">₹349</td>
                <td className="py-3 font-bold text-[var(--primary)]">₹35</td>
                <td className="py-3 font-bold text-[var(--secondary)]">₹314</td>
                <td className="py-3 text-[var(--coral)] font-semibold">₹349 (Cancelled)</td>
                <td className="py-3"><Badge status="Cancelled" size="sm">Refunded</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
