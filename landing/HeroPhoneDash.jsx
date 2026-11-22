import React from 'react';
import { Bell, Calendar, Check, ChevronRight, CircleAlert, Clock, FileText, Mail, MapPin, Plus, Repeat } from 'lucide-react';
import useLiveDate from './preview/liveDate.js';

// The homepage hero's card below lg (hero.css, "Phones and tablets: the dashboard card"): the app's
// phone dashboard (web app, src/components/dashboard/phone/PhoneHome.tsx) as static markup, dark only,
// with Bayside Pool Co.'s demo day, dated today (liveDate.js). The header stays put while the list under it moves with the page
// (useHeroCardScroll.js). Always rendered, so the pre-rendered page is the same at every width; from lg
// up hero.css hides it and the desktop dashboard shows instead. Decoration: hidden from screen readers,
// and no headings, so the page's outline stays the hero's own.

const ICON = { strokeWidth: 2, 'aria-hidden': true };

/** One row: icon, label (and a muted detail), value, then a chevron, or its space when it opens nothing. */
const Row = ({ icon: Icon, label, detail, value, chevron = true }) => (
  <div className="hd-row">
    <Icon size={18} {...ICON} className="hd-row-icon" />
    <span className="hd-row-label">
      {label}
      {detail && <span className="hd-muted"> · {detail}</span>}
    </span>
    {value != null && <span className="hd-row-value">{value}</span>}
    {chevron ? <ChevronRight size={14} {...ICON} className="hd-chevron" /> : <span className="hd-chevron" />}
  </div>
);

/** A muted section label, with a small chevron when it opens a page ("Routes today ›"). */
const Section = ({ title, link = false, children }) => (
  <div className="hd-section">
    <div className="hd-section-head">
      {title}
      {link && <ChevronRight size={13} {...ICON} />}
    </div>
    {children}
  </div>
);

/**
 * A route's stops done: "X of Y" (a green tick once it's finished), then the short bar, green when
 * finished and blue while under way. The bars sit last, so every route's lines up over the next.
 */
const RouteValue = ({ done, total }) => {
  const finished = done === total;
  return (
    <span className="hd-route">
      {finished ? (
        <span className="hd-route-count is-done"><Check size={13} strokeWidth={2.25} aria-hidden="true" />{done} of {total}</span>
      ) : (
        <span className="hd-route-count">{done} of {total}</span>
      )}
      <span className={`hd-route-bar${finished ? ' is-done' : ''}`}><span style={{ width: `${(done / total) * 100}%` }} /></span>
    </span>
  );
};

/** The menu: three lines, the middle one shorter. */
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M4 6h16M4 12h11M4 18h16" />
  </svg>
);

export default function HeroPhoneDash() {
  // Today on the visitor's clock (liveDate.js). Until the page runs, the demo's date holds the space, unseen.
  const today = useLiveDate();
  return (
    <div className="hero-dash" aria-hidden="true">
      <div className="hd-header">
        <span className="hd-title" style={today ? undefined : { visibility: 'hidden' }}>
          {today?.weekday ?? 'Tuesday'} <span className="hd-date">{today?.short ?? 'Oct 20'}</span>
        </span>
        <span className="hd-actions">
          <Bell size={20} {...ICON} />
          <MenuIcon />
          <span className="hd-plus"><Plus size={16} strokeWidth={2.25} aria-hidden="true" /></span>
        </span>
      </div>

      <div className="hd-list">
        <Section title="Needs attention">
          <Row icon={Mail} label="1 invoice to mail" />
          <Row icon={Clock} label="2 invoices past due" />
          <Row icon={CircleAlert} label="1 urgent request" />
          <Row icon={FileText} label="2 estimates awaiting approval" />
        </Section>

        <Section title="Routes today" link>
          <Row icon={MapPin} label="Justin Braswell" value={<RouteValue done={17} total={17} />} />
          <Row icon={MapPin} label="Gabriel Montoya" value={<RouteValue done={14} total={18} />} />
        </Section>

        <Section title="Money" link>
          <Row icon={Repeat} label="Recurring" value={<span className="hd-strong">$48,930/mo</span>} chevron={false} />
          <Row icon={Calendar} label="Next billing" detail={<span style={today ? undefined : { visibility: 'hidden' }}>{today?.tomorrow ?? 'Oct 21'}</span>} value="9 invoices" />
        </Section>
      </div>
    </div>
  );
}
