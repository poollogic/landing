import React, { useRef, useState, useSyncExternalStore } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Wordmark } from '../components/brand-logo.jsx';
import { FEATURE_GROUPS } from './featureGroups.js';
import { ctaHref, isReserving } from './onboarding.js';
import { usePreviewTheme } from './preview/previewTheme.js';
import './feature-card.css';

// "Poolnautics handles all of it": every feature, in eight groups (featureGroups.js, which also feeds
// the homepage's featureList JSON-LD), under the pain cards in OnePlatformSection.jsx. Styles:
// feature-card.css.
//
// One set of panels, two layouts. Up to 1040px (where the pain cards above stack) each group is a
// button row (aria-expanded) over its panel, at most one open at a time, all closed at first. Wider, a
// rail of the eight names (a tablist) sits
// beside the panels, which become its tabpanels: hovering or clicking a name selects it, and one is
// always selected. Every feature is in the pre-rendered HTML; closed and unselected panels are only
// hidden. The page renders the phone roles on the server (no window there) and switches to the tab
// roles once it's running on a wide screen.

// The tabs' breakpoint: the pain cards' (one-platform.css), not lg. Below it they stack 720px wide.
const WIDE = '(min-width: 1041px)';
const subscribeLg = (fn) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener('change', fn);
  return () => mq.removeEventListener('change', fn);
};
const useIsDesktop = () => useSyncExternalStore(subscribeLg, () => window.matchMedia(WIDE).matches, () => false);

const Check = () => (
  <span className="fc-tick" aria-hidden="true">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  </span>
);

const OneLink = ({ link }) => (
  <a className="fc-link" href={link.href}>
    {link.label}
    <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" />
  </a>
);
// A group's link, or its two side by side (wrapping on a narrow phone).
const GroupLink = ({ link }) => {
  if (!link) return null;
  if (!Array.isArray(link)) return <OneLink link={link} />;
  return <div className="fc-links">{link.map((l) => <OneLink key={l.href} link={l} />)}</div>;
};

export default function FeatureCard() {
  const theme = usePreviewTheme();
  const isDesktop = useIsDesktop();
  // The open dropdown (null: none), and the selected tab on a wide screen (always one).
  const [open, setOpen] = useState(null);
  const [tab, setTab] = useState(0);
  const tabRefs = useRef([]);

  const toggle = (i) => {
    setOpen((o) => (o === i ? null : i));
    setTab(i); // a wide screen later shows the last group opened
  };
  const select = (i) => {
    setTab(i);
    setOpen(i);
  };
  // The rail from the keyboard: arrows move (and select), Home and End jump.
  const onTabKey = (e, i) => {
    const n = FEATURE_GROUPS.length;
    const to = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    const next = (to + n) % n;
    select(next);
    tabRefs.current[next]?.focus();
  };

  const shown = (i) => (isDesktop ? tab === i : open === i);

  return (
    <div className="fc">
      <p className="fc-head">
        <Wordmark style={{ display: 'inline-block' }} />
        <span className="sr-only">Poolnautics</span>{' '}
        {/* The words before "handles all of it" show only where the long line fits (feature-card.css). */}
        <span className="fc-handles"><span className="fc-handles-more">is the pool company software that </span>handles all of it</span>
      </p>

      <div className="fc-body">
        {/* Wide screens: the names, as tabs. Hidden on narrower ones (the groups' own buttons are there). */}
        <div className="fc-rail" role="tablist" aria-label="Features" aria-orientation="vertical">
          {FEATURE_GROUPS.map((g, i) => (
            <button
              key={g.id}
              ref={(el) => { tabRefs.current[i] = el; }}
              type="button"
              id={`fc-tab-${g.id}`}
              className={`fc-tab${tab === i ? ' is-on' : ''}`}
              role="tab"
              aria-selected={tab === i}
              aria-controls={`fc-panel-${g.id}`}
              tabIndex={tab === i ? 0 : -1}
              onClick={() => select(i)}
              onMouseEnter={() => select(i)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              {g.name}
            </button>
          ))}
        </div>

        {FEATURE_GROUPS.map((g, i) => (
          <div key={g.id} className={`fc-group${open === i ? ' is-open' : ''}`}>
            {/* Narrower screens: the group's row. Hidden on wide ones (the rail's tab stands for it). */}
            <h3 className="fc-gh">
              <button
                type="button"
                id={`fc-btn-${g.id}`}
                className="fc-toggle"
                aria-expanded={open === i}
                aria-controls={`fc-panel-${g.id}`}
                onClick={() => toggle(i)}
              >
                {g.name}
                <ChevronDown className="fc-chev" size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            </h3>
            <div
              id={`fc-panel-${g.id}`}
              className={`fc-panel${tab === i ? ' is-selected' : ''}`}
              role={isDesktop ? 'tabpanel' : 'region'}
              aria-labelledby={isDesktop ? `fc-tab-${g.id}` : `fc-btn-${g.id}`}
              inert={shown(i) ? undefined : ''}
            >
              <div className="fc-panel-inner">
                <div className="fc-pname" aria-hidden="true">{g.name}</div>
                <p className="fc-desc">{g.desc}</p>
                <ul className="fc-list" role="list" style={{ '--rows': Math.ceil(g.features.length / 2) }}>
                  {g.features.map((f) => <li key={f}><Check />{f}</li>)}
                </ul>
                <GroupLink link={g.link} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fc-foot">
        <a href={isReserving ? '#reserve' : ctaHref(theme)} className="hero-cta fc-cta">
          {isReserving ? 'Reserve your spot' : 'Start your free trial'}
          <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
        </a>
        <div className="fc-foot-text">
          <p className="fc-foot-line">Every feature is included in your 30-day trial. No credit card.</p>
          <p className="fc-foot-note">Some features are part of the Vision plan. <a href="/pricing">Compare plans</a></p>
        </div>
      </div>
    </div>
  );
}
