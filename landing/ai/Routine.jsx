import React from 'react';
import { Check } from 'lucide-react';
import SectionHeader from '../SectionHeader.jsx';

// "The routine runs itself" (white), the first section after the hero: what Poolnautics runs on its
// own (left) beside what you'd ask your AI for (right). No links or buttons; the requests are still
// drawings of chat bubbles, not a working chat. On the homepage's type and spacing tokens; styles:
// ai.css ("The routine runs itself").

const BUILT_IN = [
  'Overdue reminders go out on schedule',
  'Late fees and paused accounts follow your rules',
  'A failed payment sends the update-card link',
  'An approved quote becomes a work order',
  'Technicians are asked to update their truck odometer',
];

const REQUESTS = [
  'Remind those three again today',
  'Note the Hamlins’ new gate code',
  'Move CJ’s requests to Marcus, he’s out sick',
  'Invoice the approved Wexler heater quote',
];

export default function Routine() {
  return (
    <section id="routine" className="section ai-routine bg-white" data-theme="light" aria-labelledby="routine-heading">
      <div className="container">
        <div className="ai-routine-inner">
          <SectionHeader
            id="routine-heading"
            title={<><span>The routine runs itself.</span>{' '}<span>The exceptions are one request away.</span></>}
            subtitle="Most automation tools leave the process to you. Poolnautics has it built in, so your AI is only needed for everything else."
          />

          <div className="ai-routine-cards">
            <div className="ai-routine-card">
              <p className="section-eyebrow">Built in</p>
              <h3 className="ai-routine-card-title">Runs on its own</h3>
              <ul className="ai-routine-list">
                {BUILT_IN.map((t) => (
                  <li key={t}><Check size={18} strokeWidth={2.4} aria-hidden="true" /><span>{t}</span></li>
                ))}
              </ul>
              <p className="ai-routine-foot">
                <strong>Durable, and no AI tokens.</strong> A reminder that fails to send is retried. One that falls in
                quiet hours waits until morning. None of it depends on an AI remembering.
              </p>
            </div>

            <div className="ai-routine-card">
              <p className="section-eyebrow">Your AI</p>
              <h3 className="ai-routine-card-title">One request away</h3>
              <ul className="ai-routine-bubbles" aria-label="Example requests">
                {REQUESTS.map((t) => <li key={t}>{t}</li>)}
              </ul>
              <p className="ai-routine-foot">
                <strong>Any model is safe to use.</strong> Connect Claude, ChatGPT, Grok or your own. Poolnautics sets
                the limits, so none of them can charge a card or approve its own price change.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
