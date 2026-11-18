import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import SectionHeader from './SectionHeader.jsx';
import './fleet.css';

// "Fleet on autopilot": between Repairs (#repairs) and Instant Migration (#switching). One card drawn
// from the app's Fleet page (FleetTab.tsx): the four count tiles, the Trucks and Mileage tabs, and on
// Trucks the check-in schedule and oil reminder dropdowns, then three points. The tabs and dropdowns
// work (only the tab's table and the dropdowns' values change); the rest is a still picture. Names and
// numbers are demo data: Michael's truck is the one whose oil change is soon, as on the hero dashboard.
// The pre-rendered page draws the Trucks tab with both menus closed, as the first render does.

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MILEAGE = [
  { name: 'Michael', days: ['41.2', '38.7', '36.4', '44.1', '39.9', null, null], total: '200.3' },
  { name: 'Gabriel', days: ['29.6', '33.0', '27.8', '31.5', '30.2', null, null], total: '152.1' },
  { name: 'Justin', days: [null, '22.4', '25.1', '19.7', '21.0', null, null], total: '88.2' },
];

const TRUCKS = [
  { name: 'Michael', truck: 'Nissan Frontier', checkIn: 'Today', reading: '70,612 miles', oil: '388 miles left', alert: true },
  { name: 'Gabriel', truck: 'Chevy Silverado', checkIn: '6d ago', reading: '48,930 miles', oil: '3,070 miles left' },
  { name: 'Justin', truck: 'Toyota Tacoma', checkIn: '2d ago', reading: '112,404 miles', oil: '1,596 miles left' },
];

const TILES = [
  ['Trucks on file', '3 of 3'],
  ['Check-ins due', '0'],
  ['Oil changes overdue', '0'],
  ['Oil changes soon', '1'],
];

const TABS = [
  { key: 'trucks', label: 'Trucks' },
  { key: 'mileage', label: 'Mileage' },
];

const CHECKIN_OPTIONS = ['Off', 'Every week', 'Every 2 weeks', 'Every month'];
const OIL_OPTIONS = ['On', 'Off'];
const WEEK = 'Oct 12 – 18, 2026';

const POINTS = [
  {
    title: 'Miles measured by GPS',
    body: 'The tech’s phone measures the distance between each stop, every day. Tracking runs from the first stop to the last, so the commute stays out of the log.',
  },
  {
    title: 'Truck check-ins on your schedule',
    body: 'Weekly, every two weeks or monthly. The app asks each tech for the odometer reading and a photo of the next oil change sticker, so you see how many miles each truck has left.',
  },
  {
    title: 'Ready for your accountant',
    body: 'Export stop-to-stop mileage with dates. Leave out a trip or correct the miles first if you need to.',
  },
];

/**
 * A dropdown as the app draws it: "Label **Value** ⌄". A button that opens a listbox; the arrow keys
 * open it and move through the options, Enter or Space picks one, Escape or Tab closes it. `open` and
 * `onOpen` come from the card, so only one menu is open at a time.
 */
