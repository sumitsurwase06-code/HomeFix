import React, { useState } from 'react';
import './TechnicianPortal.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const LOCALITIES = [
  'Sector 62, Noida',
  'Indirapuram, Ghaziabad',
  'Sector 18, Noida',
  'Vaishali, Ghaziabad',
  'Mayur Vihar, Delhi',
  'Greater Noida West'
];

export default function Availability() {
  const [schedule, setSchedule] = useState({
    Monday: { enabled: true, from: '09:00', to: '19:00' },
    Tuesday: { enabled: true, from: '09:00', to: '19:00' },
    Wednesday: { enabled: true, from: '09:00', to: '19:00' },
    Thursday: { enabled: true, from: '09:00', to: '19:00' },
    Friday: { enabled: true, from: '09:00', to: '19:00' },
    Saturday: { enabled: true, from: '10:00', to: '18:00' },
    Sunday: { enabled: false, from: '10:00', to: '14:00' },
  });

  const [selectedAreas, setSelectedAreas] = useState([
    'Sector 62, Noida',
    'Indirapuram, Ghaziabad',
    'Sector 18, Noida'
  ]);
  const [maxDailyJobs, setMaxDailyJobs] = useState(5);
  const [instantDispatch, setInstantDispatch] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const toggleDay = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  };

  const updateHours = (day, field, val) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: val },
    }));
  };

  const toggleArea = (area) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    setToastMessage('Availability preferences and service coverage saved successfully!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="portal-page">
      {toastMessage && (
        <div className="portal-toast">
          ✓ {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">Working Hours & Service Availability</h1>
          <p className="portal-page-subtitle">
            Configure your active weekly dispatch calendar, preferred service localities, and daily appointment capacity.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Working Days & Hours Card */}
        <div className="portal-section-card">
          <div className="section-card-header">
            <div>
              <h2 className="section-title">Weekly Dispatch Calendar</h2>
              <p className="section-subtitle">Select the days and time slots during which you accept service calls</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {DAYS.map((day) => {
              const item = schedule[day];
              return (
                <div
                  key={day}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between flex-wrap gap-4 ${
                    item.enabled
                      ? 'bg-[var(--color-surface)] border-[var(--color-border-champagne)]'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => toggleDay(day)}
                      className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer"
                    />
                    <span className={`font-bold text-sm ${item.enabled ? 'text-[var(--color-text-main)]' : 'text-slate-500'}`}>
                      {day}
                    </span>
                  </label>

                  {item.enabled ? (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[var(--color-text-muted)]">From:</span>
                      <input
                        type="time"
                        value={item.from}
                        onChange={(e) => updateHours(day, 'from', e.target.value)}
                        className="portal-input py-1 px-2 text-xs w-28"
                      />
                      <span className="text-[var(--color-text-muted)] ml-2">To:</span>
                      <input
                        type="time"
                        value={item.to}
                        onChange={(e) => updateHours(day, 'to', e.target.value)}
                        className="portal-input py-1 px-2 text-xs w-28"
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      Off Duty / Not Accepting Bookings
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Coverage Areas & Capacity */}
        <div className="portal-grid-2col">
          <div className="portal-section-card">
            <h3 className="section-title mb-1">Preferred Service Localities</h3>
            <p className="section-subtitle mb-4">You will receive dispatch requests within these chosen sectors</p>
            <div className="flex flex-wrap gap-2">
              {LOCALITIES.map((loc) => {
                const isSelected = selectedAreas.includes(loc);
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => toggleArea(loc)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-main)] border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {loc}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="portal-section-card">
            <h3 className="section-title mb-1">Dispatch Preferences</h3>
            <p className="section-subtitle mb-4">Capacity control and instant emergency dispatch</p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="form-label text-xs font-semibold block mb-1">
                  Maximum Appointment Capacity per Day:
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={maxDailyJobs}
                  onChange={(e) => setMaxDailyJobs(Number(e.target.value))}
                  className="portal-input w-full"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-amber-900">
                  <input
                    type="checkbox"
                    checked={instantDispatch}
                    onChange={(e) => setInstantDispatch(e.target.checked)}
                    className="w-4 h-4 accent-emerald-800"
                  />
                  <span>Enable Emergency Instant Dispatch leads in my primary sector</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="portal-btn portal-btn-primary">
            💾 Save Availability Settings
          </button>
        </div>
      </form>
    </div>
  );
}
