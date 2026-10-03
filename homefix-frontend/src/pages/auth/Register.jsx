import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Wrench, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { authApi } from '../../services/api';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import './Auth.css';

export default function Register() {
  const [role, setRole] = useState('customer'); // 'customer' | 'technician'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tradeCategory, setTradeCategory] = useState('plumbing');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authApi.register({
        name: fullName,
        email,
        phone,
        role,
        tradeCategory: role === 'technician' ? tradeCategory : undefined,
      });

      // Navigate to OTP verification step with state
      navigate('/verify-otp', {
        state: {
          email,
          phone,
          role,
          name: fullName,
        },
      });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-root">
      <div className="auth-container">
        <div className="auth-brand-header">
          <Link to="/" className="auth-brand-logo">
            <div className="brand-icon">
              <Wrench size={20} />
            </div>
            <span>HomeFix</span>
          </Link>
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">Join HomeFix to book home repairs or earn as a certified technician</p>
        </div>

        <Card className="auth-card">
          {error && (
            <div className="auth-error-banner" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Role Selection */}
            <div className="mb-4">
              <label className="input-label mb-2">I am registering as:</label>
              <div className="role-selector-box">
                <div
                  className={`role-radio-card ${role === 'customer' ? 'selected' : ''}`}
                  onClick={() => setRole('customer')}
                  role="button"
                  tabIndex={0}
                >
                  <User size={22} className="role-icon" />
                  <span className="role-label-title">Customer</span>
                  <span className="role-label-desc">Book household repairs</span>
                </div>

                <div
                  className={`role-radio-card ${role === 'technician' ? 'selected' : ''}`}
                  onClick={() => setRole('technician')}
                  role="button"
                  tabIndex={0}
                >
                  <Wrench size={22} className="role-icon" />
                  <span className="role-label-title">Technician</span>
                  <span className="role-label-desc">Offer maintenance services</span>
                </div>
              </div>
            </div>

            <Input
              label="Full Legal Name"
              required
              leftIcon={<User size={16} />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Email Address"
                type="email"
                required
                leftIcon={<Mail size={16} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />

              <Input
                label="Phone Number"
                type="tel"
                required
                leftIcon={<Phone size={16} />}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            {role === 'technician' && (
              <div className="input-group mb-4">
                <label className="input-label">Primary Trade Skill / Category *</label>
                <select
                  className="input-control"
                  value={tradeCategory}
                  onChange={(e) => setTradeCategory(e.target.value)}
                  required
                >
                  <option value="plumbing">Plumbing Services</option>
                  <option value="electrical">Electrical & Wiring</option>
                  <option value="carpentry">Carpentry & Hardware</option>
                  <option value="appliance-repair">Appliance Servicing</option>
                  <option value="leakage-repair">Leakage & Waterproofing</option>
                  <option value="painting">Painting</option>
                  <option value="cleaning">Deep Cleaning</option>
                </select>
                <p className="input-helper-msg">
                  * Note: Technicians undergo admin verification before going live.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Password"
                type="password"
                required
                leftIcon={<Lock size={16} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
              />

              <Input
                label="Confirm Password"
                type="password"
                required
                leftIcon={<Lock size={16} />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={<ArrowRight size={16} />}
              className="mt-2"
            >
              Continue to OTP Verification
            </Button>
          </form>

          <div className="auth-footer-prompt">
            Already have an account?{' '}
            <Link to="/login" className="auth-link-bold">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
