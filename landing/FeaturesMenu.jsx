import React, { useEffect, useRef } from 'react';
import {
  ArrowLeftRight, ArrowRight, Bell, ChevronDown, CreditCard, Gauge, Route, Smartphone, Sparkle, TrendingUp, Truck, Wrench,
} from 'lucide-react';

// The header's links, shared by the site header (landing/Nav.jsx, styled in landing/nav.css) and
// the preserved old homepage's (components/site-chrome.jsx, styled in components/site-nav.css).

// The Features menu: four groups of links, the same in the desktop dropdown (with an icon beside each,
// Lucide's) and the phone and tablet menu (Nav.jsx, no icons). Homepage sections are rooted at / so
// they work from every page.
export const FEATURE_GROUPS = [
  ['Get paid', [
    { label: 'Billing on autopilot', href: '/pool-service-billing', Icon: CreditCard },
    { label: 'Collections', href: '/#collections', Icon: Bell },
    { label: 'Price increases', href: '/pool-service-price-increases', Icon: TrendingUp },
  ]],
  ['In the field', [
    { label: 'Routes & scheduling', href: '/pool-route-software', Icon: Route },
    { label: 'Technician app', href: '/tech-app', Icon: Smartphone },
    { label: 'Repairs on autopilot', href: '/workflow', Icon: Wrench },
  ]],
  ['Trucks & mileage', [
    { label: 'Mileage tracking', href: '/pool-service-mileage-tracking', Icon: Gauge },
    { label: 'Fleet management', href: '/pool-service-fleet-management', Icon: Truck },
  ]],
  ['More', [
    { label: 'AI & automations', href: '/ai-and-automations', Icon: Sparkle },
    { label: 'Route transfers', href: '/#routes', Icon: ArrowLeftRight },
  ]],
];
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
          <div className="dd-cols">
            {FEATURE_GROUPS.map(([title, links], g) => (
              <div key={title} className="dd-col">
                <p className="dd-lab" id={`lp-nav-dd-${g}`}>{title}</p>
                <ul aria-labelledby={`lp-nav-dd-${g}`}>
                  {links.map(({ label, href, Icon }) => (
                    <li key={href}>
                      <a href={href} onClick={() => setOpen(false)}>
                        <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
                        {label}
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
          <span className="dd-more">Learn more <ArrowRight size={16} strokeWidth={2} aria-hidden="true" /></span>
        </a>
      </div>
    </div>
  );
};

export default FeaturesMenu;
