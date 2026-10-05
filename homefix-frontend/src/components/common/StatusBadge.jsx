import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Truck, 
  Wrench, 
  XCircle, 
  AlertCircle, 
  ShieldCheck,
  CircleDot
} from 'lucide-react';
import './StatusBadge.css';

/**
 * Reusable StatusBadge component supporting canonical HomeFix statuses
 */
export default function StatusBadge({ status = 'PENDING', size = 'md', className = '' }) {
  const normalized = (status || '').toUpperCase().replace(/[\s-]/g, '_');

  const getStatusConfig = () => {
    switch (normalized) {
      case 'REQUESTED':
      case 'PENDING':
        return {
          label: 'Requested',
          theme: 'status-pending',
          icon: <Clock size={13} />
        };
      case 'ACCEPTED':
        return {
          label: 'Accepted',
          theme: 'status-accepted',
          icon: <CircleDot size={13} />
        };
      case 'SCHEDULED':
        return {
          label: 'Scheduled',
          theme: 'status-scheduled',
          icon: <Calendar size={13} />
        };
      case 'ON_THE_WAY':
        return {
          label: 'On The Way',
          theme: 'status-ontheway',
          icon: <Truck size={13} />
        };
      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          theme: 'status-inprogress',
          icon: <Wrench size={13} />
        };
      case 'COMPLETED':
        return {
          label: 'Completed',
          theme: 'status-completed',
          icon: <CheckCircle2 size={13} />
        };
      case 'CANCELLED':
      case 'REJECTED':
        return {
          label: normalized === 'REJECTED' ? 'Rejected' : 'Cancelled',
          theme: 'status-cancelled',
          icon: <XCircle size={13} />
        };
      case 'APPROVED':
      case 'VERIFIED':
        return {
          label: normalized === 'VERIFIED' ? 'Verified' : 'Approved',
          theme: 'status-approved',
          icon: <ShieldCheck size={13} />
        };
      case 'UNDER_REVIEW':
      case 'PENDING_VERIFICATION':
        return {
          label: 'Under Review',
          theme: 'status-warning',
          icon: <AlertCircle size={13} />
        };
      default:
        return {
          label: status,
          theme: 'status-default',
          icon: <CircleDot size={13} />
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`status-badge status-badge-${size} ${config.theme} ${className}`}>
      <span className="status-badge-icon">{config.icon}</span>
      <span className="status-badge-text">{config.label}</span>
    </span>
  );
}
