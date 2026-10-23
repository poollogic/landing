import React, { lazy, Suspense, useEffect, useState } from 'react';
import '../landing/landing.css';
import '../landing/hero.css';
import Nav from '../landing/Nav.jsx';
import Hero from '../landing/Hero.jsx';
import { Footer } from '../components/site-chrome.jsx';

// Everything below the hero is its own chunk, fetched once the first screen has loaded and its
// fonts are in (capped at 2.5s) so the two don't share the connection, or straight away when the visitor
// scrolls first or arrives on a /#section link. The hero is taller than the window, so the
// sections arriving never move anything in view.
const BelowFold = lazy(() => import('../landing/BelowFold.jsx'));
const placeholder = <div style={{ minHeight: '100vh' }} />;
function useBelowFoldReady() {
  const [ready, setReady] = useState(() => typeof window !== 'undefined' && !!window.location.hash);
  useEffect(() => {
    if (ready) return undefined;
    let done = false;
    const go = () => { if (!done) { done = true; setReady(true); } };
    // After load, also let the hero's fonts finish (they start late on purpose: vite.config.js), capped.
    const onLoad = () => {
      Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 2500))]).then(() => setTimeout(go, 0));
    };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
    window.addEventListener('scroll', go, { once: true, passive: true });
    return () => {
      window.removeEventListener('load', onLoad);
      window.removeEventListener('scroll', go);
    };
  }, [ready]);
  return ready;
}

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
  const belowFoldReady = useBelowFoldReady();
  return (
    <div className="mktg relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
      <Nav />
      <main>
        <Hero />
        {belowFoldReady ? <Suspense fallback={placeholder}><BelowFold /></Suspense> : placeholder}
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
