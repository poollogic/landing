import React, { useEffect, useState } from 'react';

// Privacy Policy — starter content. Review with counsel before publishing.
// Find-and-replace placeholders if needed:
//   PoolLogic, LLC          legal entity name
//   Florida                 governing state
//   May 15, 2026            effective date
//   privacy@poollogic.app   contact email
//
// Subprocessors listed below reflect the current stack — confirm before going live
// and update if hosting/database/email providers change.

const SECTIONS = [
  { id: 'scope', title: 'Who This Applies To' },
  { id: 'data-collected', title: 'What Data We Collect' },
  { id: 'how-collected', title: 'How We Collect Data' },
  { id: 'use', title: 'How We Use Data' },
  { id: 'legal-basis', title: 'Legal Basis for Processing' },
  { id: 'sharing', title: 'How We Share Data — Subprocessors' },
  { id: 'security', title: 'Data Security' },
  { id: 'cookies', title: 'Cookies & Tracking' },
  { id: 'retention', title: 'Data Retention' },
  { id: 'end-customer-rights', title: 'End Customer Rights' },
  { id: 'subscriber-rights', title: 'Subscriber Rights' },
  { id: 'children', title: 'Children' },
  { id: 'international', title: 'International Transfers' },
  { id: 'changes', title: 'Changes to This Policy' },
  { id: 'contact', title: 'Contact' },
];

