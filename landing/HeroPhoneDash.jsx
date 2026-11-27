import React from 'react';
import { Bell, Calendar, Check, ChevronLeft, ChevronRight, CircleAlert, Clock, FileText, Mail, MapPin, Plus, Repeat, RotateCw, Search } from 'lucide-react';
import { HERO_DATE } from './preview/data.js';

// The homepage hero's phone below 768px (hero.css, "Phones: the iPhone"): the app's phone dashboard (web
// app, src/components/dashboard/phone/PhoneHome.tsx) in its light theme, open in Safari on an iPhone,
// with Bayside Pool Co.'s demo day, dated HERO_DATE (preview/data.js). Everything inside the screen is
// laid out at an iPhone's 393 × 852 points with the app's own sizes (52px rows, 14px names, 13px
// section labels, 18px icons) and scaled down as a whole to the screen's width, so it keeps the real
// proportions. Nothing in it moves. Always rendered, so the pre-rendered page is the same at every
// width; from 768px hero.css hides it and the desktop dashboard shows instead.
// An illustration: one text alternative (role="img"), so the status bar, search field and Safari bar
// inside are neither read out nor focusable, and no headings, so the page's outline stays the hero's own.

const ICON = { strokeWidth: 1.4, 'aria-hidden': true }; // the app's --home-icon-stroke

/**
 * One row: icon (red for the app's critical ones), label (and a muted detail), value, then a chevron,
 * or its space when it opens nothing.
 */
const Row = ({ icon: Icon, label, detail, value, chevron = true, critical = false }) => (
  <div className="hd-row">
    <Icon size={18} {...ICON} className={`hd-row-icon${critical ? ' is-critical' : ''}`} />
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
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M4 6h16M4 12h11M4 18h16" />
  </svg>
);

/** The status bar's right side: signal bars, "5G" and the battery. */
const StatusRight = () => (
  <span className="hd-status-icons">
    <svg width="19" height="12" viewBox="0 0 19 12" fill="currentColor" aria-hidden="true">
      <rect x="0" y="8" width="3.2" height="4" rx="1" /><rect x="5.2" y="5.5" width="3.2" height="6.5" rx="1" />
      <rect x="10.4" y="3" width="3.2" height="9" rx="1" /><rect x="15.6" y="0" width="3.2" height="12" rx="1" />
    </svg>
    <span className="hd-5g">5G</span>
    <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true">
      <rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" strokeOpacity=".4" />
      <rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor" />
      <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" fillOpacity=".45" />
    </svg>
  </span>
);

/** Safari's tabs button: two overlapping rounded squares. */
const TabsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <rect x="2.5" y="5.5" width="12" height="12" rx="2.5" />
    <path d="M5.5 2.5h9.5a2.5 2.5 0 0 1 2.5 2.5v9.5" />
  </svg>
);

export default function HeroPhoneDash() {
  return (
    <div
      className="hero-dash"
      role="img"
      aria-label="The Poolnautics dashboard on an iPhone: what needs attention, today's routes and the month's billing."
    >
      <div className="hd-screen">
        <div className="hd-status">
          <span className="hd-time">9:41</span>
          <span className="hd-island" />
          <StatusRight />
        </div>

        <div className="hd-header">
          <span className="hd-title">
            {HERO_DATE.weekday} <span className="hd-date">{HERO_DATE.short}</span>
          </span>
          <span className="hd-actions">
            <Bell size={22} {...ICON} />
            <MenuIcon />
            <span className="hd-plus"><Plus size={18} strokeWidth={2} aria-hidden="true" /></span>
          </span>
        </div>

        {/* The app's search (HomeSearch.tsx): a white field in a faint well. */}
        <div className="hd-search-well">
          <div className="hd-search">
            <Search size={18} strokeWidth={1.5} aria-hidden="true" />
            <span>Search</span>
          </div>
        </div>

        <div className="hd-list">
          <Section title="Needs attention">
            <Row icon={Mail} label="1 invoice to mail" critical />
            <Row icon={Clock} label="2 invoices past due" critical />
            <Row icon={CircleAlert} label="1 urgent request" />
            <Row icon={FileText} label="2 estimates awaiting approval" />
          </Section>

          <Section title="Routes today" link>
            <Row icon={MapPin} label="Justin Braswell" value={<RouteValue done={17} total={17} />} />
            <Row icon={MapPin} label="Gabriel Montoya" value={<RouteValue done={14} total={18} />} />
          </Section>

          <Section title="Money" link>
            <Row icon={Repeat} label="Recurring" value={<span className="hd-strong">$48,930/mo</span>} chevron={false} />
            <Row icon={Calendar} label="Next billing" detail={HERO_DATE.next} value="9 invoices" />
          </Section>
        </div>

        {/* Safari's bar, at the screen's foot: back, the address, tabs; then the home indicator. */}
        <div className="hd-safari">
          <span className="hd-sf-btn"><ChevronLeft size={22} strokeWidth={1.8} aria-hidden="true" /></span>
          <span className="hd-sf-url">
            <span>app.poolnautics.app</span>
            <RotateCw size={15} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span className="hd-sf-btn"><TabsIcon /></span>
        </div>
        <span className="hd-home" />
      </div>
    </div>
  );
}
