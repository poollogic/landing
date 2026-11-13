import React, { useRef, useState } from 'react';
import useBrowserLayoutEffect from './useBrowserLayoutEffect.js';
import { onScrollFrame } from './scrollFrame.js';
import './day.css';

// "Meet your new office manager": a day at Bayside Pool Co. (demo data, matching the hero's) as a
// timeline, after "The only software your pool company needs". All of it is in the pre-rendered HTML
// and fully visible without JavaScript. With it (and without reduced motion), the section gets
// .is-live: a blue line fills down the timeline as the page scrolls, the entry at the marker (56% of
// the window) is lit and the rest dimmed, and the closing lines rise in once. Driven from
// the page's shared scroll frame while the section is on screen; offsets are measured on resize only,
// and each frame writes only the line's transform and, when they change, the entries' states.

// Figures shown brighter than the text around them.
const F = ({ children }) => <span className="dt-fig">{children}</span>;
// Kept on one line ("10-day", "5-minute"). Satoshi has no non-breaking hyphen, so not U+2011.
const NB = ({ children }) => <span className="dt-nb">{children}</span>;

const ENTRIES = [
  {
    time: '07:26', label: '7:26 AM', title: 'Michael submitted a truck check-in',
    detail: <><F>70,612 mi</F>. Oil change due at <F>71,000</F></>,
  },
  {
    time: '08:30', label: '8:30 AM', title: 'The daily billing run',
    results: [
      <><F>163 invoices</F> emailed, <F>$26,409</F></>,
      <><F>8 invoices</F> sent for mailing, printed and posted for you</>,
      <>Autopay collected. Receipts emailed to every customer</>,
      <><F>1 autopay</F> failed on an expired card. Customer emailed a link to update it</>,
      <>Late fees applied to <F>6 invoices</F> past the <NB>10-day</NB> grace period</>,
      <><F>1 customer</F> paused at 30 days past due. Route slot held</>,
    ],
  },
  {
    time: '09:14', label: '9:14 AM', title: 'You sent a quote to Avery Collins',
    detail: <>DE split &amp; clean, <F>$175</F>. Linked to a work order for Justin</>,
  },
  {
    time: '09:36', label: '9:36 AM', title: 'Avery Collins approved the quote',
    detail: <>Moved to Justin’s open work orders automatically</>,
  },
  {
    time: '13:07', label: '1:07 PM', title: 'Justin marked the DE split & clean complete',
    detail: <>Work order completed in the mobile app</>,
  },
  {
    time: '13:12', label: '1:12 PM', title: 'Invoice sent to Avery Collins for: DE split & clean',
    detail: <><F>$175</F>, after your <NB>5-minute</NB> automated invoicing delay</>,
  },
  {
    time: '16:27', label: '4:27 PM', title: 'All technicians finished their routes',
    detail: <><F>59 of 60 stops</F> completed. <F>1 stop</F> marked could not service.</>,
    note: 'Porch was locked, customer was not home. Salt cell is generating, should be fine until next week.',
  },
  {
    time: '18:44', label: '6:44 PM', title: 'Avery Collins paid the invoice for: DE split & clean',
    detail: <><F>$175</F> + <F>$5.25</F> card fee, paid by credit card from the emailed invoice. Receipt sent automatically.</>,
  },
];

const MARKER = 0.56; // where an entry is reached, as a share of the window's height
const REVEAL = 0.82; // where the closing rises in

