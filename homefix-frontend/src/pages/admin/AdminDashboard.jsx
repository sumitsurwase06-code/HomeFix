import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  HardHat,
  UserCheck,
  Clock,
  CalendarCheck,
  CheckCircle,
  XCircle,
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Eye,
  Filter,
  Search,
  ChevronDown,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Sparkles,
  Award,
  AlertTriangle,
  Building2,
  FileCheck2,
  SlidersHorizontal,
  Download
} from 'lucide-react';
import { DEMO_TECHNICIANS } from '../../data/technicians';
import { DEMO_BOOKINGS } from '../../data/bookings';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import './AdminDashboard.css';

// Multi-Quarter & Monthly Revenue Datasets
const QUARTERLY_REVENUE_DATA = [
  {
    period: 'Q1 2026',
    platformRevenue: 76500,
    grossGMV: 765000,
    bookings: 210,
    growth: '+14.5%',
    trendUp: true,
    barHeight: '52%'
  },
  {
    period: 'Q2 2026',
    platformRevenue: 98000,
    grossGMV: 980000,
    bookings: 275,
    growth: '+28.1%',
    trendUp: true,
    barHeight: '66%'
  },
  {
    period: 'Q3 2026',
    platformRevenue: 124500,
    grossGMV: 1245000,
    bookings: 348,
    growth: '+27.0%',
    trendUp: true,
    barHeight: '84%'
  },
  {
    period: 'Q4 2026 (Est.)',
    platformRevenue: 148500,
    grossGMV: 1485000,
    bookings: 415,
    growth: '+19.3%',
    trendUp: true,
    barHeight: '100%'
  }
];

