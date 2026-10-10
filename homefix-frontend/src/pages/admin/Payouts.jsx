import React, { useState, useMemo } from 'react';
import { useToast } from '../../context/ToastContext';
import {
  Receipt,
  CheckCircle2,
  Clock,
  Building2,
  Download,
  Calendar,
  Search,
  X,
  SlidersHorizontal,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  Percent,
  ExternalLink
} from 'lucide-react';
import './AdminDashboard.css';

// Initial verified admin technician payout records
const ALL_PAYOUT_RECORDS = [
  {
    id: 1,
    payoutId: 'PAY-1081',
    bookingRef: 'HF-BK-8903',
    service: 'Appliance & Geyser Repair',
    technicianId: 'TECH-104',
    technicianName: 'Suresh Patel',
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
    technicianPayout: 1124,
    settlementStatus: 'Settled',
    disbursementMethod: 'IMPS Direct Bank (HDFC)',
    bankAccountMasked: '•••• •••• •••• 4892',
    ifscCode: 'HDFC0001248',
    utrRef: 'UTR-HDFC-9821034'
  },
  {
    id: 2,
    payoutId: 'PAY-1080',
    bookingRef: 'HF-BK-8901',
    service: 'Plumbing Leakage & Mixer Cartridge',
    technicianId: 'TECH-101',
    technicianName: 'Rajesh Kumar',
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
    technicianPayout: 699,
    settlementStatus: 'Escrow Held',
    disbursementMethod: 'UPI Auto-Disburse',
    bankAccountMasked: '•••• •••• •••• 1048',
    ifscCode: 'SBIN0004521',
    utrRef: 'ESCROW-HOLD-1001'
  },
  {
    id: 3,
    payoutId: 'PAY-1079',
    bookingRef: 'HF-BK-8902',
    service: 'Electrical Short Circuit Inspection',
    technicianId: 'TECH-102',
    technicianName: 'Amit Sharma',
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
    technicianPayout: 179,
    settlementStatus: 'Escrow Held',
    disbursementMethod: 'UPI Auto-Disburse',
    bankAccountMasked: '•••• •••• •••• 7712',
    ifscCode: 'ICIC0000182',
    utrRef: 'ESCROW-HOLD-1002'
  },
  {
    id: 4,
    payoutId: 'PAY-1078',
    bookingRef: 'HF-BK-8850',
    service: 'Main Pipeline Overhaul',
    technicianId: 'TECH-101',
    technicianName: 'Rajesh Kumar',
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
    technicianPayout: 584,
    settlementStatus: 'Settled',
    disbursementMethod: 'IMPS Direct Bank (HDFC)',
    bankAccountMasked: '•••• •••• •••• 1048',
    ifscCode: 'SBIN0004521',
    utrRef: 'UTR-HDFC-9742110'
  },
  {
    id: 5,
    payoutId: 'PAY-1077',
    bookingRef: 'HF-BK-8792',
    service: 'Geyser Thermostat Replacement',
    technicianId: 'TECH-104',
    technicianName: 'Suresh Patel',
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
    technicianPayout: 899,
    settlementStatus: 'Settled',
    disbursementMethod: 'IMPS Direct Bank (HDFC)',
    bankAccountMasked: '•••• •••• •••• 4892',
    ifscCode: 'HDFC0001248',
    utrRef: 'UTR-HDFC-9689401'
  },
  {
    id: 6,
    payoutId: 'PAY-1076',
    bookingRef: 'HF-BK-8710',
    service: 'Submersible Pump Valve Fitting',
    technicianId: 'TECH-103',
    technicianName: 'Manoj Tiwari',
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
    technicianPayout: 1259,
    settlementStatus: 'Processing',
    disbursementMethod: 'NEFT Batch Transfer',
    bankAccountMasked: '•••• •••• •••• 8831',
    ifscCode: 'PUNB0021400',
    utrRef: 'BATCH-PROC-1008'
  },
  {
    id: 7,
    payoutId: 'PAY-1075',
    bookingRef: 'HF-BK-8640',
    service: 'Kitchen Sink Drain Cleaning',
    technicianId: 'TECH-101',
    technicianName: 'Rajesh Kumar',
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
    technicianPayout: 719,
    settlementStatus: 'Pending',
    disbursementMethod: 'Weekly Batch Tuesday',
    bankAccountMasked: '•••• •••• •••• 1048',
    ifscCode: 'SBIN0004521',
    utrRef: 'PENDING-SETTLEMENT'
  },
  {
    id: 8,
    payoutId: 'PAY-1074',
    bookingRef: 'HF-BK-8580',
    service: 'Bathroom Water Mixer Valve',
    technicianId: 'TECH-101',
    technicianName: 'Rajesh Kumar',
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
    technicianPayout: 1484,
    settlementStatus: 'Settled',
    disbursementMethod: 'IMPS Direct Bank (HDFC)',
    bankAccountMasked: '•••• •••• •••• 1048',
    ifscCode: 'SBIN0004521',
    utrRef: 'UTR-HDFC-9531092'
  },
  {
    id: 9,
    payoutId: 'PAY-1070',
    bookingRef: 'HF-BK-8420',
    service: 'Electrical Switchboard Replacement',
    technicianId: 'TECH-102',
    technicianName: 'Amit Sharma',
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
    technicianPayout: 314,
    settlementStatus: 'Settled',
    disbursementMethod: 'IMPS Direct Bank',
    bankAccountMasked: '•••• •••• •••• 7712',
    ifscCode: 'ICIC0000182',
    utrRef: 'UTR-HDFC-9410882'
  }
];

