import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';
import { authApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import './Auth.css';

export default function OTPVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const state = location.state || {
    email: 'customer@homefix.demo',
    phone: '+91 98765 43210',
    role: 'customer',
    name: 'New HomeFix User',
  };

  const [otp, setOtp] = useState('123456'); // Pre-filled with demo OTP for instant ease
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      await authApi.verifyOtp(otp);
      // Auto login user into context
      await login(state.email, 'demo1234', state.role);

      if (state.role === 'technician') {
        navigate('/technician/dashboard', { replace: true });
      } else {
        navigate('/customer/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP code.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    setResendMessage('A new 6-digit verification code has been sent (Use 123456 for demo).');
    setTimeout(() => setResendMessage(''), 4000);
  };

  return (
    <div className="auth-page-root">
      <div className="auth-container">
        <div className="auth-brand-header">
          <div className="brand-icon mx-auto mb-3" style={{ margin: '0 auto 1rem' }}>
            <ShieldCheck size={24} />
          </div>
          <h1 className="auth-title">Verify Your Phone/Email</h1>
          <p className="auth-subtitle">
            We sent a verification code to <strong>{state.phone || state.email}</strong>
          </p>
        </div>

        <div className="auth-demo-notice">
          <AlertCircle size={15} />
          <span>
            <strong>Demo Code:</strong> Enter <strong>123456</strong> to proceed.
          </span>
        </div>

        <Card className="auth-card">
          {error && (
            <div className="auth-error-banner" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {resendMessage && (
            <div className="alert-box alert-success" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
              {resendMessage}
            </div>
          )}

          <form onSubmit={handleVerify}>
            <div className="mb-4 text-center">
              <label className="input-label justify-center mb-2">Enter 6-Digit One Time Password</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-control text-center text-2xl font-bold tracking-widest"
                style={{ letterSpacing: '0.4em' }}
                placeholder="123456"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isVerifying}
              rightIcon={<ArrowRight size={16} />}
              className="mt-2"
            >
              Verify & Complete Registration
            </Button>
          </form>

          <div className="flex items-center justify-between mt-6 pt-4 border-t text-xs">
            <span className="text-muted">Didn't receive code?</span>
            <button
              type="button"
              className="text-primary font-semibold flex items-center gap-1 hover:underline"
              onClick={handleResend}
            >
              <RotateCcw size={13} />
              <span>Resend OTP</span>
            </button>
          </div>

          <div className="auth-footer-prompt">
            <Link to="/register" className="text-muted text-xs">
              ← Change phone number or role
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
