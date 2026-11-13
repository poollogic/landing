import React, { useState } from 'react';
import { ArrowRight, Bell, CreditCard, FileText, MessageSquare, Star, UserPlus } from 'lucide-react';
import AutomationFlow from './AutomationFlow.jsx';

// #automations (white): the built-in follow-ups on the left as a radio group, the automation card on
// the right showing the one picked (AutomationFlow.jsx). Each example with a wait remembers its own
// delay; the first example's row reads its delay ("Reply to new leads in 5 minutes"). The company,
// customers and messages are MOCK data. Starts on the first example, the same on the server and in
// the browser. Styles: ai.css ("Automations").

const EXAMPLES = [
  {
    key: 'lead',
    name: 'New lead follow-up',
    row: (delay) => (delay === 'Right away' ? 'Reply to new leads right away' : `Reply to new leads in ${delay}`),
    delay: '90 seconds',
    steps: [
      { kind: 'When', icon: UserPlus, title: 'A new lead comes into your Poolnautics', detail: 'From a webhook or another integration' },
      { kind: 'Wait', wait: true },
      {
        kind: 'Then',
        icon: MessageSquare,
        title: 'Text or email the lead',
        message: 'Hi Nacho, this is Chris with Bayside Pool Co. Thanks for reaching out! We got your request and we’d love to help with your pool. What’s a good time today for a quick call? Or just reply here and we’ll take it from there.',
      },
      { kind: 'Then', icon: Bell, title: 'Notify the office right away', detail: 'Nacho Varga was texted automatically' },
    ],
  },
  {
    key: 'payment',
    name: 'Failed payment',
    row: () => 'Send the update-card link when a payment fails',
    delay: '5 minutes',
    steps: [
      { kind: 'When', icon: CreditCard, title: 'A payment fails' },
      { kind: 'Wait', wait: true },
      {
        kind: 'Then',
        icon: MessageSquare,
        title: 'Text or email the customer',
        message: 'Hi Kim, this is Chris with Bayside Pool Co. Just a heads up, your payment for this month’s pool service didn’t go through. No worries, it happens! You can update your card in a few seconds here: [link]. Thanks so much.',
      },
    ],
  },
  {
    key: 'estimate',
    name: 'Estimate follow-up',
    row: () => 'Follow up on an estimate that isn’t approved',
    steps: [
      { kind: 'When', icon: FileText, title: 'An estimate isn’t approved', detail: 'After 3 days' },
      {
        kind: 'Then',
        icon: MessageSquare,
        title: 'Text or email the customer',
        message: 'Hi Howard, this is Chris with Bayside Pool Co. Just checking in on the estimate we sent you. If you have any questions, reply here and we’ll go over it with you. You can approve it whenever you’re ready.',
      },
      { kind: 'Then', icon: Bell, title: 'Notify the office right away', detail: 'Howard Hamlin was sent a follow-up automatically' },
    ],
  },
  {
    key: 'review',
    name: 'Review request',
    row: () => 'Ask for a review after the 4th service visit',
    steps: [
      { kind: 'When', icon: Star, title: 'A pool is serviced', detail: 'After the 4th service visit. You choose which visit.' },
      {
        kind: 'Then',
        icon: MessageSquare,
        title: 'Text or email your own message',
        message: 'Hi Kim, thank you for trusting us with your pool. We’re so happy to have you as a customer! You’ve just had your fourth visit, which means you’ve been with us for about a month. We’d love to hear what you think so far. If you have a minute, a quick review would mean a lot to our team: [your review link]. Thanks again, Bayside Pool Co.',
      },
    ],
  },
];

export default function Automations({ header, focus }) {
  const [picked, setPicked] = useState(0);
  const [delays, setDelays] = useState(() => Object.fromEntries(EXAMPLES.filter((e) => e.delay).map((e) => [e.key, e.delay])));
  const example = EXAMPLES[picked];

  return (
    <div className="ai-auto">
      <div className="ai-auto-copy" data-reveal="">
        {header}
        <fieldset className="ai-pick">
          <legend className="ai-pick-label">Built-in follow-ups <span>Tap one to try it</span></legend>
          {EXAMPLES.map((e, i) => (
            <label key={e.key} className={`ai-pick-row${i === picked ? ' is-on' : ''}`}>
              <input type="radio" name="ai-auto-example" className="sr-only" checked={i === picked} onChange={() => setPicked(i)} />
              <span className="ai-radio" aria-hidden="true" />
              <span>{e.row(delays[e.key])}</span>
            </label>
          ))}
        </fieldset>
        <a href="/workflow" className={`ai-link ${focus}`}>
          See how the workflow runs <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
        </a>
      </div>
      <div className="ai-auto-card" data-reveal="">
        <AutomationFlow
          example={example}
          delay={delays[example.key]}
          onDelay={(d) => setDelays((prev) => ({ ...prev, [example.key]: d }))}
        />
      </div>
    </div>
  );
}
