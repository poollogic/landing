import React, { lazy, Suspense } from 'react';
import '../landing/landing.css';
import '../landing/hero.css';
import Nav from '../landing/Nav.jsx';
import Hero from '../landing/Hero.jsx';
import { Footer } from '../components/site-chrome.jsx';

// Everything below the hero is its own chunk. The request starts as soon as
// this module runs, but the hero renders without waiting for it. The hero is
// taller than the window, so the sections arriving never move anything in view.
const belowFold = import('../landing/BelowFold.jsx');

// A reload starts at the top. The browser's own restore would land after the lazy sections load, as
// one big jump through the pinned billing section. Links to a section (/#billing …) still go there
// (BelowFold scrolls to the hash).
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
const BelowFold = lazy(() => belowFold);

// The homepage (/). Built on Tailwind with the --mktg-* tokens (see
// tailwind.config.js and landing/landing.css), with its own nav; section
// components go in landing/. The footer is the rest of the site's.

const LandingPage = () => (
  <div className="mktg relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
    <Nav />
    <main>
      <Hero />
      <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
        <BelowFold />
      </Suspense>
    </main>
    {/* On the site's own light background, as on every other page. */}
    <div style={{ background: 'var(--bg)' }}>
      <Footer />
    </div>
  </div>
);

export default LandingPage;
