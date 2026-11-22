import React, { useEffect, useId, useRef } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { API_DOCS_URL } from '../aiFacts.js';

// The header's links, shared by the site header (landing/Nav.jsx, styled in landing/nav.css) and
// the preserved old homepage's (components/site-chrome.jsx, styled in components/site-nav.css).

// The Features menu: what the app does, and where to read about each. Most are homepage sections
// (rooted at / so they work from every page) until a feature gets a page of its own (billing:
// /pool-service-billing; repairs: /workflow).
// Two columns of features, each with a line on what it does (the copy is the homepage's). Read as
// rows: Billing and Repairs on top, Collections and Switching below...
export const FEATURE_COLUMNS = [
  [
    { label: 'Billing on autopilot', desc: 'Every customer invoiced on their own schedule and paid in one tap', href: '/pool-service-billing' },
    { label: 'Collections', desc: 'Late fees, overdue notices and service pauses that run themselves', href: '/#collections' },
  ],
  [
    { label: 'Repairs on autopilot', desc: 'Requests, diagnostics and work orders that run from quote to paid', href: '/workflow' },
    { label: 'Switching', desc: 'Bring your Skimmer or QuickBooks customers over in minutes', href: '/#switching' },
  ],
];
// ...a column of plain links in two labelled groups...
const AI_PAGE = { label: 'AI & automations', href: '/ai-and-automations' };
const ROUTES_LINK = { label: 'Route transfers', href: '/#routes' };
const ROUTE_SOFTWARE = { label: 'Routes & scheduling', href: '/pool-route-software' };
// TODO(owner): is Route transfers right under Product, and Questions under Resources?
// TODO(owner): API docs, Partner program and Questions aren't in the phone menu (MENU_FEATURES). Intended?
const MORE_GROUPS = [
  ['Product', [ROUTE_SOFTWARE, AI_PAGE, ROUTES_LINK]],
  ['Resources', [
    { label: 'API docs', href: API_DOCS_URL },
    { label: 'Partner program', href: '/partners' },
    { label: 'Questions', href: '/#faq' },
  ]],
];
// ...and what's new, along the bottom.
const NEWS = { title: 'New', text: 'Connect Claude, Grok, ChatGPT or your own AI', href: AI_PAGE.href };
// The phone menu: the features row by row, as the grid reads, then the plain links it carries (the AI
// page, Routes & scheduling and Route transfers).
const [LEFT, RIGHT] = FEATURE_COLUMNS;
export const MENU_FEATURES = [...LEFT.flatMap((item, i) => [item, RIGHT[i]]), ROUTE_SOFTWARE, AI_PAGE, ROUTES_LINK];

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
  const groupId = useId();

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
                    <span className="nav-dd-label">
                      {label}
                      <ArrowRight size={14} strokeWidth={2} className="nav-dd-arrow" aria-hidden="true" />
                    </span>
                    <span className="nav-dd-desc">{desc}</span>
                  </a>
                </li>
              ))}
            </ul>
          ))}
          <div className="nav-dd-col nav-dd-more">
            {MORE_GROUPS.map(([title, links], g) => (
              <div key={title} className="nav-dd-group">
                <p className="nav-dd-group-label" id={`${groupId}-${g}`}>{title}</p>
                <ul aria-labelledby={`${groupId}-${g}`}>
                  {links.map(({ label, href }) => (
                    <li key={href}><a href={href} onClick={() => setOpen(false)}>{label}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <a href={NEWS.href} className="nav-dd-news" onClick={() => setOpen(false)}>
          <span><b>{NEWS.title}</b> {NEWS.text}</span>
          <span className="nav-dd-news-more">Learn more <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" /></span>
        </a>
      </div>
    </div>
  );
};

export default FeaturesMenu;
