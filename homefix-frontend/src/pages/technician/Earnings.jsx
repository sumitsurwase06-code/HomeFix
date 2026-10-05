import React from 'react';
import { Wallet, TrendingUp, ArrowDownRight, ArrowUpRight, DollarSign, Download, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function Earnings() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Technician Earnings & Payouts</h1>
          <p className="page-subtitle">Itemized trade earnings, service fees, and bank disbursement history</p>
        </div>

        <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>
          Download Statement
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <StatCard
          title="Total Gross Revenue"
          value="₹27,850"
          subtitle="Customer billed amount"
          icon={TrendingUp}
          colorScheme="primary"
        />

        <StatCard
          title="Platform Commission"
          value="₹3,000"
          subtitle="Fixed 10% platform service fee"
          icon={ArrowDownRight}
          colorScheme="warning"
        />

        <StatCard
          title="Net Payout Balance"
          value="₹24,850"
          subtitle="Disbursed to linked bank account"
          icon={Wallet}
          colorScheme="secondary"
        />
      </div>

      <Card className="p-6" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--text)', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--line)' }}>
          Recent Completed Job Disbursements
        </h3>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Service Trade</th>
                <th>Visiting Fee</th>
                <th>Labor + Parts</th>
                <th>Platform Fee (10%)</th>
                <th>Net Payout</th>
                <th>Payout Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: 'var(--primary)' }}>HF-BK-8903</td>
                <td style={{ fontWeight: 600 }}>Appliance Repair</td>
                <td>₹249</td>
                <td>₹1,000</td>
                <td style={{ color: 'var(--coral)', fontWeight: 600 }}>-₹125</td>
                <td style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>₹1,124</td>
                <td><Badge status="Paid" size="sm">Transferred</Badge></td>
              </tr>
              <tr>
                <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: 'var(--primary)' }}>HF-BK-8850</td>
                <td style={{ fontWeight: 600 }}>Plumbing Leak Fix</td>
                <td>₹199</td>
                <td>₹450</td>
                <td style={{ color: 'var(--coral)', fontWeight: 600 }}>-₹65</td>
                <td style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>₹584</td>
                <td><Badge status="Paid" size="sm">Transferred</Badge></td>
              </tr>
              <tr>
                <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: 'var(--primary)' }}>HF-BK-8792</td>
                <td style={{ fontWeight: 600 }}>Geyser Thermostat</td>
                <td>₹199</td>
                <td>₹800</td>
                <td style={{ color: 'var(--coral)', fontWeight: 600 }}>-₹99</td>
                <td style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>₹900</td>
                <td><Badge status="Paid" size="sm">Transferred</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
