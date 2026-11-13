import React, { lazy, Suspense } from 'react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/home-roles.css'; // type and spacing roles, on the tokens in index.html
import Nav from '../landing/Nav.jsx';
import Hero from '../landing/Hero.jsx';
import { Footer } from '../components/site-chrome.jsx';

// Everything below the hero is its own chunk, fetched once the first screen has loaded and its
// fonts are in (capped at 2.5s) so the two don't share the connection, or straight away when the visitor
// scrolls first or arrives on a /#section link. The page is pre-rendered (entry-server.jsx) with these
// sections in it, so their text is there from the start: until the chunk arrives, React leaves that
// markup as it is, then takes it over. Rendered in the browser only (no pre-rendered markup), the
// placeholder holds their place; the hero is taller than the window, so nothing in view moves.
const belowFoldWanted = () => new Promise((resolve) => {
  if (typeof window === 'undefined' || window.location.hash) { resolve(); return; }
  // After load, also let the hero's fonts finish (they start late on purpose: vite.config.js), capped.
  const onLoad = () => {
    Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 2500))]).then(() => setTimeout(resolve, 0));
  };
  if (document.readyState === 'complete') onLoad();
  else window.addEventListener('load', onLoad, { once: true });
  window.addEventListener('scroll', () => resolve(), { once: true, passive: true });
});
const BelowFold = lazy(() => belowFoldWanted().then(() => import('../landing/BelowFold.jsx')));
const placeholder = <div style={{ minHeight: '100vh' }} />;

// A reload starts at the top. The browser's own restore would land after the lazy sections load, as
// one big jump through the pinned billing section. Links to a section (/#billing …) still go there
// (BelowFold scrolls to the hash).
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// The homepage (/). Built on Tailwind with the --mktg-* tokens (see
// tailwind.config.js and landing/landing.css), with its own nav; section
// components go in landing/. The footer is the rest of the site's.

const LandingPage = () => {
  return (
    <div className="mktg lp-home relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
      <Nav />
      <main>
        <Hero />
        <Suspense fallback={placeholder}><BelowFold /></Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
