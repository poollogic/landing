import React, { useEffect } from 'react';
import BillingScrollMorph from './BillingScrollMorph.jsx';
import { BillingPhone, BillingSettingsCard } from './BillingMockups.jsx';
import RevenueSection from './RevenueSection.jsx';
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
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <>
      <BillingScrollMorph id="billing" phone={<BillingPhone embedded />} setupCard={<BillingSettingsCard embedded />} />
      <RevenueSection />
      <ImportSection />
      <RouteSection />
      <FaqSection />
    </>
  );
}
