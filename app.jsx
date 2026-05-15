import React, { useEffect, lazy, Suspense } from 'react';
import { Nav, Hero, Migration } from './components/sections.jsx';

// Legal pages are each split into their own chunks — only fetched when visited.
const TermsPage = lazy(() => import('./pages/terms.jsx'));
const PrivacyPage = lazy(() => import('./pages/privacy.jsx'));

// Page defaults — accent color, hero layout, density, theme.
// EDITMODE markers are preserved so the external prototype editor can still patch this object.
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#3B82F6",
  "heroLayout": "stacked",
  "headline": "Pool service software your techs can run on day one",
  "subhead": "Pool service software for routes, chemistry tracking, repairs, and billing — all in one app your techs can use day one.",
  "density": "default",
  "theme": "light"
}/*EDITMODE-END*/;

const isTermsPath = (p) => p === '/terms' || p === '/terms/';
const isPrivacyPath = (p) => p === '/privacy' || p === '/privacy/';

const App = () => {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', TWEAK_DEFAULTS.accent);
    root.style.setProperty('--accent-ink', `color-mix(in oklab, ${TWEAK_DEFAULTS.accent} 80%, black)`);
    document.body.dataset.density = TWEAK_DEFAULTS.density;
    document.body.dataset.theme = TWEAK_DEFAULTS.theme;
  }, []);

  const path = typeof window !== 'undefined' ? window.location.pathname : '/';

  if (isTermsPath(path)) {
    return (
      <>
        <Nav accent={TWEAK_DEFAULTS.accent} />
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <TermsPage />
          </Suspense>
        </ErrorBoundary>
        <ConstructionBanner />
      </>
    );
  }

  if (isPrivacyPath(path)) {
    return (
      <>
        <Nav accent={TWEAK_DEFAULTS.accent} />
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <PrivacyPage />
          </Suspense>
        </ErrorBoundary>
        <ConstructionBanner />
      </>
    );
  }

  return (
    <>
      <Nav accent={TWEAK_DEFAULTS.accent} />
      <Hero
        layout={TWEAK_DEFAULTS.heroLayout}
        headline={TWEAK_DEFAULTS.headline}
        subhead={TWEAK_DEFAULTS.subhead}
      />
      <Migration />
      <ConstructionBanner />
    </>
  );
};

// Minimal class-based error boundary so a failed lazy import or runtime error
// inside a route renders a graceful fallback instead of a blank white page.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    // Keep this lightweight — wired for an external logger later if needed.
    console.error('Route error:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ maxWidth: 640, margin: '120px auto', padding: '0 24px', textAlign: 'center', color: 'var(--ink-3)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-5)' }}>
            Something went wrong
          </div>
          <h1 style={{ marginTop: 12, fontSize: 32, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            This page failed to load.
          </h1>
          <p style={{ marginTop: 14, fontSize: 16, lineHeight: 1.6 }}>
            Try refreshing. If the problem persists, head back to{' '}
            <a href="/" style={{ color: 'var(--accent)' }}>the home page</a>.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const RouteFallback = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-5)', fontSize: 14 }}>
    <span style={{
      display: 'inline-block',
      width: 18, height: 18, borderRadius: '50%',
      border: '2px solid var(--line)',
      borderTopColor: 'var(--accent)',
      animation: 'spin 0.8s linear infinite',
    }}/>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const ConstructionBanner = () => (
  <div role="status" style={{
    position: 'fixed',
    left: 0, right: 0, bottom: 0,
    zIndex: 60,
    background: 'color-mix(in oklab, var(--brand-orange) 14%, var(--bg))',
    borderTop: '1px solid color-mix(in oklab, var(--brand-orange) 32%, transparent)',
    boxShadow: '0 -10px 28px -14px rgba(15, 23, 42, .14)',
    backdropFilter: 'saturate(160%) blur(10px)',
    WebkitBackdropFilter: 'saturate(160%) blur(10px)',
    color: 'var(--ink-2)',
    padding: '18px 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
    textAlign: 'center',
    lineHeight: 1.4,
  }}>
    <span aria-hidden="true" style={{
      display: 'inline-flex',
      width: 10, height: 10, borderRadius: '50%',
      background: 'var(--brand-orange)',
      boxShadow: '0 0 0 4px color-mix(in oklab, var(--brand-orange) 22%, transparent)',
      flexShrink: 0,
      animation: 'pulse-dot 2s ease-in-out infinite',
    }}/>
    <span style={{ fontSize: 15, fontWeight: 600 }}>Site under maintenance</span>
    <span aria-hidden="true" style={{ width: 1, height: 16, background: 'color-mix(in oklab, var(--brand-orange) 30%, transparent)', display: 'inline-block' }} />
    <span style={{ fontSize: 14, color: 'var(--ink-4)', fontWeight: 500 }}>Check back soon.</span>
    <style>{`
      @keyframes pulse-dot {
        0%, 100% { box-shadow: 0 0 0 4px color-mix(in oklab, var(--brand-orange) 22%, transparent); }
        50%      { box-shadow: 0 0 0 8px color-mix(in oklab, var(--brand-orange) 6%, transparent); }
      }
    `}</style>
  </div>
);

export default App;
