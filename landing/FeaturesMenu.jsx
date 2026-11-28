import React, { useEffect, useRef } from 'react';
import {
  ArrowLeftRight, ArrowRight, Bell, ChevronDown, CreditCard, Gauge, Import, Route, Smartphone, Sparkle, TrendingUp, Truck, Wrench,
} from 'lucide-react';
import { NAME, NAME_PATH, TM_PATH } from '../components/brandName.js';

// The header's links, shared by the site header (landing/Nav.jsx, styled in landing/nav.css) and
// the preserved old homepage's (components/site-chrome.jsx, styled in components/site-nav.css).

// The Features menu: four groups of links, the same in the desktop dropdown and the phone and tablet menu
// (Nav.jsx), each with its Lucide icon beside it. Homepage sections are rooted at / so
// they work from every page.
export const FEATURE_GROUPS = [
  ['Getting paid', [
    { label: 'Billing on autopilot', href: '/pool-service-billing', Icon: CreditCard },
    { label: 'Collections', href: '/#collections', Icon: Bell },
    { label: 'Price increases', href: '/pool-service-price-increases', Icon: TrendingUp },
  ]],
  ['Routes & jobs', [
    { label: 'Routes & scheduling', href: '/pool-route-software', Icon: Route },
    { label: 'Repairs on autopilot', href: '/workflow', Icon: Wrench },
  ]],
  ['Technicians', [
    { label: 'Technician app', href: '/tech-app', Icon: Smartphone },
    { label: 'Mileage tracking', href: '/pool-service-mileage-tracking', Icon: Gauge },
    { label: 'Fleet management', href: '/pool-service-fleet-management', Icon: Truck },
  ]],
  ['More', [
    { label: 'AI & automations', href: '/ai-and-automations', Icon: Sparkle },
    // Its label is "Switching to" and the header's wordmark (ItemLabel); screen readers hear "Switching to Poolnautics".
    { label: 'Switching to', wordmark: true, href: '/switch-pool-service-software', Icon: Import },
    // The homepage's Route acquisition section (buy, sell and transfer routes). It was "Route transfers"
    // under Routes & jobs; the owner moved it here in Guides' place (2026-11-28). /guides is in the footer.
    { label: 'Selling a pool route', href: '/#routes', Icon: ArrowLeftRight },
  ]],
];

// A menu item's label, in the desktop dropdown and the phone and tablet menu. "Switching to" is followed on
// the same line by the header logo's wordmark (components/brandName.js, its name and ™), in the link's own
// colour (currentColor, so it follows hover), 0.82em of the label's font size tall and 0.3em after the
// words. Its box runs from the top of the "l" to the bottom of the "p", and the name's baseline is 78% of
// the way down, so it sits 0.18em below the text's baseline to put the two baselines together. The SVG is
// hidden from screen readers, which read the visually hidden " Poolnautics" instead. One span that never
// wraps, so the flex row's gap doesn't come between the words and the wordmark. Its styles are inline, as
// the old homepage's header (components/site-chrome.jsx) shares this menu without landing/nav.css, and so
// they beat the menus' icon rules (.dd-col a svg, .menu-feature svg: 17px, grey), which would catch it too.
const WM_BASELINE = (86.64 - NAME.y) / NAME.h; // the name's baseline, as a share of the box's height
const SR_ONLY = { position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 };
export const ItemLabel = ({ label, wordmark }) => {
  if (!wordmark) return label;
  const h = 0.82;
  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      {label}
      <svg
        viewBox={`${NAME.x} ${NAME.y} ${NAME.w} ${NAME.h}`}
        aria-hidden="true"
        focusable="false"
        style={{ display: 'inline-block', overflow: 'visible', color: 'inherit', opacity: 1, height: `${h}em`, width: `${((h * NAME.w) / NAME.h).toFixed(3)}em`, marginLeft: '0.3em', verticalAlign: `-${(h * (1 - WM_BASELINE)).toFixed(3)}em` }}
      >
        <path d={NAME_PATH} fill="currentColor" />
        <path d={TM_PATH} fill="currentColor" />
      </svg>
      <span style={SR_ONLY}> Poolnautics</span>
    </span>
  );
};
// What's new: the dropdown's bottom strip, and the phone menu's card (shorter).
export const NEWS = {
  href: '/claude',
  text: 'Poolnautics now connects to Claude. Send quotes, chase late invoices and check routes.',
  short: 'Connect Poolnautics to Claude',
};

// The links after Features. (Home comes first, before Features: Nav.jsx.)
export const LINKS = [
  ['Pricing', '/pricing'],
  ['Contact', '/contact'],
];

// The desktop Features dropdown. It opens on hover (a mouse only, so a tap doesn't open and close
// it at once) and on click, and its links stay in the page while it's closed, so crawlers find
// them.
// current: the page's own path (Nav's `current`): its link keeps the hover look and is aria-current.
const FeaturesMenu = ({ open, setOpen, current }) => {
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
          <div className="dd-cols">
            {FEATURE_GROUPS.map(([title, links], g) => (
              <div key={title} className="dd-col">
                <p className="dd-lab" id={`lp-nav-dd-${g}`}>{title}</p>
                <ul aria-labelledby={`lp-nav-dd-${g}`}>
                  {links.map(({ label, wordmark, href, Icon }) => (
                    <li key={href}>
                      <a href={href} aria-current={href === current ? 'page' : undefined} onClick={() => setOpen(false)}>
                        <Icon size={17} strokeWidth={1.25} aria-hidden="true" />
                        <ItemLabel label={label} wordmark={wordmark} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <a href={NEWS.href} className="nav-dd-news" onClick={() => setOpen(false)}>
          <span className="dd-strip"><b>New</b>{NEWS.text}</span>
          <span className="dd-more">Learn more <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" /></span>
        </a>
      </div>
    </div>
  );
};

export default FeaturesMenu;
