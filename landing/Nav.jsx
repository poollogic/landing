import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { usePreviewTheme } from './preview/previewTheme.js';
import { ctaHref, isReserving } from './onboarding.js';
import { Wordmark } from '../components/brand-logo.jsx';
import FeaturesMenu, { LINKS, MENU_FEATURES } from './FeaturesMenu.jsx';
import './nav.css';

// The site header. Dark, absolutely positioned over the hero, on the homepage, /pricing, /contact
// and /ai-integrations; light (tone="light"), in the page's flow, on the legal and partner pages.
// Either way it scrolls away with the page. Styles live in landing/nav.css.

const APP_URL = 'https://app.poollogic.app';

// Below this width the burger menu replaces the links (the same breakpoint as index.html's).
const MENU_MAX = 880;

// focused: just the wordmark and "Sign in", for a page whose only job is its form (/reserve), so
// nothing in the header leads away from it.
// current: the page's own path (e.g. '/pricing'), so its link shows as the page you're on. A prop,
// not window.location, so a pre-rendered page renders the same on the server.
// tone: 'dark' or 'light', the page's background.
const Nav = ({ focused = false, current, tone = 'dark' }) => {
  const [open, setOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const ref = useRef(null);
  const theme = usePreviewTheme();
  const light = tone === 'light' ? ' is-light' : '';

  // Close the mobile menu on Escape, outside click, or growing past the menu's widths.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const mq = window.matchMedia(`(min-width: ${MENU_MAX + 0.02}px)`);
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

  if (focused) {
    return (
      <header className={`lp-nav is-focused${light}`}>
        <div className="lp-nav-bar container">
          <a href="/" className="lp-nav-wordmark" aria-label="Poolnautics — home"><Wordmark bg={tone} /></a>
          <div className="nav-right">
            <a href={APP_URL} className="nav-signin">Sign in</a>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
    <header className={`lp-nav${light}`} ref={ref}>
      <div className="lp-nav-bar container">
        <a href="/" className="lp-nav-wordmark" aria-label="Poolnautics — home"><Wordmark bg={tone} /></a>

        <nav className="nav-links" aria-label="Primary">
          <FeaturesMenu open={featuresOpen} setOpen={setFeaturesOpen} />
          {LINKS.map(([label, href]) => <a key={label} href={href} aria-current={href === current ? 'page' : undefined}>{label}</a>)}
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
          <p className="nav-menu-label">Features</p>
          {MENU_FEATURES.map(({ label, href, Icon }) => (
            <a key={href} href={href} className="menu-feature" onClick={close}>
              <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
              {label}
            </a>
          ))}
          <hr />
          {LINKS.map(([label, href]) => <a key={label} href={href} aria-current={href === current ? 'page' : undefined} onClick={close}>{label}</a>)}
          <a href={APP_URL} className="menu-signin" onClick={close}>Sign in</a>
          <a href={ctaHref(theme)} className="menu-trial" onClick={close}>{isReserving ? 'Reserve your spot' : 'Start free trial'}</a>
        </nav>
      </div>
    </header>
    {/* Dims the page behind the open menu; outside the header so it sits under it (z-index 99 < 100).
        A tap on it closes the menu. */}
    <div className={`nav-scrim${light}${open ? ' is-open' : ''}`} onClick={close} aria-hidden="true" />
    </>
  );
};

export default Nav;