export default function Payouts() {
  const toast = useToast();

  const [selectedPeriod, setSelectedPeriod] = useState('THIS_QUARTER'); // 'THIS_MONTH', 'LAST_MONTH', 'THIS_QUARTER', 'PREV_QUARTER', 'CUSTOM', 'ALL'
  const [customStartDate, setCustomStartDate] = useState('2026-07-01');
  const [customEndDate, setCustomEndDate] = useState('2026-10-31');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedPayoutDrawer, setSelectedPayoutDrawer] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Validate custom date range
  const isCustomDateValid = useMemo(() => {
    if (selectedPeriod !== 'CUSTOM') return true;
    if (!customStartDate || !customEndDate) return false;
    return new Date(customStartDate) <= new Date(customEndDate);
  }, [selectedPeriod, customStartDate, customEndDate]);

  // Filter records by period
  const periodFilteredRecords = useMemo(() => {
    return ALL_PAYOUT_RECORDS.filter((r) => {
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

  // Payout KPI aggregates
  const {
    totalPartnerPayouts,
    settledPayoutsTotal,
    settledCount,
    escrowHeldTotal,
    escrowHeldCount,
    pendingOrActionTotal,
    pendingOrActionCount,
    recordsCount
  } = useMemo(() => {
    let partner = 0;
    let settled = 0;
    let sCount = 0;
    let escrow = 0;
    let eCount = 0;
    let pending = 0;
    let pCount = 0;

    periodFilteredRecords.forEach((r) => {
      partner += r.technicianPayout;

      if (r.settlementStatus === 'Settled') {
        settled += r.technicianPayout;
        sCount += 1;
      } else if (r.settlementStatus === 'Escrow Held') {
        escrow += r.technicianPayout;
        eCount += 1;
      } else {
        pending += r.technicianPayout;
        pCount += 1;
      }
    });

    return {
      totalPartnerPayouts: partner,
      settledPayoutsTotal: settled,
      settledCount: sCount,
      escrowHeldTotal: escrow,
      escrowHeldCount: eCount,
      pendingOrActionTotal: pending,
      pendingOrActionCount: pCount,
      recordsCount: periodFilteredRecords.length
    };
  }, [periodFilteredRecords]);

  // Filtered & Sorted Table Entries
  const displayedRecords = useMemo(() => {
    return periodFilteredRecords
      .filter((r) => {
        if (statusFilter !== 'ALL' && r.settlementStatus !== statusFilter) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchPayoutId = r.payoutId.toLowerCase().includes(q);
          const matchBookingRef = r.bookingRef.toLowerCase().includes(q);
          const matchTechName = r.technicianName.toLowerCase().includes(q);
          const matchTechId = r.technicianId.toLowerCase().includes(q);
          const matchService = r.service.toLowerCase().includes(q);
          return matchPayoutId || matchBookingRef || matchTechName || matchTechId || matchService;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'highest_payout') return b.technicianPayout - a.technicianPayout;
        if (sortBy === 'lowest_payout') return a.technicianPayout - b.technicianPayout;
        if (sortBy === 'highest_gmv') return b.customerTotal - a.customerTotal;
        return 0;
      });
  }, [periodFilteredRecords, statusFilter, searchQuery, sortBy]);

  // Handle Export CSV
  const handleExportCSV = () => {
    if (displayedRecords.length === 0) {
      if (toast) {
        toast.warning('No payout records available to export for this period.', 'Empty Export');
      }
      return;
    }

    setIsExporting(true);

    setTimeout(() => {
      try {
        const headers = [
          'Payout ID',
          'Booking Reference',
          'Technician Name',
          'Technician ID',
          'Service Category',
          'Completion Date',
          'Customer Billing (INR)',
          'Platform Fee 10% (INR)',
          'Partner Net Payout (INR)',
          'Disbursement Method',
          'Settlement Status',
          'Transfer Ref / UTR'
        ];

        const rows = displayedRecords.map((r) => [
          r.payoutId,
          r.bookingRef,
          `"${r.technicianName}"`,
          r.technicianId,
          `"${r.service}"`,
          r.displayDate,
          r.customerTotal,
          r.platformFee,
          r.technicianPayout,
          `"${r.disbursementMethod}"`,
          r.settlementStatus,
          `"${r.utrRef}"`
        ]);

        const summaryRows = [
          [],
          ['--- PAYOUT AUDIT SUMMARY ---'],
          ['Reporting Period', selectedPeriod],
          ['Total Payout Records', displayedRecords.length],
          ['Total Partner Obligations (INR)', totalPartnerPayouts],
          ['Settled Payouts (INR)', settledPayoutsTotal],
          ['Escrow Held (INR)', escrowHeldTotal],
          ['Pending / Processing (INR)', pendingOrActionTotal]
        ];

        const csvContent =
          'data:text/csv;charset=utf-8,' +
          [headers.join(','), ...rows.map((e) => e.join(',')), ...summaryRows.map((e) => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        const fileName = `HomeFix_Technician_Payouts_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsExporting(false);
        if (toast) {
          toast.success(`Payout ledger exported successfully as ${fileName}`, 'Export Complete');
        }
      } catch (err) {
        setIsExporting(false);
        if (toast) {
          toast.error('Failed to generate export file.', 'Export Error');
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
            <span className="admin-tag">Disbursement Management</span>
            <span className="admin-live-pulse">
              <span className="pulse-dot"></span>
              Weekly Tuesday Auto-Settlement Active
            </span>
          </div>
          <h1 className="admin-heading">Technician Payouts & Escrow Ledger</h1>
          <p className="admin-subheading">
            Manage partner payout obligations, automated banking disbursements, and escrow fund releases.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Period Selector Dropdown */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="earnings-period-select"
            style={{ minHeight: '38px', background: 'var(--white)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            aria-label="Filter payout period"
          >
            <option value="THIS_QUARTER">This Quarter (Q3 2026)</option>
            <option value="THIS_MONTH">This Month (Oct 2026)</option>
            <option value="LAST_MONTH">Last Month (Sep 2026)</option>
            <option value="PREV_QUARTER">Previous Quarter (Q2 2026)</option>
            <option value="CUSTOM">Custom Date Range</option>
            <option value="ALL">All Time Payout History</option>
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
            {isExporting ? 'Exporting…' : 'Export Payout Ledger (.CSV)'}
          </button>
        </div>
      </div>

      {/* Custom Date Range Sub-Bar */}
      {selectedPeriod === 'CUSTOM' && (
        <div className="earnings-custom-date-bar">
          <div className="earnings-date-inputs-group">
            <div className="earnings-date-field">
              <label htmlFor="payoutStartDate" className="earnings-date-field-label">
                <Calendar size={14} className="inline mr-1 text-emerald-800" />
                From:
              </label>
              <input
                id="payoutStartDate"
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className={`earnings-date-input ${!isCustomDateValid ? 'is-invalid' : ''}`}
              />
            </div>

            <div className="earnings-date-field">
              <label htmlFor="payoutEndDate" className="earnings-date-field-label">
                To:
              </label>
              <input
                id="payoutEndDate"
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

      {/* 4-Column Payout Summary KPI Cards */}
      <div className="admin-payout-kpi-grid">
        {/* Card 1: Total Partner Payout Obligations */}
        <div className="admin-payout-kpi-card">
          <div className="admin-payout-kpi-header">
            <span className="admin-payout-kpi-label">Total Payout Obligations</span>
            <div className="admin-payout-kpi-icon blue">
              <Receipt size={18} />
            </div>
          </div>
          <div className="admin-payout-kpi-val">
            {formatCurrency(totalPartnerPayouts)}
          </div>
          <p className="admin-payout-kpi-footer">
            <span>Across {recordsCount} completed partner jobs</span>
          </p>
        </div>

        {/* Card 2: Settled Payouts */}
        <div className="admin-payout-kpi-card highlight-settled">
          <div className="admin-payout-kpi-header">
            <span className="admin-payout-kpi-label">Successfully Transferred</span>
            <div className="admin-payout-kpi-icon emerald">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="admin-payout-kpi-val text-emerald">
            {formatCurrency(settledPayoutsTotal)}
          </div>
          <p className="admin-payout-kpi-footer">
            <span>{settledCount} transfers confirmed to bank</span>
          </p>
        </div>

        {/* Card 3: Escrow Held */}
        <div className="admin-payout-kpi-card highlight-escrow">
          <div className="admin-payout-kpi-header">
            <span className="admin-payout-kpi-label">Active Escrow Held</span>
            <div className="admin-payout-kpi-icon amber">
              <Clock size={18} />
            </div>
          </div>
          <div className="admin-payout-kpi-val text-amber">
            {formatCurrency(escrowHeldTotal)}
          </div>
          <p className="admin-payout-kpi-footer">
            <span>{escrowHeldCount} jobs awaiting customer completion sign-off</span>
          </p>
        </div>

        {/* Card 4: Pending / Action Required */}
        <div className="admin-payout-kpi-card">
          <div className="admin-payout-kpi-header">
            <span className="admin-payout-kpi-label">Pending / Processing</span>
            <div className="admin-payout-kpi-icon slate">
              <Building2 size={18} />
            </div>
          </div>
          <div className="admin-payout-kpi-val">
            {formatCurrency(pendingOrActionTotal)}
          </div>
          <p className="admin-payout-kpi-footer">
            <span>{pendingOrActionCount} payouts in Tuesday transfer queue</span>
          </p>
        </div>
      </div>

      {/* Partner Payout Disbursement Ledger Table */}
      <div className="admin-table-container">
        <div className="admin-table-header-row">
          <div>
            <h2 className="admin-table-title">Partner Payout Disbursement Ledger</h2>
            <p className="admin-table-subtitle">
              Individual technician payout records, platform commission splits, disbursement methods, and settlement statuses.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Showing {displayedRecords.length} of {periodFilteredRecords.length} payouts
          </span>
        </div>

        {/* Toolbar: Search, Status Pills, Sort */}
        <div className="admin-payout-toolbar">
          <div className="admin-payout-search-wrap">
            <Search size={15} className="admin-payout-search-icon" />
            <input
              type="text"
              className="admin-payout-search-input"
              placeholder="Search payout ID, booking ref, technician, or service..."
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
            {['ALL', 'Settled', 'Escrow Held', 'Processing', 'Pending'].map((status) => (
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
            <label htmlFor="payoutSortSelect" className="reviews-sort-label">Sort:</label>
            <select
              id="payoutSortSelect"
              className="reviews-sort-select"
              style={{ minHeight: '38px', padding: '6px 10px', fontSize: '0.82rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Completion Date (Newest)</option>
              <option value="oldest">Completion Date (Oldest)</option>
              <option value="highest_payout">Partner Payout (High → Low)</option>
              <option value="lowest_payout">Partner Payout (Low → High)</option>
              <option value="highest_gmv">Customer Billing (High → Low)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {displayedRecords.length === 0 ? (
          <div className="reviews-empty-state-card" style={{ padding: '2.5rem 1.5rem' }}>
            <div className="reviews-empty-icon" style={{ width: '52px', height: '52px' }}>
              <Receipt size={24} />
            </div>
            <h3 className="reviews-empty-title" style={{ fontSize: '1.1rem' }}>No Payout Records Found</h3>
            <p className="reviews-empty-desc" style={{ fontSize: '0.84rem' }}>
              No payout records match your search criteria for the selected period.
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
                  <th>Payout ID</th>
                  <th>Booking Ref</th>
                  <th>Technician Identity</th>
                  <th style={{ textAlign: 'right' }}>Customer Billing</th>
                  <th style={{ textAlign: 'right' }}>Platform Fee</th>
                  <th style={{ textAlign: 'right' }}>Partner Net Payout</th>
                  <th>Disbursement Method</th>
                  <th style={{ textAlign: 'center' }}>Settlement Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedRecords.map((r) => {
                  const statusClass =
                    r.settlementStatus === 'Settled'
                      ? 'settled'
                      : r.settlementStatus === 'Escrow Held'
                      ? 'escrow'
                      : r.settlementStatus === 'Processing'
                      ? 'processing'
                      : 'pending';

                  return (
                    <tr key={r.id}>
                      <td className="cell-mono">{r.payoutId}</td>
                      <td className="cell-mono text-slate-600 font-normal">{r.bookingRef}</td>
                      <td>
                        <div className="admin-technician-cell">
                          <div className="admin-tech-avatar-sm">
                            {r.technicianName.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div className="admin-tech-meta">
                            <span className="admin-tech-name">{r.technicianName}</span>
                            <span className="admin-tech-sub">{r.technicianId} · {r.service}</span>
                          </div>
                        </div>
                      </td>
                      <td className="cell-numeric font-bold text-slate-800">
                        {formatCurrency(r.customerTotal)}
                      </td>
                      <td className="cell-numeric font-semibold text-rose-600">
                        -{formatCurrency(r.platformFee)}
                      </td>
                      <td className="cell-numeric font-bold text-emerald-800 text-[0.95rem]">
                        {formatCurrency(r.technicianPayout)}
                      </td>
                      <td>
                        <span className="text-xs text-slate-600 block">{r.disbursementMethod}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{r.utrRef}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`admin-status-badge ${statusClass}`}>
                          {r.settlementStatus === 'Settled' && '✓ '}
                          {r.settlementStatus === 'Escrow Held' && '🔒 '}
                          {r.settlementStatus === 'Processing' && '⚡ '}
                          {r.settlementStatus === 'Pending' && '⏳ '}
                          {r.settlementStatus}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedPayoutDrawer(r)}
                          className="btn btn-outline btn-xs"
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

      {/* Payout Details Side Drawer */}
      {selectedPayoutDrawer && (
        <div
          className="admin-drawer-backdrop"
          onClick={() => setSelectedPayoutDrawer(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="admin-drawer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="admin-drawer-header">
              <div>
                <div className="flex items-center gap-2">
                  <Receipt size={18} className="text-emerald-800" />
                  <h3 className="font-primary font-bold text-base text-[var(--text-primary)]">
                    Payout Disbursement Voucher
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-800 font-bold mt-0.5 block">
                  {selectedPayoutDrawer.payoutId} · {selectedPayoutDrawer.bookingRef}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayoutDrawer(null)}
                className="p-1 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="admin-drawer-body">
              {/* Status Header Box */}
              <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block">Settlement Status</span>
                  <strong className="text-sm font-bold text-emerald-950">{selectedPayoutDrawer.settlementStatus}</strong>
                </div>
                <span className="text-xs font-mono text-emerald-800 font-semibold">
                  {selectedPayoutDrawer.utrRef}
                </span>
              </div>

              {/* Technician Profile Card */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Trade Partner Identity
                </div>
                <div className="flex items-center gap-3">
                  <div className="admin-tech-avatar-sm" style={{ width: '40px', height: '40px', fontSize: '0.95rem' }}>
                    {selectedPayoutDrawer.technicianName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{selectedPayoutDrawer.technicianName}</h4>
                    <span className="text-xs text-slate-500 block">
                      Partner ID: <strong>{selectedPayoutDrawer.technicianId}</strong> · {selectedPayoutDrawer.service}
                    </span>
                  </div>
                </div>
              </div>

              {/* Banking & Rails */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 block mb-0.5">Disbursement Rail</span>
                  <strong className="text-slate-800">{selectedPayoutDrawer.disbursementMethod}</strong>
                  <span className="text-[11px] text-slate-500 block font-mono mt-0.5">{selectedPayoutDrawer.bankAccountMasked}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 block mb-0.5">Service Locality</span>
                  <strong className="text-slate-800">{selectedPayoutDrawer.locality}</strong>
                  <span className="text-[11px] text-slate-500 block mt-0.5">IFSC: {selectedPayoutDrawer.ifscCode}</span>
                </div>
              </div>

              {/* Itemized Calculation Breakdown */}
              <div className="financial-breakdown-box mb-0">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Financial Settlement Split
                </div>

                <div className="financial-breakdown-row">
                  <span className="text-slate-600">Doorstep Visiting Fee:</span>
                  <span className="font-mono">{formatCurrency(selectedPayoutDrawer.visitingFee)}</span>
                </div>

                <div className="financial-breakdown-row">
                  <span className="text-slate-600">Approved Labor & Repairs:</span>
                  <span className="font-mono">{formatCurrency(selectedPayoutDrawer.repairLabor)}</span>
                </div>

                <div className="financial-breakdown-row">
                  <span className="text-slate-600">Materials & Spare Parts:</span>
                  <span className="font-mono">{formatCurrency(selectedPayoutDrawer.materialCharge)}</span>
                </div>

                <div className="financial-breakdown-row font-bold text-slate-900 border-t border-dashed border-slate-300 pt-1.5 mt-1">
                  <span>Customer Gross Total:</span>
                  <span className="font-mono">{formatCurrency(selectedPayoutDrawer.customerTotal)}</span>
                </div>

                <div className="financial-breakdown-row text-rose-600 font-semibold">
                  <span>HomeFix Platform Fee (10%):</span>
                  <span className="font-mono">-{formatCurrency(selectedPayoutDrawer.platformFee)}</span>
                </div>

                <div className="financial-breakdown-row total-row">
                  <span>Partner Net Disbursement:</span>
                  <span className="font-mono text-lg">{formatCurrency(selectedPayoutDrawer.technicianPayout)}</span>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="admin-drawer-footer">
              {selectedPayoutDrawer.settlementStatus === 'Escrow Held' && (
                <button
                  type="button"
                  onClick={() => {
                    if (toast) {
                      toast.success(`Escrow released for ${selectedPayoutDrawer.payoutId}. Automated transfer scheduled.`, 'Escrow Released');
                    }
                    setSelectedPayoutDrawer(null);
                  }}
                  className="btn btn-primary btn-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} />
                  Release Escrow to Partner
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedPayoutDrawer(null)}
                className="btn btn-secondary btn-sm"
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
