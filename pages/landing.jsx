import React, { useEffect } from 'react';
import '../landing/landing.css';
import '../landing/hero.css';
import Nav from '../landing/Nav.jsx';
import Hero from '../landing/Hero.jsx';
import BillingSection from '../landing/BillingSection.jsx';
import RevenueSection from '../landing/RevenueSection.jsx';
import CursorLight from '../landing/CursorLight.jsx';

// /landing — marketing page, built on Tailwind with the --mktg-* tokens
// (see tailwind.config.js and landing/landing.css). Rendered without the site
// Nav/Footer; section components go in landing/.

const LandingPage = () => {
  // Hide from search engines while this page is in progress.
  useEffect(() => {
    let robots = document.head.querySelector('meta[name="robots"]');
    const prev = robots?.getAttribute('content');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex,follow');
    return () => {
      if (prev) robots.setAttribute('content', prev);
    };
  }, []);

  return (
    <div className="mktg relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
      <Nav />
      <CursorLight />
      <main>
        <Hero />
        <BillingSection />
        <RevenueSection />
      </main>
    </div>
  );
};

export default LandingPage;
