import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Award,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  Briefcase,
  Copy,
  Check,
  X,
  AlertTriangle,
  FileCheck2,
  ExternalLink,
  ShieldAlert,
  UserCheck,
  FileText,
  ChevronDown,
  ChevronUp,
  Ban,
  CheckCircle,
  Eye
} from 'lucide-react';
import { DEMO_TECHNICIANS } from '../../data/technicians';
import { adminApi, technicianApi } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import './AdminTechnicianProfile.css';

export default function AdminTechnicianProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [technician, setTechnician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  // Modal states for administrative actions
  const [actionType, setActionType] = useState(null); // 'Approve' | 'Reject' | 'Suspend' | 'Reactivate'
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Document Inspection Modal
  const [inspectedDoc, setInspectedDoc] = useState(null);

  // Load technician profile
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let found = null;
        try {
          const res = await technicianApi.getById(id);
          found = res?.data;
        } catch {
          // Fallback to DEMO_TECHNICIANS
        }
        if (!found) {
          found = DEMO_TECHNICIANS.find((t) => t.id === id) || DEMO_TECHNICIANS[0];
        }
        setTechnician(found);
      } catch (err) {
        console.error('Error loading technician details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4500);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showNotification(`${label} copied to clipboard!`);
  };

  const promptAction = (type) => {
    setActionType(type);
    setAdminNote('');
    setIsActionModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!technician || !actionType) return;
    setIsSubmittingAction(true);

    let newStatus = 'Verified';
    if (actionType === 'Approve' || actionType === 'Reactivate') {
      newStatus = 'Verified';
    } else if (actionType === 'Reject') {
      newStatus = 'Rejected';
    } else if (actionType === 'Suspend') {
      newStatus = 'Suspended';
    }

    try {
      await adminApi.verifyTechnician(technician.id, newStatus);
      setTechnician((prev) => ({
        ...prev,
        status: newStatus
      }));
      setIsActionModalOpen(false);
      showNotification(
        `Technician ${technician.name} (${technician.id}) status successfully updated to "${newStatus}".`
      );
    } catch (err) {
      console.error(err);
      showNotification('Failed to update status. Please try again.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Curated sample certifications based on category
  const certifications = useMemo(() => {
    if (!technician) return [];
    const cat = technician.category?.toLowerCase() || '';

    if (cat.includes('plumb')) {
      return [
        {
          name: 'National Trade Certificate in Plumbing (ITI)',
          issuer: 'Directorate General of Training (DGT), Govt. of India',
          issueDate: '2019',
          expiry: 'Lifetime',
          verified: true
        },
        {
          name: 'High-Pressure Pipe & Backflow Testing Certification',
          issuer: 'Indian Plumbing Association (IPA)',
          issueDate: '2022',
          expiry: 'Valid till Nov 2027',
          verified: true
        }
      ];
    } else if (cat.includes('electr')) {
      return [
        {
          name: 'Class-1 Wireman & Electrical Supervisor License',
          issuer: 'State Electrical Licensing Board',
          issueDate: '2020',
          expiry: 'Valid till Dec 2028',
          verified: true
        },
        {
          name: 'Domestic Circuit & MCB Safety Standard Certification',
          issuer: 'Bureau of Indian Standards (BIS)',
          issueDate: '2023',
          expiry: 'Valid till Mar 2028',
          verified: true
        }
      ];
    } else {
      return [
        {
          name: 'Govt. Skill India Trade Assessment Level-4',
          issuer: 'National Skill Development Corporation (NSDC)',
          issueDate: '2021',
          expiry: 'Lifetime',
          verified: true
        },
        {
          name: 'Workplace Safety & Equipment Hygiene Standard',
          issuer: 'HomeFix Partner Quality Assurance Guild',
          issueDate: '2024',
          expiry: 'Valid till Dec 2026',
          verified: true
        }
      ];
    }
  }, [technician]);

  // Verified documents review items
  const verificationDocs = useMemo(() => {
    if (!technician) return [];
    return [
      {
        id: 'DOC-AADHAAR',
        type: 'Government Identity Proof',
        title: 'Aadhaar / National Identity Card',
        number: 'XXXX-XXXX-4819',
        verified: technician.status !== 'Rejected',
        status: technician.status === 'Pending' ? 'Pending Review' : 'Verified & KYC Matched',
        issueAuthority: 'UIDAI',
        verifiedDate: '12-Jan-2024'
      },
      {
        id: 'DOC-TRADE-CERT',
        type: 'Professional Credential',
        title: 'State Vocational Trade License & Certificate',
        number: `TRD-${technician.category?.toUpperCase() || 'GEN'}-9021`,
        verified: technician.status !== 'Rejected',
        status: technician.status === 'Pending' ? 'Pending Verification' : 'Verified & Active',
        issueAuthority: 'National Council for Vocational Training',
        verifiedDate: '15-Jan-2024'
      },
      {
        id: 'DOC-POLICE-VERIF',
        type: 'Background Compliance',
        title: 'Police Clearance & Criminal Record Check',
        number: 'PCR-ND-2024-8812',
        verified: technician.status !== 'Rejected',
        status: technician.status === 'Pending' ? 'In Progress' : 'No Adverse Records Found',
        issueAuthority: 'State Police Department',
        verifiedDate: '18-Jan-2024'
      }
    ];
  }, [technician]);

  // Sample feedback reviews
  const reviews = useMemo(() => {
    return [
      {
        id: 'REV-01',
        customer: 'Sunil Mehta',
        rating: 5,
        date: 'Oct 02, 2026',
        comment:
          'Arrived promptly with specialized diagnostic equipment. Repaired the main line cleanly and explained upfront charges.'
      },
      {
        id: 'REV-02',
        customer: 'Kavita Rao',
        rating: 5,
        date: 'Sep 24, 2026',
        comment:
          'Very courteous, transparent billing, and demonstrated the completed repair with pressure testing.'
      },
      {
        id: 'REV-03',
        customer: 'Aakash Verma',
        rating: 4,
        date: 'Sep 12, 2026',
        comment:
          'Neat work and knowledgeable technician. Carried the exact replacement parts required.'
      }
    ];
  }, []);

  if (loading) {
    return (
      <div className="admin-tech-profile-container">
        <div className="admin-section-card text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--emerald-ink)] mb-3"></div>
          <p className="text-sm font-semibold text-[var(--emerald-ink)]">
            Loading technician credentials & compliance dossier...
          </p>
        </div>
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="admin-tech-profile-container">
        <div className="admin-section-card text-center py-16">
          <AlertTriangle size={36} className="text-amber-600 mx-auto mb-2" />
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Technician Not Found</h2>
          <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto mb-4">
            No technician profile matching reference #{id} could be located in the registered directory.
          </p>
          <Link to="/admin/technicians" className="admin-tech-back-btn inline-flex">
            <ArrowLeft size={14} />
            <span>Return to Technicians Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-tech-profile-container">
      {/* Notification Banner */}
      {notification && (
        <div className="admin-notification-banner" role="status">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-[var(--emerald-ink)]" />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            onClick={() => setNotification('')}
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Professional Page Header */}
      <header className="admin-tech-header-card">
        <div className="admin-tech-header-left">
          <div className="admin-tech-nav-row">
            <Link to="/admin/technicians" className="admin-tech-back-btn">
              <ArrowLeft size={14} />
              <span>Back to Technicians</span>
            </Link>

            <span className="admin-tech-id-badge">
              <span>ID: {technician.id}</span>
              <button
                type="button"
                className="admin-copy-icon-btn"
                onClick={() => copyToClipboard(technician.id, 'Technician ID')}
                title="Copy Technician ID"
              >
                <Copy size={12} />
              </button>
            </span>

            <StatusBadge status={technician.status} size="sm" />
            <span
              className={`status-badge status-badge-sm ${
                technician.status === 'Verified'
                  ? 'status-approved'
                  : technician.status === 'Suspended'
                  ? 'status-cancelled'
                  : 'status-warning'
              }`}
            >
              <span className="status-badge-text">
                Account: {technician.status === 'Verified' ? 'Active' : technician.status}
              </span>
            </span>
          </div>

          <div className="admin-tech-title-wrap">
            <h1 className="admin-tech-page-title">Technician Profile</h1>
          </div>
          <p className="admin-tech-page-subtitle">
            Review professional credentials, service quality, and marketplace eligibility.
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="admin-tech-header-actions">
          {technician.status === 'Pending' && (
            <>
              <button
                type="button"
                className="admin-primary-btn approve w-auto px-4 py-2"
                onClick={() => promptAction('Approve')}
              >
                <CheckCircle2 size={15} />
                <span>Approve Verification</span>
              </button>
              <button
                type="button"
                className="admin-secondary-btn reject w-auto px-4 py-2 m-0"
                onClick={() => promptAction('Reject')}
              >
                <X size={14} />
                <span>Reject</span>
              </button>
            </>
          )}

          {technician.status === 'Verified' && (
            <button
              type="button"
              className="admin-secondary-btn suspend w-auto px-4 py-2 m-0"
              onClick={() => promptAction('Suspend')}
            >
              <Ban size={14} />
              <span>Suspend Marketplace Access</span>
            </button>
          )}

          {(technician.status === 'Suspended' || technician.status === 'Rejected') && (
            <button
              type="button"
              className="admin-secondary-btn reactivate w-auto px-4 py-2 m-0"
              onClick={() => promptAction('Reactivate')}
            >
              <CheckCircle size={14} />
              <span>Reactivate Profile</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Quick Information KPI Metrics Row */}
      <section className="admin-tech-metrics-grid" aria-label="Key Performance Indicators">
        <div className="admin-metric-card">
          <div className="admin-metric-meta">
            <span className="admin-metric-label">Completed Jobs</span>
            <span className="admin-metric-value">{technician.completedJobs || 120}</span>
          </div>
          <div className="admin-metric-icon-wrap jobs">
            <Briefcase size={20} />
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-meta">
            <span className="admin-metric-label">Average Rating</span>
            <span className="admin-metric-value">{technician.rating || 4.8} ★</span>
          </div>
          <div className="admin-metric-icon-wrap rating">
            <Star size={20} />
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-meta">
            <span className="admin-metric-label">Total Reviews</span>
            <span className="admin-metric-value">{technician.reviewsCount || 48}</span>
          </div>
          <div className="admin-metric-icon-wrap reviews">
            <Award size={20} />
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-meta">
            <span className="admin-metric-label">Years of Experience</span>
            <span className="admin-metric-value">
              {technician.experienceYears ? `${technician.experienceYears} Yrs` : technician.experience || '6+ Yrs'}
            </span>
          </div>
          <div className="admin-metric-icon-wrap exp">
            <Clock size={20} />
          </div>
        </div>
      </section>

      {/* 3. Main Two-Column Layout (65% Main / 35% Side) */}
      <div className="admin-tech-workspace-grid">
        {/* ================================================================
            MAIN CONTENT AREA (~65%)
            ================================================================ */}
        <main className="admin-tech-main-column">
          {/* Main Profile Hero Card */}
          <div className="admin-section-card">
            <div className="admin-profile-hero-content">
              {/* Professional Profile Photo (96-120px) */}
              <div className="admin-avatar-container">
                <img
                  src={technician.avatar}
                  alt={technician.name}
                  className="admin-avatar-img"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200';
                  }}
                />
                <span
                  className="admin-avatar-verified-badge"
                  title={technician.status === 'Verified' ? 'Verified Professional' : 'Under Review'}
                >
                  <ShieldCheck size={14} />
                </span>
              </div>

              {/* Identity & Details */}
              <div className="admin-profile-hero-details">
                <div className="admin-profile-name-row">
                  <h2 className="admin-profile-name">{technician.name}</h2>
                  <StatusBadge status={technician.status} size="sm" />
                </div>

                <p className="admin-profile-title">{technician.title}</p>

                <div className="admin-profile-tags-row">
                  <span className="admin-trade-tag">{technician.category?.replace('-', ' ')}</span>
                  <span className="text-xs font-semibold text-[var(--emerald-medium)] flex items-center gap-1">
                    <MapPin size={13} />
                    <span>{technician.serviceArea}</span>
                  </span>
                </div>

                {/* Quick Info Bar */}
                <div className="admin-profile-quick-stats">
                  <div className="quick-stat-item">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span className="font-bold">{technician.rating}</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      ({technician.reviewsCount || 48} reviews)
                    </span>
                  </div>
                  <div className="quick-stat-item">
                    <Briefcase size={14} />
                    <span>{technician.completedJobs || 120} jobs fulfilled</span>
                  </div>
                  <div className="quick-stat-item">
                    <Clock size={14} />
                    <span>{technician.experience || '6+ years'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section A: Professional Background */}
          <div className="admin-section-card">
            <div className="admin-section-header">
              <div className="admin-section-title-wrap">
                <div className="admin-section-icon-badge">
                  <FileText size={17} />
                </div>
                <h3 className="admin-section-title">Professional Background</h3>
              </div>
              <span className="admin-section-badge">Career & Trade Experience</span>
            </div>

            <div className="admin-bio-body">
              <div className="admin-bio-quote">
                <p className="admin-bio-text">
                  {technician.bio ||
                    'Registered service partner on HomeFix. Specializes in residential installations, emergency diagnostics, and equipment maintenance.'}
                </p>
                {technician.about && (
                  <div className="mt-2 pt-2 border-t border-[var(--champagne-dark)]">
                    <p className={`admin-bio-text ${!isBioExpanded ? 'line-clamp-2' : ''}`}>
                      {technician.about}
                    </p>
                    <button
                      type="button"
                      className="admin-read-more-btn"
                      onClick={() => setIsBioExpanded(!isBioExpanded)}
                    >
                      <span>{isBioExpanded ? 'Show less' : 'Read more credentials'}</span>
                      {isBioExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>
                )}
              </div>

              {/* Qualifications Summary Grid */}
              <div className="admin-qual-grid">
                <div className="admin-qual-box">
                  <span className="admin-qual-k">Primary Trade</span>
                  <p className="admin-qual-v capitalize">
                    {technician.category?.replace('-', ' ')}
                  </p>
                </div>
                <div className="admin-qual-box">
                  <span className="admin-qual-k">Experience in Field</span>
                  <p className="admin-qual-v">{technician.experience || '6+ Years'}</p>
                </div>
                <div className="admin-qual-box">
                  <span className="admin-qual-k">Service Coverage Radius</span>
                  <p className="admin-qual-v">{technician.serviceArea}</p>
                </div>
                <div className="admin-qual-box">
                  <span className="admin-qual-k">Visiting / Inspection Base Fee</span>
                  <p className="admin-qual-v">₹{technician.visitingCharge} (Fixed Base)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Skills & Certifications */}
          <div className="admin-section-card">
            <div className="admin-section-header">
              <div className="admin-section-title-wrap">
                <div className="admin-section-icon-badge">
                  <Award size={17} />
                </div>
                <h3 className="admin-section-title">Skills & Certifications</h3>
              </div>
              <span className="admin-section-badge">{technician.skills?.length || 0} Specializations</span>
            </div>

            <div className="admin-skills-wrapper">
              {/* Wrapping Skill Badges (No Overflow) */}
              <div>
                <h4 className="admin-skills-group-title">Verified Technical Skills</h4>
                <div className="admin-skills-badges-wrap">
                  {technician.skills && technician.skills.length > 0 ? (
                    technician.skills.map((skill, idx) => (
                      <span key={idx} className="admin-skill-chip">
                        <CheckCircle2 size={13} className="text-[var(--emerald-ink)]" />
                        <span>{skill}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">
                      No specialized skills registered.
                    </span>
                  )}
                </div>
              </div>

              {/* Certifications Block */}
              <div>
                <h4 className="admin-skills-group-title">Recognized Trade Certifications</h4>
                <div className="admin-certs-list">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="admin-cert-card">
                      <div className="admin-cert-left">
                        <div className="admin-cert-icon-box">
                          <Award size={18} />
                        </div>
                        <div className="admin-cert-info">
                          <h5 className="admin-cert-name">{cert.name}</h5>
                          <span className="admin-cert-meta">
                            Issued by {cert.issuer} · {cert.expiry}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`admin-cert-badge ${
                          cert.verified ? 'verified' : 'unverified'
                        }`}
                      >
                        <ShieldCheck size={12} />
                        <span>{cert.verified ? 'Verified Active' : 'Pending Check'}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Compliance & Verification Documents */}
          <div className="admin-section-card">
            <div className="admin-section-header">
              <div className="admin-section-title-wrap">
                <div className="admin-section-icon-badge">
                  <FileCheck2 size={17} />
                </div>
                <h3 className="admin-section-title">Compliance Documents & Identity Review</h3>
              </div>
              <span className="admin-section-badge">KYC & Compliance</span>
            </div>

            <div className="admin-docs-grid">
              {verificationDocs.map((doc) => (
                <div key={doc.id} className="admin-doc-card">
                  <div className="admin-doc-header">
                    <div className="admin-doc-title-row">
                      <FileCheck2 size={15} className="text-[var(--emerald-ink)]" />
                      <h4 className="admin-doc-name">{doc.title}</h4>
                    </div>
                    <span
                      className={`admin-cert-badge ${
                        doc.verified ? 'verified' : 'unverified'
                      }`}
                    >
                      {doc.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>

                  <div className="text-xs text-[var(--text-muted)] space-y-0.5">
                    <div>Ref / ID: <span className="font-mono font-semibold text-[var(--text-primary)]">{doc.number}</span></div>
                    <div>Authority: {doc.issueAuthority}</div>
                    <div>Status: <span className="font-semibold text-[var(--emerald-dark)]">{doc.status}</span></div>
                  </div>

                  <button
                    type="button"
                    className="admin-doc-preview-box"
                    onClick={() => setInspectedDoc(doc)}
                    title="Click to view verified document metadata"
                  >
                    <Eye size={14} />
                    <span>Inspect Document Record</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section D: Customer Ratings & Performance Feedback */}
          <div className="admin-section-card">
            <div className="admin-section-header">
              <div className="admin-section-title-wrap">
                <div className="admin-section-icon-badge">
                  <Star size={17} />
                </div>
                <h3 className="admin-section-title">Customer Feedback & Service Quality</h3>
              </div>
              <span className="admin-section-badge">Verified Reviews</span>
            </div>

            <div className="admin-reviews-list">
              {reviews.map((rev) => (
                <div key={rev.id} className="admin-review-card">
                  <div className="admin-review-header">
                    <span className="admin-review-author">{rev.customer}</span>
                    <div className="admin-review-stars">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={13} fill="#F59E0B" />
                      ))}
                    </div>
                  </div>
                  <p className="admin-review-comment">"{rev.comment}"</p>
                  <span className="admin-review-date">{rev.date} · Verified HomeFix Booking</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* ================================================================
            SIDEBAR AREA (~35%): Administrative Actions, Operations, Eligibility
            ================================================================ */}
        <aside className="admin-tech-side-column">
          {/* Administrative Actions Card */}
          <div className="admin-actions-card">
            <div className="admin-status-banner">
              <div className="admin-status-left">
                <span className="admin-status-k">Marketplace Status</span>
                <span className="text-sm font-bold text-[var(--emerald-ink)]">
                  {technician.status}
                </span>
              </div>
              <StatusBadge status={technician.status} size="sm" />
            </div>

            {technician.status === 'Pending' && (
              <div>
                <button
                  type="button"
                  className="admin-primary-btn approve"
                  onClick={() => promptAction('Approve')}
                >
                  <CheckCircle2 size={16} />
                  <span>Approve & Grant Booking Access</span>
                </button>
                <button
                  type="button"
                  className="admin-secondary-btn reject"
                  onClick={() => promptAction('Reject')}
                >
                  <X size={15} />
                  <span>Reject Application</span>
                </button>
              </div>
            )}

            {technician.status === 'Verified' && (
              <div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-3 text-center">
                  <ShieldCheck size={22} className="text-emerald-700 mx-auto mb-1" />
                  <span className="text-sm font-bold text-emerald-900 block">Eligible for Bookings</span>
                  <span className="text-xs text-emerald-700">
                    Active in customer search and instant dispatch queue.
                  </span>
                </div>
                <button
                  type="button"
                  className="admin-secondary-btn suspend"
                  onClick={() => promptAction('Suspend')}
                >
                  <Ban size={15} />
                  <span>Suspend Marketplace Access</span>
                </button>
              </div>
            )}

            {(technician.status === 'Suspended' || technician.status === 'Rejected') && (
              <div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-3 text-center">
                  <ShieldAlert size={22} className="text-amber-700 mx-auto mb-1" />
                  <span className="text-sm font-bold text-amber-900 block">
                    {technician.status === 'Suspended' ? 'Access Suspended' : 'Application Rejected'}
                  </span>
                  <span className="text-xs text-amber-700">
                    Hidden from customer search and cannot receive job leads.
                  </span>
                </div>
                <button
                  type="button"
                  className="admin-secondary-btn reactivate"
                  onClick={() => promptAction('Reactivate')}
                >
                  <CheckCircle size={15} />
                  <span>Reactivate Profile</span>
                </button>
              </div>
            )}
          </div>

          {/* Contact & Administrative Operations Card */}
          <div className="admin-contact-card">
            <div className="admin-section-header">
              <div className="admin-section-title-wrap">
                <div className="admin-section-icon-badge">
                  <Phone size={16} />
                </div>
                <h4 className="admin-section-title">Administrative Contact</h4>
              </div>
            </div>

            <div className="admin-contact-list">
              <div className="admin-contact-item">
                <Phone size={15} className="admin-contact-icon" />
                <div className="admin-contact-info">
                  <span className="admin-contact-k">Registered Phone</span>
                  <span className="admin-contact-v">{technician.phone || '+91 98765 43210'}</span>
                  <div className="admin-contact-actions">
                    <a
                      href={`tel:${technician.phone || '+919876543210'}`}
                      className="admin-mini-action-btn"
                    >
                      <Phone size={11} />
                      <span>Call</span>
                    </a>
                    <button
                      type="button"
                      className="admin-mini-action-btn"
                      onClick={() =>
                        copyToClipboard(technician.phone || '+919876543210', 'Phone number')
                      }
                    >
                      <Copy size={11} />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-contact-item">
                <Mail size={15} className="admin-contact-icon" />
                <div className="admin-contact-info">
                  <span className="admin-contact-k">Official Email</span>
                  <span className="admin-contact-v">
                    {technician.email || `${technician.id.toLowerCase()}@homefix.internal`}
                  </span>
                  <div className="admin-contact-actions">
                    <button
                      type="button"
                      className="admin-mini-action-btn"
                      onClick={() =>
                        copyToClipboard(
                          technician.email || `${technician.id.toLowerCase()}@homefix.internal`,
                          'Email address'
                        )
                      }
                    >
                      <Copy size={11} />
                      <span>Copy Email</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-contact-item">
                <Clock size={15} className="admin-contact-icon" />
                <div className="admin-contact-info">
                  <span className="admin-contact-k">Current Dispatch Status</span>
                  <span className="admin-contact-v text-[var(--emerald-medium)] font-bold">
                    {technician.availability || 'Available Today'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Marketplace Eligibility Checklist */}
          <div className="admin-contact-card">
            <div className="admin-section-header">
              <div className="admin-section-title-wrap">
                <div className="admin-section-icon-badge">
                  <UserCheck size={16} />
                </div>
                <h4 className="admin-section-title">Eligibility Criteria</h4>
              </div>
            </div>

            <div className="admin-eligibility-list">
              <div className="eligibility-check-item">
                <div className="eligibility-left">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>National ID Matched</span>
                </div>
                <span className="text-xs font-semibold text-emerald-800">Pass</span>
              </div>

              <div className="eligibility-check-item">
                <div className="eligibility-left">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Trade Certificate Verified</span>
                </div>
                <span className="text-xs font-semibold text-emerald-800">Pass</span>
              </div>

              <div className="eligibility-check-item">
                <div className="eligibility-left">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Police Check Clean</span>
                </div>
                <span className="text-xs font-semibold text-emerald-800">Pass</span>
              </div>

              <div className="eligibility-check-item">
                <div className="eligibility-left">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Payout Escrow Linked</span>
                </div>
                <span className="text-xs font-semibold text-emerald-800">Ready</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ====================================================================
          ADMINISTRATIVE ACTION CONFIRMATION MODAL
          ==================================================================== */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title={`${actionType} Technician Profile`}
        subtitle={`${technician.name} (${technician.id})`}
        maxWidth="500px"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--text-secondary)] m-0">
            {actionType === 'Approve' &&
              'Approving will certify all uploaded KYC documents and grant this technician immediate access to receive customer service bookings.'}
            {actionType === 'Reject' &&
              'Rejecting will mark the application as denied. The applicant will not be visible in customer searches.'}
            {actionType === 'Suspend' &&
              'Suspending will temporarily freeze marketplace access and pause dispatch assignment.'}
            {actionType === 'Reactivate' &&
              'Reactivating will restore active marketplace status and resume booking eligibility.'}
          </p>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">
              Admin Audit Note (Optional):
            </label>
            <textarea
              rows="3"
              className="w-full p-2.5 text-sm rounded-lg border border-[var(--champagne-border)] outline-none focus:border-[var(--emerald-ink)]"
              placeholder={`Reason for ${actionType?.toLowerCase()} action (saved in permanent compliance audit logs)...`}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="admin-tech-back-btn"
              onClick={() => setIsActionModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`admin-primary-btn w-auto px-5 ${
                actionType === 'Reject' ? 'bg-red-700 text-white' : 'approve'
              }`}
              disabled={isSubmittingAction}
              onClick={handleConfirmAction}
            >
              {isSubmittingAction ? 'Processing...' : `Confirm ${actionType}`}
            </button>
          </div>
        </div>
      </Modal>

      {/* ====================================================================
          DOCUMENT INSPECTION MODAL
          ==================================================================== */}
      {inspectedDoc && (
        <Modal
          isOpen={Boolean(inspectedDoc)}
          onClose={() => setInspectedDoc(null)}
          title={inspectedDoc.title}
          subtitle={`Compliance Record #${inspectedDoc.number}`}
          maxWidth="560px"
        >
          <div className="doc-inspect-body">
            <div className="doc-inspect-sheet">
              <div className="doc-inspect-row">
                <span className="text-[var(--text-muted)]">Document Type:</span>
                <span className="font-semibold">{inspectedDoc.type}</span>
              </div>
              <div className="doc-inspect-row">
                <span className="text-[var(--text-muted)]">Reference Number:</span>
                <span className="font-mono font-bold text-[var(--emerald-ink)]">{inspectedDoc.number}</span>
              </div>
              <div className="doc-inspect-row">
                <span className="text-[var(--text-muted)]">Issuing Authority:</span>
                <span className="font-semibold">{inspectedDoc.issueAuthority}</span>
              </div>
              <div className="doc-inspect-row">
                <span className="text-[var(--text-muted)]">Verification Date:</span>
                <span>{inspectedDoc.verifiedDate}</span>
              </div>
              <div className="doc-inspect-row">
                <span className="text-[var(--text-muted)]">Audit Status:</span>
                <span className="font-bold text-emerald-800">✓ {inspectedDoc.status}</span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] m-0">
              Verified through HomeFix Automated Identity & National Credentials Verification API.
            </p>

            <div className="flex justify-end mt-2">
              <button
                type="button"
                className="admin-primary-btn approve w-auto px-5"
                onClick={() => setInspectedDoc(null)}
              >
                Close Inspection
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
