import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowRightLeft, ChevronDown, Menu, Receipt, Route, ShieldAlert, Sparkles, X } from 'lucide-react';
import { usePreviewTheme } from './preview/previewTheme.js';
import { ctaHref, isReserving } from './onboarding.js';
import { Wordmark } from '../components/brand-logo.jsx';
import { API_DOCS_URL } from '../aiFacts.js';

// Top nav for the homepage, /pricing and /ai-integrations. Absolutely positioned over the hero
// (not sticky). Styles live in landing/hero.css.

const APP_URL = 'https://app.poollogic.app';

// The Features menu: what the app does, and where to read about each. Most are homepage sections
// (rooted at / so they work from every page) until a feature gets a page of its own.
// Two columns of features, each with a line on what it does (the copy is the homepage's)...
const FEATURE_COLUMNS = [
  [
    { label: 'Billing on autopilot', desc: 'Every customer invoiced on their own schedule and paid in one tap', href: '/#billing', Icon: Receipt },
    { label: 'Collections', desc: 'Late fees, overdue notices and service pauses that run themselves', href: '/#collections', Icon: ShieldAlert },
  ],
  [
    { label: 'Switching', desc: 'Bring your Skimmer or QuickBooks customers over in minutes', href: '/#switching', Icon: ArrowRightLeft },
    { label: 'Route transfers', desc: 'Sell a route with one code, knowing exactly what it’s worth', href: '/#routes', Icon: Route },
  ],
];
// ...a column of plain links...
const AI_PAGE = { label: 'AI & integrations', href: '/ai-integrations', Icon: Sparkles };
const MORE_LINKS = [
  AI_PAGE,
  { label: 'API docs', href: API_DOCS_URL },
  { label: 'Partner program', href: '/partners' },
  { label: 'Questions', href: '/#faq' },
];
// ...and what's new, along the bottom.
const NEWS = { title: 'New', text: 'Connect Claude, Grok, ChatGPT or your own AI', href: AI_PAGE.href };
// The phone menu: the features, then the AI page.
const MENU_FEATURES = [...FEATURE_COLUMNS.flat(), AI_PAGE];

const LINKS = [
  ['Pricing', '/pricing'],
  ['Contact', '/contact'],
];

// Below this width the burger menu replaces the links (the same breakpoint as index.html's).
const MENU_MAX = 880;

// The desktop Features dropdown. It opens on hover (a mouse only, so a tap doesn't open and close
// it at once) and on click, and its links stay in the page while it's closed, so crawlers find
// them. While open, the header sits above the hero (.lp-nav.is-dd-open, hero.css).
const FeaturesMenu = ({ open, setOpen }) => {
  const ref = useRef(null);
  const timer = useRef(0);
  const viaHover = useRef(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Close on Escape (focus goes back to the button) or a click anywhere else.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      if (ref.current?.contains(document.activeElement)) ref.current.querySelector('button')?.focus();
    };
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open, setOpen]);

  // A short delay before closing, so the pointer can cross the gap to the panel.
  const hover = (enter) => (e) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(timer.current);
    if (enter) {
      if (!open) viaHover.current = true;
      setOpen(true);
    } else {
      timer.current = setTimeout(() => setOpen(false), 150);
    }
  };

  // A click just after hovering opened it keeps it open; otherwise a click toggles it.
  const onClick = () => {
    if (viaHover.current) {
      viaHover.current = false;
      setOpen(true);
    } else {
      setOpen((o) => !o);
    }
  };

  // Tabbing out of the menu closes it.
  const onBlur = (e) => {
    if (e.relatedTarget && !ref.current?.contains(e.relatedTarget)) setOpen(false);
  };

  return (
    <div
      className={`nav-dd${open ? ' is-open' : ''}`}
      ref={ref}
      onPointerEnter={hover(true)}
      onPointerLeave={hover(false)}
      onBlur={onBlur}
    >
      <button type="button" className="nav-dd-trigger" aria-expanded={open} aria-controls="lp-nav-features" onClick={onClick}>
        Features
        <ChevronDown size={14} strokeWidth={2} aria-hidden="true" />
      </button>
      <div id="lp-nav-features" className="nav-dd-panel">
        <div className="nav-dd-card">
          {FEATURE_COLUMNS.map((items, i) => (
            <ul key={i} className="nav-dd-col">
              {items.map(({ label, desc, href }) => (
                <li key={href}>
                  <a href={href} className="nav-dd-feature" onClick={() => setOpen(false)}>
                    <span className="nav-dd-label">{label}</span>
                    <span className="nav-dd-desc">{desc}</span>
                  </a>
                </li>
              ))}
            </ul>
          ))}
          <ul className="nav-dd-col nav-dd-more">
            {MORE_LINKS.map(({ label, href }) => (
              <li key={href}><a href={href} onClick={() => setOpen(false)}>{label}</a></li>
            ))}
          </ul>
        </div>
        <a href={NEWS.href} className="nav-dd-news" onClick={() => setOpen(false)}>
          <span><b>{NEWS.title}</b> {NEWS.text}</span>
          <span className="nav-dd-news-more">Learn more <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" /></span>
        </a>
      </div>
    </div>
  );
};

// focused: just the wordmark and "Sign in", for a page whose only job is its form (/reserve), so
// nothing in the header leads away from it.
// current: the page's own path (e.g. '/pricing'), so its link shows as the page you're on. A prop,
// not window.location, so a pre-rendered page renders the same on the server.
const Nav = ({ focused = false, current }) => {
  const [open, setOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const ref = useRef(null);
  const theme = usePreviewTheme();

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
      <header className="lp-nav is-focused">
        <div className="lp-nav-bar container">
          <a href="/" className="lp-nav-wordmark" aria-label="Poolnautics — home"><Wordmark bg="dark" /></a>
          <div className="nav-right">
            <a href={APP_URL} className="nav-signin">Sign in</a>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
    <header className={`lp-nav${featuresOpen ? ' is-dd-open' : ''}`} ref={ref}>
      <div className="lp-nav-bar container">
        <a href="/" className="lp-nav-wordmark" aria-label="Poolnautics — home"><Wordmark bg="dark" /></a>

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
    <div className={`nav-scrim${open ? ' is-open' : ''}`} onClick={close} aria-hidden="true" />
    </>
  );
};

export default Nav;
