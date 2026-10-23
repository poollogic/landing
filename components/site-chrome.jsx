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

// The site footer on every page: dark whatever the page or OS theme, links turning white on
// hover like the nav's (.site-footer in index.html). Link grid hidden until destinations are
// wired. (FooterLink above stays for the preserved v1 homepage's footer in sections.jsx.)
const Footer = () =>
<footer className="site-footer">
    <div className="container footer-bottom">
      <span>© {new Date().getFullYear()} PoolLogic. All rights reserved.</span>
      <span className="site-footer-links">
        <a href="/partners" className="site-footer-link">Partners</a>
        <a href="/terms" className="site-footer-link">Terms</a>
        <a href="/privacy" className="site-footer-link">Privacy</a>
      </span>
    </div>
  </footer>;

export { Nav, Footer, FooterLink };