function Dropdown({ label, options, value, onChange, open, onOpen, align }) {
  const id = useId();
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const [active, setActive] = useState(options.indexOf(value));

  // Opening puts the keyboard on the selected option.
  useEffect(() => {
    if (!open) return;
    setActive(options.indexOf(value));
    listRef.current?.focus();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = (refocus) => {
    onOpen(false);
    if (refocus) buttonRef.current?.focus();
  };
  const pick = (i) => {
    onChange(options[i]);
    close(true);
  };

  const onButtonKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      onOpen(true);
    }
  };
  const onListKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(options.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(options.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(active); }
    else if (e.key === 'Escape') { e.preventDefault(); close(true); }
    else if (e.key === 'Tab') close(false);
  };

  return (
    <div className="fl-dd">
      <button
        ref={buttonRef}
        type="button"
        className="fl-dd-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        onClick={() => onOpen(!open)}
        onKeyDown={onButtonKey}
      >
        <span className="fl-dd-label">{label}</span>
        <span className="fl-dd-value">{value}</span>
        <ChevronDown size={14} strokeWidth={2} aria-hidden="true" className="fl-dd-chev" />
      </button>
      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          className={`fl-dd-menu fl-dd-menu--${align}`}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKey}
        >
          {options.map((o, i) => (
            <li
              key={o}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={o === value}
              className={`fl-dd-item${i === active ? ' is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(i)}
            >
              <span>{o}</span>
              {o === value && <Check size={14} strokeWidth={2.4} aria-hidden="true" className="fl-dd-tick" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FleetCard() {
  const id = useId();
  const cardRef = useRef(null);
  const tabRefs = useRef([]);
  const [tab, setTab] = useState('trucks');
  const [checkins, setCheckins] = useState('Every 2 weeks');
  const [oil, setOil] = useState('On');
  const [menu, setMenu] = useState(null); // 'checkins' | 'oil' | null

  // A press anywhere but inside a dropdown closes the open menu.
  useEffect(() => {
    if (!menu) return undefined;
    const onDown = (e) => {
      const dd = e.target instanceof Element ? e.target.closest('.fl-dd') : null;
      if (!dd || !cardRef.current?.contains(dd)) setMenu(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [menu]);

  // The tabs: the arrow keys move between them and select, as in the app.
  const onTabKey = (e, i) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + TABS.length) % TABS.length;
    setTab(TABS[next].key);
    tabRefs.current[next]?.focus();
  };
  const opener = (name) => (open) => setMenu(open ? name : null);

  return (
    <div ref={cardRef} className="fl-card">
      <div className="fl-card-head">
        <p className="fl-card-title">Fleet</p>
      </div>

      {/* role="list": Safari drops a list's semantics once its markers are styled away. */}
      <ul className="fl-tiles" role="list" aria-label="Fleet at a glance">
        {TILES.map(([label, value]) => (
          <li key={label} className="fl-tile">
            <span className="fl-tile-label"><span className="fl-tile-dot" aria-hidden="true" /><span className="fl-tile-text">{label}</span></span>
            <span className="fl-tile-value">{value}</span>
          </li>
        ))}
      </ul>

      <div className="fl-bar">
        <div className="fl-tabs" role="tablist" aria-label="Fleet">
          {TABS.map((t, i) => (
            <button
              key={t.key}
              ref={(el) => { tabRefs.current[i] = el; }}
              type="button"
              role="tab"
              id={`${id}-tab-${t.key}`}
              aria-selected={tab === t.key}
              aria-controls={`${id}-panel-${t.key}`}
              tabIndex={tab === t.key ? 0 : -1}
              className={`fl-tab${tab === t.key ? ' is-on' : ''}`}
              onClick={() => setTab(t.key)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'trucks' ? (
          <div className="fl-controls">
            <Dropdown label="Check-ins" options={CHECKIN_OPTIONS} value={checkins} onChange={setCheckins} open={menu === 'checkins'} onOpen={opener('checkins')} align="left" />
            <Dropdown label="Oil reminders" options={OIL_OPTIONS} value={oil} onChange={setOil} open={menu === 'oil'} onOpen={opener('oil')} align="right" />
          </div>
        ) : (
          <p className="fl-range">{WEEK}</p>
        )}
      </div>

      <div id={`${id}-panel-trucks`} role="tabpanel" aria-labelledby={`${id}-tab-trucks`} hidden={tab !== 'trucks'} className="fl-table-box">
        <table className="fl-table fl-trucks">
          <thead>
            <tr>
              <th scope="col">Technician</th>
              <th scope="col">Truck</th>
              <th scope="col">Mileage</th>
              <th scope="col">Oil change</th>
            </tr>
          </thead>
          <tbody>
            {TRUCKS.map((t) => (
              <tr key={t.name}>
                {/* On phones the Truck column is hidden and the truck shows under the name instead. */}
                <th scope="row">{t.name}<span className="fl-truck-sub">{t.truck}</span></th>
                <td>{t.truck}</td>
                <td>
                  <span className="fl-checkin">{t.checkIn}</span>
                  <span className="fl-reading">{t.reading}</span>
                </td>
                <td><span className={`fl-pill${t.alert ? ' fl-pill--alert' : ''}`}>{t.oil}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div id={`${id}-panel-mileage`} role="tabpanel" aria-labelledby={`${id}-tab-mileage`} hidden={tab !== 'mileage'} className="fl-table-box">
        <table className="fl-table fl-mileage" aria-label={`Mileage, ${WEEK}`}>
          <thead>
            <tr>
              <th scope="col">Technician</th>
              {DAYS.map((d) => <th key={d} scope="col">{d}</th>)}
              <th scope="col">Miles</th>
            </tr>
          </thead>
          <tbody>
            {MILEAGE.map((row) => (
              <tr key={row.name}>
                <th scope="row">{row.name}</th>
                {row.days.map((mi, i) => (
                  <td key={DAYS[i]}>{mi === null ? <span className="fl-none">—</span> : mi}</td>
                ))}
                <td className="fl-total">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function FleetSection() {
  return (
    <section id="fleet" className="fl-section" aria-labelledby="fleet-heading">
      <div className="fl-inner">
        <SectionHeader
          id="fleet-heading"
          eyebrow="Fleet on autopilot"
          title="Every mile logged. Every oil change caught."
          subtitle="The tech app measures the miles between every stop by GPS. Scheduled truck check-ins capture the odometer and a photo of the oil change sticker."
          titleClassName="text-slate-900"
        />

        <FleetCard />

        <ul className="fl-points">
          {POINTS.map((p) => (
            <li key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
