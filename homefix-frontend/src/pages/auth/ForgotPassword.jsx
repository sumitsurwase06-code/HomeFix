import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="auth-page-root">
      <div className="auth-container">
        <div className="auth-brand-header">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">We will send a password reset link to your verified email</p>
        </div>

        <Card className="auth-card">
          {sent ? (
            <div className="text-center py-4">
              <div className="empty-state-icon-wrapper" style={{ margin: '0 auto 1.25rem', backgroundColor: 'rgba(74, 222, 128, 0.15)', color: 'var(--success-text)' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2">Check Your Inbox</h3>
              <p className="text-xs text-muted mb-6">
                If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
              </p>
              <Link to="/login">
                <Button variant="outline" size="sm" fullWidth>
                  Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Input
                label="Registered Email Address"
                type="email"
                required
                leftIcon={<Mail size={16} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<Send size={16} />}
                className="mt-4"
              >
                Send Reset Instructions
              </Button>

              <div className="mt-6 text-center">
                <Link to="/login" className="flex items-center justify-center gap-1 text-xs text-primary font-semibold">
                  <ArrowLeft size={14} />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
