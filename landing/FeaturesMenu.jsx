import React, { useEffect, useRef } from 'react';
import { ArrowRight, ArrowRightLeft, ChevronDown, Receipt, Route, ShieldAlert, Sparkles, Wrench } from 'lucide-react';
import { API_DOCS_URL } from '../aiFacts.js';

// The header's links, shared by the site header (landing/Nav.jsx, styled in landing/nav.css) and
// the preserved old homepage's (components/site-chrome.jsx, styled in components/site-nav.css).

// The Features menu: what the app does, and where to read about each. Most are homepage sections
// (rooted at / so they work from every page) until a feature gets a page of its own.
// Two columns of features, each with a line on what it does (the copy is the homepage's). Read as
// rows: Billing and Repairs on top, Collections and Switching below...
export const FEATURE_COLUMNS = [
  [
    { label: 'Billing on autopilot', desc: 'Every customer invoiced on their own schedule and paid in one tap', href: '/#billing', Icon: Receipt },
    { label: 'Collections', desc: 'Late fees, overdue notices and service pauses that run themselves', href: '/#collections', Icon: ShieldAlert },
  ],
  [
    { label: 'Repairs on autopilot', desc: 'Requests, diagnostics and work orders that run from quote to paid', href: '/workflow', Icon: Wrench },
    { label: 'Switching', desc: 'Bring your Skimmer or QuickBooks customers over in minutes', href: '/#switching', Icon: ArrowRightLeft },
  ],
];
// ...a column of plain links...
const AI_PAGE = { label: 'AI & automations', href: '/ai-and-automations', Icon: Sparkles };
const ROUTES_LINK = { label: 'Route transfers', href: '/#routes', Icon: Route };
const MORE_LINKS = [
  AI_PAGE,
  { label: 'API docs', href: API_DOCS_URL },
  { label: 'Partner program', href: '/partners' },
  ROUTES_LINK,
  { label: 'Questions', href: '/#faq' },
];
// ...and what's new, along the bottom.
const NEWS = { title: 'New', text: 'Connect Claude, Grok, ChatGPT or your own AI', href: AI_PAGE.href };
// The phone menu: the features row by row, as the grid reads, then the plain links it carries (the AI
// page and Route transfers, in that column's order).
const [LEFT, RIGHT] = FEATURE_COLUMNS;
export const MENU_FEATURES = [...LEFT.flatMap((item, i) => [item, RIGHT[i]]), AI_PAGE, ROUTES_LINK];

// The links beside the menu.
export const LINKS = [
  ['Pricing', '/pricing'],
  ['Contact', '/contact'],
];

// The desktop Features dropdown. It opens on hover (a mouse only, so a tap doesn't open and close
// it at once) and on click, and its links stay in the page while it's closed, so crawlers find
// them.
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

export default FeaturesMenu;
