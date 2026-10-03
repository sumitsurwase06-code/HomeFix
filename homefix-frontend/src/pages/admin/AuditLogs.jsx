import React from 'react';
import { FileText, Shield, User, Clock, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function AuditLogs() {
  const logs = [
    {
      id: 'LOG-9921',
      action: 'TECHNICIAN_APPROVED',
      actor: 'admin@homefix.demo',
      target: 'TECH-101 (Rajesh Kumar)',
      timestamp: '2026-10-03 14:22:10',
      ip: '192.168.1.45',
      status: 'SUCCESS',
    },
    {
      id: 'LOG-9920',
      action: 'PAYMENT_SETTLEMENT',
      actor: 'SYSTEM_ESCROW',
      target: 'HF-BK-8903 (Payout ₹1,124 to Suresh Patel)',
      timestamp: '2026-10-01 13:00:04',
      ip: '10.0.4.12',
      status: 'SUCCESS',
    },
    {
      id: 'LOG-9919',
      action: 'BOOKING_CANCELLED',
      actor: 'rohan.sharma@example.com',
      target: 'HF-BK-8840 (Refund initiated ₹349)',
      timestamp: '2026-09-30 18:45:19',
      ip: '115.240.92.14',
      status: 'INFO',
    },
    {
      id: 'LOG-9918',
      action: 'AUTH_LOGIN_SUCCESS',
      actor: 'admin@homefix.demo',
      target: 'Admin Session Token Generated',
      timestamp: '2026-09-30 09:12:00',
      ip: '192.168.1.45',
      status: 'SUCCESS',
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Security & Operational Audit Logs</h1>
          <p className="page-subtitle">Immutable trace records for administrative actions, auth sessions, and payout triggers</p>
        </div>
      </div>

      <Card className="p-6" style={{ padding: '1.5rem' }}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Event Action</th>
                <th>Triggered By</th>
                <th>Target Details</th>
                <th>Timestamp</th>
                <th>IP Address</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{log.id}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text)' }}>{log.action}</td>
                  <td style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)' }}>{log.actor}</td>
                  <td style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.target}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{log.timestamp}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{log.ip}</td>
                  <td>
                    <Badge status={log.status === 'SUCCESS' ? 'Completed' : 'Scheduled'} size="sm">
                      {log.status}
                    </Badge>
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
