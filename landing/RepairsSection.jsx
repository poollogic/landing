import React from 'react';
import { ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader.jsx';
import './repairs.css';

// "Repairs on autopilot": between Technicians on autopilot (#technicians) and Instant Migration (#switching).
// Dark. A repair from the tech's request to the paid invoice in five cards; the owner's only step is the
// second. Each card's "screen" is a still drawing of the app, not working UI: plain spans, read to screen
// readers as one image with a description. Nothing here moves or waits on JavaScript.

// The feature page for requests, diagnostics and work orders.
const WORK_ORDERS_HREF = '/workflow';

const Chip = ({ tone, children }) => <span className={`rp-chip rp-chip--${tone}`}>{children}</span>;

const STEPS = [
  {
    title: 'Your tech reports it',
    body: 'Submitted from the technician app at the pool. It lands on your dashboard, ready to price.',
    alt: 'New request: Cartridge filter is worn out. From Gabriel, in the tech app.',
    screen: (
      <>
        <span className="rp-screen-label">New request</span>
        <span className="rp-screen-main">Cartridge filter is worn out</span>
        <span className="rp-screen-foot"><span className="rp-screen-small">Gabriel · tech app</span></span>
      </>
    ),
  },
  {
    title: 'You set a price and hit send',
    body: 'Send it as a quote or as an invoice, whichever your company prefers.',
    tag: 'Your only step',
    alt: 'Send as a quote or an invoice, with Invoice selected. $125. Send.',
    screen: (
      <>
        <span className="rp-screen-label">Send as</span>
        <span className="rp-seg">
          <span className="rp-seg-opt">Quote</span>
          <span className="rp-seg-opt is-on">Invoice</span>
        </span>
        <span className="rp-screen-foot">
          <span className="rp-screen-price">$125</span>
          <Chip tone="send">Send</Chip>
        </span>
      </>
    ),
  },
  {
    title: 'The customer approves or pays',
    body: 'One tap from their phone. No login, no call back to the office.',
    alt: 'Customer: invoice paid, or quote approved. $125, from their phone.',
    screen: (
      <>
        <span className="rp-screen-label">Customer</span>
        <span className="rp-screen-main">Invoice paid</span>
        <span className="rp-screen-small">or quote approved</span>
        <span className="rp-screen-foot"><span className="rp-screen-small">$125 · from their phone</span></span>
      </>
    ),
  },
  {
    title: 'A tech gets the job',
    body: 'Once it’s approved or paid, the work order goes to your tech’s list.',
    alt: 'Work order: assigned to Gabriel. Cartridge filter, open.',
    screen: (
      <>
        <span className="rp-screen-label">Work order</span>
        <span className="rp-screen-main">Assigned to Gabriel</span>
        <span className="rp-screen-foot">
          <span className="rp-screen-small">Cartridge filter</span>
          <Chip tone="open">Open</Chip>
        </span>
      </>
    ),
  },
  {
    title: 'Done and paid',
    body: 'Quoted jobs are invoiced when the tech marks them complete. Invoiced jobs are already paid.',
    alt: 'Job complete: Gabriel marked it complete. $125, paid.',
    screen: (
      <>
        <span className="rp-screen-label">Job complete</span>
        <span className="rp-screen-main">Gabriel marked it complete</span>
        <span className="rp-screen-foot">
          <span className="rp-screen-price">$125</span>
          <Chip tone="paid">Paid</Chip>
        </span>
      </>
    ),
  },
];

export default function RepairsSection() {
  return (
    <section id="repairs" className="rp-section" aria-labelledby="repairs-heading">
      <div className="rp-inner">
        <SectionHeader
          id="repairs-heading"
          eyebrow="Repairs on autopilot"
          title="Invoice the $125 filter. Quote the $2,500 pump."
          subtitle="Either way, the work order writes itself. No phone tag, no chasing anyone down."
        />

        {/* role="list": Safari drops a list's semantics once its markers are styled away. */}
        <ol className="rp-flow" role="list">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rp-step">
              <div className={`rp-card${step.tag ? ' rp-card--yours' : ''}`}>
                <div className="rp-card-head">
                  <span className="rp-num"><span className="sr-only">Step </span>{i + 1}</span>
                  {step.tag && <span className="rp-tag">{step.tag}</span>}
                </div>
                <div className="rp-screen" role="img" aria-label={step.alt}>{step.screen}</div>
                <div className="rp-caption">
                  <h3 className="rp-card-title">{step.title}</h3>
                  <p className="rp-card-body">{step.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="rp-close">
          <p className="rp-close-1">A finished job that never gets billed is the easiest way for a pool company to lose money.</p>
          <p className="rp-close-2">Here, billing it doesn’t depend on anyone remembering.</p>
          <a href={WORK_ORDERS_HREF} className="rp-btn">
            Learn more about work orders
            <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
