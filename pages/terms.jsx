import React, { useEffect, useState } from 'react';

// Terms of Service — starter content. Review with counsel before publishing.
// Find-and-replace placeholders if needed:
//   PoolLogic, LLC        legal entity name
//   Florida               governing state
//   May 15, 2026          effective date
//   legal@poollogic.app   contact email

const SECTIONS = [
  { id: 'acceptance', title: 'Acceptance & Who This Applies To' },
  { id: 'eligibility', title: 'Eligibility & Account Security' },
  { id: 'service', title: 'The Service' },
  { id: 'payments', title: 'Payment Processing (Stripe)' },
  { id: 'autopay', title: 'Autopay & Saved Cards' },
  { id: 'subscriber', title: 'Subscriber Responsibilities' },
  { id: 'acceptable-use', title: 'Acceptable Use' },
  { id: 'fees', title: 'Fees, Cancellation & Refunds' },
  { id: 'data', title: 'Data Ownership' },
  { id: 'termination', title: 'Termination' },
  { id: 'disclaimers', title: 'Disclaimers & Limitation of Liability' },
  { id: 'indemnification', title: 'Indemnification' },
  { id: 'governing-law', title: 'Governing Law & Disputes' },
  { id: 'changes', title: 'Changes to These Terms' },
  { id: 'contact', title: 'Contact' },
];