const MONTHLY_REVENUE_DATA = [
  { period: 'May 2026', platformRevenue: 31000, grossGMV: 310000, bookings: 88, growth: '+8.2%', barHeight: '48%' },
  { period: 'Jun 2026', platformRevenue: 36500, grossGMV: 365000, bookings: 102, growth: '+17.7%', barHeight: '58%' },
  { period: 'Jul 2026', platformRevenue: 40200, grossGMV: 402000, bookings: 114, growth: '+10.1%', barHeight: '64%' },
  { period: 'Aug 2026', platformRevenue: 43800, grossGMV: 438000, bookings: 122, growth: '+8.9%', barHeight: '70%' },
  { period: 'Sep 2026', platformRevenue: 46500, grossGMV: 465000, bookings: 130, growth: '+6.2%', barHeight: '75%' },
  { period: 'Oct 2026', platformRevenue: 51200, grossGMV: 512000, bookings: 144, growth: '+10.1%', barHeight: '85%' }
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Global Period Filter State
  const [selectedPeriod, setSelectedPeriod] = useState('This Quarter'); // 'Today' | 'This Week' | 'This Month' | 'This Quarter' | 'Previous Quarter' | 'This Year' | 'Previous Year'
  const [selectedQuarter, setSelectedQuarter] = useState('Q3'); // 'Q1' | 'Q2' | 'Q3' | 'Q4'

  // Revenue Chart Controls
  const [chartMode, setChartMode] = useState('quarter'); // 'quarter' | 'month'
  const [activeBarIndex, setActiveBarIndex] = useState(2); // Default to Q3 2026

  // Technician Performance Matrix Controls
  const [techSearch, setTechSearch] = useState('');
  const [tradeFilter, setTradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('revenue'); // 'revenue' | 'jobs' | 'acceptance' | 'completion' | 'rating'

  // Dynamic Technician Performance Dataset mapping
  const technicianMetrics = useMemo(() => {
    const rawMetrics = [
      {
        id: 'TECH-101',
        name: 'Rajesh Kumar',
        category: 'plumbing',
        avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80',
        rating: 4.8,
        status: 'Verified',
        jobsAssigned: 48,
        accepted: 43,
        declined: 5,
        completed: 39,
        revenueGenerated: 28400,
        experience: '8 Years'
      },
      {
        id: 'TECH-102',
        name: 'Amit Sharma',
        category: 'electrical',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        rating: 4.9,
        status: 'Verified',
        jobsAssigned: 42,
        accepted: 37,
        declined: 5,
        completed: 34,
        revenueGenerated: 24800,
        experience: '6 Years'
      },
      {
        id: 'TECH-104',
        name: 'Suresh Patel',
        category: 'appliance-repair',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
        rating: 4.8,
        status: 'Verified',
        jobsAssigned: 38,
        accepted: 35,
        declined: 3,
        completed: 32,
        revenueGenerated: 23500,
        experience: '7 Years'
      },
      {
        id: 'TECH-103',
        name: 'Vikram Saini',
        category: 'carpentry',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        rating: 4.7,
        status: 'Verified',
        jobsAssigned: 35,
        accepted: 33,
        declined: 2,
        completed: 31,
        revenueGenerated: 22100,
        experience: '10 Years'
      },
      {
        id: 'TECH-105',
        name: 'Manoj Verma',
        category: 'leakage-repair',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
        rating: 4.6,
        status: 'Verified',
        jobsAssigned: 28,
        accepted: 25,
        declined: 3,
        completed: 23,
        revenueGenerated: 18900,
        experience: '9 Years'
      },
      {
        id: 'TECH-106',
        name: 'Sunil Rao',
        category: 'other-maintenance',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
        rating: 4.5,
        status: 'Pending',
        jobsAssigned: 12,
        accepted: 9,
        declined: 3,
        completed: 8,
        revenueGenerated: 7200,
        experience: '4 Years'
      }
    ];

    // Compute derived rates
    return rawMetrics.map((t) => {
      const acceptanceRate = t.jobsAssigned > 0 ? ((t.accepted / t.jobsAssigned) * 100).toFixed(1) : '0.0';
      const completionRate = t.accepted > 0 ? ((t.completed / t.accepted) * 100).toFixed(1) : '0.0';
      const declineRate = t.jobsAssigned > 0 ? ((t.declined / t.jobsAssigned) * 100).toFixed(1) : '0.0';
      return {
        ...t,
        acceptanceRate: parseFloat(acceptanceRate),
        completionRate: parseFloat(completionRate),
        declineRate: parseFloat(declineRate)
      };
    });
  }, []);

  // Filtered & Sorted Technicians
  const filteredTechnicians = useMemo(() => {
    return technicianMetrics
      .filter((tech) => {
        const matchesSearch =
          tech.name.toLowerCase().includes(techSearch.toLowerCase()) ||
          tech.id.toLowerCase().includes(techSearch.toLowerCase()) ||
          tech.category.toLowerCase().includes(techSearch.toLowerCase());
        const matchesTrade = tradeFilter === 'all' || tech.category === tradeFilter;
        const matchesStatus = statusFilter === 'all' || tech.status === statusFilter;
        return matchesSearch && matchesTrade && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'revenue') return b.revenueGenerated - a.revenueGenerated;
        if (sortBy === 'jobs') return b.jobsAssigned - a.jobsAssigned;
        if (sortBy === 'acceptance') return b.acceptanceRate - a.acceptanceRate;
        if (sortBy === 'completion') return b.completionRate - a.completionRate;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [technicianMetrics, techSearch, tradeFilter, statusFilter, sortBy]);

  // Acceptance vs Decline Metrics (Calculated dynamically)
  const outcomeStats = useMemo(() => {
    const totalRequests = 520;
    const accepted = 430;
    const declined = 90;
    const completed = 390;
    const cancelled = 40;

    const acceptanceRate = ((accepted / totalRequests) * 100).toFixed(1);
    const declineRate = ((declined / totalRequests) * 100).toFixed(1);
    const completionRate = ((completed / accepted) * 100).toFixed(1);
    const cancellationRate = ((cancelled / accepted) * 100).toFixed(1);

    return {
      totalRequests,
      accepted,
      declined,
      completed,
      cancelled,
      acceptanceRate,
      declineRate,
      completionRate,
      cancellationRate
    };
  }, []);

  // Current active chart dataset
  const activeChartData = chartMode === 'quarter' ? QUARTERLY_REVENUE_DATA : MONTHLY_REVENUE_DATA;
  const currentChartItem = activeChartData[activeBarIndex] || activeChartData[0];

  const pendingTechs = DEMO_TECHNICIANS.filter((t) => t.status === 'Pending');

  return (
    <div className="admin-dashboard-container">
      {/* 1. Global Date & Period Filter Control Bar */}
      <div className="admin-control-bar">
        <div className="admin-title-group">
          <div className="admin-badge-row">
            <span className="admin-tag">Operations Console</span>
            <div className="admin-live-pulse">
              <span className="pulse-dot"></span>
              <span>Live Engine Connected</span>
            </div>
          </div>
          <h1 className="admin-heading">Executive Management Overview</h1>
          <p className="admin-subheading">
            Enterprise analytics, multi-quarter platform commission, and technician performance tracking.
          </p>
        </div>

        {/* Period Selector Controls */}
        <div className="filter-controls-group">
          <div className="period-select-wrapper">
            <span className="period-select-label">
              <Calendar size={13} />
              Period:
            </span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-dropdown"
              aria-label="Select reporting period"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month (Oct 2026)</option>
              <option value="This Quarter">This Quarter (Q3 2026)</option>
              <option value="Previous Quarter">Previous Quarter (Q2 2026)</option>
              <option value="This Year">This Year (2026)</option>
              <option value="Previous Year">Previous Year (2025)</option>
              <option value="Custom Range">Custom Date Range</option>
            </select>
          </div>

          {/* Quick Quarter Selector */}
          <div className="quarter-pills" title="Quick Quarter Jump">
            {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
              <button
                key={q}
                type="button"
                className={`quarter-pill-btn ${selectedQuarter === q ? 'active' : ''}`}
                onClick={() => {
                  setSelectedQuarter(q);
                  if (chartMode === 'quarter') {
                    const idx = ['Q1', 'Q2', 'Q3', 'Q4'].indexOf(q);
                    if (idx !== -1) setActiveBarIndex(idx);
                  }
                }}
              >
                {q} 2026
              </button>
            ))}
          </div>

          <Link to="/admin/revenue">
            <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>
              Export Report
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Platform Revenue Accounting Architecture Banner */}
      <div className="revenue-architecture-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Building2 size={20} style={{ color: 'var(--emerald-ink)' }} />
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--emerald-ink)' }}>
              HomeFix Revenue Separation Principle:
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginLeft: '0.35rem' }}>
              Platform recognizes only the 10% commission fee as operating revenue. Gross payments are disbursed to technicians.
            </span>
          </div>
        </div>

        <div className="revenue-flow-diagram">
          <div className="flow-node">
            <span className="flow-node-title">Customer Billing</span>
            <span className="flow-node-val">₹9,80,400</span>
          </div>
          <span className="flow-arrow">➔</span>
          <div className="flow-node">
            <span className="flow-node-title">Technician Payouts</span>
            <span className="flow-node-val">₹8,31,900</span>
          </div>
          <span className="flow-arrow">+</span>
          <div className="flow-node highlight">
            <span className="flow-node-title">Platform Net Revenue</span>
            <span className="flow-node-val">₹1,48,500</span>
          </div>
        </div>
      </div>

      {/* 3. Top 6 Primary KPI Cards */}
      <div className="kpi-grid">
        {/* KPI 1: Platform Revenue */}
        <div className="corporate-kpi-card primary">
          <div>
            <div className="kpi-card-header">
              <span className="kpi-label">Platform Net Revenue</span>
              <div className="kpi-icon-badge">
                <CircleDollarSign size={20} />
              </div>
            </div>
            <div className="kpi-value-display">₹1,48,500</div>
          </div>
          <div className="kpi-footer-row">
            <span className="kpi-trend positive">
              <TrendingUp size={13} />
              +18.4%
            </span>
            <span>vs previous quarter</span>
          </div>
        </div>

        {/* KPI 2: Total Bookings */}
        <div className="corporate-kpi-card info">
          <div>
            <div className="kpi-card-header">
              <span className="kpi-label">Total Job Bookings</span>
              <div className="kpi-icon-badge">
                <CalendarCheck size={20} />
              </div>
            </div>
            <div className="kpi-value-display">3,290</div>
          </div>
          <div className="kpi-footer-row">
            <span className="kpi-trend positive">
              <TrendingUp size={13} />
              +14.2%
            </span>
            <span>cumulative orders</span>
          </div>
        </div>

        {/* KPI 3: Job Fulfillment / Completion Rate */}
        <div className="corporate-kpi-card success">
          <div>
            <div className="kpi-card-header">
              <span className="kpi-label">Completion Fulfillment</span>
              <div className="kpi-icon-badge">
                <CheckCircle size={20} />
              </div>
            </div>
            <div className="kpi-value-display">{outcomeStats.completionRate}%</div>
          </div>
          <div className="kpi-footer-row">
            <span className="kpi-trend positive">
              <TrendingUp size={13} />
              2,950 Jobs
            </span>
            <span>completed smoothly</span>
          </div>
        </div>

        {/* KPI 4: Active & Verified Technicians */}
        <div className="corporate-kpi-card secondary">
          <div>
            <div className="kpi-card-header">
              <span className="kpi-label">Active Technicians</span>
              <div className="kpi-icon-badge">
                <HardHat size={20} />
              </div>
            </div>
            <div className="kpi-value-display">76 Verified</div>
          </div>
          <div className="kpi-footer-row">
            <span className="kpi-trend neutral">82 Total</span>
            <span>92.6% compliance</span>
          </div>
        </div>

        {/* KPI 5: Job Acceptance Rate */}
        <div className="corporate-kpi-card warning">
          <div>
            <div className="kpi-card-header">
              <span className="kpi-label">Job Acceptance Rate</span>
              <div className="kpi-icon-badge">
                <ShieldCheck size={20} />
              </div>
            </div>
            <div className="kpi-value-display">{outcomeStats.acceptanceRate}%</div>
          </div>
          <div className="kpi-footer-row">
            <span className="kpi-trend positive">
              <TrendingUp size={13} />
              430 Accepted
            </span>
            <span>of 520 total requests</span>
          </div>
        </div>

        {/* KPI 6: Pending Operational Actions */}
        <div className="corporate-kpi-card info">
          <div>
            <div className="kpi-card-header">
              <span className="kpi-label">Pending Operational Actions</span>
              <div className="kpi-icon-badge">
                <Clock size={20} />
              </div>
            </div>
            <div className="kpi-value-display">{pendingTechs.length + 6} Items</div>
          </div>
          <div className="kpi-footer-row">
            <Link to="/admin/verification" className="text-[var(--primary)] font-bold hover:underline">
              {pendingTechs.length} partner IDs to verify →
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Analytics Row: Quarter-wise Platform Revenue (Interactive) & Job Outcome Analytics */}
      <div className="analytics-dashboard-grid">
        {/* Left: Platform Revenue Interactive Quarter / Month Visualizer */}
        <div className="analytics-panel">
          <div className="panel-header-toolbar">
            <div>
              <h3 className="panel-title">
                <CircleDollarSign size={18} />
                Platform Revenue Performance
              </h3>
              <p className="panel-subtitle">
                Revenue generated strictly through HomeFix marketplace platform commission fees (10%).
              </p>
            </div>

            {/* View Toggle */}
            <div className="chart-toggle-group">
              <button
                type="button"
                className={`chart-toggle-btn ${chartMode === 'quarter' ? 'active' : ''}`}
                onClick={() => {
                  setChartMode('quarter');
                  setActiveBarIndex(2); // default Q3
                }}
              >
                Quarter-wise
              </button>
              <button
                type="button"
                className={`chart-toggle-btn ${chartMode === 'month' ? 'active' : ''}`}
                onClick={() => {
                  setChartMode('month');
                  setActiveBarIndex(5); // default Oct
                }}
              >
                Month-wise
              </button>
            </div>
          </div>

          {/* Pure CSS Interactive Bar Chart */}
          <div className="interactive-bar-chart-container">
            <div className="chart-grid-bars">
              {activeChartData.map((bar, idx) => {
                const isSelected = idx === activeBarIndex;
                return (
                  <div
                    key={bar.period}
                    className="chart-bar-column"
                    onClick={() => setActiveBarIndex(idx)}
                    title={`Click to inspect ${bar.period}`}
                  >
                    <span className="chart-bar-value-top">₹{(bar.platformRevenue / 1000).toFixed(1)}k</span>
                    <div
                      style={{ height: bar.barHeight }}
                      className={`chart-bar-pillar ${isSelected ? 'active-quarter' : ''}`}
                    />
                    <span className="chart-bar-label-bottom">{bar.period}</span>
                    <span className="chart-bar-sublabel">{bar.growth}</span>
                  </div>
                );
              })}
            </div>

            {/* Selected Period Itemized Drilldown */}
            <div className="chart-detail-summary-strip">
              <div className="detail-metric-box">
                <span className="detail-metric-title">Inspecting Period</span>
                <span className="detail-metric-num">{currentChartItem.period}</span>
              </div>
              <div className="detail-metric-box">
                <span className="detail-metric-title">Platform Net Revenue</span>
                <span className="detail-metric-num emerald">₹{currentChartItem.platformRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="detail-metric-box">
                <span className="detail-metric-title">Gross Customer GMV</span>
                <span className="detail-metric-num gold">₹{currentChartItem.grossGMV.toLocaleString('en-IN')}</span>
              </div>
              <div className="detail-metric-box">
                <span className="detail-metric-title">Job Bookings</span>
                <span className="detail-metric-num">{currentChartItem.bookings} fulfilled</span>
              </div>
              <div className="detail-metric-box">
                <span className="detail-metric-title">Period Growth</span>
                <span className="detail-metric-num" style={{ color: '#059669' }}>{currentChartItem.growth} QoQ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Job Requests Outcome & Acceptance vs Decline Widget */}
        <div className="analytics-panel">
          <div className="panel-header-toolbar">
            <div>
              <h3 className="panel-title">
                <ShieldCheck size={18} />
                Job Request Outcome
              </h3>
              <p className="panel-subtitle">Total received orders, acceptance throughput, and decline metrics.</p>
            </div>
          </div>

          <div className="outcomes-container">
            {/* Big Acceptance Card */}
            <div className="acceptance-ratio-card">
              <div className="ratio-header">
                <span className="kpi-label">Marketplace Acceptance Rate</span>
                <span className="text-xs font-bold text-[#059669] bg-[#d1fae5] px-2 py-0.5 rounded">
                  Healthy Target (&gt;80%)
                </span>
              </div>

              <div className="ratio-stat-block">
                <span className="ratio-big-percent">{outcomeStats.acceptanceRate}%</span>
                <span className="ratio-big-label">({outcomeStats.accepted} of {outcomeStats.totalRequests} Requests)</span>
              </div>

              {/* Segmented Bar Visualizer */}
              <div className="segmented-outcome-bar">
                <div
                  className="segmented-segment accepted"
                  style={{ width: `${outcomeStats.acceptanceRate}%` }}
                  title={`Accepted: ${outcomeStats.accepted} (${outcomeStats.acceptanceRate}%)`}
                />
                <div
                  className="segmented-segment declined"
                  style={{ width: `${outcomeStats.declineRate}%` }}
                  title={`Declined: ${outcomeStats.declined} (${outcomeStats.declineRate}%)`}
                />
              </div>

              {/* Outcome Legend Details */}
              <div className="outcome-legend-grid">
                <div className="legend-item-box">
                  <div className="legend-color-indicator accepted" />
                  <div className="legend-label-col">
                    <span>Accepted Jobs</span>
                    <span>{outcomeStats.accepted} ({outcomeStats.acceptanceRate}%)</span>
                  </div>
                </div>

                <div className="legend-item-box">
                  <div className="legend-color-indicator declined" />
                  <div className="legend-label-col">
                    <span>Declined Jobs</span>
                    <span>{outcomeStats.declined} ({outcomeStats.declineRate}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Downstream Fulfillment Lifecycle */}
            <div className="lifecycle-pipeline-box">
              <span className="kpi-label" style={{ marginBottom: '0.25rem' }}>
                Fulfillment of Accepted Jobs
              </span>

              <div className="pipeline-stage-row">
                <span className="font-semibold text-xs text-[var(--emerald-ink)]">Successfully Completed</span>
                <div className="pipeline-progress-track">
                  <div className="pipeline-progress-fill" style={{ width: `${outcomeStats.completionRate}%` }} />
                </div>
                <span className="font-bold text-xs">{outcomeStats.completed} ({outcomeStats.completionRate}%)</span>
              </div>

              <div className="pipeline-stage-row">
                <span className="font-semibold text-xs text-[#b91c1c]">Customer Cancelled</span>
                <div className="pipeline-progress-track">
                  <div className="pipeline-progress-fill" style={{ width: `${outcomeStats.cancellationRate}%`, backgroundColor: '#ef4444' }} />
                </div>
                <span className="font-bold text-xs">{outcomeStats.cancelled} ({outcomeStats.cancellationRate}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Technician Performance Section (Major Data Matrix) */}
      <div className="technician-performance-container">
        <div className="panel-header-toolbar">
          <div>
            <h3 className="panel-title">
              <HardHat size={18} />
              Technician Performance Matrix
            </h3>
            <p className="panel-subtitle">
              Jobs assigned, acceptance & completion rates, and platform commission generated per trade professional.
            </p>
          </div>

          <Link to="/admin/technicians">
            <Button variant="outline" size="sm">
              Manage All Technicians ({technicianMetrics.length})
            </Button>
          </Link>
        </div>

        {/* Toolbar: Search, Filters, and Sorting Controls */}
        <div className="table-toolbar-row">
          <div className="table-search-box">
            <Search size={15} className="table-search-icon" />
            <input
              type="text"
              placeholder="Search technician by name, ID, trade..."
              value={techSearch}
              onChange={(e) => setTechSearch(e.target.value)}
              className="table-search-input"
            />
          </div>

          <div className="table-filter-group">
            <select
              value={tradeFilter}
              onChange={(e) => setTradeFilter(e.target.value)}
              className="table-filter-select"
              aria-label="Filter by trade service"
            >
              <option value="all">All Trade Services</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="carpentry">Carpentry</option>
              <option value="appliance-repair">Appliance Repair</option>
              <option value="leakage-repair">Leakage & Waterproofing</option>
              <option value="other-maintenance">General Maintenance</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="table-filter-select"
              aria-label="Filter by verification status"
            >
              <option value="all">All Verification Statuses</option>
              <option value="Verified">Verified Partners</option>
              <option value="Pending">Pending Verification</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="table-filter-select"
              aria-label="Sort matrix"
            >
              <option value="revenue">Sort: Revenue Generated (High → Low)</option>
              <option value="jobs">Sort: Jobs Assigned (High → Low)</option>
              <option value="acceptance">Sort: Acceptance Rate (High → Low)</option>
              <option value="completion">Sort: Completion Rate (High → Low)</option>
              <option value="rating">Sort: Star Rating (High → Low)</option>
            </select>
          </div>
        </div>

        {/* Corporate Performance Table */}
        <div className="corporate-data-table-wrapper">
          <table className="corporate-data-table">
            <thead>
              <tr>
                <th>Technician</th>
                <th className="sortable" onClick={() => setSortBy('jobs')}>Assigned</th>
                <th>Accepted</th>
                <th>Declined</th>
                <th className="sortable" onClick={() => setSortBy('completion')}>Completed</th>
                <th className="sortable" onClick={() => setSortBy('revenue')}>Revenue Generated</th>
                <th className="sortable" onClick={() => setSortBy('acceptance')}>Acceptance Rate</th>
                <th>Completion Rate</th>
                <th>Verification</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTechnicians.map((tech) => (
                <tr key={tech.id}>
                  <td>
                    <div className="tech-cell-profile">
                      <img src={tech.avatar} alt={tech.name} className="tech-cell-avatar" />
                      <div>
                        <div className="tech-cell-name">{tech.name}</div>
                        <div className="tech-cell-sub">
                          <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{tech.id}</span>
                          <span>•</span>
                          <span style={{ textTransform: 'capitalize', color: 'var(--emerald-ink)', fontWeight: 600 }}>
                            {tech.category.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="font-bold">{tech.jobsAssigned}</td>
                  <td className="font-semibold text-[#059669]">{tech.accepted}</td>
                  <td className="font-semibold text-[#ef4444]">{tech.declined}</td>
                  <td className="font-bold text-[var(--text)]">{tech.completed}</td>
                  <td>
                    <span className="font-extrabold text-[var(--emerald-ink)]">
                      ₹{tech.revenueGenerated.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`rate-badge ${
                        tech.acceptanceRate >= 90 ? 'high' : tech.acceptanceRate >= 80 ? 'medium' : 'low'
                      }`}
                    >
                      {tech.acceptanceRate}%
                    </span>
                  </td>
                  <td>
                    <span
                      className={`rate-badge ${
                        tech.completionRate >= 90 ? 'high' : tech.completionRate >= 80 ? 'medium' : 'low'
                      }`}
                    >
                      {tech.completionRate}%
                    </span>
                  </td>
                  <td>
                    <Badge status={tech.status} size="sm" dot>
                      {tech.status}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/technicians/${tech.id}`}>
                      <Button variant="ghost" size="sm" leftIcon={<Eye size={13} />}>
                        Inspect
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Operational Actions & Live Dispatch Feed */}
      <div className="operational-action-grid">
        {/* Verification Queue Preview */}
        <div className="analytics-panel">
          <div className="panel-header-toolbar">
            <div>
              <h3 className="panel-title">
                <UserCheck size={18} />
                Partner Verification Queue
              </h3>
              <p className="panel-subtitle">New trade applicants requiring identity and certificate verification.</p>
            </div>
            <Badge status="Pending" dot>
              {pendingTechs.length} Pending
            </Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {DEMO_TECHNICIANS.slice(4, 6).map((tech) => (
              <div key={tech.id} className="action-item-card">
                <div className="action-item-meta">
                  <img src={tech.avatar} alt="" className="tech-cell-avatar" />
                  <div>
                    <div className="font-bold text-xs text-[var(--text)]">{tech.name}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{tech.title} • {tech.experience}</div>
                    <div className="text-[10px] text-[var(--text-light)]">{tech.serviceArea}</div>
                  </div>
                </div>

                <Link to="/admin/verification">
                  <Button variant="outline" size="sm">
                    Review ID
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <Link to="/admin/verification">
              <Button variant="primary" size="sm" fullWidth rightIcon={<ArrowRight size={14} />}>
                Open Verification Center
              </Button>
            </Link>
          </div>
        </div>

        {/* Live Dispatch & Open Bookings */}
        <div className="analytics-panel">
          <div className="panel-header-toolbar">
            <div>
              <h3 className="panel-title">
                <CalendarCheck size={18} />
                Live Dispatch Supervision
              </h3>
              <p className="panel-subtitle">High-priority ongoing bookings requiring operations supervision.</p>
            </div>
            <Link to="/admin/bookings" className="text-xs font-bold text-[var(--emerald-ink)] hover:underline">
              View All ({DEMO_BOOKINGS.length})
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {DEMO_BOOKINGS.slice(0, 2).map((b) => (
              <div key={b.id} className="action-item-card">
                <div className="action-item-meta">
                  <div className="action-item-icon">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--emerald-ink)]">{b.id}</span>
                      <Badge status={b.status} size="sm" dot>{b.status}</Badge>
                    </div>
                    <div className="font-semibold text-xs text-[var(--text)] mt-0.5">{b.serviceName}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      Customer: {b.customer.name} • Tech: {b.technicianName}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-xs text-[var(--text)]">₹{b.pricing.customerTotal}</div>
                  <Link to={`/admin/bookings/${b.id}`}>
                    <span className="text-[11px] text-[var(--primary)] font-bold hover:underline">Details →</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <Link to="/admin/bookings">
              <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight size={14} />}>
                Manage All Platform Dispatches
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
