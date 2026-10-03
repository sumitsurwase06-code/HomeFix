import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '960px' }}>
        <div className="section-header text-center">
          <span className="section-eyebrow">Get In Touch</span>
          <h1 className="section-title">Contact Support & Inquiries</h1>
          <p className="section-subtitle">
            Have questions about booking a technician or partnering with HomeFix? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="flex flex-col gap-4">
            <Card className="p-6">
              <Mail size={24} className="text-primary mb-2" />
              <h4 className="font-bold text-base mb-1">Email Us</h4>
              <p className="text-xs text-muted mb-2">For platform support & project inquiries</p>
              <a href="mailto:support@homefix.demo" className="text-sm font-semibold text-primary">
                support@homefix.demo
              </a>
            </Card>

            <Card className="p-6">
              <Phone size={24} className="text-secondary mb-2" />
              <h4 className="font-bold text-base mb-1">Call Center</h4>
              <p className="text-xs text-muted mb-2">Mon - Sat from 8am to 8pm</p>
              <span className="text-sm font-semibold text-text-primary">
                +91 (800) 466-3349
              </span>
            </Card>

            <Card className="p-6">
              <MapPin size={24} className="text-warning mb-2" />
              <h4 className="font-bold text-base mb-1">Headquarters</h4>
              <p className="text-xs text-secondary leading-relaxed">
                Academic Campus, Computer Science & Engineering Department, Greater Noida, India
              </p>
            </Card>
          </div>

          {/* Form */}
          <Card className="p-8" style={{ gridColumn: 'span 2' }}>
            {submitted ? (
              <div className="text-center py-8">
                <div className="empty-state-icon-wrapper" style={{ margin: '0 auto 1.5rem', backgroundColor: 'rgba(74, 222, 128, 0.15)', color: 'var(--success-text)' }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent Successfully!</h3>
                <p className="text-muted text-sm mb-6">
                  Thank you for reaching out. Our support team will review your inquiry shortly.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-lg font-bold mb-4">Send Us a Direct Message</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <Input
                  label="Subject"
                  required
                  placeholder="How can we assist you?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />

                <div className="input-group">
                  <label className="input-label">
                    Message Details <span className="input-required">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    className="input-control"
                    placeholder="Write your query or message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" fullWidth rightIcon={<Send size={16} />}>
                  Submit Inquiry
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
