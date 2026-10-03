import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Star, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { DEMO_BOOKINGS } from '../../data/bookings';
import { reviewApi } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function WriteReview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId') || DEMO_BOOKINGS[2].id;

  const booking = DEMO_BOOKINGS.find((b) => b.id === bookingId) || DEMO_BOOKINGS[2];

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reviewApi.submitReview({
        bookingId: booking.id,
        technicianId: booking.technicianId,
        rating,
        comment,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper max-w-3xl" style={{ margin: '0 auto' }}>
      <Link to="/customer/bookings" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
        <ArrowLeft size={16} />
        <span>Back to Bookings</span>
      </Link>

      <Card className="p-8" style={{ padding: '2rem' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(74, 222, 128, 0.15)', color: 'var(--success-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Thank You for Your Feedback!</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Your verified review helps other homeowners and rewards our skilled technicians.
            </p>
            <Button variant="primary" onClick={() => navigate('/customer/bookings')}>
              Return to Bookings
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview}>
            <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>Rate Your Service Experience</h1>
            <p className="page-subtitle" style={{ marginBottom: '1.5rem' }}>
              Booking Ref: <strong style={{ color: 'var(--primary)' }}>{booking.id}</strong> • Technician: <strong style={{ color: 'var(--text)' }}>{booking.technicianName}</strong>
            </p>

            {/* Star Selector */}
            <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'var(--surface-raised)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                Overall Rating
              </span>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    style={{ padding: '0.25rem', cursor: 'pointer', transition: 'transform 0.2s', background: 'none', border: 'none' }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      size={32}
                      className={
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted'
                      }
                      style={{ color: (hoverRating || rating) >= star ? '#fbbf24' : 'rgba(241, 242, 233, 0.2)', fill: (hoverRating || rating) >= star ? '#fbbf24' : 'none' }}
                    />
                  </button>
                ))}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.75rem', display: 'block' }}>
                {rating === 5 ? 'Excellent (5.0)' :
                 rating === 4 ? 'Good (4.0)' :
                 rating === 3 ? 'Average (3.0)' :
                 rating === 2 ? 'Below Average (2.0)' : 'Poor (1.0)'}
              </span>
            </div>

            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label className="input-label">Detailed Feedback & Work Quality Review</label>
              <textarea
                rows={4}
                required
                className="input-control"
                placeholder="How was the technician's punctuality, repair skill, and cleanliness? Did they explain the charges clearly?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={loading}
              rightIcon={<Send size={16} />}
            >
              Submit Verified Review
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
