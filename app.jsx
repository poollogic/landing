import React, { useEffect, lazy, Suspense } from 'react';
import { Nav, Hero, Features, BuiltDifferently, Migration, Pricing, FAQ, FinalCTA, Footer } from './components/sections.jsx';

// Sub-pages are each split into their own chunks — only fetched when visited.
const TermsPage = lazy(() => import('./pages/terms.jsx'));
const PrivacyPage = lazy(() => import('./pages/privacy.jsx'));
const TechAppPage = lazy(() => import('./pages/tech-app.jsx'));
const ContactPage = lazy(() => import('./pages/contact.jsx'));

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
const isTechAppPath = (p) => p === '/tech-app' || p === '/tech-app/';
const isContactPath = (p) => p === '/contact' || p === '/contact/';

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
        <Footer />
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
        <Footer />
      </>
    );
  }

  if (isTechAppPath(path)) {
    return (
      <>
        <Nav accent={TWEAK_DEFAULTS.accent} />
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <TechAppPage />
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </>
    );
  }

  if (isContactPath(path)) {
    return (
      <>
        <Nav accent={TWEAK_DEFAULTS.accent} />
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <ContactPage />
          </Suspense>
        </ErrorBoundary>
        <Footer />
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
      <Features />
      <BuiltDifferently />
      <Migration />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
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

export default App;
