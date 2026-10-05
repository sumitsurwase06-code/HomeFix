import React from 'react';
import { 
  Wrench, 
  ShieldCheck, 
  Users, 
  Target, 
  HeartHandshake, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Award
} from 'lucide-react';
import Card from '../../components/common/Card';

export default function About() {
  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '1080px' }}>
        <div className="section-header text-center">
          <span className="section-eyebrow">Our Vision & Quality Standard</span>
          <h1 className="section-title">About the HomeFix Platform</h1>
          <p className="section-subtitle">
            A modernized, technology-driven household maintenance marketplace providing reliable dispatch, verified professionals, and transparent pricing for every home.
          </p>
        </div>

        <Card className="p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold text-primary tracking-wider uppercase mb-2 block">The HomeFix Difference</span>
              <h2 className="text-2xl font-bold mb-4 font-serif">Transforming Home Services Into a Frictionless Experience</h2>
              <p className="text-secondary leading-relaxed mb-4">
                Finding dependable, skilled, and honest household technicians has historically been characterized by arbitrary quotes, lack of identity verification, and uncertain arrival windows.
              </p>
              <p className="text-secondary leading-relaxed">
                HomeFix bridges this gap by combining stringent background screening, standardized service pricing, and modern digital booking into one seamless, trustworthy platform.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-lg bg-surface-raised border border-champagne-dark text-center">
                <div className="text-3xl font-bold text-primary font-serif mb-1">99.4%</div>
                <div className="text-xs text-muted font-medium">On-Time Arrival Rate</div>
              </div>
              <div className="p-5 rounded-lg bg-surface-raised border border-champagne-dark text-center">
                <div className="text-3xl font-bold text-primary font-serif mb-1">100%</div>
                <div className="text-xs text-muted font-medium">Background Verified</div>
              </div>
              <div className="p-5 rounded-lg bg-surface-raised border border-champagne-dark text-center">
                <div className="text-3xl font-bold text-primary font-serif mb-1">4.9★</div>
                <div className="text-xs text-muted font-medium">Customer Rating</div>
              </div>
              <div className="p-5 rounded-lg bg-surface-raised border border-champagne-dark text-center">
                <div className="text-3xl font-bold text-primary font-serif mb-1">30-Day</div>
                <div className="text-xs text-muted font-medium">Service Guarantee</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stakeholder Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-primary mb-3">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">For Homeowners</h3>
            <p className="text-sm text-secondary leading-relaxed">
              Book doorstep repair in under 60 seconds with upfront estimates, verified customer reviews, and clear appointment tracking.
            </p>
          </Card>

          <Card className="p-6">
            <div className="text-primary mb-3">
              <Wrench size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">For Service Partners</h3>
            <p className="text-sm text-secondary leading-relaxed">
              Empowering local master tradespeople with digital dispatch, reliable booking slots, and guaranteed transparent payouts.
            </p>
          </Card>

          <Card className="p-6">
            <div className="text-primary mb-3">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">Trust & Safety First</h3>
            <p className="text-sm text-secondary leading-relaxed">
              Rigorous government ID verification, hands-on skill audits, standardized safety protocols, and comprehensive quality assurance.
            </p>
          </Card>
        </div>

        {/* Core Principles */}
        <Card className="p-8 bg-surface-raised border border-champagne-dark">
          <h3 className="text-xl font-bold mb-6 font-serif text-center">Our Operating Principles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <CheckCircle2 size={20} className="text-primary shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold mb-1">Transparent Pricing</h4>
                <p className="text-xs text-secondary">No hidden travel fees or sudden surcharges. You approve quotes before work begins.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock size={20} className="text-primary shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold mb-1">Guaranteed Punctuality</h4>
                <p className="text-xs text-secondary">We respect your time. Verified pros arrive precisely within your chosen calendar window.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Award size={20} className="text-primary shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold mb-1">Workmanship Warranty</h4>
                <p className="text-xs text-secondary">Every repair job is backed by our standard 30-day HomeFix service protection policy.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
