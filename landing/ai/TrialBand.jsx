import React from 'react';
import { Check } from 'lucide-react';
import { PrimaryCta } from './shared.jsx';
import { TRIAL_DAYS } from '../../aiFacts.js';

// The dark trial band: "Not on Poolnautics yet?", the trial button and three ticks. Under the hero on
// /ai-and-automations (pages/ai-integrations.jsx); the closing section of /pool-service-mileage-tracking
// (pages/mileage-tracking.jsx). Styles: ai.css (.ai-trial-band*), so the page must be an .ai-page.

// The trial buttons on /ai-and-automations: the nav's, this band's and the closing section's (Morning.jsx); no others.
const TRIAL_TICKS = [`Free for ${TRIAL_DAYS} days`, 'No card needed', 'Export your data any time'];

export default function TrialBand({ theme }) {
  return (
    <section className="ai-trial-band" aria-labelledby="trial-band-heading">
      <div className="container">
        <h2 id="trial-band-heading" className="ai-trial-band-title">Not on Poolnautics yet?</h2>
        <p className="ai-trial-band-ask">How much of last week went to chasing invoices?</p>
        <p className="ai-trial-band-sub">
          Poolnautics does that part for you. Try it free and see what your week looks like when the routine runs itself.
        </p>
        <div className="ai-trial-band-cta">
          <PrimaryCta theme={theme} label="Start your free trial" />
        </div>
        <ul className="ai-trial-band-ticks">
          {TRIAL_TICKS.map((t) => (
            <li key={t}><span className="ai-trial-band-tick" aria-hidden="true"><Check size={11} strokeWidth={3} /></span>{t}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
