import React, { useState, useEffect } from 'react';
import { I } from './icons.jsx';
import BrandLogo from './brand-logo.jsx';
import FeaturesMenu, { LINKS } from '../landing/FeaturesMenu.jsx';
import { ctaHref, isReserving } from '../landing/onboarding.js';
import './site-nav.css';

// The old site's nav and footer, used on every page outside the marketing
// pages (and the footer on those too). Kept apart from sections.jsx so the
// main bundle doesn't carry the previous homepage's sections.

// The light header on the legal and partner pages: the dark nav's links (FeaturesMenu.jsx), in the
// light theme (site-nav.css). Below 880px the links hide (index.html), leaving the logo and buttons.
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className="site-nav" style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'color-mix(in oklab, var(--bg) 80%, transparent)' : 'transparent',
      backdropFilter: scrolled ? 'saturate(160%) blur(14px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'saturate(160%) blur(14px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
      transition: 'all .2s ease'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'relative' }}>
        <a href="/" aria-label="Poolnautics — home" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <BrandLogo height={40} compact={scrolled} />
        </a>
        <div className="nav-links site-nav-links">
          <FeaturesMenu open={featuresOpen} setOpen={setFeaturesOpen} />
          {LINKS.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="https://app.poollogic.app" className="btn btn-ghost btn-sm nav-signin" style={{ textDecoration: 'none' }}>Sign in</a>
          <a href={ctaHref('light')} className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>{isReserving ? 'Reserve your spot' : 'Start free trial'}<I.arrowR /></a>
        </div>
      </div>
    </nav>);

};

const FooterLink = ({ label, href }) => (
  <a href={href} style={{
    fontSize: 13, lineHeight: 1.4,
    color: 'var(--ink-5)',
    textDecoration: 'none',
    transition: 'color .15s ease',
    width: 'fit-content',
  }}
    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--ink-2)'}
    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink-5)'}>{label}</a>
);

// The site footer on every page: dark whatever the page or OS theme, links turning white on
// hover like the nav's (.site-footer in index.html). Link grid hidden until destinations are
// wired. (FooterLink above stays for the preserved v1 homepage's footer in sections.jsx.)
const Footer = () =>
<footer className="site-footer">
    <div className="container footer-bottom">
      {/* The year can differ between a pre-rendered page's build and the visit. */}
      <span suppressHydrationWarning>© {new Date().getFullYear()} Poolnautics. All rights reserved.</span>
      <span className="site-footer-links">
        <a href="/ai-integrations" className="site-footer-link">AI &amp; integrations</a>
        <a href="/partners" className="site-footer-link">Partners</a>
        <a href="/terms" className="site-footer-link">Terms</a>
        <a href="/privacy" className="site-footer-link">Privacy</a>
      </span>
    </div>
  </footer>;

export { Nav, Footer, FooterLink };
