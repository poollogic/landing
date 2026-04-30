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
    </>
  );
};

export default App;
