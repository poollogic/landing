import React, { useRef, useState } from 'react';
import useBrowserLayoutEffect from './useBrowserLayoutEffect.js';
import { onScrollFrame } from './scrollFrame.js';
import './day.css';

// The scroll-lit timeline section: the homepage's "A day with Poolnautics" (DaySection.jsx) and
// /recurring-billing's late invoices (landing/billing-page/LateInvoices.jsx). TimelineSection takes a
// header (eyebrow, heading lines, subhead) and a list of entries, and whatever follows the timeline
// (its closing) as children. Styles: day.css (.dt-*).
// All of it is in the pre-rendered HTML and fully visible without JavaScript. With it (and without
// reduced motion), the section gets .is-live: a blue line fills down the timeline as the page
// scrolls, the entry at the marker (56% of the window) is lit and the rest dimmed, and anything in the
// section marked .dt-reveal rises in once. Driven from the page's shared scroll frame while the
// section is on screen; offsets are measured on resize only, and each frame writes only the line's
// transform and, when they change, the entries' states.
//
// An entry: { label (the left column), time (optional: a date or time for its <time dateTime>),
// title, tag (a small label after the title), detail, results (a ticked list), note (a tech's note),
// audience (a tag under the detail, lit with its entry: { text, kind: 'email' | 'other' }) }; all but
// label and title are optional.

// Figures shown brighter than the text around them.
export const F = ({ children }) => <span className="dt-fig">{children}</span>;
// Kept on one line ("10-day", "5-minute"). Satoshi has no non-breaking hyphen, so not U+2011.
export const NB = ({ children }) => <span className="dt-nb">{children}</span>;

const MARKER = 0.56; // where an entry is reached, as a share of the window's height
const REVEAL = 0.82; // where .dt-reveal blocks rise in

/** Lights the timeline in the section `ref` points at. True once it's live (for the section's .is-live). */
export function useTimelineScroll(ref) {
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

  return live;
}

export default function DayTimeline({ entries }) {
  return (
    <div className="dt-timeline">
      <div className="dt-track" aria-hidden="true" />
      <div className="dt-progress" aria-hidden="true" />
      <ol className="dt-list">
        {entries.map((e) => (
          <li key={e.time ?? e.label} className="dt-entry">
            {e.time ? <time className="dt-time" dateTime={e.time}>{e.label}</time> : <span className="dt-time">{e.label}</span>}
            <span className="dt-dot" aria-hidden="true" />
            <div className="dt-body">
              <h3 className="dt-entry-title">{e.title}{e.tag && <><span className="dt-tag-gap"> </span><span className="dt-tag">{e.tag}</span></>}</h3>
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
            {e.audience && <p className={`dt-audience dt-audience--${e.audience.kind ?? 'other'}`}>{e.audience.text}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** The whole section: its glow, centred header, the timeline, then `children` (its closing). */
export function TimelineSection({ id, headingId, className = '', eyebrow, title, sub, entries, children }) {
  const ref = useRef(null);
  const live = useTimelineScroll(ref);
  return (
    <section ref={ref} id={id} className={`dt-section${className ? ` ${className}` : ''}${live ? ' is-live' : ''}`} aria-labelledby={headingId}>
      <div className="dt-glow" aria-hidden="true" />
      <div className="dt-inner">
        <p className="section-eyebrow dt-eyebrow">{eyebrow}</p>
        <h2 id={headingId} className="dt-title">
          {title.map((line, i) => <React.Fragment key={i}>{i > 0 && ' '}<span className="dt-title-line">{line}</span></React.Fragment>)}
        </h2>
        <p className="dt-sub">{sub}</p>

        <DayTimeline entries={entries} />

        {children}
      </div>
    </section>
  );
}
