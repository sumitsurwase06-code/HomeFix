import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Star,
  FileText
} from 'lucide-react';
import { DEMO_BOOKINGS } from '../../data/bookings';
import { paymentApi, bookingApi } from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ErrorState from '../../components/common/ErrorState';

const STATUS_STEPS = [
  'Requested',
  'Accepted',
  'Scheduled',
  'On the Way',
  'In Progress',
  'Completed',
];

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(() => {
    return DEMO_BOOKINGS.find((b) => b.id === id) || DEMO_BOOKINGS[0];
  });

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!booking) {
    return (
      <ErrorState
        title="Booking Not Found"
        message={`We could not locate booking reference "${id}".`}
        onRetry={() => navigate('/customer/bookings')}
        retryLabel="Back to Bookings"
      />
    );
  }

  const currentStatusIndex = STATUS_STEPS.indexOf(booking.status);

  // Mock Payment handler
  const handlePayment = async () => {
    setIsPaying(true);
    try {
      await paymentApi.processMockPayment(booking.id, booking.pricing.customerTotal);
      setBooking((prev) => ({
        ...prev,
        paymentStatus: 'Paid',
      }));
      setPaymentSuccess(true);
      setTimeout(() => {
        setIsPayModalOpen(false);
        setPaymentSuccess(false);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPaying(false);
    }
  };

  // Cancel Booking handler
  const handleCancelBooking = async () => {
    await bookingApi.updateStatus(booking.id, 'Cancelled', 'Cancelled by customer');
    setBooking((prev) => ({
      ...prev,
      status: 'Cancelled',
    }));
    setIsCancelModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link to="/customer/bookings" className="flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] hover:underline">
          <ArrowLeft size={16} />
          <span>Back to All Bookings</span>
        </Link>
        <div className="flex items-center gap-2">
          <Badge status={booking.status} dot size="md">{booking.status}</Badge>
          <Badge status={booking.paymentStatus === 'Paid' ? 'Paid' : 'Pending'} size="md">
            Pay: {booking.paymentStatus}
          </Badge>
        </div>
      </div>

      {/* Booking Header Card */}
      <Card className="p-6">
        <div className="flex justify-between items-start flex-wrap gap-4 border-b border-[var(--line)] pb-4 mb-4">
          <div>
            <span className="text-xs font-mono font-bold text-[var(--primary)] bg-[rgba(212,239,105,0.1)] border border-[rgba(212,239,105,0.25)] px-2 py-1 rounded">
              {booking.id}
            </span>
            <h1 className="text-2xl font-bold text-[var(--text)] mt-2">{booking.serviceName}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">{booking.problemTitle}</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-[var(--text-muted)] uppercase font-semibold">Total Amount</span>
            <div className="text-2xl font-extrabold text-[var(--primary)]">₹{booking.pricing.customerTotal}</div>
          </div>
        </div>

        {/* Status Lifecycle Stepper Tracker */}
        {booking.status !== 'Cancelled' ? (
          <div className="py-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">
              Real-time Service Progress
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = currentStatusIndex >= idx;
                const isCurrent = booking.status === step;
                return (
                  <div
                    key={step}
                    className={`p-2.5 rounded-lg border text-center text-xs transition-all ${
                      isCurrent
                        ? 'border-[var(--primary)] bg-[rgba(212,239,105,0.12)] text-[var(--primary)] font-bold shadow-sm'
                        : isPassed
                        ? 'border-[rgba(74,222,128,0.3)] bg-[rgba(74,222,128,0.08)] text-[var(--success-text)] font-medium'
                        : 'border-[var(--line)] text-[var(--text-light)] bg-[var(--surface-raised)]'
                    }`}
                  >
                    <div className="mb-1 text-base">{isPassed ? '✓' : idx + 1}</div>
                    <div>{step}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-3 bg-[var(--danger-bg)] border border-[var(--danger-border)] text-[var(--coral)] text-sm rounded-lg flex items-center gap-2">
            <AlertTriangle size={18} />
            <span>This booking has been cancelled.</span>
          </div>
        )}
      </Card>

      {/* Grid: Details & Pricing Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Appointment & Problem */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-base text-[var(--text)] mb-3">Appointment & Address</h3>
            <div className="space-y-2 text-sm text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[var(--text-muted)]" />
                <span>Date: <strong className="text-[var(--text)]">{booking.appointmentDate}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[var(--text-muted)]" />
                <span>Time Slot: <strong className="text-[var(--text)]">{booking.appointmentTime}</strong></span>
              </div>
              <div className="flex items-start gap-2 pt-2 border-t border-[var(--line)] mt-2">
                <MapPin size={16} className="text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
                <span>{booking.address.street}, {booking.address.locality}, {booking.address.city} - {booking.address.postalCode}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-base text-[var(--text)] mb-3">Assigned Technician</h3>
            <div className="flex items-center gap-3">
              <img src={booking.technicianAvatar} alt="" className="w-12 h-12 rounded-lg object-cover border border-[var(--line)]" />
              <div>
                <h4 className="font-bold text-sm text-[var(--text)]">{booking.technicianName}</h4>
                <p className="text-xs text-[var(--text-muted)]">ID: {booking.technicianId}</p>
                <Link to={`/technicians/${booking.technicianId}`} className="text-xs text-[var(--primary)] font-semibold hover:underline">
                  View Full Profile
                </Link>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-base text-[var(--text)] mb-2">Problem Description</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
              {booking.problemDescription}
            </p>

            {booking.problemImages && booking.problemImages.length > 0 && (
              <div>
                <span className="text-xs text-[var(--text-muted)] font-semibold block mb-2">Uploaded Inspection Photos:</span>
                <div className="flex gap-2">
                  {booking.problemImages.map((src, i) => (
                    <img key={i} src={src} alt="Issue attachment" className="w-16 h-16 rounded-lg object-cover border border-[var(--line)]" />
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right: Itemized Financial Breakdown & Actions */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-base text-[var(--text)] mb-3 pb-2 border-b border-[var(--line)]">
              Itemized Invoice Summary
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Visiting / Inspection Fee:</span>
                <span className="font-semibold text-[var(--text)]">₹{booking.pricing.visitingCharge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Repair Labor Charges:</span>
                <span className="font-semibold text-[var(--text)]">₹{booking.pricing.repairLabor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Spare Parts & Material:</span>
                <span className="font-semibold text-[var(--text)]">₹{booking.pricing.materialCharge}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[var(--line)] text-base font-bold text-[var(--text)]">
                <span>Customer Total:</span>
                <span className="text-[var(--primary)]">₹{booking.pricing.customerTotal}</span>
              </div>
              <div className="flex justify-between pt-1 text-xs text-[var(--text-muted)]">
                <span>Payment Status:</span>
                <Badge status={booking.paymentStatus === 'Paid' ? 'Paid' : 'Pending'}>
                  {booking.paymentStatus}
                </Badge>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-col gap-2">
              {booking.paymentStatus === 'Pending' && booking.status !== 'Cancelled' && (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setIsPayModalOpen(true)}
                  leftIcon={<CreditCard size={16} />}
                >
                  Pay Now (₹{booking.pricing.customerTotal})
                </Button>
              )}

              {booking.status === 'Completed' && (
                <Link to={`/customer/reviews?bookingId=${booking.id}`}>
                  <Button variant="outline" fullWidth leftIcon={<Star size={16} />}>
                    Write a Review
                  </Button>
                </Link>
              )}

              {booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
                <Button
                  variant="ghost"
                  fullWidth
                  className="text-danger"
                  onClick={() => setIsCancelModalOpen(true)}
                >
                  Cancel Booking
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Pay Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Simulated Payment Gateway"
        subtitle="Prototype payment gateway test (No real money deducted)"
      >
        {paymentSuccess ? (
          <div className="text-center py-6">
            <CheckCircle2 size={42} className="text-[var(--primary)] mx-auto mb-3" />
            <h4 className="font-bold text-lg text-[var(--text)]">Payment Completed!</h4>
            <p className="text-xs text-[var(--text-muted)]">Receipt generated and status marked as Paid.</p>
          </div>
        ) : (
          <div>
            <div className="p-4 bg-[var(--surface-raised)] border border-[var(--line)] rounded-xl mb-4 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Booking Reference:</span>
                <span className="font-mono font-bold text-[var(--primary)]">{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Amount to Pay:</span>
                <span className="font-bold text-[var(--primary)]">₹{booking.pricing.customerTotal}</span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] mb-4">
              In production, this modal will connect to Razorpay / Stripe gateway using Spring Boot backend webhook tokens.
            </p>

            <Button
              variant="primary"
              fullWidth
              isLoading={isPaying}
              onClick={handlePayment}
            >
              Complete Mock Payment
            </Button>
          </div>
        )}
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Appointment"
        subtitle="Are you sure you want to cancel this booking?"
      >
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          This will notify technician {booking.technicianName} that the appointment is no longer required.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>
            Keep Booking
          </Button>
          <Button variant="danger" onClick={handleCancelBooking}>
            Confirm Cancellation
          </Button>
        </div>
      </Modal>
    </div>
  );
}