const TermsPage = () => {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  // Highlight TOC entry for the section currently in the upper portion of the viewport.
  useEffect(() => {
    const headings = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!headings.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    );
    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, []);

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--ink-2)', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 56, paddingBottom: 72 }}>
        {/* Title block */}
        <header style={{ maxWidth: 880, marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-5)', fontFamily: "'Geist Mono', ui-monospace, monospace" }}>
            Legal
          </div>
          <h1 style={{ marginTop: 12, fontSize: 'clamp(36px, 4.4vw, 56px)', letterSpacing: '-0.035em', lineHeight: 1.05, color: 'var(--ink)' }}>
            Terms of Service
          </h1>
          <p style={{ marginTop: 16, fontSize: 16, color: 'var(--ink-4)', lineHeight: 1.6, maxWidth: 640 }}>
            These terms govern your use of PoolLogic. Please read them carefully — by creating an account or using the service, you agree to them.
          </p>
          <div style={{ marginTop: 22, display: 'flex', gap: 28, flexWrap: 'wrap', fontSize: 13.5, color: 'var(--ink-5)' }}>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Effective:</strong> May 15, 2026</span>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Provider:</strong> PoolLogic, LLC</span>
          </div>
        </header>

        {/* Two-column layout — sticky TOC on the left, body on the right */}
        <div className="terms-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 220px) minmax(0, 720px)',
          gap: 80,
          alignItems: 'start',
        }}>
          {/* Sticky TOC */}
          <nav className="terms-toc" style={{ position: 'sticky', top: 96, display: 'flex', flexDirection: 'column', gap: 2, fontSize: 13.5 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-5)', marginBottom: 12 }}>
              On this page
            </div>
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} style={{
                padding: '6px 0',
                color: activeId === s.id ? 'var(--accent)' : 'var(--ink-4)',
                fontWeight: activeId === s.id ? 600 : 400,
                borderLeft: activeId === s.id ? '2px solid var(--accent)' : '2px solid transparent',
                paddingLeft: 10,
                marginLeft: -12,
                transition: 'color .15s ease, border-color .15s ease',
                lineHeight: 1.4,
              }}>{s.title}</a>
            ))}
          </nav>

          {/* Body */}
          <article style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-3)' }}>
            <Section id="acceptance" title="1. Acceptance & Who This Applies To">
              <p>These Terms of Service ("Terms") form a binding agreement between you and PoolLogic, LLC ("PoolLogic," "we," "our," or "us"). They apply to two distinct types of users:</p>
              <ul>
                <li><strong>Subscribers</strong> — pool service businesses that create a PoolLogic account to manage their customers, routes, invoicing, and operations.</li>
                <li><strong>End Customers</strong> — homeowners or property managers who receive invoices, estimates, or service reports from a Subscriber through PoolLogic.</li>
              </ul>
              <p>Subscribers accept these Terms by creating an account. End Customers accept these Terms by paying an invoice, saving a payment method, or otherwise using PoolLogic-powered features provided by a Subscriber.</p>
            </Section>

            <Section id="eligibility" title="2. Eligibility & Account Security">
              <p>To create a Subscriber account, you must be at least 18 years old and authorized to bind your business to these Terms.</p>
              <p>You are responsible for safeguarding your login credentials and for any activity that occurs under your account, including actions taken by your staff. We recommend using a strong, unique password and enabling any available multi-factor authentication.</p>
              <p>Each business operates under a single PoolLogic organization. Staff members are added by the Subscriber and inherit permissions assigned by the account administrator. You agree to notify us promptly of any unauthorized access.</p>
            </Section>

            <Section id="service" title="3. The Service">
              <p>PoolLogic provides software for pool service businesses, including customer management, route dispatch, invoicing and estimates, recurring billing, payment processing (via Stripe), transactional email delivery (via Resend), and service-visit reporting.</p>
              <p>The service is provided on an "as is" and "as available" basis. We do not guarantee uninterrupted availability, error-free operation, or that the service will meet every requirement of your business. We will make reasonable efforts to maintain uptime, but planned maintenance and unforeseen outages may occur.</p>
            </Section>

            <Section id="payments" title="4. Payment Processing (Stripe)">
              <p><strong>Payments are processed by Stripe, not by PoolLogic.</strong> To send invoices or accept payments through PoolLogic, you must connect a Stripe account. By doing so, you agree to be bound by the <a href="https://stripe.com/connect-account/legal" target="_blank" rel="noreferrer noopener">Stripe Connected Account Agreement</a> and any other Stripe terms applicable to your account.</p>
              <p>PoolLogic is not a party to the underlying payment transaction. Funds flow directly from your customer to your connected Stripe account. PoolLogic facilitates the request and the record-keeping, but does not handle, hold, or transfer funds on your behalf.</p>
              <p>Stripe handles all cardholder data in a PCI-compliant environment. <strong>PoolLogic never sees, receives, or stores full card numbers, CVV codes, or other sensitive payment information.</strong></p>
              <p>All disputes, chargebacks, refunds, and reversals are between the Subscriber, the End Customer, and Stripe. PoolLogic is not responsible for resolving payment disputes and will not refund Subscriber fees on the basis of a chargeback.</p>
            </Section>

            <Section id="autopay" title="5. Autopay & Saved Cards">
              <p>End Customers may save a payment method to enable automatic recurring charges. When an End Customer saves a card through the PoolLogic invoice flow, they consent to recurring charges initiated by the Subscriber for services rendered.</p>
              <p>If a Subscriber adds a card on an End Customer's behalf, the Subscriber attests that they have obtained the End Customer's express permission and have read and accepted the in-app consent confirmation. Misrepresenting this consent is a material breach of these Terms and may result in account termination.</p>
              <p>End Customers may update or remove their saved payment method at any time through the Stripe Customer Portal. After <strong>three consecutive declined charges</strong>, autopay is automatically disabled for that customer and the Subscriber is notified.</p>
            </Section>

            <Section id="subscriber" title="6. Subscriber Responsibilities">
              <p>Subscribers are solely responsible for the accuracy and legitimacy of invoices, estimates, and service records they send to their customers through PoolLogic.</p>
              <p>You are responsible for complying with all applicable laws in the jurisdictions where you operate, including consumer-protection regulations, sales tax obligations, late-fee rules, refund-policy disclosures, and any licensing requirements for pool service work.</p>
              <p>You must have explicit permission to charge an End Customer. You may not use PoolLogic to bill for illegal services, to defraud customers, to harass or intimidate, or to send unsolicited communications.</p>
            </Section>

            <Section id="acceptable-use" title="7. Acceptable Use">
              <p>You agree not to:</p>
              <ul>
                <li>Resell, sublicense, or otherwise commercially exploit the service except as expressly permitted.</li>
                <li>Reverse-engineer, decompile, or attempt to extract the source code of the service.</li>
                <li>Use automated scrapers, bots, or other tools to access the service in a manner not intended by the user interface.</li>
                <li>Send spam, phishing messages, or any unsolicited communications through PoolLogic-provided email or messaging features.</li>
                <li>Upload malware, viruses, or any content designed to disrupt the service or other users.</li>
                <li>Attempt to gain unauthorized access to other accounts, systems, or data.</li>
                <li>Use the service to violate any law or the rights of any third party.</li>
              </ul>
            </Section>

            <Section id="fees" title="8. Fees, Cancellation & Refunds">
              <p>Subscriber fees, billing cycles, and any applicable taxes are presented before purchase and are charged automatically through Stripe to the payment method you provide. By subscribing, you authorize PoolLogic to charge that payment method on each renewal date.</p>
              <p>You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the then-current billing period. Access to paid features continues until that date.</p>
              <p>Except where required by law, fees already paid are <strong>non-refundable</strong>, including for partial months or unused portions of a billing period. We may, at our sole discretion, offer prorated refunds in exceptional circumstances.</p>
              <p>Free trial periods (currently 14 days) automatically convert to a paid subscription at the end of the trial unless canceled beforehand.</p>
            </Section>

            <Section id="data" title="9. Data Ownership">
              <p><strong>You own your data.</strong> Customer records, invoices, estimates, service reports, photos, and any other content you upload to PoolLogic remain your property.</p>
              <p>You grant PoolLogic a limited, non-exclusive, royalty-free license to host, process, transmit, and display your data solely for the purpose of operating and improving the service for you.</p>
              <p>You may export your data at any time during your subscription. On account closure or termination, you have <strong>30 days</strong> to export your data. After that period, we may delete it, subject to any legal or financial-record retention obligations (for example, Stripe transaction records, which are retained per Stripe's own policies).</p>
            </Section>

            <Section id="termination" title="10. Termination">
              <p>You may terminate your account at any time. We may terminate or suspend your account, with or without notice, if you (a) materially breach these Terms, (b) fail to pay subscription fees, (c) use the service for fraudulent or illegal activity, or (d) create risk or legal exposure for PoolLogic, other Subscribers, or End Customers.</p>
              <p>On termination, your right to access the service ends immediately. Records related to historical transactions, invoices, or other financial activity may be retained as required by law or by Stripe's record-keeping rules. Sections of these Terms that by their nature should survive termination (including ownership, indemnification, disclaimers, limitation of liability, and governing law) will survive.</p>
            </Section>

            <Section id="disclaimers" title="11. Disclaimers & Limitation of Liability">
              <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR UNINTERRUPTED OPERATION.</p>
              <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, POOLLOGIC'S TOTAL CUMULATIVE LIABILITY ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE TOTAL FEES YOU PAID TO POOLLOGIC IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS ($100).</p>
              <p>POOLLOGIC WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOST REVENUE, LOST DATA, OR BUSINESS INTERRUPTION, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
              <p>Some jurisdictions do not allow the exclusion or limitation of certain warranties or damages, so these limits may not apply to you in full.</p>
            </Section>

            <Section id="indemnification" title="12. Indemnification">
              <p>You agree to defend, indemnify, and hold harmless PoolLogic, its officers, employees, and contractors from and against any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising out of or related to (a) your use of the service, (b) your breach of these Terms, (c) your violation of any law or the rights of any third party, or (d) any dispute between you and an End Customer, including billing disputes, service complaints, or refund claims.</p>
            </Section>

            <Section id="governing-law" title="13. Governing Law & Disputes">
              <p>These Terms are governed by the laws of the State of Florida, without regard to its conflict-of-laws principles. The exclusive venue for any dispute arising out of or relating to these Terms is the state or federal courts located in Florida, and you consent to the personal jurisdiction of those courts.</p>
              <p>You and PoolLogic each waive any right to a jury trial in any proceeding arising out of or related to these Terms.</p>
            </Section>

            <Section id="changes" title="14. Changes to These Terms">
              <p>We may update these Terms from time to time. If we make material changes, we will notify you by email and post the updated Terms on this page with a new effective date. Material changes will take effect <strong>30 days</strong> after notice. Your continued use of the service after that period constitutes acceptance of the updated Terms.</p>
              <p>For non-material changes (such as clarifications or typo corrections), we may update these Terms without individual notice.</p>
            </Section>

            <Section id="contact" title="15. Contact">
              <p>For questions about these Terms or to send a legal notice, contact us at:</p>
              <p style={{ marginTop: 12 }}>
                <strong style={{ color: 'var(--ink-2)' }}>PoolLogic, LLC</strong><br/>
                <a href="mailto:legal@poollogic.app" style={{ color: 'var(--accent)' }}>legal@poollogic.app</a>
              </p>
            </Section>
          </article>
        </div>
      </div>
    </main>
  );
};

const Section = ({ id, title, children }) => (
  <section id={id} style={{ scrollMarginTop: 96, marginBottom: 36 }}>
    <h2 style={{
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '-0.015em',
      color: 'var(--ink)',
      marginBottom: 12,
      lineHeight: 1.3,
    }}>{title}</h2>
    <div className="terms-body">{children}</div>
  </section>
);

export default TermsPage;
