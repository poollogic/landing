import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import SectionHeader from '../SectionHeader.jsx';

// "The routine runs itself" (light grey), the first section after the hero: what Poolnautics runs on
// its own (left) beside what you'd ask your AI for (right). No buttons; one link, to /claude. The
// requests are drawings of chat requests, not a working chat. On the homepage's type and spacing
// tokens; styles: ai.css ("The routine runs itself", under #routine: /claude's guardrails card shares
// the card classes).

const BUILT_IN = [
  'A new lead gets a text in 90 seconds',
  'An approved quote becomes a work order',
  'Overdue reminders go out on schedule',
  'Late fees and paused accounts follow your rules',
  'A failed payment sends the update-card link',
  'A new customer’s details go to your other apps, like your phone system',
];

const REQUESTS = [
  'Raise everyone under $120 a month by $10 if they haven’t had an increase in the last 6 months',
  'Update the Hamlin gate code to 3072',
  'Temporarily shift CJ’s route this week to Jim',
  'Quote Wexler’s heater from the info on the request',
];

export default function Routine() {
  return (
    <section id="routine" className="section ai-routine bg-slate-50" data-theme="light" aria-labelledby="routine-heading">
      <div className="container">
        <div className="ai-routine-inner">
          <SectionHeader
            id="routine-heading"
            title={<><span>Pool company software with billing, follow-ups</span>{' '}<span>and work orders already automated.</span></>}
            subtitle="No more weekends spent building your own automations and gluing them onto legacy pool software with Zapier. Poolnautics comes with the routine already built, and you can hand any part of it to your AI whenever you like."
          />

          <div className="ai-routine-cards">
            <div className="ai-routine-card">
              <p className="section-eyebrow">Poolnautics automations</p>
              <h3 className="ai-routine-card-title">Runs on its own</h3>
              <ul className="ai-routine-list">
                {BUILT_IN.map((t) => (
                  <li key={t}><Check size={18} strokeWidth={2.4} aria-hidden="true" /><span>{t}</span></li>
                ))}
              </ul>
              <p className="ai-routine-foot">
                <strong>Built into the software that runs your business.</strong> Your automations live alongside your
                routes, billing, customers and work orders, so there’s nothing to connect or keep in sync. A reminder
                that fails is retried, quiet hours are respected, and none of it uses AI tokens.
              </p>
            </div>

            <div className="ai-routine-card">
              <p className="section-eyebrow">Your AI</p>
              <h3 className="ai-routine-card-title">One request away</h3>
              <ul className="ai-routine-bubbles" aria-label="Example requests">
                {REQUESTS.map((t) => <li key={t}>{t}</li>)}
              </ul>
              <p className="ai-routine-foot">
                <strong>No mapping, no figuring it out.</strong> Our MCP hands your AI the Poolnautics blueprint, so
                Claude, ChatGPT or Grok knows how to do the job. The guardrails are built into Poolnautics, not the
                prompt, so no AI can talk its way into charging a card, or changing a price without your approval.
              </p>
              <a href="/claude" className="ai-routine-link">
                See Poolnautics for Claude <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
