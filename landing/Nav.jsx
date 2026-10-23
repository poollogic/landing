import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { usePreviewTheme } from './preview/previewTheme.js';
import { ctaHref, isReserving } from './onboarding.js';

// Top nav for the homepage and /pricing. Absolutely positioned over the hero
// (not sticky). Styles live in landing/hero.css.

const APP_URL = 'https://app.poollogic.app';

// The homepage's sections (rooted at / so they also work from /pricing), then pricing.
const LINKS = [
  ['Billing', '/#billing'],
  ['Collections', '/#collections'],
  ['Switching', '/#switching'],
  ['Pricing', '/pricing'],
];

const Nav = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const theme = usePreviewTheme();

  // Close the mobile menu on Escape, outside click, or growing past mobile width.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const mq = window.matchMedia('(min-width: 560px)');
    const onResize = (e) => { if (e.matches) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    mq.addEventListener('change', onResize);
    // The page behind the open menu doesn't scroll (html.nav-locked, hero.css).
    document.documentElement.classList.add('nav-locked');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
      mq.removeEventListener('change', onResize);
      document.documentElement.classList.remove('nav-locked');
    };
  }, [open]);

  // Unlock straight away (not after the re-render), so a /#section link can scroll the page.
  const close = () => {
    document.documentElement.classList.remove('nav-locked');
    setOpen(false);
  };

  return (
    <>
    <header className="lp-nav" ref={ref}>
      <div className="lp-nav-bar container">
        <a href="/" className="lp-nav-wordmark">PoolLogic</a>

        <nav className="nav-links" aria-label="Primary">
          {LINKS.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </nav>

        <div className="nav-right">
          <a href={APP_URL} className="nav-signin">Sign in</a>
          <a href={ctaHref(theme)} className="nav-trial">
            {isReserving ? 'Reserve your spot' : 'Start free trial'}
            <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
          </a>
          <button
            type="button"
            className="nav-burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="lp-nav-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} strokeWidth={1.8} /> : <Menu size={20} strokeWidth={1.8} />}
          </button>
        </div>

        <nav id="lp-nav-menu" className="nav-menu" aria-label="Mobile" hidden={!open}>
          {LINKS.map(([label, href]) => <a key={label} href={href} onClick={close}>{label}</a>)}
          <hr />
          <a href={APP_URL} onClick={close}>Sign in</a>
          <a href={ctaHref(theme)} className="menu-trial" onClick={close}>{isReserving ? 'Reserve your spot' : 'Start free trial'}</a>
        </nav>
      </div>
    </header>
    {/* Dims the page behind the open menu; outside the header so it sits under it (z-index 99 < 100).
        A tap on it closes the menu (the outside-tap handler above). */}
    <div className={`nav-scrim${open ? ' is-open' : ''}`} aria-hidden="true" />
    </>
  );
};

export default Nav;