export default function DaySection() {
  const ref = useRef(null);
  const [live, setLive] = useState(false);

  useBrowserLayoutEffect(() => {
    const section = ref.current;
    if (!section || !('IntersectionObserver' in window) || !('ResizeObserver' in window)) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const list = section.querySelector('.dt-list');
    const line = section.querySelector('.dt-progress');
    const entries = [...section.querySelectorAll('.dt-entry')];
    const reveals = [...section.querySelectorAll('.dt-reveal')];
    let listTop = 0;
    let listH = 0;
    let tops = [];
    let revealTops = [];
    let vh = 0;
    let lastScale = '';
    let lastCurrent = -2;
    const shown = new Set();

    // The only layout reads: on start and whenever the page's size changes.
    const measure = () => {
      const y = window.scrollY;
      const r = list.getBoundingClientRect();
      listTop = r.top + y;
      listH = r.height;
      tops = entries.map((e) => e.getBoundingClientRect().top + y);
      revealTops = reveals.map((e) => e.getBoundingClientRect().top + y);
      vh = window.innerHeight;
    };

    const frame = (y) => {
      const marker = y + MARKER * vh;
      const progress = Math.min(1, Math.max(0, (marker - (listTop + 10)) / (listH - 20)));
      const scale = `scaleY(${progress.toFixed(4)})`;
      if (scale !== lastScale) { lastScale = scale; line.style.transform = scale; }
      // Passed: the entry's top + 24px is above the marker. The current entry is the last passed.
      let current = -1;
      for (let i = 0; i < tops.length; i++) if (tops[i] + 24 < marker) current = i;
      if (current !== lastCurrent) {
        lastCurrent = current;
        entries.forEach((e, i) => { e.dataset.state = i < current ? 'passed' : i === current ? 'current' : 'upcoming'; });
      }
      reveals.forEach((e, i) => {
        if (!shown.has(i) && revealTops[i] < y + REVEAL * vh) { shown.add(i); e.classList.add('is-in'); }
      });
    };

    measure();
    // Already in or above view when this starts: shown, with no rise.
    reveals.forEach((e, i) => { if (revealTops[i] < window.scrollY + REVEAL * vh) { shown.add(i); e.classList.add('is-in', 'no-rise'); } });
    frame(window.scrollY);
    section.classList.add('is-live');
    setLive(true);

    let unsubscribe = null;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !unsubscribe) {
        unsubscribe = onScrollFrame(frame);
        frame(window.scrollY);
      } else if (!entry.isIntersecting && unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    });
    io.observe(section);
    // The page above can change height (fonts, lazy sections), moving everything here.
    const ro = new ResizeObserver(() => { measure(); frame(window.scrollY); });
    ro.observe(document.body);

    return () => {
      io.disconnect();
      ro.disconnect();
      unsubscribe?.();
      section.classList.remove('is-live');
      line.style.transform = '';
      entries.forEach((e) => { delete e.dataset.state; });
      reveals.forEach((e) => e.classList.remove('is-in', 'no-rise'));
    };
  }, []);

  return (
    <section ref={ref} id="day" className={`dt-section${live ? ' is-live' : ''}`} aria-labelledby="day-heading">
      <div className="dt-glow" aria-hidden="true" />
      <div className="dt-inner">
        <h2 id="day-heading" className="dt-title">
          <span className="dt-title-line">Meet your new office manager</span>{' '}
          <span className="dt-title-line">who never calls in sick.</span>
        </h2>
        <p className="dt-sub">
          Here’s its Tuesday at Bayside Pool Co. Billing, routes and trucks, exactly as Poolnautics handled them.
        </p>

        <div className="dt-timeline">
          <div className="dt-track" aria-hidden="true" />
          <div className="dt-progress" aria-hidden="true" />
          <ol className="dt-list">
            {ENTRIES.map((e) => (
              <li key={e.time} className="dt-entry">
                <time className="dt-time" dateTime={e.time}>{e.label}</time>
                <span className="dt-dot" aria-hidden="true" />
                <div className="dt-body">
                  <h3 className="dt-entry-title">{e.title}</h3>
                  {e.detail && <p className="dt-detail">{e.detail}</p>}
                  {e.results && (
                    <ul className="dt-results">
                      {e.results.map((r, i) => <li key={i}><span>{r}</span></li>)}
                    </ul>
                  )}
                  {e.note && (
                    <blockquote className="dt-note">
                      <p><span className="dt-note-label">Tech note:</span> {e.note}</p>
                    </blockquote>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="dt-close dt-reveal">
          <p className="dt-close-1">You sent one quote. It did the rest.</p>
          <p className="dt-close-2">The less you have to do, the more you can do.</p>
          <a href="#reserve" className="hero-cta dt-cta">
            Reserve Your Spot
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
