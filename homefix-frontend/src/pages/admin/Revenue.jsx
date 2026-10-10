import React, { useState, useMemo } from 'react';
import { useToast } from '../../context/ToastContext';
import {
  CircleDollarSign,
  TrendingUp,
  ArrowUpRight,
  Receipt,
  Download,
  Calendar,
  Search,
  X,
  SlidersHorizontal,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  Percent,
  Layers,
  PieChart,
  BarChart3
} from 'lucide-react';
import './AdminDashboard.css';

// Initial verified admin revenue transaction records
const ALL_REVENUE_LEDGER = [
  {
    id: 1,
    bookingRef: 'HF-BK-8903',
    service: 'Appliance & Geyser Repair',
    customer: 'Rohan Sharma',
    locality: 'Sector 62, Noida',
    date: '2026-10-02',
    displayDate: '02 Oct 2026',
    monthKey: '2026-10',
    quarterKey: 'Q3-2026',
    visitingFee: 249,
    repairLabor: 450,
    materialCharge: 550,
    customerTotal: 1249,
    platformFee: 125, // 10%
    paymentStatus: 'Paid'
  },
  {
    id: 2,
    bookingRef: 'HF-BK-8901',
    service: 'Plumbing Leakage & Mixer Cartridge',
    customer: 'Pooja Verma',
    locality: 'Indirapuram, Ghaziabad',
    date: '2026-10-01',
    displayDate: '01 Oct 2026',
    monthKey: '2026-10',
    quarterKey: 'Q3-2026',
    visitingFee: 199,
    repairLabor: 350,
    materialCharge: 220,
    customerTotal: 769,
    platformFee: 70,
    paymentStatus: 'Escrow Held'
  },
  {
    id: 3,
    bookingRef: 'HF-BK-8902',
    service: 'Electrical Short Circuit Inspection',
    customer: 'Amit Sharma',
    locality: 'Sector 18, Noida',
    date: '2026-09-28',
    displayDate: '28 Sep 2026',
    monthKey: '2026-09',
    quarterKey: 'Q3-2026',
    visitingFee: 199,
    repairLabor: 0,
    materialCharge: 0,
    customerTotal: 199,
    platformFee: 20,
    paymentStatus: 'Escrow Held'
  },
  {
    id: 4,
    bookingRef: 'HF-BK-8850',
    service: 'Main Pipeline Overhaul',
    customer: 'Aditi Nair',
    locality: 'Vaishali, Ghaziabad',
    date: '2026-09-24',
    displayDate: '24 Sep 2026',
    monthKey: '2026-09',
    quarterKey: 'Q3-2026',
    visitingFee: 199,
    repairLabor: 450,
    materialCharge: 0,
    customerTotal: 649,
    platformFee: 65,
    paymentStatus: 'Paid'
  },
  {
    id: 5,
    bookingRef: 'HF-BK-8792',
    service: 'Geyser Thermostat Replacement',
    customer: 'Sunil Mathur',
    locality: 'Sector 50, Noida',
    date: '2026-09-18',
    displayDate: '18 Sep 2026',
    monthKey: '2026-09',
    quarterKey: 'Q3-2026',
    visitingFee: 199,
    repairLabor: 500,
    materialCharge: 300,
    customerTotal: 999,
    platformFee: 100,
    paymentStatus: 'Paid'
  },
  {
    id: 6,
    bookingRef: 'HF-BK-8710',
    service: 'Submersible Pump Valve Fitting',
    customer: 'Vikram Mehta',
    locality: 'Sector 76, Noida',
    date: '2026-09-10',
    displayDate: '10 Sep 2026',
    monthKey: '2026-09',
    quarterKey: 'Q3-2026',
    visitingFee: 249,
    repairLabor: 600,
    materialCharge: 550,
    customerTotal: 1399,
    platformFee: 140,
    paymentStatus: 'Processing'
  },
  {
    id: 7,
    bookingRef: 'HF-BK-8640',
    service: 'Kitchen Sink Drain Cleaning',
    customer: 'Meera Deshmukh',
    locality: 'Sector 137, Noida',
    date: '2026-08-28',
    displayDate: '28 Aug 2026',
    monthKey: '2026-08',
    quarterKey: 'Q3-2026',
    visitingFee: 199,
    repairLabor: 600,
    materialCharge: 0,
    customerTotal: 799,
    platformFee: 80,
    paymentStatus: 'Paid'
  },
  {
    id: 8,
    bookingRef: 'HF-BK-8580',
    service: 'Bathroom Water Mixer Valve',
    customer: 'Kavita Joshi',
    locality: 'Indirapuram, Ghaziabad',
    date: '2026-08-15',
    displayDate: '15 Aug 2026',
    monthKey: '2026-08',
    quarterKey: 'Q3-2026',
    visitingFee: 249,
    repairLabor: 800,
    materialCharge: 600,
    customerTotal: 1649,
    platformFee: 165,
    paymentStatus: 'Paid'
  },
  {
    id: 9,
    bookingRef: 'HF-BK-8420',
    service: 'Electrical Switchboard Replacement',
    customer: 'Naveen Goyal',
    locality: 'Sector 62, Noida',
    date: '2026-06-20',
    displayDate: '20 Jun 2026',
    monthKey: '2026-06',
    quarterKey: 'Q2-2026',
    visitingFee: 149,
    repairLabor: 200,
    materialCharge: 0,
    customerTotal: 349,
    platformFee: 35,
    paymentStatus: 'Paid'
  }
];

