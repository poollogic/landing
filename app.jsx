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
      <ConstructionBanner />
      <Nav accent={TWEAK_DEFAULTS.accent} />
      <Hero
        layout={TWEAK_DEFAULTS.heroLayout}
        headline={TWEAK_DEFAULTS.headline}
        subhead={TWEAK_DEFAULTS.subhead}
      />
      <Migration />
    </>
  );
};

const ConstructionBanner = () => (
  <div role="status" style={{
    background: 'color-mix(in oklab, var(--brand-orange) 12%, var(--bg))',
    borderBottom: '1px solid color-mix(in oklab, var(--brand-orange) 28%, transparent)',
    color: 'var(--ink-2)',
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: '0.01em',
    padding: '8px 16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    textAlign: 'center',
    lineHeight: 1.4,
  }}>
    <span aria-hidden="true" style={{
      display: 'inline-flex',
      width: 8, height: 8, borderRadius: '50%',
      background: 'var(--brand-orange)',
      boxShadow: '0 0 0 3px color-mix(in oklab, var(--brand-orange) 22%, transparent)',
      flexShrink: 0,
    }}/>
    <span>Site under construction — actively being built. Check back soon.</span>
  </div>
);

export default App;
