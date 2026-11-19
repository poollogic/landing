import React from 'react';
import { F, NB, TimelineSection } from './DayTimeline.jsx';

// "Meet your new office manager": a day at Bayside Pool Co. (demo data, matching the hero's) as a
// timeline, after "The only software your pool company needs". The timeline and its scroll lighting
// are DayTimeline.jsx (shared with /recurring-billing); this is the section, its day and its closing,
// which rises in once (.dt-reveal).

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

export default function DaySection() {
  return (
    <TimelineSection
      id="day"
      headingId="day-heading"
      eyebrow="A day with Poolnautics"
      title={['Meet your new office manager', 'who never calls in sick.']}
      sub="Here’s its Tuesday at Bayside Pool Co. Billing, routes and trucks, exactly as Poolnautics handled them."
      entries={ENTRIES}
    >
      <div className="dt-close dt-reveal">
        <p className="dt-close-1">You sent one quote. It did the rest.</p>
        <p className="dt-close-2">The less you have to do, the more you can do.</p>
        <a href="#reserve" className="hero-cta dt-cta">
          Reserve your spot
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </a>
      </div>
    </TimelineSection>
  );
}
