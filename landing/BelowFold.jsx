import React, { useEffect } from 'react';
import BillingScrollMorph from './BillingScrollMorph.jsx';
import { BillingPhone } from './BillingMockups.jsx';
import RevenueSection from './RevenueSection.jsx';
import ReserveSection from './ReserveSection.jsx';
import FounderSection from './FounderSection.jsx';
import ImportSection from './ImportSection.jsx';
import RouteSection from './RouteSection.jsx';
import FaqSection from './FaqSection.jsx';

// The homepage below the hero, in its own chunk so the hero paints without
// waiting for it. pages/landing.jsx starts loading it straight away.

export default function BelowFold() {
  // Arriving on /#billing etc.: the target didn't exist when the browser
  // looked for it, so scroll to it once it does. A hashchange first tells the
  // billing section's scroll gate this is navigation, as it does for in-page
  // links, so the jump isn't held at the billing section.
  // The jump is instant: on a fresh load there's nothing to see in a smooth scroll through the page.
  // Once fonts and sections have settled, it lines up again if anything above moved (unless the
  // visitor has scrolled by then).
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const el = id && document.getElementById(id);
    if (!el) return undefined;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    el.scrollIntoView({ behavior: 'instant' });
    let moved = false;
    const onInput = () => { moved = true; };
    const opts = { passive: true, once: true };
    window.addEventListener('wheel', onInput, opts);
    window.addEventListener('touchstart', onInput, opts);
    window.addEventListener('keydown', onInput, { once: true });
    const t = setTimeout(() => {
      if (!moved && Math.abs(el.getBoundingClientRect().top) > 2) el.scrollIntoView({ behavior: 'instant' });
    }, 900);
    return () => {
      clearTimeout(t);
      window.removeEventListener('wheel', onInput);
      window.removeEventListener('touchstart', onInput);
      window.removeEventListener('keydown', onInput);
    };
  }, []);

  return (
    <>
      <BillingScrollMorph id="billing" phone={<BillingPhone embedded />} />
      <RevenueSection />
      <FounderSection />
      <ReserveSection />
      <ImportSection />
      <RouteSection />
      <FaqSection />
    </>
  );
}
