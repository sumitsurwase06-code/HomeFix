import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Wrench,
  FileText,
  MapPin,
  Calendar,
  Users,
  CheckSquare,
  CheckCircle2,
  Upload,
  X,
  ArrowRight,
  ArrowLeft,
  Clock,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../data/services';
import { DEMO_TECHNICIANS } from '../../data/technicians';
import { bookingApi } from '../../services/api';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const STEPS = [
  { id: 1, title: 'Category' },
  { id: 2, title: 'Problem' },
  { id: 3, title: 'Location' },
  { id: 4, title: 'Date & Time' },
  { id: 5, title: 'Expert' },
  { id: 6, title: 'Estimate' },
  { id: 7, title: 'Confirmation' },
];

export default function BookService() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Form Fields
  const [selectedServiceId, setSelectedServiceId] = useState(searchParams.get('service') || 'plumbing');
  const [problemTitle, setProblemTitle] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [photoPreviews, setPhotoPreviews] = useState([]);

  // Address
  const [streetAddress, setStreetAddress] = useState('Flat 402, Sunshine Heights, Sector 62');
  const [locality, setLocality] = useState('Indirapuram');
  const [city, setCity] = useState('Noida');
  const [postalCode, setPostalCode] = useState('201309');
  const [saveAddress, setSaveAddress] = useState(true);

  // Appointment Slot
  const [appointmentDate, setAppointmentDate] = useState('2026-10-06');
  const [appointmentTime, setAppointmentTime] = useState('10:00 AM - 12:00 PM');

  // Technician Selection
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(searchParams.get('technicianId') || '');
  const [techFilterRating, setTechFilterRating] = useState(0);

  // Error validation
  const [stepError, setStepError] = useState('');

  // Selected Objects
  const selectedService = SERVICE_CATEGORIES.find((s) => s.id === selectedServiceId) || SERVICE_CATEGORIES[0];
  const matchedTechnicians = DEMO_TECHNICIANS.filter((t) => {
    const matchesCat = t.category === selectedServiceId;
    const matchesRating = t.rating >= techFilterRating;
    return matchesCat && matchesRating;
  });
  
  // Pick active tech or first available matching tech
  const chosenTechnician = DEMO_TECHNICIANS.find((t) => t.id === selectedTechnicianId) || matchedTechnicians[0] || DEMO_TECHNICIANS[0];

  // Estimated Pricing calculations
  const visitingCharge = chosenTechnician?.visitingCharge || 199;
  const estimatedLaborCharge = selectedService?.startingPrice || 250;
  const estimatedMaterialCharge = 0; // Finalized upon physical diagnostic
  const estimatedGrandTotal = visitingCharge + estimatedLaborCharge + estimatedMaterialCharge;

  // Handle image upload previews
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removePhoto = (index) => {
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Step Validation & Progression
  const handleNext = () => {
    setStepError('');
    if (currentStep === 1) {
      if (!selectedServiceId) {
        setStepError('Please select a service trade category.');
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
  };

  const handleBack = () => {
    setStepError('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
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
      setCurrentStep(7); // Jump to Confirmation Step
    } catch (err) {
      setStepError('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-2">
      {/* Wizard Progress Stepper */}
      <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)] shadow-sm mb-6 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px] gap-2">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-[var(--success)] text-[#101512]'
                      : isCurrent
                      ? 'bg-[var(--primary)] text-[#101512] ring-4 ring-[rgba(212,239,105,0.2)]'
                      : 'bg-[var(--surface-raised)] text-[var(--text-muted)] border border-[var(--line)]'
                  }`}
                >
                  {isCompleted ? '✓' : step.id}
                </div>
                <span
                  className={`text-xs font-semibold whitespace-nowrap ${
                    isCurrent ? 'text-[var(--primary)]' : isCompleted ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {step.title}
                </span>
                {step.id !== STEPS.length && (
                  <div className={`h-0.5 w-6 sm:w-10 ${isCompleted ? 'bg-[var(--success)]' : 'bg-[var(--line)]'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {stepError && (
        <div className="bg-[var(--danger-bg)] border border-[var(--danger-border)] text-[var(--coral)] p-3 rounded-lg text-sm flex items-center gap-2 mb-4" role="alert">
          <AlertCircle size={16} />
          <span>{stepError}</span>
        </div>
      )}

      {/* STEP 1: Select Service Category */}
      {currentStep === 1 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-[var(--text)] mb-1">Step 1: Select Service Category</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">Choose the household repair or maintenance trade required.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {SERVICE_CATEGORIES.map((cat) => {
              const isSelected = selectedServiceId === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedServiceId(cat.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[var(--primary)] bg-[rgba(212,239,105,0.08)] shadow-sm'
                      : 'border-[var(--line)] hover:border-[rgba(241,242,233,0.2)] bg-[var(--surface-raised)]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-base text-[var(--text)]">{cat.name}</span>
                    {isSelected && <span className="text-[var(--primary)] text-sm font-bold">✓</span>}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mb-3">{cat.shortDesc}</p>
                  <div className="text-xs font-semibold text-[var(--primary)]">
                    Est. starts ₹{cat.startingPrice}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <Button variant="primary" onClick={handleNext} rightIcon={<ArrowRight size={16} />}>
              Proceed to Problem Details
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Describe Problem & Upload Photos */}
      {currentStep === 2 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-[var(--text)] mb-1">Step 2: Describe the Problem</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Detailed symptoms help our technicians arrive prepared with the right diagnostic tools and spare parts.
          </p>

          <div className="space-y-4 mb-6">
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

            {/* Multiple Photos Upload Preview */}
            <div className="border border-dashed border-[var(--line)] p-4 rounded-xl text-center bg-[var(--surface-raised)]">
              <Upload size={28} className="mx-auto text-[var(--text-muted)] mb-2" />
              <label className="cursor-pointer text-sm font-semibold text-[var(--primary)] hover:underline">
                <span>Upload Photos of the Issue (Optional)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
              <p className="text-xs text-[var(--text-light)] mt-1">PNG, JPG or JPEG up to 5MB each (multiple photos supported)</p>

              {photoPreviews.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4 justify-center">
                  {photoPreviews.map((imgSrc, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[var(--line)]">
                      <img src={imgSrc} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 bg-[var(--coral)] text-[#101512] rounded-full p-0.5 font-bold"
                        aria-label="Remove photo"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleBack} leftIcon={<ArrowLeft size={16} />}>
              Back
            </Button>
            <Button variant="primary" onClick={handleNext} rightIcon={<ArrowRight size={16} />}>
              Proceed to Doorstep Location
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Doorstep Location */}
      {currentStep === 3 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-[var(--text)] mb-1">Step 3: Doorstep Address & Location</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Where should the technician be dispatched? Designed for Google Maps Places API integration.
          </p>

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

            <label className="checkbox-label text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
              />
              <span>Save this location to My Addresses for 1-click future bookings</span>
            </label>

            {/* Google Maps Integration Ready Placeholder */}
            <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--line)] text-xs text-[var(--text-secondary)] flex items-start gap-3">
              <MapPin size={20} className="text-[var(--primary)] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[var(--text)] block">Map Geolocation Integration Ready:</span>
                This address block is structured to support Google Maps JavaScript API & Places Autocomplete in the upcoming release.
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleBack} leftIcon={<ArrowLeft size={16} />}>
              Back
            </Button>
            <Button variant="primary" onClick={handleNext} rightIcon={<ArrowRight size={16} />}>
              Select Appointment Slot
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: Preferred Appointment Slot */}
      {currentStep === 4 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-[var(--text)] mb-1">Step 4: Preferred Appointment Slot</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">Choose a date and convenient 2-hour inspection window.</p>

          <div className="space-y-6 mb-6">
            <div>
              <label className="input-label mb-2">Select Preferred Date *</label>
              <input
                type="date"
                className="input-control"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min="2026-10-04"
                required
              />
            </div>

            <div>
              <label className="input-label mb-2">Select Time Window *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  '08:00 AM - 10:00 AM',
                  '10:00 AM - 12:00 PM',
                  '12:00 PM - 02:00 PM',
                  '02:00 PM - 04:00 PM',
                  '04:00 PM - 06:00 PM',
                  '06:00 PM - 08:00 PM',
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setAppointmentTime(slot)}
                    className={`p-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                      appointmentTime === slot
                        ? 'border-[var(--primary)] bg-[rgba(212,239,105,0.12)] text-[var(--primary)] shadow-sm'
                        : 'border-[var(--line)] text-[var(--text-secondary)] bg-[var(--surface-raised)] hover:border-[rgba(241,242,233,0.2)]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleBack} leftIcon={<ArrowLeft size={16} />}>
              Back
            </Button>
            <Button variant="primary" onClick={handleNext} rightIcon={<ArrowRight size={16} />}>
              Choose Technician
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 5: Select Technician */}
      {currentStep === 5 && (
        <Card className="p-6">
          <div className="flex justify-between items-center flex-wrap gap-3 mb-1">
            <h2 className="text-xl font-bold text-[var(--text)]">Step 5: Choose Your Certified Expert</h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--text-muted)]">Filter rating:</span>
              <button
                type="button"
                className={`px-2 py-1 rounded ${techFilterRating === 0 ? 'bg-[var(--primary)] text-[#101512] font-bold' : 'bg-[var(--surface-raised)] text-[var(--text-muted)] border border-[var(--line)]'}`}
                onClick={() => setTechFilterRating(0)}
              >
                All
              </button>
              <button
                type="button"
                className={`px-2 py-1 rounded ${techFilterRating === 4.7 ? 'bg-[var(--primary)] text-[#101512] font-bold' : 'bg-[var(--surface-raised)] text-[var(--text-muted)] border border-[var(--line)]'}`}
                onClick={() => setTechFilterRating(4.7)}
              >
                4.7+ ★
              </button>
            </div>
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-6">Showing technicians qualified for {selectedService.name}.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {matchedTechnicians.length > 0 ? (
              matchedTechnicians.map((tech) => (
                <div
                  key={tech.id}
                  onClick={() => setSelectedTechnicianId(tech.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    (selectedTechnicianId || chosenTechnician?.id) === tech.id
                      ? 'border-[var(--primary)] bg-[rgba(212,239,105,0.08)] shadow-sm'
                      : 'border-[var(--line)] hover:border-[rgba(241,242,233,0.2)] bg-[var(--surface-raised)]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img src={tech.avatar} alt={tech.name} className="w-14 h-14 rounded-lg object-cover border border-[var(--line)]" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-[var(--text)] truncate">{tech.name}</h4>
                        <span className="text-xs font-bold text-[var(--primary)]">₹{tech.visitingCharge} fee</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">{tech.title}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span className="bg-[rgba(251,191,36,0.15)] text-[#fde68a] border border-[rgba(251,191,36,0.3)] px-1.5 py-0.5 rounded font-bold">★ {tech.rating}</span>
                        <span className="text-[var(--text-light)]">({tech.reviewsCount} reviews)</span>
                        <span className="text-[var(--text-light)]">•</span>
                        <span className="text-[var(--text-secondary)] font-medium">{tech.experience}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-6 text-[var(--text-muted)] text-sm">
                No matching technicians found for this specific filter.
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleBack} leftIcon={<ArrowLeft size={16} />}>
              Back
            </Button>
            <Button variant="primary" onClick={handleNext} rightIcon={<ArrowRight size={16} />}>
              Review Booking Summary
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 6: Booking Summary & Itemized Estimates */}
      {currentStep === 6 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-[var(--text)] mb-1">Step 6: Review & Finalize Booking</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Please verify your service details before submitting your appointment request.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Service & Technician Details */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--line)]">
                <span className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider">Requested Trade</span>
                <h4 className="text-base font-bold text-[var(--text)] mt-1">{selectedService.name}</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">Issue: {problemTitle}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{problemDescription}</p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--line)]">
                <span className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider">Assigned Professional</span>
                <div className="flex items-center gap-3 mt-2">
                  <img src={chosenTechnician.avatar} alt="" className="w-12 h-12 rounded-lg object-cover border border-[var(--line)]" />
                  <div>
                    <h5 className="font-bold text-sm text-[var(--text)]">{chosenTechnician.name}</h5>
                    <p className="text-xs text-[var(--text-muted)]">{chosenTechnician.title} • {chosenTechnician.experience}</p>
                    <span className="text-xs font-semibold text-[var(--primary)]">{chosenTechnician.availability}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--line)]">
                <span className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider">Appointment & Location</span>
                <div className="text-xs text-[var(--text-secondary)] mt-2 space-y-1">
                  <div className="font-semibold text-[var(--primary)]">{appointmentDate} at {appointmentTime}</div>
                  <div>{streetAddress}</div>
                  <div>{locality}, {city} - {postalCode}</div>
                </div>
              </div>
            </div>

            {/* Itemized Pricing Structure */}
            <div className="p-5 rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-[var(--text)] mb-4 pb-2 border-b border-[var(--line)]">
                  Estimated Price Breakdown
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-muted)]">Visiting & Diagnostic Fee:</span>
                    <span className="font-semibold text-[var(--text)]">₹{visitingCharge}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-muted)]">Estimated Repair Labor:</span>
                    <span className="font-semibold text-[var(--text)]">₹{estimatedLaborCharge}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-muted)]">Estimated Materials / Spare Parts:</span>
                    <span className="text-[var(--text-light)] italic text-xs">Finalized after inspection</span>
                  </div>

                  <div className="pt-3 border-t border-[var(--line)] flex justify-between items-center text-base">
                    <span className="font-bold text-[var(--text)]">Estimated Total:</span>
                    <span className="font-extrabold text-[var(--primary)] text-xl">₹{estimatedGrandTotal}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.2)] text-xs text-[#fde68a] leading-relaxed">
                  <strong>Notice:</strong> The technician will provide an upfront final quote for required spare parts and labor after physical on-site inspection. You will pay only upon job satisfaction.
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  onClick={handleConfirmBooking}
                  rightIcon={<CheckSquare size={18} />}
                >
                  Confirm & Request Service
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <Button variant="outline" onClick={handleBack} leftIcon={<ArrowLeft size={16} />}>
              Back
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 7: Confirmation & Booking Created */}
      {currentStep === 7 && confirmedBooking && (
        <Card className="p-8 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[rgba(212,239,105,0.15)] text-[var(--primary)] border border-[rgba(212,239,105,0.3)] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} />
          </div>

          <h2 className="text-2xl font-bold text-[var(--text)] mb-1">Booking Request Created!</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Your appointment has been registered and sent to {confirmedBooking.technicianName} for confirmation.
          </p>

          <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--line)] text-left mb-6 space-y-2 text-sm">
            <div className="flex justify-between border-b border-[var(--line)] pb-2">
              <span className="text-[var(--text-muted)]">Booking Reference ID:</span>
              <span className="font-mono font-bold text-[var(--primary)]">{confirmedBooking.id}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--line)] py-2">
              <span className="text-[var(--text-muted)]">Service:</span>
              <span className="font-semibold text-[var(--text)]">{confirmedBooking.serviceName}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--line)] py-2">
              <span className="text-[var(--text-muted)]">Appointment Slot:</span>
              <span className="font-semibold text-[var(--text)]">{confirmedBooking.appointmentDate} ({confirmedBooking.appointmentTime})</span>
            </div>
            <div className="flex justify-between pt-2">
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
        </Card>
      )}
    </div>
  );
}
