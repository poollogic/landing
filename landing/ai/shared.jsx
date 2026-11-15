import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import SectionHeader from '../SectionHeader.jsx';
import { ctaHref, isReserving } from '../onboarding.js';

// Pieces shared by the pages on ai.css (.ai-page): /ai-and-automations and /tech-app. The primary
// button ("Reserve your spot", or the trial while reservations are closed: onboarding.js), section
// headers in the dark and light treatments, and the tick list.

export const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--brand-blue)]';

export function PrimaryCta({ theme }) {
  return (
    <a href={ctaHref(theme)} className={`hero-cta ai-cta ${FOCUS}`}>
      <span className="hero-cta-label">{isReserving ? 'Reserve your spot' : 'Start your 30-day trial'}</span>
      <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
    </a>
  );
}

/** A section header on a dark band. */
export const header = (props) => (
  <SectionHeader eyebrowClassName="ai-eyebrow" titleClassName="text-mktg-primary" subtitleClassName="text-mktg-muted" {...props} />
);
/** A section header on a white or light grey band. */
export const headerLight = (props) => (
  <SectionHeader eyebrowClassName="ai-eyebrow" titleClassName="ai-title-light" subtitleClassName="ai-sub-light" {...props} />
);

/** Blue ticks, one line each. On a light band the text is slate and the ticks brand blue (.ai-light). */
export function Ticks({ items, className = '' }) {
  return (
    <ul className={`ai-ticks ${className}`}>
      {items.map((t) => (
        <li key={typeof t === 'string' ? t : t.key}>
          <Check size={16} strokeWidth={2.4} aria-hidden="true" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
