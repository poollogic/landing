import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader.jsx';
import './billing-section.css';

// "Billing on autopilot" (#billing): between the Repairs section and the Financial Watchdog. A still
// section: the header, one card that reads left to right (what the owner sets, what Poolnautics
// sends, what the customer pays) and three points under it. Replaces the pinned scroll section with
// the laptop (BillingScrollMorph.jsx, kept in the repo but no longer on the page).
//
// The card plays once as it comes into view (billing-section.css): the columns rise in left to right,
// each arrow after the column before it, then the Paid tag. The pre-rendered page draws it finished;
// the animation is only set up when the card is still below the window, so nothing on screen blinks
// out, and never with reduced motion.

const STEPS = [
  { label: 'You set', value: '$145 / month', note: 'Monthly, starting Dec 14' },
  { label: 'Poolnautics sends', value: 'Sent Dec 14', note: 'Invoice emailed, card fee and chemicals added' },
  { label: 'They pay', value: '$149.21', tag: 'Paid', note: 'One tap, or automatically on autopay' },
];
const POINTS = ['Monthly, quarterly or yearly', 'A different day for every customer', 'Saved cards charged automatically'];

const Tick = () => (
  <svg className="ba-tick" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export default function BillingSection() {
  const cardRef = useRef(null);
  const [anim, setAnim] = useState('none'); // 'none' (drawn finished) | 'armed' | 'in'

  useEffect(() => {
    const el = cardRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight) return undefined; // already on screen
    setAnim('armed');
    // Once about 45% of the card is in view.
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setAnim('in');
    }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = anim === 'none' ? '' : anim === 'armed' ? ' ba-anim' : ' ba-anim is-in';
  return (
    <section id="billing" className="ba-section" aria-labelledby="billing-heading">
      <div className="ba-inner">
        <SectionHeader
          id="billing-heading"
          eyebrow="Billing on autopilot"
          title="Never run billing again. Set it once."
          subtitle="Give each customer a rate and a date. The invoices go out by themselves from then on. No billing runs. No Send button."
        />

        {/* role="list": Safari drops a list's semantics once its markers are styled away. */}
        <ol ref={cardRef} className={`ba-card${cls}`} role="list">
          {STEPS.map((s, i) => (
            <li key={s.label} className="ba-step" style={{ '--i': i }}>
              {i > 0 && (
                <span className="ba-divider" aria-hidden="true">
                  <span className="ba-arrow"><ArrowRight size={14} strokeWidth={2.6} /></span>
                </span>
              )}
              <div className="ba-col">
                <span className="ba-label">{s.label}</span>
                <span className="ba-value">
                  {s.value}
                  {s.tag && <span className="ba-tag">{s.tag}</span>}
                </span>
                <span className="ba-note">{s.note}</span>
              </div>
            </li>
          ))}
        </ol>

        <ul className="ba-points" role="list">
          {POINTS.map((p) => <li key={p}><Tick /><span>{p}</span></li>)}
        </ul>
      </div>
    </section>
  );
}
