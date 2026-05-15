import React, { useEffect } from 'react';
import { Nav, Hero, Migration } from './components/sections.jsx';

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

const App = () => {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', TWEAK_DEFAULTS.accent);
    root.style.setProperty('--accent-ink', `color-mix(in oklab, ${TWEAK_DEFAULTS.accent} 80%, black)`);
    document.body.dataset.density = TWEAK_DEFAULTS.density;
    document.body.dataset.theme = TWEAK_DEFAULTS.theme;
  }, []);

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
