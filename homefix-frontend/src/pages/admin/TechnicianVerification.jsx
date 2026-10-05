import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Search,
  ShieldAlert,
  ShieldCheck,
  Eye,
  RefreshCw
} from 'lucide-react';
import { DEMO_TECHNICIANS } from '../../data/technicians';
import { adminApi } from '../../services/api';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

export default function TechnicianVerification() {
  const [technicians, setTechnicians] = useState(DEMO_TECHNICIANS);
  const [filter, setFilter] = useState('all'); // 'all' | 'Pending' | 'Verified' | 'Suspended'
  const [search, setSearch] = useState('');

  // Confirmation Modal state
  const [selectedTech, setSelectedTech] = useState(null);
  const [actionType, setActionType] = useState(null); // 'Approve' | 'Reject' | 'Suspend' | 'Reactivate'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  const filtered = technicians.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.serviceArea.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === 'all' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

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

    await adminApi.verifyTechnician(selectedTech.id, newStatus);

    setTechnicians((prev) =>
      prev.map((t) => (t.id === selectedTech.id ? { ...t, status: newStatus } : t))
    );

    setIsModalOpen(false);
    setActionNotice(`Technician ${selectedTech.name} status updated to "${newStatus}".`);
    setTimeout(() => setActionNotice(''), 4000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Partner Identity & Skill Verification</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Review submitted government IDs, trade certifications, approve active listings, or suspend accounts
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.3)] text-[var(--success-text)] text-xs rounded-lg flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter and search toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
        <div className="flex items-center gap-2">
          {['all', 'Pending', 'Verified', 'Suspended'].map((st) => (
            <Button
              key={st}
              variant={filter === st ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(st)}
            >
              {st === 'all' ? 'All Partners' : st}
            </Button>
          ))}
        </div>

        <div style={{ maxWidth: '320px', width: '100%' }}>
          <Input
            placeholder="Search by name, ID, or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
            wrapperClassName="mb-0"
          />
        </div>
      </div>

      {/* Verification Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-xs text-[var(--text-muted)] uppercase tracking-wider">
                <th className="pb-3">Technician</th>
                <th className="pb-3">Trade & Skills</th>
                <th className="pb-3">Experience</th>
                <th className="pb-3">Coverage Area</th>
                <th className="pb-3">Documents Check</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Verification Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {filtered.map((tech) => (
                <tr key={tech.id} className="hover:bg-[var(--surface-raised)] transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img src={tech.avatar} alt="" className="w-10 h-10 rounded-lg object-cover border border-[var(--line)]" />
                      <div>
                        <div className="font-bold text-[var(--text)] text-xs">{tech.name}</div>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">{tech.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-xs font-semibold text-[var(--primary)] block capitalize">{tech.category}</span>
                    <span className="text-[11px] text-[var(--text-muted)]">{tech.skills.slice(0, 2).join(', ')}</span>
                  </td>
                  <td className="py-4 text-xs font-medium text-[var(--text)]">{tech.experience}</td>
                  <td className="py-4 text-xs text-[var(--text-secondary)] max-w-[160px] truncate">{tech.serviceArea}</td>
                  <td className="py-4">
                    <span className="text-xs text-[var(--success-text)] bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.25)] px-2 py-0.5 rounded font-semibold flex items-center gap-1 w-max">
                      <FileText size={12} /> Aadhaar + Trade Cert
                    </span>
                  </td>
                  <td className="py-4">
                    <StatusBadge status={tech.status} size="sm" />
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {tech.status === 'Pending' && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => promptAction(tech, 'Approve')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-danger"
                            onClick={() => promptAction(tech, 'Reject')}
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {tech.status === 'Verified' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[var(--warning)]"
                          onClick={() => promptAction(tech, 'Suspend')}
                        >
                          Suspend
                        </Button>
                      )}

                      {(tech.status === 'Suspended' || tech.status === 'Rejected') && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => promptAction(tech, 'Reactivate')}
                        >
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${actionType} Technician Listing`}
        subtitle="Operations verification decision confirmation"
      >
        {selectedTech && (
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
              Are you sure you want to <strong>{actionType}</strong> technician partner{' '}
              <strong className="text-[var(--text)]">{selectedTech.name}</strong> ({selectedTech.id})?
            </p>

            <div className="p-3 bg-[var(--surface-raised)] border border-[var(--line)] rounded-xl text-xs space-y-1 mb-6 text-[var(--text-muted)]">
              <div><strong className="text-[var(--text)]">Trade:</strong> {selectedTech.title}</div>
              <div><strong className="text-[var(--text)]">Experience:</strong> {selectedTech.experience}</div>
              <div><strong className="text-[var(--text)]">Visiting Charge:</strong> ₹{selectedTech.visitingCharge}</div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={actionType === 'Reject' || actionType === 'Suspend' ? 'danger' : 'primary'}
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
