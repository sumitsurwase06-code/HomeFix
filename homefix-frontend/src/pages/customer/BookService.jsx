import React, { useState, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Wrench,
  Zap,
  Hammer,
  Armchair,
  Droplets,
  Droplet,
  Paintbrush,
  Cpu,
  Sparkles,
  Search,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Calendar,
  CalendarDays,
  CalendarCheck2,
  Clock,
  Sunrise,
  SunMedium,
  Moon,
  MapPin,
  ShieldCheck,
  BadgeCheck,
  AlertCircle,
  Upload,
  ImagePlus,
  Plus,
  X,
  PhoneCall,
  CheckSquare,
  Sparkle,
  ChevronRight,
  Star,
  Pencil,
  Award,
  Eye,
  RotateCcw,
  Filter
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../data/services';
import { DEMO_TECHNICIANS } from '../../data/technicians';
import { bookingApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import './BookService.css';

// Step definition for Progress Stepper
const STEPS = [
  { id: 1, title: 'Service', label: '01' },
  { id: 2, title: 'Problem', label: '02' },
  { id: 3, title: 'Location', label: '03' },
  { id: 4, title: 'Schedule', label: '04' },
  { id: 5, title: 'Expert', label: '05' },
  { id: 6, title: 'Review', label: '06' },
  { id: 7, title: 'Confirm', label: '07' },
];

// Curated concise descriptions and icons for modern presentation
const SERVICE_METADATA = {
  plumbing: {
    icon: Droplets,
    conciseDesc: 'Leaks, taps & drainage',
  },
  electrical: {
    icon: Zap,
    conciseDesc: 'Switches, wiring & fixtures',
  },
  carpentry: {
    icon: Hammer,
    conciseDesc: 'Doors, woodwork & hinges',
  },
  'furniture-repair': {
    icon: Armchair,
    conciseDesc: 'Sofa, tables & polishing',
  },
  'leakage-repair': {
    icon: Droplet,
    conciseDesc: 'Seepage, cracks & waterproofing',
  },
  painting: {
    icon: Paintbrush,
    conciseDesc: 'Wall colors & waterproof coats',
  },
  'appliance-repair': {
    icon: Cpu,
    conciseDesc: 'AC, washing machine & fridge',
  },
  cleaning: {
    icon: Sparkles,
    conciseDesc: 'Deep scrub, kitchen & bath',
  },
  'other-maintenance': {
    icon: Wrench,
    conciseDesc: 'Fittings, drilling & odd jobs',
  },
};

// Grouped time slots with icons and periods
const TIME_SLOT_GROUPS = [
  {
    group: 'Morning',
    icon: Sunrise,
    period: '08:00 AM - 12:00 PM',
    slots: ['08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM'],
  },
  {
    group: 'Afternoon',
    icon: SunMedium,
    period: '12:00 PM - 04:00 PM',
    slots: ['12:00 PM - 02:00 PM', '02:00 PM - 04:00 PM'],
  },
  {
    group: 'Evening',
    icon: Moon,
    period: '04:00 PM - 08:00 PM',
    slots: ['04:00 PM - 06:00 PM', '06:00 PM - 08:00 PM'],
  },
];

// Generate selectable upcoming 7 days starting from 2026-10-06
const generateUpcomingDays = () => {
  const base = new Date('2026-10-06T00:00:00');
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const fullFormatted = d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
    days.push({ iso, dayName, dayNum, month, fullFormatted });
  }
  return days;
};

export default function BookService() {
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const customDateInputRef = useRef(null);

  // Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Search filter for Step 1
  const [searchQuery, setSearchQuery] = useState('');

  // Form Fields
  const [selectedServiceId, setSelectedServiceId] = useState(searchParams.get('service') || 'plumbing');
  const [problemTitle, setProblemTitle] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Address
  const [streetAddress, setStreetAddress] = useState('Flat 402, Sunshine Heights, Sector 62');
  const [locality, setLocality] = useState('Indirapuram');
  const [city, setCity] = useState('Noida');
  const [postalCode, setPostalCode] = useState('201309');
  const [saveAddress, setSaveAddress] = useState(true);

  // Appointment Slot
  const upcomingDays = useMemo(() => generateUpcomingDays(), []);
  const [appointmentDate, setAppointmentDate] = useState('2026-10-06');
  const [appointmentTime, setAppointmentTime] = useState('10:00 AM - 12:00 PM');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  // Technician Selection & Filtering (Step 5)
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(searchParams.get('technicianId') || '');
  const [techSearchQuery, setTechSearchQuery] = useState('');
  const [techRatingFilter, setTechRatingFilter] = useState(0);
  const [techExpFilter, setTechExpFilter] = useState('all');
  const [techVerifiedOnly, setTechVerifiedOnly] = useState(false);
  const [techSortBy, setTechSortBy] = useState('recommended');
  const [quickViewTech, setQuickViewTech] = useState(null);

  // Error validation
  const [stepError, setStepError] = useState('');

  // Selected Service Category Object
  const selectedService = useMemo(() => {
    return SERVICE_CATEGORIES.find((s) => s.id === selectedServiceId) || SERVICE_CATEGORIES[0];
  }, [selectedServiceId]);

  // All technicians available for current selected category
  const categoryTechnicians = useMemo(() => {
    return DEMO_TECHNICIANS.filter((t) => t.category === selectedServiceId);
  }, [selectedServiceId]);

  // Filtered & Sorted technicians
  const filteredAndSortedTechnicians = useMemo(() => {
    let list = categoryTechnicians.filter((t) => {
      // 1. Search Query
      if (techSearchQuery.trim()) {
        const q = techSearchQuery.toLowerCase().trim();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesSkills = t.skills?.some((s) => s.toLowerCase().includes(q));
        const matchesArea = (t.serviceArea || '').toLowerCase().includes(q);
        const matchesBio = (t.bio || '').toLowerCase().includes(q);
        if (!matchesName && !matchesTitle && !matchesSkills && !matchesArea && !matchesBio) return false;
      }

      // 2. Rating Filter
      if (techRatingFilter > 0 && t.rating < techRatingFilter) {
        return false;
      }

      // 3. Experience Filter
      if (techExpFilter === '3+' && (t.experienceYears || 0) < 3) return false;
      if (techExpFilter === '5+' && (t.experienceYears || 0) < 5) return false;
      if (techExpFilter === '8+' && (t.experienceYears || 0) < 8) return false;

      // 4. Verified Only Filter
      if (techVerifiedOnly && t.status !== 'Verified') return false;

      return true;
    });

    // Sorting
    return [...list].sort((a, b) => {
      if (techSortBy === 'rating') {
        return b.rating - a.rating || b.reviewsCount - a.reviewsCount;
      }
      if (techSortBy === 'experience') {
        return (b.experienceYears || 0) - (a.experienceYears || 0);
      }
      if (techSortBy === 'fee_asc') {
        return a.visitingCharge - b.visitingCharge;
      }
      // 'recommended': composite score of rating and review volume
      const scoreA = (a.rating || 0) * Math.log10((a.reviewsCount || 0) + 10);
      const scoreB = (b.rating || 0) * Math.log10((b.reviewsCount || 0) + 10);
      return scoreB - scoreA;
    });
  }, [categoryTechnicians, techSearchQuery, techRatingFilter, techExpFilter, techVerifiedOnly, techSortBy]);

  // Active chosen technician object
  const chosenTechnician = useMemo(() => {
    if (selectedTechnicianId) {
      const match = DEMO_TECHNICIANS.find((t) => t.id === selectedTechnicianId);
      if (match && match.category === selectedServiceId) {
        return match;
      }
    }
    return null;
  }, [selectedTechnicianId, selectedServiceId]);

  // Check if any filter is active
  const hasActiveTechFilters = useMemo(() => {
    return (
      techSearchQuery.trim() !== '' ||
      techRatingFilter > 0 ||
      techExpFilter !== 'all' ||
      techVerifiedOnly ||
      techSortBy !== 'recommended'
    );
  }, [techSearchQuery, techRatingFilter, techExpFilter, techVerifiedOnly, techSortBy]);

  // Clear all technician filters
  const clearTechFilters = () => {
    setTechSearchQuery('');
    setTechRatingFilter(0);
    setTechExpFilter('all');
    setTechVerifiedOnly(false);
    setTechSortBy('recommended');
  };

  // Handler for service category selection
  const handleSelectService = (serviceId) => {
    setSelectedServiceId(serviceId);
    if (selectedTechnicianId) {
      const tech = DEMO_TECHNICIANS.find((t) => t.id === selectedTechnicianId);
      if (tech && tech.category !== serviceId) {
        setSelectedTechnicianId('');
      }
    }
  };

  // Filtered services in Step 1
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return SERVICE_CATEGORIES;
    const q = searchQuery.toLowerCase().trim();
    return SERVICE_CATEGORIES.filter((cat) => {
      const nameMatch = cat.name.toLowerCase().includes(q);
      const descMatch = (cat.shortDesc || '').toLowerCase().includes(q);
      const snippetMatch = (SERVICE_METADATA[cat.id]?.conciseDesc || '').toLowerCase().includes(q);
      const subServicesMatch = (cat.popularServices || []).some((item) => item.toLowerCase().includes(q));
      return nameMatch || descMatch || snippetMatch || subServicesMatch;
    });
  }, [searchQuery]);

  // Estimated Pricing calculations
  const visitingCharge = chosenTechnician?.visitingCharge || (selectedService?.startingPrice ? Math.min(selectedService.startingPrice, 199) : 199);
  const estimatedLaborCharge = selectedService?.startingPrice || 250;
  const estimatedMaterialCharge = 0; // Finalized upon physical diagnostic
  const estimatedGrandTotal = visitingCharge + estimatedLaborCharge + estimatedMaterialCharge;

  // Formatted date string for summary presentation
  const formattedSelectedDate = useMemo(() => {
    const matched = upcomingDays.find((d) => d.iso === appointmentDate);
    if (matched) return matched.fullFormatted;
    try {
      const parsed = new Date(appointmentDate + 'T00:00:00');
      return parsed.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return appointmentDate;
    }
  }, [appointmentDate, upcomingDays]);

  // Process and validate uploaded files
  const processFiles = (files) => {
    if (!files || !files.length) return;

    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

    const validFiles = [];
    for (const file of files) {
      if (!validImageTypes.includes(file.type)) {
        toast.error('Only JPG, JPEG, PNG and WEBP images are supported.', 'Unsupported file');
        continue;
      }
      if (file.size > maxSizeBytes) {
        toast.error(`"${file.name}" exceeds 5MB limit.`, 'File too large');
        continue;
      }
      validFiles.push(file);
    }

    if (!validFiles.length) return;

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPhotoPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files?.length) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removePhoto = (index) => {
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Step Validation & Progression
  const handleNext = () => {
    setStepError('');
    if (currentStep === 1) {
      if (!selectedServiceId) {
        setStepError('Please select a service trade to get started.');
        return;
      }
    } else if (currentStep === 2) {
      if (!problemTitle.trim()) {
        setStepError('Please enter a brief problem title.');
        return;
      }
      if (!problemDescription.trim()) {
        setStepError('Please provide a brief problem description.');
        return;
      }
    } else if (currentStep === 3) {
      if (!streetAddress || !locality || !city || !postalCode) {
        setStepError('Please complete all address fields.');
        return;
      }
    } else if (currentStep === 4) {
      if (!appointmentDate || !appointmentTime) {
        setStepError('Please select preferred date and time slot.');
        return;
      }
    } else if (currentStep === 5) {
      if (!chosenTechnician) {
        setStepError('Please select a technician.');
        return;
      }
    }

    setCurrentStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStepError('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jump directly to a specific step to edit details
  const jumpToStep = (stepNumber) => {
    setStepError('');
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Final Booking
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        technicianId: chosenTechnician.id,
        technicianName: chosenTechnician.name,
        technicianAvatar: chosenTechnician.avatar,
        problemTitle,
        problemDescription,
        problemImages: photoPreviews,
        address: {
          street: streetAddress,
          locality,
          city,
          postalCode,
        },
        appointmentDate,
        appointmentTime,
        pricing: {
          visitingCharge,
          repairLabor: estimatedLaborCharge,
          materialCharge: estimatedMaterialCharge,
          customerTotal: estimatedGrandTotal,
          platformFee: Math.round(visitingCharge * 0.1),
          technicianPayout: estimatedGrandTotal - Math.round(visitingCharge * 0.1),
        },
      };

      const res = await bookingApi.create(payload);
      setConfirmedBooking(res.data);
      toast.success('Your service request has been registered.', 'Booking Confirmed');
      setCurrentStep(7); // Jump to Confirmation Step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setStepError('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic next button label based on step
  const getNextButtonLabel = () => {
    switch (currentStep) {
      case 1:
        return 'Continue to Problem Details';
      case 2:
        return 'Continue to Doorstep Location';
      case 3:
        return 'Select Appointment Slot';
      case 4:
        return 'Choose Expert Technician';
      case 5:
        return 'Review Booking Summary';
      case 6:
        return 'Confirm & Book Service';
      default:
        return 'Continue';
    }
  };

  // Dynamic Next Step text for summary card
  const getNextStepSummaryPrompt = () => {
    switch (currentStep) {
      case 1:
        return 'Describe your problem';
      case 2:
        return 'Provide doorstep address';
      case 3:
        return 'Pick date & time window';
      case 4:
        return 'Select certified technician';
      case 5:
        return 'Review estimates & confirm';
      case 6:
        return 'Dispatch request';
      default:
        return 'Complete booking';
    }
  };

  return (
    <div className="booking-wizard-page">
      {/* Global Page Header */}
      <div className="booking-page-header">
        <div>
          <h1 className="booking-header-title">Book a Service</h1>
          <p className="booking-header-subtitle">Find the right certified professional for your home repairs.</p>
        </div>
        <a href="tel:1800-HOME-FIX" className="booking-header-help" title="Contact Support">
          <PhoneCall size={15} />
          <span>Need help? 1800-HOME-FIX</span>
        </a>
      </div>

      {/* Top Progress Stepper */}
      <div className="booking-stepper-container" aria-label="Booking Progress">
        <div className="booking-stepper-list">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isPending = currentStep < step.id;

            return (
              <div
                key={step.id}
                className={`booking-step-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''} ${isPending ? 'pending' : ''}`}
              >
                <div
                  className={`booking-step-circle ${
                    isCompleted ? 'completed' : isCurrent ? 'active' : 'pending'
                  }`}
                >
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : step.label}
                </div>
                <div className="booking-step-text-wrapper">
                  <span className="booking-step-number-label">Step {step.label}</span>
                  <span className="booking-step-title">{step.title}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`booking-step-divider ${isCompleted ? 'completed' : ''}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Alert Message */}
      {stepError && (
        <div className="bg-[var(--danger-bg)] border border-[var(--danger-border)] text-[var(--danger-text)] p-3 rounded-lg text-sm flex items-center gap-2 mb-6 shadow-sm" role="alert">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span className="font-semibold">{stepError}</span>
        </div>
      )}

      {/* Main Two-Column Wizard Grid (Step 1-6) */}
      {currentStep < 7 ? (
        <div className="booking-wizard-grid">
          {/* Main Content Column */}
          <div className="booking-main-col">
            {/* STEP 1: Select Service Category */}
            {currentStep === 1 && (
              <div className="booking-step-card">
                <div className="booking-step-header">
                  <h2 className="booking-step-heading">What do you need help with?</h2>
                  <p className="booking-step-desc">Choose a service category to get started with verified technicians.</p>
                </div>

                {/* Compact Search Bar */}
                <div className="service-search-wrapper">
                  <Search size={18} className="service-search-icon" />
                  <input
                    type="text"
                    className="service-search-input"
                    placeholder="Search plumbing, electrical, cleaning, carpentry..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search services"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="service-search-clear"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Service Cards Grid */}
                {filteredServices.length > 0 ? (
                  <div className="service-category-grid">
                    {filteredServices.map((cat) => {
                      const isSelected = selectedServiceId === cat.id;
                      const meta = SERVICE_METADATA[cat.id] || { icon: Wrench, conciseDesc: cat.shortDesc };
                      const IconComp = meta.icon;

                      return (
                        <div
                          key={cat.id}
                          onClick={() => handleSelectService(cat.id)}
                          className={`service-selection-card ${isSelected ? 'selected' : ''}`}
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleSelectService(cat.id);
                            }
                          }}
                        >
                          <div>
                            <div className="service-card-top-row">
                              <div className="service-card-icon-box">
                                <IconComp size={20} />
                              </div>
                              {isSelected ? (
                                <div className="service-card-check-badge">
                                  <Check size={14} strokeWidth={3} />
                                </div>
                              ) : cat.popular ? (
                                <span className="service-card-popular-pill">Popular</span>
                              ) : null}
                            </div>

                            <div className="service-card-body">
                              <h3 className="service-card-name">{cat.name}</h3>
                              <p className="service-card-snippet">{meta.conciseDesc}</p>
                            </div>
                          </div>

                          <div className="service-card-footer">
                            <span className="service-card-price-badge">From ₹{cat.startingPrice}</span>
                            <span className="text-[11px] text-[var(--text-muted)] font-medium">Visiting fee</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="service-empty-search">
                    <Search size={36} className="service-empty-icon mx-auto" />
                    <h3 className="service-empty-title">No services found</h3>
                    <p className="service-empty-desc">Try searching for another service trade or clear your query.</p>
                    <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                      Clear Search Query
                    </Button>
                  </div>
                )}

                {/* Step Navigation Action */}
                <div className="booking-step-actions single-action">
                  <button
                    type="button"
                    className="booking-continue-btn"
                    onClick={handleNext}
                    disabled={!selectedServiceId}
                  >
                    <span>{getNextButtonLabel()}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Describe Problem & Upload Photos */}
            {currentStep === 2 && (
              <div className="booking-step-card">
                <div className="booking-step-header">
                  <h2 className="booking-step-heading">Describe the issue</h2>
                  <p className="booking-step-desc">
                    Detailed symptoms help our technician arrive prepared with the correct diagnostics and spare parts.
                  </p>
                </div>

                <div className="space-y-5 mb-6">
                  <Input
                    label="Problem Headline / Short Title"
                    required
                    placeholder="e.g. Master bathroom sink tap continuously leaking"
                    value={problemTitle}
                    onChange={(e) => setProblemTitle(e.target.value)}
                  />

                  <div className="input-group">
                    <label className="input-label">
                      Detailed Problem Description <span className="input-required">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      className="input-control"
                      placeholder="Explain what is malfunctioning, when it started, and whether water/power supply was shut off..."
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                    />
                  </div>

                  {/* Professional Problem Photo Upload Section */}
                  <div className="photo-upload-section">
                    <div className="photo-upload-header-row">
                      <div className="photo-upload-title-wrap">
                        <h4 className="photo-upload-title">Add photos of the issue</h4>
                        <span className="photo-upload-badge-optional">Optional</span>
                      </div>
                      {photoPreviews.length > 0 && (
                        <span className="text-xs text-[var(--emerald-medium)] font-bold">
                          {photoPreviews.length} photo{photoPreviews.length > 1 ? 's' : ''} attached
                        </span>
                      )}
                    </div>
                    <p className="photo-upload-subtitle">
                      Photos help your technician understand the problem before arriving.
                    </p>

                    {/* Hidden Native File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files?.length) {
                          processFiles(Array.from(e.target.files));
                          e.target.value = '';
                        }
                      }}
                    />

                    {/* Dedicated Drag & Drop Zone */}
                    <div
                      className={`photo-dropzone ${isDragging ? 'is-dragging' : ''}`}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          fileInputRef.current?.click();
                        }
                      }}
                      aria-label="Upload photos of the problem"
                    >
                      <div className="photo-upload-icon-box">
                        <ImagePlus size={26} />
                      </div>

                      <div className="photo-upload-prompt-title">
                        {isDragging ? 'Drop images here' : 'Drag & drop images here or'}
                      </div>

                      <div className="photo-upload-prompt-sub">
                        <span className="photo-browse-btn">
                          <Upload size={14} />
                          <span>Browse Photos</span>
                        </span>
                      </div>

                      <div className="photo-upload-hints">
                        JPG, JPEG, PNG or WEBP • Up to 5 MB each • You can upload multiple photos
                      </div>
                    </div>

                    {/* Uploaded Photo Previews Grid */}
                    {photoPreviews.length > 0 && (
                      <div className="photo-previews-container">
                        <div className="photo-previews-header">
                          <span>Uploaded Photos ({photoPreviews.length})</span>
                        </div>
                        <div className="photo-preview-grid">
                          {photoPreviews.map((imgSrc, idx) => (
                            <div key={idx} className="photo-preview-card">
                              <img src={imgSrc} alt={`Problem preview ${idx + 1}`} className="photo-preview-image" />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removePhoto(idx);
                                }}
                                className="photo-preview-remove-btn"
                                title="Remove photo"
                                aria-label="Remove photo"
                              >
                                <X size={13} strokeWidth={2.5} />
                              </button>
                            </div>
                          ))}

                          {/* Mini Add More Tile */}
                          <div
                            className="photo-add-more-card"
                            onClick={() => fileInputRef.current?.click()}
                            role="button"
                            tabIndex={0}
                            title="Add another photo"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                fileInputRef.current?.click();
                              }
                            }}
                          >
                            <Plus size={20} />
                            <span>Add more</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="booking-step-actions">
                  <button type="button" className="booking-back-btn" onClick={handleBack}>
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    className="booking-continue-btn"
                    onClick={handleNext}
                    disabled={!problemTitle.trim() || !problemDescription.trim()}
                  >
                    <span>{getNextButtonLabel()}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Doorstep Location */}
            {currentStep === 3 && (
              <div className="booking-step-card">
                <div className="booking-step-header">
                  <h2 className="booking-step-heading">Doorstep service address</h2>
                  <p className="booking-step-desc">
                    Specify the exact household location where our verified specialist will visit.
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <Input
                    label="Flat / House / Floor / Building Name"
                    required
                    placeholder="e.g. Flat 402, Sunshine Heights, Sector 62"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      label="Locality / Area"
                      required
                      placeholder="e.g. Indirapuram"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                    />

                    <Input
                      label="City"
                      required
                      placeholder="e.g. Noida"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />

                    <Input
                      label="PIN / Postal Code"
                      required
                      placeholder="e.g. 201309"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>

                  <label className="checkbox-label text-sm text-[var(--text-secondary)] flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="accent-[var(--emerald-ink)]"
                    />
                    <span>Save this address to My Addresses for 1-click future bookings</span>
                  </label>

                  {/* Google Maps Integration Ready Placeholder */}
                  <div className="p-4 rounded-xl bg-[var(--champagne-light)] border border-[var(--champagne-border)] text-xs text-[var(--text-secondary)] flex items-start gap-3 mt-4">
                    <MapPin size={20} className="text-[var(--emerald-medium)] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[var(--emerald-ink)] block">Map Geolocation Integration Ready</span>
                      Address fields are formatted for Google Maps JavaScript API & Places Autocomplete.
                    </div>
                  </div>
                </div>

                <div className="booking-step-actions">
                  <button type="button" className="booking-back-btn" onClick={handleBack}>
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    className="booking-continue-btn"
                    onClick={handleNext}
                    disabled={!streetAddress || !locality || !city || !postalCode}
                  >
                    <span>{getNextButtonLabel()}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Preferred Appointment Slot */}
            {currentStep === 4 && (
              <div className="booking-step-card">
                <div className="booking-step-header">
                  <h2 className="booking-step-heading">Select appointment schedule</h2>
                  <p className="booking-step-desc">Choose your preferred service date and a convenient 2-hour arrival window.</p>
                </div>

                <div className="schedule-container mb-6">
                  {/* Section A: Date Selector */}
                  <div>
                    <div className="schedule-sub-header">
                      <span className="schedule-sub-title">
                        <CalendarDays size={17} />
                        <span>Select Date</span>
                      </span>
                      <button
                        type="button"
                        className="schedule-custom-date-toggle"
                        onClick={() => {
                          setShowCustomDatePicker(!showCustomDatePicker);
                          if (!showCustomDatePicker) {
                            setTimeout(() => customDateInputRef.current?.showPicker?.(), 50);
                          }
                        }}
                      >
                        <Calendar size={14} />
                        <span>{showCustomDatePicker ? 'Hide Custom Picker' : 'Pick another date'}</span>
                      </button>
                    </div>

                    {/* Date Ribbon */}
                    <div className="schedule-date-ribbon">
                      {upcomingDays.map((day) => {
                        const isSelectedDate = appointmentDate === day.iso;
                        return (
                          <div
                            key={day.iso}
                            onClick={() => {
                              setAppointmentDate(day.iso);
                              setShowCustomDatePicker(false);
                            }}
                            className={`schedule-date-card ${isSelectedDate ? 'selected' : ''}`}
                            role="radio"
                            aria-checked={isSelectedDate}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                setAppointmentDate(day.iso);
                              }
                            }}
                          >
                            <span className="schedule-date-day">{day.dayName}</span>
                            <span className="schedule-date-num">{day.dayNum}</span>
                            <span className="schedule-date-month">{day.month}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Optional Custom Native Date Input */}
                    {showCustomDatePicker && (
                      <div className="mt-3 p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--champagne-border)] flex items-center gap-3">
                        <label className="text-xs font-bold text-[var(--emerald-ink)]">Choose custom date:</label>
                        <input
                          ref={customDateInputRef}
                          type="date"
                          className="input-control text-xs py-1.5 px-3 w-auto"
                          value={appointmentDate}
                          onChange={(e) => setAppointmentDate(e.target.value)}
                          min="2026-10-06"
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* Section B: Time Slot Groups */}
                  <div>
                    <div className="schedule-sub-header">
                      <span className="schedule-sub-title">
                        <Clock size={17} />
                        <span>Select 2-Hour Arrival Window</span>
                      </span>
                    </div>

                    <div className="schedule-time-sections">
                      {TIME_SLOT_GROUPS.map((group) => {
                        const GroupIcon = group.icon;
                        return (
                          <div key={group.group} className="schedule-period-block">
                            <div className="schedule-period-header">
                              <div className="schedule-period-title">
                                <GroupIcon size={16} />
                                <span>{group.group}</span>
                              </div>
                              <span className="schedule-period-range">{group.period}</span>
                            </div>

                            <div className="schedule-slots-grid">
                              {group.slots.map((slot) => {
                                const isSelectedSlot = appointmentTime === slot;
                                return (
                                  <div
                                    key={slot}
                                    onClick={() => setAppointmentTime(slot)}
                                    className={`schedule-slot-card ${isSelectedSlot ? 'selected' : ''}`}
                                    role="radio"
                                    aria-checked={isSelectedSlot}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        setAppointmentTime(slot);
                                      }
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Clock size={15} className={isSelectedSlot ? 'text-[var(--emerald-ink)]' : 'text-[var(--text-muted)]'} />
                                      <span className="schedule-slot-time">{slot}</span>
                                    </div>
                                    <span className="schedule-slot-badge">
                                      {isSelectedSlot ? 'Selected' : '2 hrs'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section C: Selected Confirmation Highlight */}
                  {appointmentDate && appointmentTime && (
                    <div className="schedule-selection-highlight">
                      <CalendarCheck2 size={24} className="schedule-highlight-icon" />
                      <div>
                        <div className="schedule-highlight-title">
                          Selected Window: {formattedSelectedDate} · {appointmentTime}
                        </div>
                        <div className="schedule-highlight-sub">
                          The certified technician will arrive within this 2-hour window. Free cancellation and slot rescheduling anytime before dispatch.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="booking-step-actions">
                  <button type="button" className="booking-back-btn" onClick={handleBack}>
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    className="booking-continue-btn"
                    onClick={handleNext}
                    disabled={!appointmentDate || !appointmentTime}
                  >
                    <span>{getNextButtonLabel()}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Select Expert Technician */}
            {currentStep === 5 && (
              <div className="booking-step-card">
                {/* Step Header */}
                <div className="tech-step-header">
                  <div className="tech-step-header-text">
                    <h2 className="booking-step-heading">Choose your verified expert</h2>
                    <p className="booking-step-desc">
                      Specialists qualified and rated for <strong>{selectedService.name}</strong> services.
                    </p>
                  </div>
                  {categoryTechnicians.length > 0 && (
                    <div className="tech-step-count-badge">
                      <ShieldCheck size={14} />
                      <span>
                        {filteredAndSortedTechnicians.length} expert{filteredAndSortedTechnicians.length === 1 ? '' : 's'} available
                      </span>
                    </div>
                  )}
                </div>

                {/* Search & Filter Toolbar */}
                <div className="tech-toolbar-container">
                  {/* Search Input Row */}
                  <div className="tech-search-bar">
                    <Search size={16} className="tech-search-icon" />
                    <input
                      type="text"
                      className="tech-search-input"
                      placeholder={`Search ${selectedService.name.toLowerCase()} technicians by name, skills, or area...`}
                      value={techSearchQuery}
                      onChange={(e) => setTechSearchQuery(e.target.value)}
                    />
                    {techSearchQuery && (
                      <button
                        type="button"
                        className="tech-search-clear"
                        onClick={() => setTechSearchQuery('')}
                        title="Clear search"
                        aria-label="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Filter Controls Row */}
                  <div className="tech-controls-row">
                    <div className="tech-filter-controls">
                      {/* Rating Filter */}
                      <div className="tech-filter-group">
                        <label className="tech-filter-label" htmlFor="tech-filter-rating">
                          Rating
                        </label>
                        <select
                          id="tech-filter-rating"
                          className="tech-filter-select"
                          value={techRatingFilter}
                          onChange={(e) => setTechFilterRating(Number(e.target.value))}
                        >
                          <option value={0}>All ratings</option>
                          <option value={4.5}>4.5+ ★ & Above</option>
                          <option value={4.7}>4.7+ ★ Top Rated</option>
                          <option value={4.8}>4.8+ ★ Elite</option>
                        </select>
                      </div>

                      {/* Experience Filter */}
                      <div className="tech-filter-group">
                        <label className="tech-filter-label" htmlFor="tech-filter-exp">
                          Experience
                        </label>
                        <select
                          id="tech-filter-exp"
                          className="tech-filter-select"
                          value={techExpFilter}
                          onChange={(e) => setTechExpFilter(e.target.value)}
                        >
                          <option value="all">Any experience</option>
                          <option value="3+">3+ Years</option>
                          <option value="5+">5+ Years</option>
                          <option value="8+">8+ Years</option>
                        </select>
                      </div>

                      {/* Sort Dropdown */}
                      <div className="tech-filter-group">
                        <label className="tech-filter-label" htmlFor="tech-filter-sort">
                          Sort by
                        </label>
                        <select
                          id="tech-filter-sort"
                          className="tech-filter-select"
                          value={techSortBy}
                          onChange={(e) => setTechSortBy(e.target.value)}
                        >
                          <option value="recommended">Recommended</option>
                          <option value="rating">Highest Rated</option>
                          <option value="experience">Most Experienced</option>
                          <option value="fee_asc">Lowest Visiting Fee</option>
                        </select>
                      </div>

                      {/* Verified Only Pill Toggle */}
                      <button
                        type="button"
                        className={`tech-toggle-pill ${techVerifiedOnly ? 'active' : ''}`}
                        onClick={() => setTechVerifiedOnly((prev) => !prev)}
                        aria-pressed={techVerifiedOnly}
                      >
                        <ShieldCheck size={14} />
                        <span>Verified Only</span>
                      </button>
                    </div>

                    {/* Clear Filters Action */}
                    {hasActiveTechFilters && (
                      <button
                        type="button"
                        className="tech-clear-filters-btn"
                        onClick={clearTechFilters}
                      >
                        <RotateCcw size={13} />
                        <span>Clear filters</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Technician Cards List / Empty State */}
                <div className="tech-cards-wrapper">
                  {filteredAndSortedTechnicians.length > 0 ? (
                    <div className="tech-cards-list">
                      {filteredAndSortedTechnicians.map((tech) => {
                        const isSelected = selectedTechnicianId === tech.id;
                        return (
                          <div
                            key={tech.id}
                            onClick={() => setSelectedTechnicianId(tech.id)}
                            className={`tech-card-card ${isSelected ? 'selected' : ''}`}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedTechnicianId(tech.id);
                              }
                            }}
                          >
                            {/* Selected Badge Indicator */}
                            {isSelected && (
                              <div className="tech-card-selected-ribbon">
                                <Check size={13} strokeWidth={3} />
                                <span>Selected Expert</span>
                              </div>
                            )}

                            <div className="tech-card-layout">
                              {/* Column 1: Image & Experience Badge */}
                              <div className="tech-card-avatar-wrapper">
                                <img
                                  src={tech.avatar}
                                  alt={tech.name}
                                  className="tech-card-avatar-img"
                                  loading="lazy"
                                />
                                <div className="tech-card-exp-badge">
                                  <Award size={11} />
                                  <span>{tech.experience}</span>
                                </div>
                              </div>

                              {/* Column 2: Details & Scannable Metadata */}
                              <div className="tech-card-info-col">
                                <div className="tech-card-title-row">
                                  <div className="tech-card-name-group">
                                    <h3 className="tech-card-name">{tech.name}</h3>
                                    {tech.status === 'Verified' && (
                                      <span className="tech-card-verified-badge" title="Verified Professional">
                                        <ShieldCheck size={12} />
                                        <span>Verified</span>
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <p className="tech-card-role-title">{tech.title}</p>

                                {/* Rating & Review & Exp Metadata */}
                                <div className="tech-card-meta-line">
                                  <span className="tech-card-rating-chip">
                                    <Star size={12} fill="currentColor" />
                                    <span>{tech.rating}</span>
                                  </span>
                                  <span className="tech-card-reviews-text">({tech.reviewsCount} reviews)</span>
                                  <span className="tech-card-meta-bullet">•</span>
                                  <span className="tech-card-jobs-text">{tech.completedJobs || 100}+ jobs done</span>
                                </div>

                                {/* Service Area & Availability */}
                                <div className="tech-card-details-row">
                                  <div className="tech-card-location-item" title={tech.serviceArea}>
                                    <MapPin size={13} className="tech-card-icon-muted" />
                                    <span className="truncate">{tech.serviceArea}</span>
                                  </div>
                                  <div className="tech-card-avail-item">
                                    <Clock size={13} className="tech-card-icon-avail" />
                                    <span>{tech.availability}</span>
                                  </div>
                                </div>

                                {/* Skills Tags */}
                                <div className="tech-card-skills-list">
                                  {tech.skills?.slice(0, 3).map((skill, idx) => (
                                    <span key={idx} className="tech-card-skill-tag">
                                      {skill}
                                    </span>
                                  ))}
                                  {tech.skills?.length > 3 && (
                                    <span className="tech-card-skill-tag more">
                                      +{tech.skills.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Column 3: Fee & Action Buttons */}
                              <div className="tech-card-actions-col">
                                <div className="tech-card-fee-box">
                                  <span className="tech-card-fee-label">VISITING FEE</span>
                                  <div className="tech-card-fee-amount">₹{tech.visitingCharge}</div>
                                  <span className="tech-card-fee-note">Pay after service</span>
                                </div>

                                <div className="tech-card-buttons-group">
                                  <button
                                    type="button"
                                    className="tech-card-view-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setQuickViewTech(tech);
                                    }}
                                  >
                                    <Eye size={14} />
                                    <span>View profile</span>
                                  </button>

                                  <button
                                    type="button"
                                    className={`tech-card-select-btn ${isSelected ? 'selected' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTechnicianId(tech.id);
                                    }}
                                  >
                                    {isSelected ? (
                                      <>
                                        <Check size={14} strokeWidth={3} />
                                        <span>Selected</span>
                                      </>
                                    ) : (
                                      <span>Select expert</span>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : categoryTechnicians.length === 0 ? (
                    <div className="tech-empty-state">
                      <div className="tech-empty-icon-wrap">
                        <AlertCircle size={32} />
                      </div>
                      <h3 className="tech-empty-title">No specialists currently listed for {selectedService.name}</h3>
                      <p className="tech-empty-desc">
                        Our team is rapidly onboarding certified professionals for this trade. You can choose a related service category or contact customer care.
                      </p>
                      <button
                        type="button"
                        className="tech-empty-action-btn"
                        onClick={() => jumpToStep(1)}
                      >
                        <ArrowLeft size={15} />
                        <span>Choose another service</span>
                      </button>
                    </div>
                  ) : (
                    <div className="tech-empty-state">
                      <div className="tech-empty-icon-wrap">
                        <Filter size={32} />
                      </div>
                      <h3 className="tech-empty-title">No matching technicians found</h3>
                      <p className="tech-empty-desc">
                        None of the available {selectedService.name.toLowerCase()} experts match your current search keywords or filter criteria.
                      </p>
                      <button
                        type="button"
                        className="tech-empty-action-btn"
                        onClick={clearTechFilters}
                      >
                        <RotateCcw size={15} />
                        <span>Reset all filters</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Validation error message */}
                {stepError && currentStep === 5 && (
                  <div className="tech-step-error-box">
                    <AlertCircle size={16} />
                    <span>{stepError}</span>
                  </div>
                )}

                {/* Bottom Wizard Actions */}
                <div className="booking-step-actions">
                  <button type="button" className="booking-back-btn" onClick={handleBack}>
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    className="booking-continue-btn"
                    onClick={handleNext}
                    disabled={!chosenTechnician}
                    title={!chosenTechnician ? 'Please select an expert technician to proceed' : 'Proceed to booking summary review'}
                  >
                    <span>{chosenTechnician ? 'Review Booking Summary' : 'Select an Expert to Continue'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: Premium Review & Finalize Booking */}
            {currentStep === 6 && (
              <div className="booking-step-card">
                <div className="booking-step-header">
                  <h2 className="booking-step-heading">Review & confirm request</h2>
                  <p className="booking-step-desc">
                    Make sure everything looks right before confirming. You will pay only after physical inspection and job satisfaction.
                  </p>
                </div>

                <div className="review-cards-container">
                  {/* Card 1: WHAT (Service & Problem) */}
                  <div className="review-card">
                    <div className="review-card-header">
                      <span className="review-card-label">
                        <Wrench size={14} />
                        <span>01 • Requested Service</span>
                      </span>
                      <button
                        type="button"
                        className="review-edit-btn"
                        onClick={() => jumpToStep(1)}
                        title="Edit service details"
                      >
                        <Pencil size={12} />
                        <span>Edit</span>
                      </button>
                    </div>
                    <div>
                      <h3 className="review-service-title">{selectedService.name}</h3>
                      <p className="review-service-issue">Issue: {problemTitle || 'General household maintenance'}</p>
                      <p className="review-service-desc">{problemDescription}</p>
                      {photoPreviews.length > 0 && (
                        <div className="mt-2 text-xs font-semibold text-[var(--emerald-medium)] flex items-center gap-1">
                          <ImagePlus size={13} />
                          <span>{photoPreviews.length} diagnosis photo{photoPreviews.length > 1 ? 's' : ''} attached</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card 2: WHO (Assigned Verified Professional) */}
                  <div className="review-card">
                    <div className="review-card-header">
                      <span className="review-card-label">
                        <BadgeCheck size={14} />
                        <span>02 • Your Professional</span>
                      </span>
                      <button
                        type="button"
                        className="review-edit-btn"
                        onClick={() => jumpToStep(5)}
                        title="Change expert"
                      >
                        <Pencil size={12} />
                        <span>Change</span>
                      </button>
                    </div>

                    <div className="review-tech-body">
                      <img
                        src={chosenTechnician.avatar}
                        alt={chosenTechnician.name}
                        className="review-tech-avatar"
                      />
                      <div className="review-tech-details">
                        <div className="review-tech-top">
                          <h4 className="review-tech-name">{chosenTechnician.name}</h4>
                          <span className="review-tech-verified-badge">
                            <ShieldCheck size={12} />
                            <span>Verified Specialist</span>
                          </span>
                        </div>
                        <p className="review-tech-title">{chosenTechnician.title}</p>
                        <div className="review-tech-meta-row">
                          <span className="review-tech-rating-pill">
                            <Star size={12} fill="currentColor" /> {chosenTechnician.rating} ({chosenTechnician.reviewsCount} reviews)
                          </span>
                          <span className="review-tech-exp-pill">• {chosenTechnician.experience}</span>
                          <span className="review-tech-fee-pill">₹{visitingCharge} visiting fee</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 & 4: WHEN & WHERE (2-Column Grid) */}
                  <div className="review-when-where-grid">
                    {/* WHEN */}
                    <div className="review-card">
                      <div className="review-card-header">
                        <span className="review-card-label">
                          <Calendar size={14} />
                          <span>03 • When</span>
                        </span>
                        <button
                          type="button"
                          className="review-edit-btn"
                          onClick={() => jumpToStep(4)}
                          title="Edit date or time slot"
                        >
                          <Pencil size={12} />
                          <span>Edit</span>
                        </button>
                      </div>
                      <div>
                        <div className="review-info-main">
                          <span>{formattedSelectedDate}</span>
                        </div>
                        <p className="review-info-sub">{appointmentTime} (2-hr arrival window)</p>
                      </div>
                    </div>

                    {/* WHERE */}
                    <div className="review-card">
                      <div className="review-card-header">
                        <span className="review-card-label">
                          <MapPin size={14} />
                          <span>04 • Where</span>
                        </span>
                        <button
                          type="button"
                          className="review-edit-btn"
                          onClick={() => jumpToStep(3)}
                          title="Edit address"
                        >
                          <Pencil size={12} />
                          <span>Edit</span>
                        </button>
                      </div>
                      <div>
                        <div className="review-info-main truncate">
                          <span>{locality}, {city}</span>
                        </div>
                        <p className="review-info-sub">{streetAddress} - {postalCode}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 5: HOW MUCH (Price Breakdown) */}
                  <div className="review-pricing-card">
                    <div className="review-card-header">
                      <span className="review-card-label">
                        <Sparkle size={14} />
                        <span>05 • Price Breakdown</span>
                      </span>
                    </div>

                    <div className="review-price-rows">
                      <div className="review-price-row">
                        <span>Visiting & Diagnostic Fee:</span>
                        <span className="font-bold text-[var(--emerald-ink)]">₹{visitingCharge}</span>
                      </div>
                      <div className="review-price-row">
                        <span>Estimated Labor:</span>
                        <span className="font-semibold text-[var(--text-primary)]">From ₹{estimatedLaborCharge}</span>
                      </div>
                      <div className="review-price-row">
                        <span>Spare Parts / Materials:</span>
                        <span className="italic text-xs text-[var(--text-muted)]">Quoted on-site after inspection</span>
                      </div>
                      <div className="review-price-row total">
                        <span>Estimated Total:</span>
                        <span>₹{estimatedGrandTotal}</span>
                      </div>
                    </div>

                    <div className="review-price-notice-box">
                      <ShieldCheck size={18} className="text-[var(--emerald-medium)] flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Transparent Pricing Guarantee:</strong> You will receive an upfront diagnostic quote. Pay only after job completion and 100% satisfaction.
                      </span>
                    </div>
                  </div>

                  {/* Card 6: WHAT HAPPENS NEXT (3-Step Assurance) */}
                  <div className="review-next-steps-banner">
                    <div className="review-next-steps-title">What happens after you confirm?</div>
                    <div className="review-next-steps-list">
                      <div className="review-step-item">
                        <CheckCircle2 size={16} />
                        <div>
                          <strong>1. Instant Dispatch:</strong> Request is routed directly to {chosenTechnician.name}.
                        </div>
                      </div>
                      <div className="review-step-item">
                        <Clock size={16} />
                        <div>
                          <strong>2. Prompt Arrival:</strong> Specialist arrives in uniform within your 2-hour window.
                        </div>
                      </div>
                      <div className="review-step-item">
                        <ShieldCheck size={16} />
                        <div>
                          <strong>3. Pay on Satisfaction:</strong> Settle the bill after the work is completely inspected.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="booking-step-actions">
                  <button type="button" className="booking-back-btn" onClick={handleBack}>
                    <ArrowLeft size={16} />
                    <span>Back to Experts</span>
                  </button>
                  <Button
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    onClick={handleConfirmBooking}
                    rightIcon={<CheckSquare size={18} />}
                  >
                    Confirm & Request Service
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Right-Side Booking Summary (Desktop) */}
          <div className="booking-sidebar-col">
            <aside className="booking-summary-sidebar">
              <div className="booking-summary-card">
                <div className="booking-summary-header">
                  <h3 className="booking-summary-title">Your booking</h3>
                  <span className="booking-summary-badge">Step {currentStep} of {STEPS.length - 1}</span>
                </div>

                {/* Selected Service Information */}
                {selectedService ? (
                  <div className="booking-summary-items">
                    <div className="booking-summary-item">
                      <div className="booking-summary-item-label">
                        <span>Service</span>
                        <Check size={14} className="text-[var(--emerald-medium)]" />
                      </div>
                      <div className="booking-summary-item-val">
                        <span>{selectedService.name}</span>
                      </div>
                      <div className="booking-summary-item-sub">
                        Visiting fee from ₹{selectedService.startingPrice}
                      </div>
                    </div>

                    {/* Step 2 details */}
                    {problemTitle && (
                      <div className="booking-summary-item">
                        <div className="booking-summary-item-label">Problem</div>
                        <div className="booking-summary-item-val text-xs truncate">{problemTitle}</div>
                      </div>
                    )}

                    {/* Step 3 details */}
                    {streetAddress && currentStep >= 3 && (
                      <div className="booking-summary-item">
                        <div className="booking-summary-item-label">Location</div>
                        <div className="booking-summary-item-val text-xs truncate">{locality}, {city}</div>
                      </div>
                    )}

                    {/* Step 4 details */}
                    {appointmentDate && currentStep >= 4 && (
                      <div className="booking-summary-item">
                        <div className="booking-summary-item-label">Scheduled Slot</div>
                        <div className="booking-summary-item-val text-xs">
                          {appointmentDate} · {appointmentTime ? appointmentTime.split(' - ')[0] : ''}
                        </div>
                      </div>
                    )}

                    {/* Step 5 details */}
                    {chosenTechnician ? (
                      <div className="booking-summary-item">
                        <div className="booking-summary-item-label">
                          <span>Selected Expert</span>
                          <Check size={14} className="text-[var(--emerald-medium)]" />
                        </div>
                        <div className="booking-summary-tech-row">
                          <img
                            src={chosenTechnician.avatar}
                            alt={chosenTechnician.name}
                            className="booking-summary-tech-avatar"
                          />
                          <div className="booking-summary-tech-info">
                            <div className="booking-summary-tech-name truncate">{chosenTechnician.name}</div>
                            <div className="booking-summary-tech-meta">
                              <Star size={11} fill="currentColor" className="text-[var(--secondary-hover)] inline" /> {chosenTechnician.rating} ({chosenTechnician.reviewsCount} reviews)
                            </div>
                          </div>
                        </div>
                        <div className="booking-summary-tech-fee-tag">
                          <span>Visiting fee:</span>
                          <strong>₹{chosenTechnician.visitingCharge}</strong>
                        </div>
                      </div>
                    ) : currentStep >= 5 ? (
                      <div className="booking-summary-item booking-summary-item-pending">
                        <div className="booking-summary-item-label">Technician</div>
                        <div className="booking-summary-item-sub">Choose a professional to continue.</div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="booking-summary-empty">
                    <h4 className="booking-summary-empty-title">No service selected</h4>
                    <p className="booking-summary-empty-desc">Select a trade category on the left to proceed.</p>
                  </div>
                )}

                {/* Next Step Guide */}
                <div className="booking-summary-next-prompt">
                  <ChevronRight size={18} className="next-icon" />
                  <div>
                    <div className="next-label">Next Action</div>
                    <div className="next-title">{getNextStepSummaryPrompt()}</div>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="booking-summary-pricing">
                  <div className="booking-summary-price-row">
                    <span>Visiting Fee:</span>
                    <span className="font-semibold text-[var(--emerald-ink)]">₹{visitingCharge}</span>
                  </div>
                  <div className="booking-summary-price-row">
                    <span>Est. Repair Labor:</span>
                    <span className="font-semibold text-[var(--text-primary)]">From ₹{estimatedLaborCharge}</span>
                  </div>
                  <div className="booking-summary-price-row total">
                    <span>Estimated Total:</span>
                    <span>₹{estimatedGrandTotal}</span>
                  </div>
                  <div className="booking-summary-price-note">
                    Final labor & spare part quotes confirmed on-site after diagnostics.
                  </div>
                </div>

                {/* Reassurance Badges */}
                <div className="booking-summary-trust-list">
                  <div className="booking-summary-trust-item">
                    <ShieldCheck size={16} />
                    <span>Verified & Background Checked Pros</span>
                  </div>
                  <div className="booking-summary-trust-item">
                    <Clock size={16} />
                    <span>On-Time Arrival Guarantee</span>
                  </div>
                  <div className="booking-summary-trust-item">
                    <Sparkle size={16} />
                    <span>Pay After Job Satisfaction</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      ) : null}

      {/* STEP 7: Confirmation & Booking Created */}
      {currentStep === 7 && confirmedBooking && (
        <div className="booking-step-card max-w-2xl mx-auto text-center p-8">
          <div className="w-16 h-16 rounded-full bg-[var(--emerald-light)] text-[var(--emerald-ink)] border border-[var(--emerald-medium)] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 size={36} />
          </div>

          <h2 className="text-2xl font-bold text-[var(--emerald-ink)] mb-1 font-serif-heading">Booking Request Created!</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Your appointment has been registered and sent to {confirmedBooking.technicianName} for confirmation.
          </p>

          <div className="p-5 rounded-xl bg-[var(--champagne-light)] border border-[var(--champagne-border)] text-left mb-6 space-y-3 text-sm">
            <div className="flex justify-between border-b border-[var(--champagne-border)] pb-2">
              <span className="text-[var(--text-muted)]">Booking Reference ID:</span>
              <span className="font-mono font-bold text-[var(--emerald-ink)]">{confirmedBooking.id}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--champagne-border)] py-2">
              <span className="text-[var(--text-muted)]">Service Category:</span>
              <span className="font-semibold text-[var(--text-primary)]">{confirmedBooking.serviceName}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--champagne-border)] py-2">
              <span className="text-[var(--text-muted)]">Appointment Slot:</span>
              <span className="font-semibold text-[var(--text-primary)]">{confirmedBooking.appointmentDate} ({confirmedBooking.appointmentTime})</span>
            </div>
            <div className="flex justify-between pt-1 items-center">
              <span className="text-[var(--text-muted)]">Initial Status:</span>
              <Badge status={confirmedBooking.status} dot>{confirmedBooking.status}</Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/customer/bookings/${confirmedBooking.id}`}>
              <Button variant="primary" fullWidth rightIcon={<ArrowRight size={16} />}>
                Track Booking Status
              </Button>
            </Link>
            <Link to="/customer/bookings">
              <Button variant="outline" fullWidth>
                View All My Bookings
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Sticky Action Bar */}
      {currentStep < 7 && (
        <div className="mobile-booking-bottom-bar">
          <div className="mobile-bottom-bar-inner">
            <div className="mobile-bottom-price-info">
              <span className="mobile-bottom-price-label">Visiting From</span>
              <span className="mobile-bottom-price-val">₹{visitingCharge}</span>
            </div>
            <button
              type="button"
              className="booking-continue-btn text-xs py-2.5 px-4"
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !selectedServiceId) ||
                (currentStep === 2 && (!problemTitle.trim() || !problemDescription.trim())) ||
                (currentStep === 3 && (!streetAddress || !locality || !city || !postalCode)) ||
                (currentStep === 4 && (!appointmentDate || !appointmentTime)) ||
                (currentStep === 5 && !chosenTechnician)
              }
            >
              <span>{getNextButtonLabel()}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
      {/* Quick View Technician Profile Modal */}
      <Modal
        isOpen={!!quickViewTech}
        onClose={() => setQuickViewTech(null)}
        title="Expert Profile"
        maxWidth="580px"
      >
        {quickViewTech && (
          <div className="tech-modal-body">
            <div className="tech-modal-header">
              <div className="tech-modal-avatar-wrap">
                <img
                  src={quickViewTech.avatar}
                  alt={quickViewTech.name}
                  className="tech-modal-avatar"
                />
                {quickViewTech.status === 'Verified' && (
                  <span className="tech-modal-verified-badge" title="Background Checked & Verified">
                    <ShieldCheck size={14} />
                  </span>
                )}
              </div>
              <div className="tech-modal-identity">
                <div className="tech-modal-name-row">
                  <h3 className="tech-modal-name">{quickViewTech.name}</h3>
                  <span className="tech-modal-id-tag">{quickViewTech.id}</span>
                </div>
                <p className="tech-modal-title">{quickViewTech.title}</p>
                <div className="tech-modal-rating-row">
                  <span className="tech-modal-rating-pill">
                    <Star size={13} fill="currentColor" /> {quickViewTech.rating}
                  </span>
                  <span className="tech-modal-reviews">({quickViewTech.reviewsCount} customer reviews)</span>
                </div>
              </div>
            </div>

            <div className="tech-modal-stats-grid">
              <div className="tech-modal-stat-card">
                <Award size={18} className="tech-modal-stat-icon" />
                <div>
                  <div className="tech-modal-stat-val">{quickViewTech.experience}</div>
                  <div className="tech-modal-stat-label">Experience</div>
                </div>
              </div>
              <div className="tech-modal-stat-card">
                <CheckCircle2 size={18} className="tech-modal-stat-icon" />
                <div>
                  <div className="tech-modal-stat-val">{quickViewTech.completedJobs || 100}+</div>
                  <div className="tech-modal-stat-label">Jobs Completed</div>
                </div>
              </div>
              <div className="tech-modal-stat-card">
                <Clock size={18} className="tech-modal-stat-icon" />
                <div>
                  <div className="tech-modal-stat-val">{quickViewTech.availability}</div>
                  <div className="tech-modal-stat-label">Availability</div>
                </div>
              </div>
              <div className="tech-modal-stat-card">
                <Sparkles size={18} className="tech-modal-stat-icon" />
                <div>
                  <div className="tech-modal-stat-val">₹{quickViewTech.visitingCharge}</div>
                  <div className="tech-modal-stat-label">Visiting Fee</div>
                </div>
              </div>
            </div>

            <div className="tech-modal-section">
              <h4 className="tech-modal-section-title">About & Professional Background</h4>
              <p className="tech-modal-bio-text">{quickViewTech.bio || quickViewTech.about}</p>
            </div>

            <div className="tech-modal-section">
              <h4 className="tech-modal-section-title">Specializations & Skills</h4>
              <div className="tech-modal-skills-grid">
                {quickViewTech.skills?.map((skill, i) => (
                  <span key={i} className="tech-modal-skill-chip">
                    <Check size={12} className="text-[var(--emerald-medium)]" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="tech-modal-section">
              <h4 className="tech-modal-section-title">Service Coverage Area</h4>
              <div className="tech-modal-location">
                <MapPin size={15} className="text-[var(--emerald-medium)] flex-shrink-0" />
                <span>{quickViewTech.serviceArea}</span>
              </div>
            </div>

            <div className="tech-modal-guarantee">
              <ShieldCheck size={18} className="text-[var(--emerald-medium)] flex-shrink-0" />
              <p>
                <strong>HomeFix Verified Specialist:</strong> Identity checked, police verified, and certified for domestic electrical & home services.
              </p>
            </div>

            <div className="tech-modal-actions">
              <button
                type="button"
                className="tech-modal-close-btn"
                onClick={() => setQuickViewTech(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="tech-modal-select-btn"
                onClick={() => {
                  setSelectedTechnicianId(quickViewTech.id);
                  setQuickViewTech(null);
                }}
              >
                {selectedTechnicianId === quickViewTech.id ? (
                  <>
                    <Check size={16} strokeWidth={3} />
                    <span>Currently Selected</span>
                  </>
                ) : (
                  <>
                    <Check size={16} strokeWidth={2.5} />
                    <span>Select {quickViewTech.name.split(' ')[0]}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
