import React, { useState } from 'react';
import { Calendar, Clock, Save, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Availability() {
  const [schedule, setSchedule] = useState({
    Monday: { enabled: true, from: '09:00', to: '19:00' },
    Tuesday: { enabled: true, from: '09:00', to: '19:00' },
    Wednesday: { enabled: true, from: '09:00', to: '19:00' },
    Thursday: { enabled: true, from: '09:00', to: '19:00' },
    Friday: { enabled: true, from: '09:00', to: '19:00' },
    Saturday: { enabled: true, from: '10:00', to: '17:00' },
    Sunday: { enabled: false, from: '10:00', to: '14:00' },
  });

  const [saved, setSaved] = useState(false);

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

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="page-wrapper max-w-3xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Availability Schedule</h1>
          <p className="page-subtitle">
            Configure active working days and appointment dispatch windows
          </p>
        </div>
      </div>

      {saved && (
        <div className="alert-box alert-success">
          <CheckCircle2 size={16} />
          <span>Working schedule updated! Customers can now book within these slots.</span>
        </div>
      )}

      <Card className="p-6" style={{ padding: '1.5rem' }}>
        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {DAYS.map((day) => {
              const item = schedule[day];
              return (
                <div
                  key={day}
                  style={{
                    padding: '0.85rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: item.enabled ? '1px solid var(--line)' : '1px solid rgba(241, 242, 233, 0.04)',
                    backgroundColor: item.enabled ? 'var(--surface-raised)' : 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    opacity: item.enabled ? 1 : 0.5,
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => toggleDay(day)}
                      style={{ accentColor: 'var(--primary)', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: item.enabled ? 'var(--text)' : 'var(--text-muted)', width: '100px' }}>{day}</span>
                  </label>

                  {item.enabled ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>From:</span>
                      <input
                        type="time"
                        value={item.from}
                        onChange={(e) => updateHours(day, 'from', e.target.value)}
                        className="input-control"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', width: '110px' }}
                      />
                      <span style={{ color: 'var(--text-muted)', marginLeft: '0.25rem' }}>To:</span>
                      <input
                        type="time"
                        value={item.to}
                        onChange={(e) => updateHours(day, 'to', e.target.value)}
                        className="input-control"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', width: '110px' }}
                      />
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Off Duty / Unavailable</span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary" leftIcon={<Save size={16} />}>
              Save Availability Calendar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
