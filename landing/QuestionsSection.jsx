import React from 'react';
import './questions.css';

// "Before you choose" (#questions): seven questions to ask any pool software, between #technicians and
// #collections. Built from the owner's spec (2026-11-27). Each answer is a bold short answer and a
// sentence or two, inline in one paragraph. The homepage's FAQPage JSON-LD (entry-server.jsx) takes these
// too, with the answer as it reads on the page (lead, a space, the body), so change the copy here only.
export const QUESTIONS = [
  {
    q: 'Whose account does my money land in?',
    lead: 'Yours.',
    body: 'Every company on Poolnautics has its own Stripe account. Payments go straight into it, then to your bank on your schedule, with no hidden platform fees.',
  },
  {
    q: 'Can a customer ever be billed twice?',
    lead: 'No.',
    body: 'Billing runs on durable execution: every step saves its progress, so a crash or dropped connection resumes where it stopped instead of starting over. Every invoice and charge is idempotent, with its own unique key, so a retry can’t run it twice. The database also refuses a second invoice for the same billing cycle.',
  },
  {
    q: 'What happens when a customer disputes a charge?',
    lead: 'You have proof.',
    body: 'Every charge is backed by a GPS-stamped service report, photos taken in the app at the pool, and the customer’s signed quote approval. You handle the dispute in your own Stripe account.',
  },
  {
    q: 'Can my techs fake a service report?',
    lead: 'Not without you knowing.',
    body: 'Every report is stamped with the phone’s GPS location when it’s sent. Photos can only come from the in-app camera, and you choose which readings are required, so pH or other readings never get skipped.',
  },
  {
    q: 'Can my techs keep working with no signal?',
    lead: 'Yes.',
    body: 'The next 7 days of routes are already on the phone. Techs fill in the whole report offline, readings, chemicals and photos included, and it sends when the signal comes back.',
  },
  {
    q: 'What happens when a card fails?',
    lead: 'It gets handled.',
    body: 'Poolnautics emails the customer, retries the card two days later and emails them again. Anything still failing shows up on your dashboard.',
  },
  {
    q: 'What if I want to leave?',
    lead: 'You take it all with you.',
    body: 'There’s no contract. Export your whole company to CSV, stop history and invoices included, and your Stripe account stays yours.',
  },
];

export const questionAnswerText = (item) => `${item.lead} ${item.body}`;

export default function QuestionsSection() {
  return (
    <section id="questions" className="qa-section" aria-labelledby="qa-title">
      <div className="qa-inner">
        <div className="qa-head">
          <p className="section-eyebrow">Before you choose</p>
          <h2 id="qa-title" className="section-title">
            Seven questions to ask any pool software.<br />Including us.
          </h2>
          <p className="section-sub">
            Any software looks good on a features page or during a demo. These are the questions that matter the day
            something goes wrong.
          </p>
        </div>
        <ol className="qa-list">
          {QUESTIONS.map((item) => (
            <li key={item.q} className="qa-item">
              <h3 className="qa-q">{item.q}</h3>
              <p className="qa-a"><strong className="qa-lead">{item.lead}</strong> {item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
