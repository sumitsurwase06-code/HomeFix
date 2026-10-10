import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Search,
  ShieldAlert,
  ShieldCheck,
  Clock,
  MapPin,
  FileCheck2,
  Filter,
  RefreshCw,
  Ban,
  Check,
  X
} from 'lucide-react';
import { DEMO_TECHNICIANS } from '../../data/technicians';
import { adminApi } from '../../services/api';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import './TechnicianVerification.css';

export default function TechnicianVerification() {
  const [technicians, setTechnicians] = useState(DEMO_TECHNICIANS);
  const [filter, setFilter] = useState('all'); // 'all' | 'Pending' | 'Verified' | 'Rejected' | 'Suspended'
  const [search, setSearch] = useState('');

  // Confirmation Modal state
  const [selectedTech, setSelectedTech] = useState(null);
  const [actionType, setActionType] = useState(null); // 'Approve' | 'Reject' | 'Suspend' | 'Reactivate'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  // Calculate dynamic summary counts from existing data
  const counts = useMemo(() => {
    return {
      total: technicians.length,
      pending: technicians.filter((t) => t.status === 'Pending').length,
      verified: technicians.filter((t) => t.status === 'Verified').length,
      rejected: technicians.filter((t) => t.status === 'Rejected').length,
      suspended: technicians.filter((t) => t.status === 'Suspended').length
    };
  }, [technicians]);

  // Filter & search records
  const filtered = useMemo(() => {
    return technicians.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        (t.serviceArea && t.serviceArea.toLowerCase().includes(search.toLowerCase()));

      const matchesFilter = filter === 'all' || t.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [technicians, search, filter]);

  const promptAction = (tech, action) => {
    setSelectedTech(tech);
    setActionType(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedTech || !actionType) return;

    let newStatus = 'Verified';
    if (actionType === 'Approve' || actionType === 'Reactivate') {
      newStatus = 'Verified';
    } else if (actionType === 'Reject') {
      newStatus = 'Rejected';
    } else if (actionType === 'Suspend') {
      newStatus = 'Suspended';
    }

    // Call existing API contract
    await adminApi.verifyTechnician(selectedTech.id, newStatus);

    setTechnicians((prev) =>
      prev.map((t) => (t.id === selectedTech.id ? { ...t, status: newStatus } : t))
    );

    setIsModalOpen(false);
    setActionNotice(`Technician ${selectedTech.name} (${selectedTech.id}) status successfully changed to "${newStatus}".`);
    setTimeout(() => setActionNotice(''), 4500);
  };

  return (
    <div className="verification-page-container">
      {/* 1. Professional Page Header */}
      <div className="verification-header">
        <div className="verification-title-group">
          <div className="verification-tag">
            <ShieldCheck size={13} />
            <span>Compliance & Trust Center</span>
          </div>
          <h1 className="verification-heading">Technician Verification</h1>
          <p className="verification-subheading">
            Review and manage technician applications, government IDs, and trade credentials before they become available for customer bookings.
          </p>
        </div>
      </div>

      {/* Success Notification Notice */}
      {actionNotice && (
        <div className="p-3 bg-[rgba(6,78,59,0.08)] border border-[rgba(6,78,59,0.25)] text-[var(--emerald-ink)] text-xs rounded-lg flex items-center gap-2 font-semibold">
          <CheckCircle size={16} />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 2. Verification Summary KPI Row */}
      <div className="verification-kpi-row">
        {/* Pending Card */}
        <div
          className={`verification-kpi-card ${filter === 'Pending' ? 'active' : ''}`}
          onClick={() => setFilter(filter === 'Pending' ? 'all' : 'Pending')}
        >
          <div className="verification-kpi-meta">
            <span className="verification-kpi-label">Pending Review</span>
            <span className="verification-kpi-count" style={{ color: '#b45309' }}>{counts.pending}</span>
          </div>
          <div className="verification-kpi-icon pending">
            <Clock size={18} />
          </div>
        </div>

        {/* Verified Card */}
        <div
          className={`verification-kpi-card ${filter === 'Verified' ? 'active' : ''}`}
          onClick={() => setFilter(filter === 'Verified' ? 'all' : 'Verified')}
        >
          <div className="verification-kpi-meta">
            <span className="verification-kpi-label">Verified Active</span>
            <span className="verification-kpi-count" style={{ color: '#065f46' }}>{counts.verified}</span>
          </div>
          <div className="verification-kpi-icon verified">
            <ShieldCheck size={18} />
          </div>
        </div>

        {/* Rejected Card */}
        <div
          className={`verification-kpi-card ${filter === 'Rejected' ? 'active' : ''}`}
          onClick={() => setFilter(filter === 'Rejected' ? 'all' : 'Rejected')}
        >
          <div className="verification-kpi-meta">
            <span className="verification-kpi-label">Rejected</span>
            <span className="verification-kpi-count" style={{ color: '#991b1b' }}>{counts.rejected}</span>
          </div>
          <div className="verification-kpi-icon rejected">
            <XCircle size={18} />
          </div>
        </div>

        {/* Suspended Card */}
        <div
          className={`verification-kpi-card ${filter === 'Suspended' ? 'active' : ''}`}
          onClick={() => setFilter(filter === 'Suspended' ? 'all' : 'Suspended')}
        >
          <div className="verification-kpi-meta">
            <span className="verification-kpi-label">Suspended</span>
            <span className="verification-kpi-count" style={{ color: '#c2410c' }}>{counts.suspended}</span>
          </div>
          <div className="verification-kpi-icon suspended">
            <Ban size={18} />
          </div>
        </div>
      </div>

      {/* 3. Toolbar: Status Filter Pills & Search Input */}
      <div className="verification-toolbar">
        <div className="verification-filter-pills">
          <button
            type="button"
            className={`filter-pill-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <span>All Technicians</span>
            <span className="filter-pill-count">{counts.total}</span>
          </button>

          <button
            type="button"
            className={`filter-pill-btn ${filter === 'Pending' ? 'active' : ''}`}
            onClick={() => setFilter('Pending')}
          >
            <span>Pending</span>
            <span className="filter-pill-count">{counts.pending}</span>
          </button>

          <button
            type="button"
            className={`filter-pill-btn ${filter === 'Verified' ? 'active' : ''}`}
            onClick={() => setFilter('Verified')}
          >
            <span>Verified</span>
            <span className="filter-pill-count">{counts.verified}</span>
          </button>

          <button
            type="button"
            className={`filter-pill-btn ${filter === 'Suspended' ? 'active' : ''}`}
            onClick={() => setFilter('Suspended')}
          >
            <span>Suspended</span>
            <span className="filter-pill-count">{counts.suspended}</span>
          </button>

          {counts.rejected > 0 && (
            <button
              type="button"
              className={`filter-pill-btn ${filter === 'Rejected' ? 'active' : ''}`}
              onClick={() => setFilter('Rejected')}
            >
              <span>Rejected</span>
              <span className="filter-pill-count">{counts.rejected}</span>
            </button>
          )}
        </div>

        <div className="verification-search-wrap">
          <Search size={15} className="verification-search-icon" />
          <input
            type="text"
            placeholder="Search by name, ID, trade, or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="verification-search-input"
            aria-label="Search technician verification records"
          />
        </div>
      </div>

      {/* 4. Enterprise-Grade Verification Grid Table */}
      <div className="verification-table-card">
        <div className="verification-table-container">
          <table className="verification-grid-table">
            <thead>
              <tr>
                <th className="col-tech">Technician</th>
                <th className="col-trade">Trade & Skills</th>
                <th className="col-exp">Experience</th>
                <th className="col-area">Coverage Area</th>
                <th className="col-docs">Verification Docs</th>
                <th className="col-status">Status</th>
                <th className="col-actions" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((tech) => (
                  <tr key={tech.id}>
                    {/* WHO: Technician Identity */}
                    <td className="col-tech">
                      <div className="tech-identity-cell">
                        <img
                          src={tech.avatar}
                          alt=""
                          className="tech-identity-avatar"
                        />
                        <div className="tech-identity-text">
                          <span className="tech-identity-name" title={tech.name}>
                            {tech.name}
                          </span>
                          <span className="tech-identity-id">{tech.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* WHAT: Trade & Skills */}
                    <td className="col-trade">
                      <div className="tech-trade-cell">
                        <span className="trade-badge">
                          {tech.category.replace('-', ' ')}
                        </span>
                        <span className="trade-skills-snippet" title={tech.skills.join(', ')}>
                          {tech.skills.slice(0, 2).join(', ')}
                        </span>
                      </div>
                    </td>

                    {/* HOW EXPERIENCED: Experience */}
                    <td className="col-exp">
                      <span className="tech-exp-cell">{tech.experience}</span>
                    </td>

                    {/* WHERE: Coverage Area */}
                    <td className="col-area">
                      <div className="tech-area-cell" title={tech.serviceArea}>
                        <MapPin size={13} className="tech-area-icon" />
                        <span className="tech-area-text">{tech.serviceArea}</span>
                      </div>
                    </td>

                    {/* DOCUMENTS: Document Check */}
                    <td className="col-docs">
                      <div className="doc-verified-pill">
                        <FileCheck2 size={13} />
                        <span>Aadhaar + Trade Cert</span>
                      </div>
                    </td>

                    {/* STATUS: Badge */}
                    <td className="col-status">
                      <StatusBadge status={tech.status} size="sm" />
                    </td>

                    {/* ACTION: Decision Buttons */}
                    <td className="col-actions" style={{ textAlign: 'right' }}>
                      <div className="verification-actions-group">
                        {tech.status === 'Pending' && (
                          <>
                            <button
                              type="button"
                              className="action-btn-approve"
                              onClick={() => promptAction(tech, 'Approve')}
                              title="Approve and activate technician"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="action-btn-reject"
                              onClick={() => promptAction(tech, 'Reject')}
                              title="Reject application"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {tech.status === 'Verified' && (
                          <button
                            type="button"
                            className="action-btn-suspend"
                            onClick={() => promptAction(tech, 'Suspend')}
                            title="Temporarily suspend marketplace access"
                          >
                            Suspend
                          </button>
                        )}

                        {(tech.status === 'Suspended' || tech.status === 'Rejected') && (
                          <button
                            type="button"
                            className="action-btn-reactivate"
                            onClick={() => promptAction(tech, 'Reactivate')}
                            title="Reactivate partner profile"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="verification-empty-state">
                      <div className="empty-icon-wrap">
                        <Filter size={20} />
                      </div>
                      <span className="font-semibold text-xs text-[var(--text)]">
                        No technician records found
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        Try resetting your search query or status filter.
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm mt-2"
                        onClick={() => { setFilter('all'); setSearch(''); }}
                      >
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Decision Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${actionType} Partner Listing`}
        subtitle="Operations verification decision confirmation"
      >
        {selectedTech && (
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed font-sans">
              Are you sure you want to <strong>{actionType}</strong> technician partner{' '}
              <strong className="text-[var(--text)]">{selectedTech.name}</strong> ({selectedTech.id})?
            </p>

            <div className="p-3 bg-[var(--surface-raised)] border border-[var(--line)] rounded-xl text-xs space-y-1.5 mb-6 text-[var(--text-muted)] font-sans">
              <div><strong className="text-[var(--text)]">Trade:</strong> {selectedTech.title}</div>
              <div><strong className="text-[var(--text)]">Experience:</strong> {selectedTech.experience}</div>
              <div><strong className="text-[var(--text)]">Coverage:</strong> {selectedTech.serviceArea}</div>
              <div><strong className="text-[var(--text)]">Visiting Charge:</strong> ₹{selectedTech.visitingCharge}</div>
            </div>

            <div className="flex justify-end gap-2 font-sans">
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={actionType === 'Reject' || actionType === 'Suspend' ? 'danger' : 'primary'}
                size="sm"
                onClick={handleConfirmAction}
              >
                Confirm {actionType}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