export default function Revenue() {
  const toast = useToast();

  const [selectedPeriod, setSelectedPeriod] = useState('THIS_QUARTER'); // 'THIS_MONTH', 'LAST_MONTH', 'THIS_QUARTER', 'PREV_QUARTER', 'CUSTOM', 'ALL'
  const [customStartDate, setCustomStartDate] = useState('2026-07-01');
  const [customEndDate, setCustomEndDate] = useState('2026-10-31');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [isExporting, setIsExporting] = useState(false);

  // Validate custom date range
  const isCustomDateValid = useMemo(() => {
    if (selectedPeriod !== 'CUSTOM') return true;
    if (!customStartDate || !customEndDate) return false;
    return new Date(customStartDate) <= new Date(customEndDate);
  }, [selectedPeriod, customStartDate, customEndDate]);

  // Filter records by period
  const periodFilteredRecords = useMemo(() => {
    return ALL_REVENUE_LEDGER.filter((r) => {
      if (selectedPeriod === 'THIS_MONTH') return r.monthKey === '2026-10';
      if (selectedPeriod === 'LAST_MONTH') return r.monthKey === '2026-09';
      if (selectedPeriod === 'THIS_QUARTER') return r.quarterKey === 'Q3-2026' || r.monthKey === '2026-10';
      if (selectedPeriod === 'PREV_QUARTER') return r.quarterKey === 'Q2-2026';
      if (selectedPeriod === 'CUSTOM') {
        if (!isCustomDateValid) return false;
        return r.date >= customStartDate && r.date <= customEndDate;
      }
      return true;
    });
  }, [selectedPeriod, customStartDate, customEndDate, isCustomDateValid]);

  // Dynamic Revenue KPI Aggregates
  const {
    totalCustomerGrossGMV,
    totalPlatformNetFee,
    completedJobsCount,
    avgTakeRatePercent,
    quarterGrowthRate
  } = useMemo(() => {
    let gross = 0;
    let fee = 0;

    periodFilteredRecords.forEach((r) => {
      gross += r.customerTotal;
      fee += r.platformFee;
    });

    const takeRate = gross > 0 ? ((fee / gross) * 100).toFixed(1) : '10.0';

    return {
      totalCustomerGrossGMV: gross,
      totalPlatformNetFee: fee,
      completedJobsCount: periodFilteredRecords.length,
      avgTakeRatePercent: takeRate,
      quarterGrowthRate: '+18.4%'
    };
  }, [periodFilteredRecords]);

  // Filtered & Sorted Table Entries
  const displayedRecords = useMemo(() => {
    return periodFilteredRecords
      .filter((r) => {
        if (statusFilter !== 'ALL' && r.paymentStatus !== statusFilter) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchBookingRef = r.bookingRef.toLowerCase().includes(q);
          const matchCustomer = r.customer.toLowerCase().includes(q);
          const matchService = r.service.toLowerCase().includes(q);
          const matchLocality = r.locality.toLowerCase().includes(q);
          return matchBookingRef || matchCustomer || matchService || matchLocality;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'highest_gross') return b.customerTotal - a.customerTotal;
        if (sortBy === 'lowest_gross') return a.customerTotal - b.customerTotal;
        if (sortBy === 'highest_fee') return b.platformFee - a.platformFee;
        return 0;
      });
  }, [periodFilteredRecords, statusFilter, searchQuery, sortBy]);

  // Handle Export CSV
  const handleExportCSV = () => {
    if (displayedRecords.length === 0) {
      if (toast) {
        toast.warning('No revenue records available to export for this period.', 'Empty Export');
      }
      return;
    }

    setIsExporting(true);

    setTimeout(() => {
      try {
        const headers = [
          'Booking Reference',
          'Customer Name',
          'Service Category',
          'Locality',
          'Transaction Date',
          'Visiting Fee (INR)',
          'Repair Labor (INR)',
          'Material/Spares (INR)',
          'Customer Total GMV (INR)',
          'Platform Revenue 10% (INR)',
          'Payment Status'
        ];

        const rows = displayedRecords.map((r) => [
          r.bookingRef,
          `"${r.customer}"`,
          `"${r.service}"`,
          `"${r.locality}"`,
          r.displayDate,
          r.visitingFee,
          r.repairLabor,
          r.materialCharge,
          r.customerTotal,
          r.platformFee,
          r.paymentStatus
        ]);

        const summaryRows = [
          [],
          ['--- PLATFORM REVENUE AUDIT SUMMARY ---'],
          ['Reporting Period', selectedPeriod],
          ['Total Billed Orders', displayedRecords.length],
          ['Customer Gross GMV (INR)', totalCustomerGrossGMV],
          ['Platform Net Commission 10% (INR)', totalPlatformNetFee],
          ['Effective Take-Rate', `${avgTakeRatePercent}%`]
        ];

        const csvContent =
          'data:text/csv;charset=utf-8,' +
          [headers.join(','), ...rows.map((e) => e.join(',')), ...summaryRows.map((e) => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        const fileName = `HomeFix_Platform_Revenue_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsExporting(false);
        if (toast) {
          toast.success(`Revenue ledger exported successfully as ${fileName}`, 'Export Complete');
        }
      } catch (err) {
        setIsExporting(false);
        if (toast) {
          toast.error('Failed to generate revenue export file.', 'Export Error');
        }
      }
    }, 350);
  };

  const formatCurrency = (val) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="admin-dashboard-container">
      {/* Top Operations Header Bar */}
      <div className="admin-control-bar">
        <div className="admin-title-group">
          <div className="admin-badge-row">
            <span className="admin-tag">Financial Performance</span>
            <span className="admin-live-pulse">
              <span className="pulse-dot"></span>
              Platform Take-Rate: 10% Fixed Operating Revenue
            </span>
          </div>
          <h1 className="admin-heading">Platform Revenue & Financial Ledger</h1>
          <p className="admin-subheading">
            Track customer gross GMV, 10% platform commission revenue, take-rate performance, and itemized billing.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Period Selector Dropdown */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="earnings-period-select"
            style={{ minHeight: '38px', background: 'var(--white)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            aria-label="Filter revenue period"
          >
            <option value="THIS_QUARTER">This Quarter (Q3 2026)</option>
            <option value="THIS_MONTH">This Month (Oct 2026)</option>
            <option value="LAST_MONTH">Last Month (Sep 2026)</option>
            <option value="PREV_QUARTER">Previous Quarter (Q2 2026)</option>
            <option value="CUSTOM">Custom Date Range</option>
            <option value="ALL">All Time Revenue History</option>
          </select>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={isExporting || displayedRecords.length === 0}
            className="btn btn-outline btn-sm flex items-center gap-1.5"
            style={{ minHeight: '38px' }}
          >
            <Download size={14} />
            {isExporting ? 'Exporting…' : 'Export Revenue Ledger (.CSV)'}
          </button>
        </div>
      </div>

      {/* Custom Date Range Sub-Bar */}
      {selectedPeriod === 'CUSTOM' && (
        <div className="earnings-custom-date-bar">
          <div className="earnings-date-inputs-group">
            <div className="earnings-date-field">
              <label htmlFor="revStartDate" className="earnings-date-field-label">
                <Calendar size={14} className="inline mr-1 text-emerald-800" />
                From:
              </label>
              <input
                id="revStartDate"
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className={`earnings-date-input ${!isCustomDateValid ? 'is-invalid' : ''}`}
              />
            </div>

            <div className="earnings-date-field">
              <label htmlFor="revEndDate" className="earnings-date-field-label">
                To:
              </label>
              <input
                id="revEndDate"
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className={`earnings-date-input ${!isCustomDateValid ? 'is-invalid' : ''}`}
              />
            </div>

            {!isCustomDateValid && (
              <span className="earnings-date-error-msg">
                <AlertCircle size={14} /> End date cannot be earlier than start date.
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setCustomStartDate('2026-07-01');
              setCustomEndDate('2026-10-31');
              setSelectedPeriod('THIS_QUARTER');
            }}
            className="text-xs font-bold text-slate-500 hover:text-emerald-800 flex items-center gap-1 cursor-pointer bg-transparent border-none"
          >
            <RotateCcw size={12} /> Reset Period
          </button>
        </div>
      )}

      {/* Accounting Principle Architecture Notice */}
      <div className="demo-banner" style={{ borderRadius: 'var(--radius-md)', margin: '0' }}>
        <ShieldCheck size={16} className="text-emerald-800 flex-shrink-0" />
        <span className="text-xs leading-relaxed">
          <strong>Revenue Recognition Principle:</strong> HomeFix strictly recognizes only the 10% platform commission fee as operating revenue. Gross customer billings are held in escrow and disbursed directly to trade partners upon job completion.
        </span>
      </div>

      {/* 4-Column Revenue Summary KPI Cards */}
      <div className="admin-payout-kpi-grid">
        {/* Card 1: Platform Net Commission Revenue */}
        <div className="admin-payout-kpi-card highlight-settled">
          <div className="admin-payout-kpi-header">
            <span className="admin-payout-kpi-label">Platform Net Revenue</span>
            <div className="admin-payout-kpi-icon emerald">
              <CircleDollarSign size={18} />
            </div>
          </div>
          <div className="admin-payout-kpi-val text-emerald">
            {formatCurrency(totalPlatformNetFee)}
          </div>
          <p className="admin-payout-kpi-footer">
            <span>HomeFix 10% operating take-rate realized</span>
          </p>
        </div>

        {/* Card 2: Customer Gross GMV */}
        <div className="admin-payout-kpi-card">
          <div className="admin-payout-kpi-header">
            <span className="admin-payout-kpi-label">Customer Gross GMV</span>
            <div className="admin-payout-kpi-icon blue">
              <Receipt size={18} />
            </div>
          </div>
          <div className="admin-payout-kpi-val">
            {formatCurrency(totalCustomerGrossGMV)}
          </div>
          <p className="admin-payout-kpi-footer">
            <span>Total platform gross billing across {completedJobsCount} jobs</span>
          </p>
        </div>

        {/* Card 3: Revenue Growth Rate */}
        <div className="admin-payout-kpi-card">
          <div className="admin-payout-kpi-header">
            <span className="admin-payout-kpi-label">Revenue Growth</span>
            <div className="admin-payout-kpi-icon emerald">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="admin-payout-kpi-val text-emerald">
            {quarterGrowthRate}
          </div>
          <p className="admin-payout-kpi-footer">
            <span>Quarter-over-quarter net revenue expansion</span>
          </p>
        </div>

        {/* Card 4: Completed Revenue Jobs */}
        <div className="admin-payout-kpi-card">
          <div className="admin-payout-kpi-header">
            <span className="admin-payout-kpi-label">Revenue-Generating Jobs</span>
            <div className="admin-payout-kpi-icon slate">
              <Layers size={18} />
            </div>
          </div>
          <div className="admin-payout-kpi-val">
            {completedJobsCount}
          </div>
          <p className="admin-payout-kpi-footer">
            <span>Completed billable orders for period</span>
          </p>
        </div>
      </div>

      {/* Revenue Structure & Margin Split Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Panel 1: Formula Architecture */}
        <div className="earnings-panel-card">
          <div className="earnings-panel-header">
            <div className="flex items-center gap-2">
              <Percent size={18} className="text-emerald-800" />
              <span>Revenue Realization Split</span>
            </div>
            <span className="badge-category text-xs">Audited Take-Rate</span>
          </div>

          <div className="commission-formula-box" style={{ padding: '1.25rem' }}>
            <div className="formula-row">
              <span className="font-semibold text-slate-700">Customer Gross Billed Volume (GMV):</span>
              <strong className="font-mono text-base text-slate-900">{formatCurrency(totalCustomerGrossGMV)} (100%)</strong>
            </div>
            <div className="formula-row text-rose-600 mt-2">
              <span className="font-semibold">HomeFix Operating Revenue (10% Take-Rate):</span>
              <strong className="font-mono text-base">+{formatCurrency(totalPlatformNetFee)} (10%)</strong>
            </div>
            <div className="formula-divider my-3"></div>
            <div className="formula-row font-bold text-emerald-950">
              <span className="text-sm">Disbursed to Trade Technicians:</span>
              <span className="font-mono text-lg text-emerald-800">{formatCurrency(totalCustomerGrossGMV - totalPlatformNetFee)} (90%)</span>
            </div>
          </div>
        </div>

        {/* Panel 2: Monthly Revenue Split */}
        <div className="earnings-panel-card">
          <div className="earnings-panel-header">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-emerald-800" />
              <span>Monthly Revenue Progression (Q3 2026)</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">Fixed 10% Fee</span>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">October 2026 (MTD)</span>
                <span className="text-[11px] text-slate-500">GMV: ₹2,018 · 2 completed orders</span>
              </div>
              <strong className="font-mono text-base text-emerald-900">₹195 Revenue</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">September 2026</span>
                <span className="text-[11px] text-slate-500">GMV: ₹3,246 · 4 completed orders</span>
              </div>
              <strong className="font-mono text-base text-emerald-900">₹325 Revenue</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">August 2026</span>
                <span className="text-[11px] text-slate-500">GMV: ₹2,448 · 2 completed orders</span>
              </div>
              <strong className="font-mono text-base text-emerald-900">₹245 Revenue</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Revenue Ledger Table */}
      <div className="admin-table-container">
        <div className="admin-table-header-row">
          <div>
            <h2 className="admin-table-title">Itemized Customer Billing vs Platform Revenue Ledger</h2>
            <p className="admin-table-subtitle">
              Granular transaction breakdown of visiting fees, labor, material charges, and platform 10% take-rate.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            10% Fixed Platform Take-Rate
          </span>
        </div>

        {/* Toolbar: Search, Status Pills, Sort */}
        <div className="admin-payout-toolbar">
          <div className="admin-payout-search-wrap">
            <Search size={15} className="admin-payout-search-icon" />
            <input
              type="text"
              className="admin-payout-search-input"
              placeholder="Search booking ref, customer, service category, locality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="reviews-search-clear"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter Pills */}
          <div className="admin-payout-filter-pills">
            {['ALL', 'Paid', 'Escrow Held', 'Processing'].map((status) => (
              <button
                key={status}
                type="button"
                className={`admin-filter-pill-btn ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status === 'ALL' ? 'All Statuses' : status}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="reviews-sort-wrap ml-auto">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <label htmlFor="revenueSortSelect" className="reviews-sort-label">Sort:</label>
            <select
              id="revenueSortSelect"
              className="reviews-sort-select"
              style={{ minHeight: '38px', padding: '6px 10px', fontSize: '0.82rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Transaction Date (Newest)</option>
              <option value="oldest">Transaction Date (Oldest)</option>
              <option value="highest_gross">Gross GMV (High → Low)</option>
              <option value="lowest_gross">Gross GMV (Low → High)</option>
              <option value="highest_fee">Platform Revenue (High → Low)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {displayedRecords.length === 0 ? (
          <div className="reviews-empty-state-card" style={{ padding: '2.5rem 1.5rem' }}>
            <div className="reviews-empty-icon" style={{ width: '52px', height: '52px' }}>
              <Receipt size={24} />
            </div>
            <h3 className="reviews-empty-title" style={{ fontSize: '1.1rem' }}>No Revenue Records Found</h3>
            <p className="reviews-empty-desc" style={{ fontSize: '0.84rem' }}>
              No billing transactions match your search filters for this reporting period.
            </p>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('ALL');
                setSearchQuery('');
                setSelectedPeriod('THIS_QUARTER');
              }}
              className="btn btn-primary btn-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-fin-table">
              <thead>
                <tr>
                  <th>Booking Ref</th>
                  <th>Customer</th>
                  <th>Service Category</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Visiting</th>
                  <th style={{ textAlign: 'right' }}>Repair Labor</th>
                  <th style={{ textAlign: 'right' }}>Material Charge</th>
                  <th style={{ textAlign: 'right' }}>Customer Gross GMV</th>
                  <th style={{ textAlign: 'right' }}>Platform Revenue (10%)</th>
                  <th style={{ textAlign: 'center' }}>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {displayedRecords.map((r) => (
                  <tr key={r.id}>
                    <td className="cell-mono">{r.bookingRef}</td>
                    <td>
                      <div className="font-semibold text-slate-800">{r.customer}</div>
                      <div className="text-[11px] text-slate-400">{r.locality}</div>
                    </td>
                    <td>
                      <span className="text-xs text-slate-700">{r.service}</span>
                    </td>
                    <td className="text-slate-600 text-xs whitespace-nowrap">{r.displayDate}</td>
                    <td className="cell-numeric text-slate-600">{formatCurrency(r.visitingFee)}</td>
                    <td className="cell-numeric text-slate-600">{formatCurrency(r.repairLabor)}</td>
                    <td className="cell-numeric text-slate-600">{formatCurrency(r.materialCharge)}</td>
                    <td className="cell-numeric font-bold text-slate-900">{formatCurrency(r.customerTotal)}</td>
                    <td className="cell-numeric font-bold text-emerald-800 text-[0.95rem]">
                      +{formatCurrency(r.platformFee)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`admin-status-badge ${r.paymentStatus === 'Paid' ? 'settled' : 'escrow'}`}>
                        {r.paymentStatus === 'Paid' && '✓ '}
                        {r.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