const PrivacyPage = () => {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

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
      <ReviewBanner />

      <div className="container" style={{ paddingTop: 64, paddingBottom: 96 }}>
        {/* Title block */}
        <header style={{ maxWidth: 880, marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-5)', fontFamily: "'Geist Mono', ui-monospace, monospace" }}>
            Legal
          </div>
          <h1 style={{ marginTop: 12, fontSize: 'clamp(36px, 4.4vw, 56px)', letterSpacing: '-0.035em', lineHeight: 1.05, color: 'var(--ink)' }}>
            Privacy Policy
          </h1>
          <p style={{ marginTop: 16, fontSize: 16, color: 'var(--ink-4)', lineHeight: 1.6, maxWidth: 640 }}>
            How PoolLogic collects, uses, and protects information from the pool service businesses that use our software and the customers they serve.
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
            <Section id="scope" title="1. Who This Applies To">
              <p>This Privacy Policy describes how PoolLogic, LLC ("PoolLogic," "we," "our," or "us") handles personal information in two distinct roles:</p>
              <ul>
                <li><strong>For Subscribers</strong> — the pool service businesses who hold accounts with us — PoolLogic acts as a <em>data controller</em>. We decide how and why your account information is collected and used.</li>
                <li><strong>For End Customers</strong> — the homeowners and property managers whose information is entered into PoolLogic by a Subscriber — PoolLogic acts as a <em>data processor</em>. The Subscriber is the data controller and decides how that information is used. We process End Customer data only on the Subscriber's behalf and according to their instructions.</li>
              </ul>
              <p>If you are an End Customer with a privacy question or request, please contact the pool service company that holds your account. We forward any direct requests we receive to the relevant Subscriber.</p>
            </Section>

            <Section id="data-collected" title="2. What Data We Collect">
              <h3 style={subHeadStyle}>From Subscribers</h3>
              <ul>
                <li><strong>Account information:</strong> name, email address, phone number, organization name, business address.</li>
                <li><strong>Billing information:</strong> billing contact and payment method details. Card data is handled by Stripe — <strong>we never see, receive, or store full card numbers, CVV codes, or other sensitive payment details</strong>.</li>
                <li><strong>Usage data:</strong> features used, pages visited, IP address, browser and device characteristics, sign-in timestamps, and other operational metadata.</li>
              </ul>

              <h3 style={subHeadStyle}>From End Customers (entered by Subscribers, stored by PoolLogic)</h3>
              <ul>
                <li>Name, email address, phone number, service address, billing address.</li>
                <li>Saved payment method metadata only — card brand, last four digits, expiry date. <strong>The full card lives on Stripe</strong>; we receive only the non-sensitive metadata Stripe returns after a save-card flow.</li>
                <li>Service history, water-chemistry readings, technician notes, and photos uploaded during service visits.</li>
                <li>Invoice, estimate, and payment history.</li>
              </ul>

              <h3 style={subHeadStyle}>From Website Visitors</h3>
              <ul>
                <li>IP address, browser type and version, pages visited, referring URL, and other standard server-log information used for security and basic analytics.</li>
              </ul>
            </Section>

            <Section id="how-collected" title="3. How We Collect Data">
              <ul>
                <li><strong>Directly from Subscribers</strong> — at account signup, when configuring billing or organization settings, and when entering customer records.</li>
                <li><strong>Automatically</strong> — through cookies and browser local storage for session management and UI state, and through server logs that record requests to the service.</li>
                <li><strong>From third parties</strong> — Stripe returns card metadata (brand, last four, expiry) after an End Customer saves a payment method. Identity-verification or anti-fraud signals may also be returned by Stripe.</li>
              </ul>
            </Section>

            <Section id="use" title="4. How We Use Data">
              <p>We use the information described above to:</p>
              <ul>
                <li>Operate the service — sending invoices, processing payments, dispatching routes, generating service reports.</li>
                <li>Communicate with Subscribers about account activity, billing, product updates, and support requests.</li>
                <li>Communicate with End Customers <strong>on a Subscriber's behalf</strong> — for example, sending invoice notifications, payment receipts, or autopay decline notices that the Subscriber has configured.</li>
                <li>Maintain and improve the service, including diagnosing errors, measuring performance, and developing new features.</li>
                <li>Detect, prevent, and respond to fraud, security incidents, and abuse.</li>
                <li>Comply with legal obligations, including tax, accounting, and anti-money-laundering rules.</li>
              </ul>
              <p>We do not sell personal information. We do not use End Customer data to advertise to End Customers.</p>
            </Section>

            <Section id="legal-basis" title="5. Legal Basis for Processing">
              <p>Where the GDPR or similar laws apply, we rely on the following legal bases:</p>
              <ul>
                <li><strong>Contract performance</strong> — processing necessary to provide the service to Subscribers.</li>
                <li><strong>Legitimate interest</strong> — security, fraud prevention, service improvement, and operating our business.</li>
                <li><strong>Consent</strong> — for any marketing communications or non-essential cookies. You may withdraw consent at any time.</li>
                <li><strong>Legal obligation</strong> — for tax, accounting, and compliance record-keeping.</li>
              </ul>
            </Section>

            <Section id="sharing" title="6. How We Share Data — Subprocessors">
              <p>We share data with the following vendors ("subprocessors") who help us operate the service. We require each to maintain appropriate security and privacy practices.</p>
              <div style={{ marginTop: 18, border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
                <SubprocessorRow
                  name="Stripe"
                  purpose="Payment processing, customer card storage, payouts."
                  shared="Full payment method data, customer name, billing/service address, charge amounts, invoice metadata."
                  link="https://stripe.com/privacy"
                />
                <SubprocessorRow
                  name="Supabase"
                  purpose="Application database and authentication."
                  shared="Account data, Subscriber-entered customer records, service history. Data is encrypted at rest."
                  link="https://supabase.com/privacy"
                />
                <SubprocessorRow
                  name="Resend"
                  purpose="Transactional email delivery (invoice notifications, receipts, account emails)."
                  shared="Recipient email addresses and the content of transactional emails we send."
                  link="https://resend.com/legal/privacy-policy"
                />
                <SubprocessorRow
                  name="Cloudflare"
                  purpose="DNS, CDN, web application hosting, and DDoS protection."
                  shared="IP address, request metadata, and any data transmitted over the public site."
                  link="https://www.cloudflare.com/privacypolicy/"
                />
              </div>
              <p style={{ marginTop: 18 }}>If we add or change a subprocessor, we'll update this list. We do not sell personal information to third parties.</p>
            </Section>

            <Section id="security" title="7. Data Security">
              <p>We take reasonable technical and organizational measures to protect personal information, including:</p>
              <ul>
                <li>HTTPS / TLS 1.2+ encryption for all traffic between users and PoolLogic.</li>
                <li>Stripe handles all sensitive cardholder data in a PCI-DSS Level 1 compliant environment. <strong>PoolLogic never sees or stores full card numbers.</strong></li>
                <li>Database encryption at rest, provided by our database host.</li>
                <li>Row-level access controls so that staff at one Subscriber's organization cannot access another Subscriber's customer data.</li>
                <li>Internal access restrictions — only authorized PoolLogic personnel can access systems containing personal information, and only for legitimate operational reasons.</li>
              </ul>
              <p>No security measure is absolute. We cannot guarantee that personal information will never be compromised, but we work continuously to reduce risk.</p>
            </Section>

            <Section id="cookies" title="8. Cookies & Tracking">
              <p>We use a small number of cookies and similar technologies:</p>
              <ul>
                <li><strong>Session cookies</strong> for authentication — required for the service to function.</li>
                <li><strong>Local storage</strong> for UI preferences such as collapsed sidebar state or theme selection.</li>
                <li><strong>Analytics</strong> — we may use basic, privacy-respecting analytics to understand traffic patterns. Where we use cookies for analytics, we do so in a way that aggregates and anonymizes the data.</li>
              </ul>
              <p>You can disable cookies in your browser settings, but doing so will prevent you from signing in.</p>
            </Section>

            <Section id="retention" title="9. Data Retention">
              <ul>
                <li><strong>Subscriber account data</strong> — retained while the account is active. After account closure, account data is retained for 90 days to allow for export, then deleted, except as noted below.</li>
                <li><strong>Financial records</strong> — invoices, payment records, and tax-relevant documents are retained for <strong>seven (7) years</strong> as required by U.S. tax and audit rules.</li>
                <li><strong>End Customer data</strong> — retained for as long as the Subscriber's account is active. Deleted on a Subscriber's request, on account closure (subject to the 90-day window above), or on the End Customer's request once forwarded to the Subscriber.</li>
                <li><strong>Stripe records</strong> — payment records held by Stripe are governed by Stripe's own retention policies. We cannot delete records from Stripe on your behalf; contact Stripe directly for those requests.</li>
              </ul>
            </Section>

            <Section id="end-customer-rights" title="10. End Customer Rights">
              <p>If you are an End Customer (a homeowner or property manager receiving services from a Subscriber who uses PoolLogic):</p>
              <ul>
                <li>The Subscriber — the pool service company — is the controller of your personal information. To request access, correction, deletion, or export of your data, please contact them directly.</li>
                <li>If you contact PoolLogic with such a request, we will forward it to the relevant Subscriber within a reasonable time and assist them in fulfilling it.</li>
                <li>Where required by law (including under the GDPR, CCPA, or similar regimes), you have rights to access, correct, delete, restrict, or port your personal data, and to object to certain processing.</li>
              </ul>
            </Section>

            <Section id="subscriber-rights" title="11. Subscriber Rights">
              <p>Subscribers may at any time:</p>
              <ul>
                <li>Access and review the personal information we hold about their account.</li>
                <li>Export their customer records, invoices, and other account data through the in-app export feature.</li>
                <li>Correct or update inaccurate account information.</li>
                <li>Delete their account, which begins the 90-day deletion window described in Section 9.</li>
              </ul>
              <p>To exercise any of these rights, contact us at <a href="mailto:privacy@poollogic.app" style={{ color: 'var(--accent)' }}>privacy@poollogic.app</a> or use the relevant in-app controls.</p>
            </Section>

            <Section id="children" title="12. Children">
              <p>PoolLogic is not directed to, and we do not knowingly collect personal information from, anyone under 18 years of age. If you believe a minor has provided personal information to PoolLogic, please contact us and we will take steps to delete it.</p>
            </Section>

            <Section id="international" title="13. International Transfers">
              <p>PoolLogic is operated from the United States and our service is currently offered to U.S.-based pool service businesses. If you access the service from outside the United States, personal information you provide will be transferred to and processed in the U.S., where data-protection laws may differ from those of your country.</p>
              <p>Where international transfers occur and a legal mechanism is required (such as Standard Contractual Clauses under the GDPR), we will rely on the appropriate framework.</p>
            </Section>

            <Section id="changes" title="14. Changes to This Policy">
              <p>We may update this Privacy Policy from time to time. If we make material changes, we'll notify Subscribers by email and post the updated policy on this page with a new effective date. For non-material changes (such as typo corrections or clarifications), we may update the policy without individual notice.</p>
            </Section>

            <Section id="contact" title="15. Contact">
              <p>For privacy questions, complaints, or requests, contact us at:</p>
              <p style={{ marginTop: 12 }}>
                <strong style={{ color: 'var(--ink-2)' }}>PoolLogic, LLC</strong><br/>
                <a href="mailto:privacy@poollogic.app" style={{ color: 'var(--accent)' }}>privacy@poollogic.app</a>
              </p>
            </Section>
          </article>
        </div>
      </div>
    </main>
  );
};

const subHeadStyle = {
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: '-0.005em',
  color: 'var(--ink-2)',
  marginTop: 24,
  marginBottom: 8,
};

const Section = ({ id, title, children }) => (
  <section id={id} style={{ scrollMarginTop: 96, marginBottom: 56 }}>
    <h2 style={{
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '-0.015em',
      color: 'var(--ink)',
      marginBottom: 16,
      lineHeight: 1.3,
    }}>{title}</h2>
    <div className="terms-body">{children}</div>
  </section>
);

const SubprocessorRow = ({ name, purpose, shared, link }) => (
  <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--line-2)' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-2)' }}>{name}</span>
      <a href={link} target="_blank" rel="noreferrer noopener" style={{ fontSize: 13, color: 'var(--accent)' }}>Privacy policy →</a>
    </div>
    <div style={{ marginTop: 6, fontSize: 14, color: 'var(--ink-4)', lineHeight: 1.55 }}>{purpose}</div>
    <div style={{ marginTop: 4, fontSize: 13.5, color: 'var(--ink-5)', lineHeight: 1.55 }}>
      <strong style={{ color: 'var(--ink-4)' }}>Data shared:</strong> {shared}
    </div>
  </div>
);

const ReviewBanner = () => (
  <div role="alert" style={{
    background: 'color-mix(in oklab, var(--brand-orange) 10%, var(--bg))',
    borderBottom: '1px solid color-mix(in oklab, var(--brand-orange) 28%, transparent)',
    color: 'var(--ink-2)',
    fontSize: 13,
    padding: '10px 20px',
    textAlign: 'center',
    lineHeight: 1.45,
  }}>
    <strong style={{ color: 'var(--ink) ' }}>Template — review with counsel before publishing.</strong>{' '}
    <span style={{ color: 'var(--ink-4)' }}>This is starter content, not legal advice. Have an attorney review before this page is live to customers.</span>
  </div>
);

export default PrivacyPage;
