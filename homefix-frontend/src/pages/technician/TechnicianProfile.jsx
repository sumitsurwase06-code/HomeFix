import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Award, 
  IndianRupee, 
  MapPin, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  Star, 
  Save, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Calendar,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import './TechnicianPortal.css';

export default function TechnicianProfile() {
  const { currentUser } = useAuth();
  const toast = useToast();

  // Baseline initial state
  const initialValues = useMemo(() => ({
    name: currentUser?.name || 'Rajesh Kumar',
    email: currentUser?.email || 'rajesh.plumber@homefix.in',
    phone: currentUser?.phone || '9876543210',
    trade: currentUser?.trade || 'Plumbing & Water Systems',
    experience: currentUser?.experience || '8+ Years Professional Experience',
    visitingCharge: currentUser?.visitingCharge || 199,
    serviceArea: currentUser?.serviceArea || 'Sector 62, Indirapuram, Sector 18, Noida NCR',
    skills: currentUser?.skills || 'Pipe Leakage Repair, Drain Cleaning, Geyser Installation, Motor Pumps, Tap & Mixer Fitting, RO Water Purifier Setup'
  }), [currentUser]);

  // Form State
  const [formData, setFormData] = useState(initialValues);
  const [savedData, setSavedData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Sync when currentUser changes
  useEffect(() => {
    setFormData(initialValues);
    setSavedData(initialValues);
  }, [initialValues]);

  // Detect unsaved changes (isDirty)
  const isDirty = useMemo(() => {
    return (
      formData.name !== savedData.name ||
      formData.email !== savedData.email ||
      formData.phone !== savedData.phone ||
      formData.trade !== savedData.trade ||
      formData.experience !== savedData.experience ||
      formData.visitingCharge !== savedData.visitingCharge ||
      formData.serviceArea !== savedData.serviceArea ||
      formData.skills !== savedData.skills
    );
  }, [formData, savedData]);

  // Dynamic Skill Chips Preview
  const skillChips = useMemo(() => {
    if (!formData.skills) return [];
    return formData.skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }, [formData.skills]);

  // Dynamic Area Chips Preview
  const areaChips = useMemo(() => {
    if (!formData.serviceArea) return [];
    return formData.serviceArea
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);
  }, [formData.serviceArea]);

  // Handle Input Changes with auto error clear
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Form Validation
  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full legal name is required.';
    } else if (formData.name.trim().length < 3) {
      errs.name = 'Name must be at least 3 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Contact email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone) {
      errs.phone = 'Contact mobile number is required.';
    } else if (cleanPhone.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.trade.trim()) {
      errs.trade = 'Primary trade or service category is required.';
    }

    if (!formData.experience.trim()) {
      errs.experience = 'Experience level is required.';
    }

    const feeNum = Number(formData.visitingCharge);
    if (isNaN(feeNum) || feeNum < 0) {
      errs.visitingCharge = 'Visiting fee must be a valid non-negative amount.';
    } else if (feeNum > 2000) {
      errs.visitingCharge = 'Visiting fee cannot exceed ₹2,000.';
    }

    if (!formData.serviceArea.trim()) {
      errs.serviceArea = 'Please specify at least one primary service area.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Discard Changes
  const handleDiscard = () => {
    setFormData(savedData);
    setErrors({});
    if (toast) {
      toast.info('All unsaved profile changes have been reverted.', 'Discarded');
    }
  };

  // Save Changes
  const handleSave = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      if (toast) {
        toast.error('Please resolve the highlighted validation errors.', 'Validation Error');
      }
      return;
    }

    setIsSaving(true);

    try {
      // Simulate enterprise API save with optimistic update
      await new Promise((resolve) => setTimeout(resolve, 600));

      setSavedData(formData);
      setIsSaving(false);

      if (toast) {
        toast.success('Professional partner profile updated successfully!', 'Profile Saved');
      }
    } catch (err) {
      setIsSaving(false);
      if (toast) {
        toast.error('Failed to save profile changes. Please try again.', 'Error');
      }
    }
  };

  const partnerId = `TECH-${currentUser?.id || '101'}`;
  const verificationStatus = currentUser?.verificationStatus || 'Verified';
  const partnerAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&fit=crop&q=80';

  return (
    <div className="portal-page">
      {/* Page Heading Bar */}
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">Professional Profile</h1>
          <p className="portal-page-subtitle">
            Manage your credentials, visiting fees, service areas, and partner marketplace presence.
          </p>
        </div>

        <div className="portal-status-toggle-wrap">
          <div className="status-indicator-dot">
            <span className="status-dot online"></span>
            <span className="status-text">{verificationStatus} Partner</span>
          </div>
        </div>
      </div>

      {/* Profile Header Summary Card */}
      <div className="profile-header-card">
        <div className="profile-header-main">
          <div className="profile-avatar-container">
            <img
              src={partnerAvatar}
              alt={formData.name}
              className="profile-avatar-img"
            />
            <div className="profile-avatar-badge" title="Certified Verified Partner">
              <ShieldCheck size={14} />
            </div>
          </div>

          <div className="profile-identity-info">
            <div className="profile-name-row">
              <h2 className="profile-partner-name">{formData.name}</h2>
              <span className="profile-trade-badge">
                <Briefcase size={14} />
                {formData.trade}
              </span>
            </div>

            <div className="profile-meta-row">
              <span className="profile-meta-item">
                Partner ID: <strong>{partnerId}</strong>
              </span>
              <span>·</span>
              <span className="profile-rating-badge">
                <Star size={13} fill="#B45309" color="#B45309" />
                4.9 Rating (142 Verified Reviews)
              </span>
              <span>·</span>
              <span className="profile-meta-item">
                <Clock size={13} />
                {formData.experience}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="profile-status-summary-badge">
            <CheckCircle2 size={16} />
            Tier 1 Gold Partner
          </span>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {isDirty && (
        <div className="profile-unsaved-banner">
          <div className="profile-unsaved-content">
            <AlertCircle size={18} />
            <span>You have unsaved changes to your professional partner profile.</span>
          </div>
          <div className="profile-unsaved-actions">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={isSaving}
              className="profile-btn profile-btn-secondary"
              style={{ minHeight: '38px', padding: '0.4rem 1rem', fontSize: '0.82rem' }}
            >
              <RotateCcw size={14} />
              Discard
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="profile-btn profile-btn-primary"
              style={{ minHeight: '38px', padding: '0.4rem 1.15rem', fontSize: '0.82rem' }}
            >
              <Save size={14} />
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Main 2-Column Grid: Form Sections + Partner Status Sidebar */}
      <div className="profile-content-layout">
        {/* Left Column: Form Sections */}
        <form onSubmit={handleSave} noValidate>
          {/* Section 1: Personal Information */}
          <div className="profile-section-card">
            <div className="profile-section-header">
              <div className="profile-section-title-wrap">
                <div className="profile-section-icon">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="profile-section-title">Personal & Contact Details</h3>
                  <p className="profile-section-desc">
                    Your official identity details used for communication and service dispatch.
                  </p>
                </div>
              </div>
            </div>

            <div className="profile-form-grid-2">
              {/* Full Legal Name */}
              <div className="profile-form-group">
                <label htmlFor="fullName" className="profile-label">
                  <span>Full Legal Name <span className="profile-label-required">*</span></span>
                </label>
                <div className="profile-input-wrap">
                  <input
                    id="fullName"
                    type="text"
                    required
                    className={`profile-input ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                {errors.name ? (
                  <div className="profile-field-error">
                    <AlertCircle size={13} /> {errors.name}
                  </div>
                ) : (
                  <span className="profile-field-hint">As printed on government ID / trade certification.</span>
                )}
              </div>

              {/* Contact Email */}
              <div className="profile-form-group">
                <label htmlFor="contactEmail" className="profile-label">
                  <span>Contact Email Address <span className="profile-label-required">*</span></span>
                </label>
                <div className="profile-input-wrap">
                  <input
                    id="contactEmail"
                    type="email"
                    required
                    className={`profile-input ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="name@provider.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                {errors.email ? (
                  <div className="profile-field-error">
                    <AlertCircle size={13} /> {errors.email}
                  </div>
                ) : (
                  <span className="profile-field-hint">Used for job alerts, invoices, and payouts.</span>
                )}
              </div>
            </div>

            {/* Direct Mobile Number */}
            <div className="profile-form-group mt-3">
              <label htmlFor="contactPhone" className="profile-label">
                <span>Direct Contact Mobile Number <span className="profile-label-required">*</span></span>
              </label>
              <div className="profile-input-wrap">
                <input
                  id="contactPhone"
                  type="tel"
                  required
                  maxLength={10}
                  className={`profile-input ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
              {errors.phone ? (
                <div className="profile-field-error">
                  <AlertCircle size={13} /> {errors.phone}
                </div>
              ) : (
                <span className="profile-field-hint">10-digit primary phone used by customers and platform dispatch.</span>
              )}
            </div>
          </div>

          {/* Section 2: Professional & Trade Information */}
          <div className="profile-section-card">
            <div className="profile-section-header">
              <div className="profile-section-title-wrap">
                <div className="profile-section-icon">
                  <Briefcase size={18} />
                </div>
                <div>
                  <h3 className="profile-section-title">Professional Qualifications & Fees</h3>
                  <p className="profile-section-desc">
                    Your primary trade domain, field experience, and standard doorstep visiting fee.
                  </p>
                </div>
              </div>
            </div>

            <div className="profile-form-grid-2">
              {/* Trade Category */}
              <div className="profile-form-group">
                <label htmlFor="tradeCategory" className="profile-label">
                  <span>Primary Trade Category <span className="profile-label-required">*</span></span>
                </label>
                <div className="profile-input-wrap">
                  <input
                    id="tradeCategory"
                    type="text"
                    required
                    className={`profile-input ${errors.trade ? 'is-invalid' : ''}`}
                    placeholder="e.g. Plumbing & Water Systems"
                    value={formData.trade}
                    onChange={(e) => handleChange('trade', e.target.value)}
                  />
                </div>
                {errors.trade && (
                  <div className="profile-field-error">
                    <AlertCircle size={13} /> {errors.trade}
                  </div>
                )}
              </div>

              {/* Experience Level */}
              <div className="profile-form-group">
                <label htmlFor="experienceLevel" className="profile-label">
                  <span>Experience Level <span className="profile-label-required">*</span></span>
                </label>
                <div className="profile-input-wrap">
                  <input
                    id="experienceLevel"
                    type="text"
                    required
                    className={`profile-input ${errors.experience ? 'is-invalid' : ''}`}
                    placeholder="e.g. 8+ Years Professional Experience"
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                  />
                </div>
                {errors.experience && (
                  <div className="profile-field-error">
                    <AlertCircle size={13} /> {errors.experience}
                  </div>
                )}
              </div>
            </div>

            {/* Standard Visiting Fee */}
            <div className="profile-form-group mt-3">
              <label htmlFor="visitingCharge" className="profile-label">
                <span>Standard Doorstep Visiting Fee <span className="profile-label-required">*</span></span>
              </label>
              <div className={`profile-input-addon-group ${errors.visitingCharge ? 'is-invalid' : ''}`}>
                <div className="profile-addon-prefix">
                  ₹
                </div>
                <input
                  id="visitingCharge"
                  type="number"
                  min="0"
                  max="2000"
                  step="10"
                  required
                  className="profile-input-naked"
                  placeholder="199"
                  value={formData.visitingCharge}
                  onChange={(e) => handleChange('visitingCharge', e.target.value)}
                />
              </div>
              {errors.visitingCharge ? (
                <div className="profile-field-error">
                  <AlertCircle size={13} /> {errors.visitingCharge}
                </div>
              ) : (
                <span className="profile-field-hint">
                  Standard doorstep inspection fee shown to customers during booking. Does not include spare parts or heavy overhaul estimates.
                </span>
              )}
            </div>
          </div>

          {/* Section 3: Service Coverage */}
          <div className="profile-section-card">
            <div className="profile-section-header">
              <div className="profile-section-title-wrap">
                <div className="profile-section-icon">
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className="profile-section-title">Service Coverage Areas</h3>
                  <p className="profile-section-desc">
                    Localities and operational zones where you are willing to accept doorstep jobs.
                  </p>
                </div>
              </div>
            </div>

            <div className="profile-form-group">
              <label htmlFor="serviceArea" className="profile-label">
                <span>Primary Localities (Comma Separated) <span className="profile-label-required">*</span></span>
              </label>
              <div className="profile-input-wrap">
                <input
                  id="serviceArea"
                  type="text"
                  required
                  className={`profile-input ${errors.serviceArea ? 'is-invalid' : ''}`}
                  placeholder="Sector 62, Indirapuram, Sector 18, Noida NCR"
                  value={formData.serviceArea}
                  onChange={(e) => handleChange('serviceArea', e.target.value)}
                />
              </div>
              {errors.serviceArea ? (
                <div className="profile-field-error">
                  <AlertCircle size={13} /> {errors.serviceArea}
                </div>
              ) : (
                <span className="profile-field-hint">
                  Separate multiple localities with commas to generate marketplace search tags.
                </span>
              )}

              {/* Area Preview Chips */}
              {areaChips.length > 0 && (
                <div className="profile-chips-wrap">
                  {areaChips.map((area, idx) => (
                    <span key={idx} className="profile-chip-tag">
                      <MapPin size={11} className="text-emerald-700" />
                      {area}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Skills & Equipment Specialties */}
          <div className="profile-section-card">
            <div className="profile-section-header">
              <div className="profile-section-title-wrap">
                <div className="profile-section-icon">
                  <Wrench size={18} />
                </div>
                <div>
                  <h3 className="profile-section-title">Skills, Tools & Equipment Specialties</h3>
                  <p className="profile-section-desc">
                    List specific equipment, diagnostic expertise, and appliance repairs you handle.
                  </p>
                </div>
              </div>
            </div>

            <div className="profile-form-group">
              <label htmlFor="skillsList" className="profile-label">
                <span>Specialized Skills & Diagnostic Capabilities</span>
              </label>
              <textarea
                id="skillsList"
                rows="3"
                className="profile-textarea"
                placeholder="Pipe Leakage Repair, Drain Cleaning, Geyser Installation, Motor Pumps, Tap & Mixer Fitting..."
                value={formData.skills}
                onChange={(e) => handleChange('skills', e.target.value)}
              />
              <span className="profile-field-hint">
                Separate multiple skills with commas. These appear as verified tags on your customer-facing partner profile.
              </span>

              {/* Skill Preview Chips */}
              {skillChips.length > 0 && (
                <div className="profile-chips-wrap">
                  {skillChips.map((skill, idx) => (
                    <span key={idx} className="profile-chip-tag">
                      <span className="profile-chip-tag-dot"></span>
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions Bar */}
          <div className="profile-actions-bar">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={!isDirty || isSaving}
              className="profile-btn profile-btn-secondary"
            >
              <RotateCcw size={16} />
              Discard Changes
            </button>

            <button
              type="submit"
              disabled={!isDirty || isSaving}
              className="profile-btn profile-btn-primary"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin mr-1">⏳</span>
                  Saving Updates…
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Column: Partner Status Sidebar */}
        <div className="partner-status-sidebar">
          {/* Card: Partner Status & Accreditation */}
          <div className="partner-status-card">
            <div className="partner-status-header">
              <ShieldCheck size={18} className="text-emerald-700" />
              Partner Accreditation
            </div>

            <div className="partner-status-item-list">
              <div className="partner-status-item">
                <span className="partner-status-item-label">Verification Status</span>
                <div className="partner-status-item-val">
                  <span className="status-pill status-completed">
                    ✓ {verificationStatus}
                  </span>
                </div>
              </div>

              <div className="partner-status-item">
                <span className="partner-status-item-label">Partner ID</span>
                <div className="partner-status-item-val">
                  <span className="font-mono font-bold text-sm text-[var(--emerald-ink)]">
                    {partnerId}
                  </span>
                </div>
              </div>

              <div className="partner-status-item">
                <span className="partner-status-item-label">Account Tier</span>
                <div className="partner-status-item-val">
                  <span className="badge-category font-bold">
                    <Sparkles size={12} className="inline mr-1" />
                    Tier 1 Gold Partner
                  </span>
                </div>
              </div>

              <div className="partner-status-item">
                <span className="partner-status-item-label">Job Availability</span>
                <div className="partner-status-item-val">
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    🟢 Active & Receiving Bookings
                  </span>
                </div>
              </div>

              <div className="partner-status-item">
                <span className="partner-status-item-label">Platform Rating</span>
                <div className="partner-status-item-val">
                  <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                    <Star size={12} fill="#B45309" color="#B45309" /> 4.9 · 142 Reviews
                  </span>
                </div>
              </div>
            </div>

            <Link to="/technician/availability" className="profile-btn-manage-link">
              <Calendar size={15} />
              Manage Availability & Slots
              <ExternalLink size={13} />
            </Link>

            {/* Security Notice */}
            <div className="partner-security-box">
              <strong>🔒 Security & Accreditation Notice</strong>
              Background verification checks, ID approvals, and partner tier rankings are certified by platform operations administrators and cannot be altered through profile self-editing.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
