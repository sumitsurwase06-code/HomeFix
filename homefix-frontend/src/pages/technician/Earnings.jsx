import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  IndianRupee,
  Download,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  X,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  Receipt,
  AlertCircle,
  HelpCircle,
  Percent,
  RotateCcw,
  Info
} from 'lucide-react';
import './TechnicianPortal.css';

// Initial verified earnings transaction records
const EARNINGS_TRANSACTIONS = [
  {
    id: 1,
    bookingRef: 'HF-BK-8903',
    service: 'Appliance & Geyser Repair',
    locality: 'Sector 62, Noida',
    customer: 'Rohan Sharma',
    completionDate: '2026-10-02',
    displayDate: '02 Oct 2026',
    monthKey: '2026-10',
    timestamp: 1790900000000,
    visitingFee: 249,
    laborAndParts: 1000,
    grossTotal: 1249,
    platformFee: 125, // 10%
    netPayout: 1124,
    status: 'Transferred',
    transferDate: '06 Oct 2026',
    utrRef: 'UTR-HDFC-9821034'
  },
  {
    id: 2,
    bookingRef: 'HF-BK-8850',
    service: 'Plumbing Leak Fix & Cartridge',
    locality: 'Indirapuram, Ghaziabad',
    customer: 'Pooja Verma',
    completionDate: '2026-09-28',
    displayDate: '28 Sep 2026',
    monthKey: '2026-09',
    timestamp: 1790500000000,
    visitingFee: 199,
    laborAndParts: 450,
    grossTotal: 649,
    platformFee: 65,
    netPayout: 584,
    status: 'Transferred',
    transferDate: '30 Sep 2026',
    utrRef: 'UTR-HDFC-9742110'
  },
  {
    id: 3,
    bookingRef: 'HF-BK-8792',
    service: 'Geyser Thermostat Overhaul',
    locality: 'Sector 18, Noida',
    customer: 'Aditi Nair',
    completionDate: '2026-09-24',
    displayDate: '24 Sep 2026',
    monthKey: '2026-09',
    timestamp: 1790100000000,
    visitingFee: 199,
    laborAndParts: 800,
    grossTotal: 999,
    platformFee: 100,
    netPayout: 899,
    status: 'Transferred',
    transferDate: '30 Sep 2026',
    utrRef: 'UTR-HDFC-9742110'
  },
  {
    id: 4,
    bookingRef: 'HF-BK-8710',
    service: 'Electrical Switchboard Overhaul',
    locality: 'Vaishali, Ghaziabad',
    customer: 'Vikram Mehta',
    completionDate: '2026-09-15',
    displayDate: '15 Sep 2026',
    monthKey: '2026-09',
    timestamp: 1789400000000,
    visitingFee: 199,
    laborAndParts: 550,
    grossTotal: 749,
    platformFee: 75,
    netPayout: 674,
    status: 'Transferred',
    transferDate: '23 Sep 2026',
    utrRef: 'UTR-HDFC-9689401'
  },
  {
    id: 5,
    bookingRef: 'HF-BK-8640',
    service: 'Main Pipeline Valve Replacement',
    locality: 'Sector 50, Noida',
    customer: 'Sunil Mathur',
    completionDate: '2026-10-08',
    displayDate: '08 Oct 2026',
    monthKey: '2026-10',
    timestamp: 1791400000000,
    visitingFee: 199,
    laborAndParts: 1200,
    grossTotal: 1399,
    platformFee: 140,
    netPayout: 1259,
    status: 'Processing',
    transferDate: '13 Oct 2026 (Scheduled)',
    utrRef: 'BATCH-PROC-1008'
  },
  {
    id: 6,
    bookingRef: 'HF-BK-8580',
    service: 'Kitchen Sink Drain Cleaning',
    locality: 'Sector 76, Noida',
    customer: 'Meera Deshmukh',
    completionDate: '2026-10-09',
    displayDate: '09 Oct 2026',
    monthKey: '2026-10',
    timestamp: 1791500000000,
    visitingFee: 199,
    laborAndParts: 600,
    grossTotal: 799,
    platformFee: 80,
    netPayout: 719,
    status: 'Pending',
    transferDate: '13 Oct 2026 (Pending)',
    utrRef: 'PENDING-SETTLEMENT'
  },
  {
    id: 7,
    bookingRef: 'HF-BK-8420',
    service: 'Submersible Pump Valve Fitting',
    locality: 'Sector 137, Noida',
    customer: 'Kavita Joshi',
    completionDate: '2026-08-20',
    displayDate: '20 Aug 2026',
    monthKey: '2026-08',
    timestamp: 1787200000000,
    visitingFee: 249,
    laborAndParts: 1400,
    grossTotal: 1649,
    platformFee: 165,
    netPayout: 1484,
    status: 'Transferred',
    transferDate: '25 Aug 2026',
    utrRef: 'UTR-HDFC-9531092'
  }
];

