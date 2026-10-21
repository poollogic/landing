import React, { useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionHeader from './SectionHeader.jsx';
import './faq.css';

// The homepage FAQ. Every answer is confirmed against the app (October 2026).
// Pricing and fees are left out on purpose until the new plans are live. The
// same list feeds Google's FAQ data, added while this page is showing.

const FAQS = [
  {
    q: 'How long does it take to switch?',
    a: 'A typical customer list imports in a couple of minutes. Exports from Jobber and QuickBooks are recognized automatically; files from Skimmer, Pool Brain, Pooltrackr or any spreadsheet work too: PoolLogic suggests a match for each column and you confirm it. You set prices, billing cycles and the first invoice date as you import, and invoices go out automatically on the date you choose.',
  },
  {
    q: 'What comes over when I import?',
    a: 'Customers and their contact details, service and billing addresses, pool and equipment details, price and billing cycle, and the next invoice date. Routes come over too: technician, service day, stop order, and weekly or every-other-week service. Service history, balances and saved cards don’t.',
  },
  {
    q: 'Can you set it up for me?',
    a: 'Yes, on every plan. Send us a spreadsheet, a PDF or a photo of your route sheet (up to 10 files) and our team loads it in for you.',
  },
  {
    q: 'Is there a free trial? Do I need a credit card?',
    a: 'Yes: 30 days with everything in Vision and unlimited technicians. No credit card required.',
  },
  {
    q: 'Is there a contract or a setup fee?',
    a: 'Neither. Cancel any time from Settings › Plan, and your plan runs to the end of the period you’ve paid for. Every plan can export customers, invoices, payments, a tax summary and routes as CSV files.',
  },
  {
    q: 'Who processes payments?',
    a: 'Stripe. Each company has its own Stripe account, and payouts go straight to it.',
  },
  {
    q: 'What happens when an autopay payment fails?',
    a: 'PoolLogic retries once, 2 days later, unless the card was expired, lost or stolen. The customer is emailed both times. If the retry fails too, autopay switches off for that customer, you’re told, and the payment shows under “Payments to fix” on your dashboard.',
  },
  {
    q: 'Can I pass card fees on to customers?',
    a: 'Yes, on Insight and Vision. You set the surcharge, up to 3% and lower where state law requires it (2% in Colorado and Oklahoma, 2.9% in New York and New Jersey). It’s switched off where card fees aren’t allowed: Connecticut, Massachusetts, Maine, Puerto Rico and California. PoolLogic takes credit cards only; customers with a debit card pay by bank transfer (ACH).',
  },
  {
    q: 'Does it chase late payments?',
    a: 'Yes. Overdue reminders are automatic on every plan, starting the day after an invoice is due. You can also have late fees added automatically after a grace period, never twice. On Vision, PoolLogic can pause service for overdue accounts and resume it once they pay.',
  },
  {
    q: 'Does the technician app work without signal?',
    a: 'Yes, on Insight and Vision. Techs can fill in the whole service report offline, including readings, chemicals, tasks and photos, mark the stop done, and report a problem or a quick repair. Everything sends when the signal comes back, and the route for yesterday and the next 7 days is downloaded ahead of time.',
  },
  {
    q: 'Can I bill customers for chemicals?',
    a: 'Yes, on every plan. Turn on “Charge chemicals” for a customer and their next regular invoice gets a Chemicals line: the chemical cost of their visits plus your own markup.',
  },
  {
    q: 'Can customers see their payment history?',
    a: 'Yes, with no login needed. Every invoice link shows the customer’s balance, open invoices and full payment history, with a receipt for each payment.',
  },
  {
    q: 'Can I text my customers?',
    a: 'Yes, on Vision, from your own business number through Quo, Twilio, Telnyx or Dialpad. That covers bulk texts and automatic texts, like replying to a new lead.',
  },
  {
    q: 'How does selling a route work?',
    a: 'Send the customers to the buyer’s PoolLogic account and give them the 8-character transfer code, which works for 7 days. They get each customer’s details, equipment, notes, price, service days and every visit report. Billing history, saved cards, bank accounts and photos stay with you.',
  },
];

/**
 * The FAQ layout: header on the left, questions on the right. Defaults are the
 * homepage's; /pricing passes its own items, title and background. Only the
 * homepage publishes the questions as Google FAQ data.
 */
export default function FaqSection({
  items = FAQS,
  id = 'faq',
  eyebrow = 'FAQ',
  title = 'Questions, answered.',
  subtitle = <>Can’t find yours? <a href="/contact">Ask us anything</a>.</>,
  background,
  structuredData = true,
}) {
  // Google's FAQ data, matching the questions on the page, only while it shows.
  useEffect(() => {
    if (!structuredData) return undefined;
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'faq-ld';
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
    document.head.appendChild(el);
    return () => el.remove();
  }, [items, structuredData]);

  return (
    <section id={id} className="fq section" style={background ? { background } : undefined} aria-labelledby={`${id}-heading`}>
      <div className="fq-inner container">
        <div className="fq-intro">
          {/* The grid's gap separates header and questions, so no header margin. */}
          <SectionHeader
            align="left"
            className="mb-0"
            id={`${id}-heading`}
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            eyebrowClassName="text-[#86868b]"
            titleClassName="text-[#1d1d1f]"
            subtitleClassName="fq-sub text-[#6e6e73]"
          />
        </div>
        <div className="fq-list">
          {items.map((f, i) => (
            <details key={f.q} className="fq-item" open={i === 0}>
              <summary>
                <span>{f.q}</span>
                <ChevronDown size={18} strokeWidth={2} aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
