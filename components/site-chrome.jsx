import React, { useState, useEffect } from 'react';
import { Logo, I } from './icons.jsx';

// The old site's nav and footer, used on every page outside the marketing
// pages (and the footer on those too). Kept apart from sections.jsx so the
// main bundle doesn't carry the previous homepage's sections.

const Nav = ({ accent }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'color-mix(in oklab, var(--bg) 80%, transparent)' : 'transparent',
      backdropFilter: scrolled ? 'saturate(160%) blur(14px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'saturate(160%) blur(14px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
      transition: 'all .2s ease'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'relative' }}>
        <a href="/" aria-label="PoolLogic — home" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <Logo size={38} gap={6} fontSize={scrolled ? 18 : 21} hideIcon={scrolled} />
        </a>
        <div className="nav-links" style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 14, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          {[
          ['Product', '/#features'],
          ['Solutions', '/#solutions'],
          ['Pricing', '/pricing'],
          ['Customers', '/#switching'],
          ['Resources', '/#faq']].
          map(([l, href]) =>
          <a key={l} href={href} style={{ padding: '8px 14px', color: 'var(--ink-3)', borderRadius: 7, textDecoration: 'none' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-muted)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>{l}</a>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="https://app.poollogic.app" className="btn btn-ghost btn-sm nav-signin" style={{ textDecoration: 'none' }}>Sign in</a>
          <a href="/contact" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>Get a demo<I.arrowR /></a>
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

// Link grid temporarily hidden until destinations are wired. Bottom bar still renders.
const Footer = () =>
<footer style={{ borderTop: '1px solid var(--line)', padding: '24px 0' }}>
    <div className="container footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--ink-5)', gap: 16, flexWrap: 'wrap' }}>
      <span>© {new Date().getFullYear()} PoolLogic. All rights reserved.</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <FooterLink label="Partners" href="/partners" />
        <FooterLink label="Terms" href="/terms" />
        <FooterLink label="Privacy" href="/privacy" />
      </span>
    </div>
  </footer>;

export { Nav, Footer, FooterLink };