export default function Earnings() {
  const { currentUser } = useAuth();
  const toast = useToast();

  const [transactions] = useState(EARNINGS_TRANSACTIONS);
  const [selectedPeriod, setSelectedPeriod] = useState('THIS_MONTH'); // 'THIS_MONTH', 'LAST_MONTH', 'LAST_3_MONTHS', 'CUSTOM', 'ALL'
  const [customStartDate, setCustomStartDate] = useState('2026-08-01');
  const [customEndDate, setCustomEndDate] = useState('2026-10-31');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'Transferred', 'Processing', 'Pending'
  const [sortBy, setSortBy] = useState('newest_date'); // 'newest_date', 'oldest_date', 'highest_gross', 'lowest_gross', 'highest_net', 'lowest_net'
  const [selectedTransactionModal, setSelectedTransactionModal] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Validate custom date range
  const isCustomDateValid = useMemo(() => {
    if (selectedPeriod !== 'CUSTOM') return true;
    if (!customStartDate || !customEndDate) return false;
    return new Date(customStartDate) <= new Date(customEndDate);
  }, [selectedPeriod, customStartDate, customEndDate]);

  // Period filtering logic
  const periodFilteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (selectedPeriod === 'THIS_MONTH') return t.monthKey === '2026-10';
      if (selectedPeriod === 'LAST_MONTH') return t.monthKey === '2026-09';
      if (selectedPeriod === 'LAST_3_MONTHS') {
        return t.monthKey === '2026-10' || t.monthKey === '2026-09' || t.monthKey === '2026-08';
      }
      if (selectedPeriod === 'CUSTOM') {
        if (!isCustomDateValid) return false;
        return t.completionDate >= customStartDate && t.completionDate <= customEndDate;
      }
      return true;
    });
  }, [transactions, selectedPeriod, customStartDate, customEndDate, isCustomDateValid]);

  // Financial KPI totals computed dynamically from the selected period
  const {
    grossEarnings,
    platformFeeTotal,
    netEarnings,
    transferredTotal,
    pendingTotal,
    completedJobsCount
  } = useMemo(() => {
    let gross = 0;
    let fee = 0;
    let net = 0;
    let transferred = 0;
    let pending = 0;

    periodFilteredTransactions.forEach((t) => {
      gross += t.grossTotal;
      fee += t.platformFee;
      net += t.netPayout;

      if (t.status === 'Transferred') {
        transferred += t.netPayout;
      } else {
        pending += t.netPayout;
      }
    });

    return {
      grossEarnings: gross,
      platformFeeTotal: fee,
      netEarnings: net,
      transferredTotal: transferred,
      pendingTotal: pending,
      completedJobsCount: periodFilteredTransactions.length
    };
  }, [periodFilteredTransactions]);

  // Table filtering and search
  const displayedTransactions = useMemo(() => {
    return periodFilteredTransactions
      .filter((t) => {
        if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchRef = t.bookingRef.toLowerCase().includes(q);
          const matchService = t.service.toLowerCase().includes(q);
          const matchLocality = t.locality.toLowerCase().includes(q);
          const matchCustomer = t.customer.toLowerCase().includes(q);
          return matchRef || matchService || matchLocality || matchCustomer;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest_date') return b.timestamp - a.timestamp;
        if (sortBy === 'oldest_date') return a.timestamp - b.timestamp;
        if (sortBy === 'highest_gross') return b.grossTotal - a.grossTotal;
        if (sortBy === 'lowest_gross') return a.grossTotal - b.grossTotal;
        if (sortBy === 'highest_net') return b.netPayout - a.netPayout;
        if (sortBy === 'lowest_net') return a.netPayout - b.netPayout;
        return 0;
      });
  }, [periodFilteredTransactions, statusFilter, searchQuery, sortBy]);

  // Real CSV Statement Generation & Export
  const handleDownloadStatement = () => {
    if (displayedTransactions.length === 0) {
      if (toast) {
        toast.warning('No transaction records available to export for this period.', 'Empty Statement');
      }
      return;
    }

    setIsExporting(true);

    setTimeout(() => {
      try {
        const periodLabel =
          selectedPeriod === 'THIS_MONTH'
            ? '2026-10'
            : selectedPeriod === 'LAST_MONTH'
            ? '2026-09'
            : selectedPeriod === 'LAST_3_MONTHS'
            ? '2026_Q3_Q4'
            : selectedPeriod === 'CUSTOM'
            ? `${customStartDate}_to_${customEndDate}`
            : 'All_Time';

        const headers = [
          'Booking Reference',
          'Service Category',
          'Customer Name',
          'Locality',
          'Completion Date',
          'Visiting Fee (INR)',
          'Labor & Spares (INR)',
          'Gross Total (INR)',
          'Platform Commission 10% (INR)',
          'Net Technician Payout (INR)',
          'Payout Status',
          'Transfer Date / Reference'
        ];

        const rows = displayedTransactions.map((t) => [
          t.bookingRef,
          `"${t.service}"`,
          `"${t.customer}"`,
          `"${t.locality}"`,
          t.completionDate,
          t.visitingFee,
          t.laborAndParts,
          t.grossTotal,
          t.platformFee,
          t.netPayout,
          t.status,
          `"${t.utrRef}"`
        ]);

        const summaryRows = [
          [],
          ['--- STATEMENT SUMMARY ---'],
          ['Partner Name', currentUser?.name || 'Rajesh Kumar'],
          ['Partner ID', `TECH-${currentUser?.id || '101'}`],
          ['Selected Period', periodLabel],
          ['Total Completed Jobs', completedJobsCount],
          ['Gross Billed Amount (INR)', grossEarnings],
          ['Platform Commission (10%) (INR)', platformFeeTotal],
          ['Net Technician Payout (INR)', netEarnings],
          ['Transferred Amount (INR)', transferredTotal],
          ['Pending Settlement Amount (INR)', pendingTotal]
        ];

        const csvContent =
          'data:text/csv;charset=utf-8,' +
          [headers.join(','), ...rows.map((e) => e.join(',')), ...summaryRows.map((e) => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        const fileName = `HomeFix_Earnings_${periodLabel}.csv`;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsExporting(false);
        if (toast) {
          toast.success(`Statement exported successfully as ${fileName}`, 'Statement Downloaded');
        }
      } catch (err) {
        setIsExporting(false);
        if (toast) {
          toast.error('Failed to export statement file.', 'Export Error');
        }
      }
    }, 400);
  };

  const formatCurrency = (val) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="portal-page">
      {/* Page Header */}
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">Earnings & Payouts</h1>
          <p className="portal-page-subtitle">
            Track completed-job earnings, platform fees, and payout history.
          </p>
        </div>

        <div className="earnings-header-actions">
          {/* Period Selector Dropdown */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="earnings-period-select"
            aria-label="Select financial period"
          >
            <option value="THIS_MONTH">This Month (Oct 2026)</option>
            <option value="LAST_MONTH">Last Month (Sep 2026)</option>
            <option value="LAST_3_MONTHS">Last 3 Months (Aug - Oct)</option>
            <option value="CUSTOM">Custom Date Range</option>
            <option value="ALL">All Time History</option>
          </select>

          {/* Download Statement Button */}
          <button
            type="button"
            onClick={handleDownloadStatement}
            disabled={isExporting || displayedTransactions.length === 0}
            className="earnings-download-btn"
          >
            <Download size={15} />
            {isExporting ? 'Generating Statement…' : 'Download Statement'}
          </button>
        </div>
      </div>

      {/* Custom Date Range Sub-Bar (When Custom Date Range is selected) */}
      {selectedPeriod === 'CUSTOM' && (
        <div className="earnings-custom-date-bar">
          <div className="earnings-date-inputs-group">
            <div className="earnings-date-field">
              <label htmlFor="startDateInput" className="earnings-date-field-label">
                <Calendar size={14} className="inline mr-1 text-emerald-800" />
                From:
              </label>
              <input
                id="startDateInput"
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className={`earnings-date-input ${!isCustomDateValid ? 'is-invalid' : ''}`}
              />
            </div>

            <div className="earnings-date-field">
              <label htmlFor="endDateInput" className="earnings-date-field-label">
                To:
              </label>
              <input
                id="endDateInput"
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
              setCustomStartDate('2026-08-01');
              setCustomEndDate('2026-10-31');
              setSelectedPeriod('THIS_MONTH');
            }}
            className="text-xs font-bold text-slate-500 hover:text-emerald-800 flex items-center gap-1 cursor-pointer bg-transparent border-none"
          >
            <RotateCcw size={12} /> Reset Period
          </button>
        </div>
      )}

      {/* 4-Column Financial KPI Cards Grid */}
      <div className="earnings-kpi-grid">
        {/* Card 1: Gross Earnings */}
        <div className="earnings-kpi-card">
          <div className="earnings-kpi-header">
            <div className="flex items-center gap-1.5">
              <span className="earnings-kpi-label">Gross Earnings</span>
              <span className="kpi-info-tooltip-wrap" tabIndex={0} aria-label="Gross Earnings Information">
                <Info size={13} />
                <span className="kpi-tooltip-box">
                  Total eligible gross charges billed across completed jobs before platform commission deductions.
                </span>
              </span>
            </div>
            <div className="earnings-kpi-icon-wrap blue">
              <Receipt size={18} />
            </div>
          </div>
          <div className="earnings-kpi-metric-row">
            <span className="earnings-kpi-val">{formatCurrency(grossEarnings)}</span>
          </div>
          <p className="earnings-kpi-footer">
            <span>Across {completedJobsCount} completed service jobs</span>
          </p>
        </div>

        {/* Card 2: Platform Commission */}
        <div className="earnings-kpi-card highlight-commission">
          <div className="earnings-kpi-header">
            <div className="flex items-center gap-1.5">
              <span className="earnings-kpi-label">Platform Fee (10%)</span>
              <span className="kpi-info-tooltip-wrap" tabIndex={0} aria-label="Platform Fee Information">
                <Info size={13} />
                <span className="kpi-tooltip-box">
                  Platform maintenance, customer dispatch, and guarantee coverage fee (10% of gross invoice amount).
                </span>
              </span>
            </div>
            <div className="earnings-kpi-icon-wrap rose">
              <Percent size={18} />
            </div>
          </div>
          <div className="earnings-kpi-metric-row">
            <span className="earnings-kpi-val text-rose">-{formatCurrency(platformFeeTotal)}</span>
          </div>
          <p className="earnings-kpi-footer">
            <span>Standard 10% platform service fee</span>
          </p>
        </div>

        {/* Card 3: Net Technician Earnings */}
        <div className="earnings-kpi-card highlight-net">
          <div className="earnings-kpi-header">
            <div className="flex items-center gap-1.5">
              <span className="earnings-kpi-label">Net Technician Earnings</span>
              <span className="kpi-info-tooltip-wrap" tabIndex={0} aria-label="Net Technician Earnings Information">
                <Info size={13} />
                <span className="kpi-tooltip-box">
                  Gross earnings minus applicable 10% commission. Direct technician takeaway revenue.
                </span>
              </span>
            </div>
            <div className="earnings-kpi-icon-wrap emerald">
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="earnings-kpi-metric-row">
            <span className="earnings-kpi-val text-emerald">{formatCurrency(netEarnings)}</span>
          </div>
          <p className="earnings-kpi-footer">
            <CheckCircle2 size={13} className="text-emerald-700 inline" />
            <span>Net partner takeaway (90%)</span>
          </p>
        </div>

        {/* Card 4: Payouts Transferred */}
        <div className="earnings-kpi-card">
          <div className="earnings-kpi-header">
            <div className="flex items-center gap-1.5">
              <span className="earnings-kpi-label">Payouts Transferred</span>
              <span className="kpi-info-tooltip-wrap" tabIndex={0} aria-label="Payouts Transferred Information">
                <Info size={13} />
                <span className="kpi-tooltip-box">
                  Total funds successfully confirmed as transferred into your bank account. Pending payouts are excluded.
                </span>
              </span>
            </div>
            <div className="earnings-kpi-icon-wrap emerald">
              <Building2 size={18} />
            </div>
          </div>
          <div className="earnings-kpi-metric-row">
            <span className="earnings-kpi-val text-emerald">{formatCurrency(transferredTotal)}</span>
          </div>
          <p className="earnings-kpi-footer">
            <Clock size={13} className="text-amber-700 inline" />
            <span className="font-semibold text-amber-800">{formatCurrency(pendingTotal)} pending batch</span>
          </p>
        </div>
      </div>

      {/* 2-Column Info Panels: Payout Destination + Commission Rules */}
      <div className="earnings-top-panels-grid">
        {/* Payout Destination Card */}
        <div className="earnings-panel-card">
          <div className="earnings-panel-header">
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-emerald-800" />
              <span>Payout Destination & Settlement</span>
            </div>
            <span className="status-pill status-completed text-xs">
              ✓ Verified Account
            </span>
          </div>

          <div className="bank-info-box">
            <div className="bank-logo-icon">HDFC</div>
            <div className="bank-details-meta">
              <h4 className="bank-name-title">HDFC Bank Limited</h4>
              <span className="bank-account-masked">
                Account: <strong>•••• •••• •••• 4892</strong> · IFSC: <strong>HDFC0001248</strong>
              </span>
            </div>
          </div>

          <div className="text-xs text-[var(--text-muted)] flex items-center justify-between pt-1">
            <span>⚡ Settlement Cycle: <strong>Weekly every Tuesday</strong></span>
            <span className="text-emerald-800 font-semibold">Auto-Settlement Active</span>
          </div>
        </div>

        {/* How Your Earnings Work Card */}
        <div className="earnings-panel-card">
          <div className="earnings-panel-header">
            <div className="flex items-center gap-2">
              <HelpCircle size={18} className="text-emerald-800" />
              <span>How Your Earnings Work</span>
            </div>
            <span className="badge-category text-xs">Transparent Policy</span>
          </div>

          <div className="commission-formula-box">
            <div className="formula-row">
              <span className="text-slate-600">Customer charges eligible for settlement:</span>
              <strong className="font-mono text-slate-800">100%</strong>
            </div>
            <div className="formula-row">
              <span className="text-rose-600">HomeFix Platform Commission (10%):</span>
              <strong className="font-mono text-rose-600">-10%</strong>
            </div>
            <div className="formula-divider"></div>
            <div className="formula-row font-bold text-emerald-900">
              <span>Technician Net Direct Takeaway:</span>
              <span className="font-mono text-emerald-800">90% Net</span>
            </div>
          </div>

          <p className="text-[11px] text-[var(--text-muted)] mt-2 mb-0">
            *Visiting fees are guaranteed for doorstep diagnostic visits. Approved labor and parts are settled weekly.
          </p>
        </div>
      </div>

      {/* Completed Job Disbursement Ledger Table */}
      <div className="earnings-table-card">
        <div className="earnings-table-header-row">
          <div className="earnings-table-title-wrap">
            <h2 className="earnings-table-title">Completed Job Disbursement Breakdown</h2>
            <p className="earnings-table-subtitle">
              Itemized service invoices, platform commission deductions, and bank transfer statuses.
            </p>
          </div>

          <span className="text-xs font-semibold text-[var(--text-muted)]">
            Showing {displayedTransactions.length} of {periodFilteredTransactions.length} records
          </span>
        </div>

        {/* Toolbar & Filters */}
        <div className="earnings-table-toolbar">
          {/* Search */}
          <div className="earnings-search-box">
            <Search size={15} className="earnings-search-icon" />
            <input
              type="text"
              className="earnings-search-input"
              placeholder="Search booking ref, service, customer, locality..."
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
          <div className="earnings-filter-pills">
            {['ALL', 'Transferred', 'Processing', 'Pending'].map((status) => (
              <button
                key={status}
                type="button"
                className={`earnings-status-pill-btn ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status === 'ALL' ? 'All Statuses' : status}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="reviews-sort-wrap ml-auto">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <label htmlFor="earningsSortSelect" className="reviews-sort-label">Sort:</label>
            <select
              id="earningsSortSelect"
              className="reviews-sort-select"
              style={{ minHeight: '38px', padding: '6px 10px', fontSize: '0.82rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest_date">Completion Date (Newest)</option>
              <option value="oldest_date">Completion Date (Oldest)</option>
              <option value="highest_gross">Gross Amount (High → Low)</option>
              <option value="lowest_gross">Gross Amount (Low → High)</option>
              <option value="highest_net">Net Earnings (High → Low)</option>
              <option value="lowest_net">Net Earnings (Low → High)</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        {displayedTransactions.length === 0 ? (
          <div className="reviews-empty-state-card" style={{ padding: '2.5rem 1.5rem' }}>
            <div className="reviews-empty-icon" style={{ width: '52px', height: '52px' }}>
              <Receipt size={24} />
            </div>
            <h3 className="reviews-empty-title" style={{ fontSize: '1.1rem' }}>No Transactions Found</h3>
            <p className="reviews-empty-desc" style={{ fontSize: '0.84rem' }}>
              No financial records match the selected period and search filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedPeriod('ALL');
                setStatusFilter('ALL');
                setSearchQuery('');
              }}
              className="profile-btn profile-btn-primary"
              style={{ display: 'inline-flex', width: 'auto', minHeight: '38px', padding: '0.4rem 1rem' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="earnings-table-responsive">
            <table className="financial-table">
              <thead>
                <tr>
                  <th>Booking Reference</th>
                  <th>Service</th>
                  <th>Completion Date</th>
                  <th style={{ textAlign: 'right' }}>Gross Amount</th>
                  <th style={{ textAlign: 'right' }}>Platform Fee (10%)</th>
                  <th style={{ textAlign: 'right' }}>Net Earnings</th>
                  <th style={{ textAlign: 'center' }}>Payout Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedTransactions.map((tx) => {
                  const statusClass =
                    tx.status === 'Transferred'
                      ? 'transferred'
                      : tx.status === 'Processing'
                      ? 'processing'
                      : tx.status === 'Pending'
                      ? 'pending'
                      : 'failed';

                  return (
                    <tr key={tx.id}>
                      <td className="cell-booking">{tx.bookingRef}</td>
                      <td>
                        <div className="font-semibold text-slate-800">{tx.service}</div>
                        <div className="text-[11px] text-slate-400">{tx.locality}</div>
                      </td>
                      <td className="text-slate-600 text-xs whitespace-nowrap">{tx.displayDate}</td>
                      <td className="cell-numeric font-bold text-slate-900">{formatCurrency(tx.grossTotal)}</td>
                      <td className="cell-numeric font-semibold text-rose-600">-{formatCurrency(tx.platformFee)}</td>
                      <td className="cell-numeric font-bold text-emerald-800 text-[0.95rem]">
                        {formatCurrency(tx.netPayout)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`payout-badge ${statusClass}`}>
                          {tx.status === 'Transferred' && '✓ '}
                          {tx.status === 'Processing' && '⚡ '}
                          {tx.status === 'Pending' && '⏳ '}
                          {tx.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedTransactionModal(tx)}
                          className="review-action-btn-sm"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.74rem' }}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Details Modal Popup */}
      {selectedTransactionModal && (
        <div
          className="review-modal-backdrop"
          onClick={() => setSelectedTransactionModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="review-modal-container"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px' }}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Receipt size={20} className="text-emerald-800" />
                <h3 className="font-primary font-bold text-lg text-[var(--text-primary)]">
                  Disbursement Invoice Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTransactionModal(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Top Meta */}
            <div className="flex items-center justify-between gap-2 mb-3 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <div>
                <span className="text-[11px] text-emerald-800 font-semibold uppercase block">Booking Reference</span>
                <strong className="font-mono text-base text-emerald-950">{selectedTransactionModal.bookingRef}</strong>
              </div>
              <span className={`payout-badge ${selectedTransactionModal.status.toLowerCase()}`}>
                {selectedTransactionModal.status === 'Transferred' && '✓ '}
                {selectedTransactionModal.status}
              </span>
            </div>

            {/* 2-Col Job Info */}
            <div className="financial-modal-grid">
              <div className="financial-modal-item">
                <span className="financial-modal-item-label">Service Rendered</span>
                <span className="financial-modal-item-val text-xs">{selectedTransactionModal.service}</span>
              </div>
              <div className="financial-modal-item">
                <span className="financial-modal-item-label">Customer & Locality</span>
                <span className="financial-modal-item-val text-xs">
                  {selectedTransactionModal.customer} ({selectedTransactionModal.locality})
                </span>
              </div>
              <div className="financial-modal-item">
                <span className="financial-modal-item-label">Job Completion Date</span>
                <span className="financial-modal-item-val text-xs">{selectedTransactionModal.displayDate}</span>
              </div>
              <div className="financial-modal-item">
                <span className="financial-modal-item-label">Transfer Reference / UTR</span>
                <span className="financial-modal-item-val text-xs font-mono text-emerald-800">
                  {selectedTransactionModal.utrRef}
                </span>
              </div>
            </div>

            {/* Itemized Financial Breakdown */}
            <div className="financial-breakdown-box">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Itemized Financial Calculation
              </div>

              <div className="financial-breakdown-row">
                <span className="text-slate-600">Standard Doorstep Visiting Charge:</span>
                <span className="font-mono font-semibold">{formatCurrency(selectedTransactionModal.visitingFee)}</span>
              </div>

              <div className="financial-breakdown-row">
                <span className="text-slate-600">Labor & Approved Spare Parts:</span>
                <span className="font-mono font-semibold">{formatCurrency(selectedTransactionModal.laborAndParts)}</span>
              </div>

              <div className="financial-breakdown-row font-bold text-slate-900 border-t border-dashed border-slate-300 pt-1 mt-1">
                <span>Gross Customer Billed Total:</span>
                <span className="font-mono">{formatCurrency(selectedTransactionModal.grossTotal)}</span>
              </div>

              <div className="financial-breakdown-row text-rose-600 font-semibold">
                <span>Platform Service Commission (10%):</span>
                <span className="font-mono">-{formatCurrency(selectedTransactionModal.platformFee)}</span>
              </div>

              <div className="financial-breakdown-row total-row">
                <span>Net Direct Technician Payout:</span>
                <span className="font-mono text-lg">{formatCurrency(selectedTransactionModal.netPayout)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center gap-2 pt-2 border-t border-slate-200">
              <Link
                to={`/technician/bookings`}
                className="review-action-btn-sm text-emerald-800 font-bold"
              >
                View Full Booking Job
                <ExternalLink size={13} />
              </Link>

              <button
                type="button"
                onClick={() => setSelectedTransactionModal(null)}
                className="profile-btn profile-btn-primary"
                style={{ minHeight: '38px', padding: '0.4rem 1.25rem', fontSize: '0.82rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
