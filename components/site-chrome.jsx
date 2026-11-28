import React, { useState, useEffect } from 'react';
import AppStoreBadge from '../landing/AppStoreBadge.jsx';
import { I } from './icons.jsx';
import BrandLogo, { Wordmark } from './brand-logo.jsx';
import FeaturesMenu, { LINKS } from '../landing/FeaturesMenu.jsx';
import { ctaHref, isReserving } from '../landing/onboarding.js';
import { API_DOCS_URL } from '../aiFacts.js';
import './site-nav.css';

// The old site's nav (now only on /landing) and the footer used on every page. Kept apart from sections.jsx so the
// main bundle doesn't carry the previous homepage's sections.

// The previous homepage's header, kept with it at /landing (every other page uses landing/Nav.jsx).
// The site's links (FeaturesMenu.jsx) in its light theme (site-nav.css). Below 880px the links
// hide (index.html), leaving the logo and buttons.
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
          <a href="https://app.poolnautics.app/" className="btn btn-ghost btn-sm nav-signin" style={{ textDecoration: 'none' }}>Sign in</a>
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

// The site footer on every page: dark whatever the page or OS theme (.site-footer in index.html). A brand
// block (the header's wordmark, a line on what Poolnautics is, the App Store badge), three columns of
// links, each a <nav> named by its heading, and a bottom bar with the copyright and the company. The same
// eleven links as before, with the one guide link now Guides (/guides, the index; 2026-11-28). (FooterLink above stays for the preserved v1 homepage's footer in sections.jsx.)
const FOOTER_COLUMNS = [
  ['Product', [
    ['Route software', '/pool-route-software'],
    ['AI & automations', '/ai-and-automations'],
    ['Claude', '/claude'],
    // The API docs are on the app's domain (aiFacts.js): getpoolnautics.com/docs/api is a 404.
    ['API docs', API_DOCS_URL],
  ]],
  ['Resources', [
    ['Switch to Poolnautics', '/switch-pool-service-software'],
    ['Guides', '/guides'],
    ['Partners', '/partners'],
    ['Questions', '/#faq'],
  ]],
  ['Legal', [
    ['Terms', '/terms'],
    ['Privacy', '/privacy'],
    ['Delete account', '/delete-account'],
  ]],
];

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <a href="/" className="site-footer-wordmark" aria-label="Poolnautics — home"><Wordmark bg="dark" /></a>
          <p className="site-footer-desc">Pool service software for routes, billing and the technician app.</p>
          <AppStoreBadge />
        </div>
        {FOOTER_COLUMNS.map(([title, links]) => {
          const id = `site-footer-${title.toLowerCase()}`;
          return (
            <nav key={title} className={`site-footer-col ${id}`} aria-labelledby={id}>
              <p id={id} className="site-footer-h">{title}</p>
              {links.map(([label, href]) => <a key={href} href={href} className="site-footer-link">{label}</a>)}
            </nav>
          );
        })}
      </div>
      <div className="site-footer-bar">
        {/* The year can differ between a pre-rendered page's build and the visit. */}
        <span suppressHydrationWarning>© {new Date().getFullYear()} Poolnautics. All rights reserved.</span>
        <span>Poolnautics LLC · St. Petersburg, Florida</span>
      </div>
    </div>
  </footer>
);

export { Nav, Footer, FooterLink };
