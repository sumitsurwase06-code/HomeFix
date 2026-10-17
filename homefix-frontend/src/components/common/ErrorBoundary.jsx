import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            maxWidth: '680px',
            margin: '3rem auto',
            padding: '2rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid rgba(6, 78, 59, 0.12)',
            boxShadow: '0 10px 30px rgba(6, 78, 59, 0.06)',
            textAlign: 'center',
            fontFamily: 'var(--font-sans, sans-serif)',
          }}
          role="alert"
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FEE2E2',
              color: '#DC2626',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <AlertTriangle size={28} />
          </div>

          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--text-primary, #10251E)',
              marginBottom: '0.5rem',
            }}
          >
            {this.props.title || 'Something went wrong in this workspace'}
          </h2>

          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary, #5F6F68)',
              maxWidth: '480px',
              margin: '0 auto 1.5rem auto',
              lineHeight: 1.5,
            }}
          >
            {this.props.message ||
              'A rendering issue occurred while displaying this page. Your data is safe.'}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={this.handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--emerald-ink, #064E3B)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.875rem',
                padding: '0.6rem 1.25rem',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={15} />
              <span>Reload Page</span>
            </button>

            <a
              href="/technician/bookings"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'transparent',
                color: 'var(--emerald-ink, #064E3B)',
                fontWeight: 700,
                fontSize: '0.875rem',
                padding: '0.6rem 1.25rem',
                borderRadius: '9999px',
                border: '1px solid rgba(6, 78, 59, 0.2)',
                textDecoration: 'none',
              }}
            >
              <Home size={15} />
              <span>Return to My Jobs</span>
            </a>
          </div>

          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <div
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem',
                backgroundColor: '#F9FAFB',
                borderRadius: '8px',
                textAlign: 'left',
                fontSize: '0.75rem',
                color: '#DC2626',
                fontFamily: 'monospace',
                overflowX: 'auto',
              }}
            >
              {this.state.error.toString()}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
