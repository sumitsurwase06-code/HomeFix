import React from 'react';
import { Wrench, ShieldCheck, Users, Target, HeartHandshake, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';

export default function About() {
  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '960px' }}>
        <div className="section-header text-center">
          <span className="section-eyebrow">Our Mission & Architecture</span>
          <h1 className="section-title">About the HomeFix Platform</h1>
          <p className="section-subtitle">
            A modernized, full-stack household maintenance marketplace solving urban repair bottlenecks through digital dispatch and transparent pricing.
          </p>
        </div>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">The Problem HomeFix Solves</h2>
          <p className="text-secondary leading-relaxed mb-4">
            Finding dependable, skilled, and honest household technicians has traditionally been an informal, unstandardized process characterized by arbitrary pricing, lack of background checks, and unreliable arrival times.
          </p>
          <p className="text-secondary leading-relaxed">
            HomeFix bridges this gap by unifying customer demand, verified technician dispatching, and administrative oversight under a unified full-stack web architecture.
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-primary mb-3">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">For Customers</h3>
            <p className="text-sm text-secondary">
              Book doorstep service in 60 seconds with itemized estimates, photo uploads, and verified ratings.
            </p>
          </Card>

          <Card className="p-6">
            <div className="text-secondary mb-3">
              <Wrench size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">For Technicians</h3>
            <p className="text-sm text-secondary">
              Empowering local tradespeople with digital job dispatch, flexible calendar slots, and transparent payout tracking.
            </p>
          </Card>

          <Card className="p-6">
            <div className="text-warning mb-3">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">For Platform Admins</h3>
            <p className="text-sm text-secondary">
              Rigorous technician identity verification, commission settlement, service catalog controls, and audit trails.
            </p>
          </Card>
        </div>

        <Card className="p-6 bg-alt border-dashed">
          <h3 className="text-base font-bold mb-2 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-success" />
            <span>Academic Capstone Context</span>
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            This platform is developed as a Major BTech Capstone Project. The frontend is modularized in React with Vite and Axios to cleanly interface with an enterprise Java Spring Boot REST API and MySQL database.
          </p>
        </Card>
      </div>
    </div>
  );
}
