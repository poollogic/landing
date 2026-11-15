import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { PrimaryCta } from './shared.jsx';
import { isReserving } from '../onboarding.js';

// /ai-and-automations' last section, after the FAQ: "By the time you check your phone, it's already
// done." Dark, with a blue glow behind a card of what ran overnight. Copy, then the button, on the
// left; the card on the right (on phones: copy, card, button). Styles: ai.css (.ai-morning*).
// The card's rows rise in one after another the first time 40% of the section is on screen. Every
// row is in the pre-rendered HTML and visible: they're hidden only once this runs (is-armed), and
// reduced motion (or no IntersectionObserver) hides nothing.

const OVERNIGHT = [
  ['21:47', '9:47 PM', 'New lead from Facebook', 'Nacho Varga was sent your automated message through Poolnautics'],
  ['07:30', '7:30 AM', 'Heater quote approved', 'Work order sent to Mike’s phone'],
  ['08:00', '8:00 AM', 'Quiet hours over', '3 overdue reminders sent'],
  ['08:30', '8:30 AM', 'Autopay failed', 'Update-card link sent to the Hamlins'],
  ['08:47', '8:47 AM', 'Card updated', 'Hamlins paid $185.00'],
];

export default function Morning({ theme }) {
  const ref = useRef(null);

  useEffect(() => {
    const section = ref.current;
    if (!section || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    section.classList.add('is-armed');
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add('is-in');
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id="morning" className="section bg-mktg-page ai-morning" aria-labelledby="morning-heading">
      <div className="ai-morning-glow" aria-hidden="true" />
      <div className="container">
        <div className="ai-morning-grid">
          <div className="ai-morning-copy">
            <p className="section-eyebrow ai-eyebrow">Tomorrow, 9:02 AM</p>
            <h2 id="morning-heading" className="section-title text-mktg-primary ai-morning-title">
              By the time you check your phone, <span className="whitespace-nowrap">it’s already done.</span>
            </h2>
            <p className="ai-morning-sub">
              Leads answered. Late invoices chased. Failed cards fixed. Approved quotes turned into work orders. Poolnautics
              handles the routine for you, so your morning starts with coffee, <span className="whitespace-nowrap">not catch-up.</span>
            </p>
          </div>

          <div className="ai-morning-card">
            <div className="ai-morning-card-head">
              <span className="ai-morning-card-title">Since last night</span>
              <span className="ai-morning-card-brand">Poolnautics</span>
            </div>
            <ul className="ai-morning-list">
              {OVERNIGHT.map(([at, shown, title, detail]) => (
                <li key={title} className="ai-morning-item">
                  <span className="ai-morning-check" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
                  <span className="ai-morning-text">
                    <span className="ai-morning-item-title">{title}</span>
                    <span className="ai-morning-item-detail">{detail}</span>
                  </span>
                  <time className="ai-morning-time" dateTime={at}>{shown}</time>
                </li>
              ))}
            </ul>
            <div className="ai-morning-needs">
              <span className="ai-morning-needs-label">Needs you</span>
              <span className="ai-morning-needs-value">Nothing</span>
            </div>
          </div>

          <div className="ai-morning-action">
            {/* Its own wording while the site takes reservations; the usual trial button otherwise. */}
            <PrimaryCta theme={theme} label={isReserving ? 'Reserve my spot' : undefined} />
            <p className="ai-morning-fine">The 30-day trial includes everything. Your data exports as CSV, any time.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
