import React from 'react';
import '../landing/landing.css';
import '../landing/hero.css';
import Nav from '../landing/Nav.jsx';
import Hero from '../landing/Hero.jsx';
import BillingSection from '../landing/BillingSection.jsx';
import RevenueSection from '../landing/RevenueSection.jsx';
import ImportSection from '../landing/ImportSection.jsx';
import FaqSection from '../landing/FaqSection.jsx';
import { Footer } from '../components/sections.jsx';

// The homepage (/). Built on Tailwind with the --mktg-* tokens (see
// tailwind.config.js and landing/landing.css), with its own nav; section
// components go in landing/. The footer is the rest of the site's.

const LandingPage = () => (
  <div className="mktg relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
    <Nav />
    <main>
      <Hero />
      <BillingSection />
      <RevenueSection />
      <ImportSection />
      <FaqSection />
    </main>
    {/* On the site's own light background, as on every other page. */}
    <div style={{ background: 'var(--bg)' }}>
      <Footer />
    </div>
  </div>
);

export default LandingPage;
