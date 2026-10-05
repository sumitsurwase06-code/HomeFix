import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Shield, Wrench, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Discreet Developer Bar
 * Displayed only if VITE_DEMO_MODE is true or in development
 */
export default function DevModeBar() {
  const isDemoEnabled = import.meta.env.VITE_DEMO_MODE === 'true';
  const { switchDemoRole, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // If not enabled via environment variable, do not render in normal UI
  if (!isDemoEnabled) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      left: '16px',
      zIndex: 9998,
      fontFamily: 'var(--font-sans)',
      fontSize: '0.75rem'
    }}>
      {isOpen ? (
        <div style={{
          backgroundColor: '#064E3B',
          color: '#F8E7C9',
          padding: '8px 14px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #EBD5AD'
        }}>
          <span style={{ fontWeight: 700 }}>Dev Persona:</span>
          <button
            type="button"
            style={{
              background: currentUser?.role === 'customer' ? '#F8E7C9' : 'transparent',
              color: currentUser?.role === 'customer' ? '#064E3B' : '#FFF7E8',
              border: '1px solid #EBD5AD',
              borderRadius: '6px',
              padding: '2px 8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
            onClick={() => { switchDemoRole('customer'); navigate('/customer/dashboard'); }}
          >
            Customer
          </button>
          <button
            type="button"
            style={{
              background: currentUser?.role === 'technician' ? '#F8E7C9' : 'transparent',
              color: currentUser?.role === 'technician' ? '#064E3B' : '#FFF7E8',
              border: '1px solid #EBD5AD',
              borderRadius: '6px',
              padding: '2px 8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
            onClick={() => { switchDemoRole('technician'); navigate('/technician/dashboard'); }}
          >
            Technician
          </button>
          <button
            type="button"
            style={{
              background: currentUser?.role === 'admin' ? '#F8E7C9' : 'transparent',
              color: currentUser?.role === 'admin' ? '#064E3B' : '#FFF7E8',
              border: '1px solid #EBD5AD',
              borderRadius: '6px',
              padding: '2px 8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
            onClick={() => { switchDemoRole('admin'); navigate('/admin/dashboard'); }}
          >
            Admin
          </button>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#F8E7C9',
              cursor: 'pointer',
              marginLeft: '6px',
              opacity: 0.7
            }}
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          style={{
            backgroundColor: 'rgba(6, 78, 59, 0.85)',
            color: '#F8E7C9',
            border: '1px solid rgba(248, 231, 201, 0.3)',
            borderRadius: '999px',
            padding: '6px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(6px)'
          }}
          onClick={() => setIsOpen(true)}
          title="Developer Persona Switcher (VITE_DEMO_MODE)"
        >
          <Terminal size={12} />
          <span>Dev Role: <strong>{currentUser?.role || 'Guest'}</strong></span>
        </button>
      )}
    </div>
  );
}
