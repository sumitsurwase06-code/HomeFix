import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Wrench, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS } from '../../data/demoUsers';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('customer@homefix.demo');
  const [password, setPassword] = useState('demo1234');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        const role = result.user.role;
        const redirectPath = location.state?.from?.pathname || (
          role === 'admin' ? '/admin/dashboard' :
          role === 'technician' ? '/technician/dashboard' :
          '/customer/dashboard'
        );
        navigate(redirectPath, { replace: true });
      } else {
        setError(result.error || 'Failed to authenticate.');
      }
    } catch (err) {
      setError('An unexpected error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick 1-click credential autofill for viva presentation
  const setDemoPersona = (demoUser) => {
    setEmail(demoUser.email);
    setPassword('demo1234');
    setError('');
  };

  return (
    <div className="auth-page-root">
      <div className="auth-container">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <Link to="/" className="auth-brand-logo">
            <div className="brand-icon">
              <Wrench size={20} />
            </div>
            <span>HomeFix</span>
          </Link>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to manage your household bookings or technician dashboard</p>
        </div>

        {/* Quick Test Persona Selector */}
        <div className="demo-persona-grid mb-4">
          {DEMO_USERS.map((u) => (
            <button
              key={u.id}
              type="button"
              className={`persona-card ${email === u.email ? 'active' : ''}`}
              onClick={() => setDemoPersona(u)}
            >
              <span className="persona-role">{u.role}</span>
              <span className="persona-name">{u.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        <Card className="auth-card">
          {error && (
            <div className="auth-error-banner" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <Input
              label="Email Address or Phone"
              type="email"
              required
              leftIcon={<Mail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              type="password"
              required
              leftIcon={<Lock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <div className="auth-options-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <Link to="/forgot-password" className="auth-link-sm">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={<LogIn size={16} />}
              className="mt-4"
            >
              Sign In to Account
            </Button>
          </form>

          <div className="auth-footer-prompt">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link-bold">
              Register as Customer or Technician
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
