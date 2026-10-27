import React, { useEffect, useState } from 'react';

// Terms of Service — starter content. Review with counsel before publishing.
// Find-and-replace placeholders if needed:
//   PoolLogic          legal entity name
//   Florida                 governing state
//   October 27, 2026        updated date
//   legal@poollogic.app     general legal contact email
//   copyright@poollogic.app DMCA designated agent email
//   [mailing address]       physical address for DMCA notices — fill before publishing

const SECTIONS = [
  { id: 'acceptance', title: 'Acceptance & Who This Applies To' },
  { id: 'eligibility', title: 'Eligibility & Account Security' },
  { id: 'service', title: 'The Service' },
  { id: 'payments', title: 'Payment Processing (Stripe)' },
  { id: 'surcharge', title: 'Card Surcharging & Pass-Through Fees' },
  { id: 'autopay', title: 'Autopay & Saved Cards' },
  { id: 'subscriber', title: 'Subscriber Responsibilities' },
  { id: 'route-transfers', title: 'Route Transfers (Route Handover Tool)' },
  { id: 'acceptable-use', title: 'Acceptable Use' },
  { id: 'communications', title: 'Communications & SMS Consent' },
  { id: 'fees', title: 'Fees, Cancellation & Refunds' },
  { id: 'data', title: 'Data Ownership & Feedback' },
  { id: 'termination', title: 'Termination & Suspension' },
  { id: 'disclaimers', title: 'Disclaimers & Limitation of Liability' },
  { id: 'indemnification', title: 'Indemnification' },
  { id: 'force-majeure', title: 'Force Majeure' },
  { id: 'disputes', title: 'Dispute Resolution & Arbitration' },
  { id: 'dmca', title: 'Copyright Complaints (DMCA)' },
  { id: 'general', title: 'General Provisions' },
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
      <div className="container" style={{ paddingTop: 'var(--page-top)', paddingBottom: 'var(--page-bottom)' }}>
        {/* Title block */}
        <header style={{ maxWidth: 880, marginBottom: 40 }}>
          <h1 style={{ fontSize: 'clamp(36px, 4.4vw, 56px)', letterSpacing: '-0.035em', lineHeight: 1.05, color: 'var(--ink)' }}>
            Terms of Service
          </h1>
          <p style={{ marginTop: 16, fontSize: 16, color: 'var(--ink-4)', lineHeight: 1.6, maxWidth: 640 }}>
            These terms govern your use of PoolLogic. Please read them carefully — by creating an account or using the service, you agree to them, including the binding arbitration and class-action waiver in Section 17.
          </p>
          <div style={{ marginTop: 22, display: 'flex', gap: 28, flexWrap: 'wrap', fontSize: 13.5, color: 'var(--ink-5)' }}>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Effective:</strong> May 15, 2026</span>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Updated:</strong> October 27, 2026</span>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Provider:</strong> PoolLogic</span>
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
              <p>These Terms of Service ("Terms") form a binding agreement between you and PoolLogic ("we," "our," or "us"). They apply to two distinct types of users:</p>
              <ul>
                <li><strong>Subscribers</strong> — pool service businesses that create a PoolLogic account to manage their customers, routes, invoicing, and operations.</li>
                <li><strong>End Customers</strong> — homeowners or property managers who receive invoices, estimates, or service reports from a Subscriber through PoolLogic.</li>
              </ul>
              <p>Subscribers accept these Terms by creating an account. End Customers accept these Terms by paying an invoice, saving a payment method, or otherwise using PoolLogic-powered features provided by a Subscriber.</p>

              <h3>Authority to Bind</h3>
              <p>If you accept these Terms on behalf of a business, organization, or other entity, you represent and warrant that you have the legal authority to bind that entity, and "Subscriber," "you," and "your" refer to that entity. If you do not have that authority, you must not accept these Terms or use the Service on the entity's behalf.</p>

              <h3>Electronic Communications and Records (E-SIGN)</h3>
              <p>You consent to receive all agreements, notices, disclosures, billing statements, and other communications we provide to you in connection with the Service in electronic form — by email to the address associated with your account, by posting in the Service, or by other reasonable electronic means — and you agree that this electronic delivery satisfies any legal requirement that such communications be in writing. You may withdraw this consent only by closing your account, which will terminate your access to the Service. You are responsible for keeping your email address current.</p>
            </Section>

            <Section id="eligibility" title="2. Eligibility & Account Security">
              <p>To create a Subscriber account, you must be at least 18 years old and authorized to bind your business to these Terms.</p>
              <p>You are responsible for safeguarding your login credentials and for any activity that occurs under your account, including actions taken by your staff. We recommend using a strong, unique password and enabling any available multi-factor authentication.</p>
              <p>Each business operates under a single PoolLogic organization. Staff members are added by the Subscriber and inherit permissions assigned by the account administrator. You agree to notify us promptly of any unauthorized access.</p>
            </Section>

            <Section id="service" title="3. The Service">
              <p>PoolLogic provides software for pool service businesses, including customer management, route dispatch, invoicing and estimates, recurring billing, payment processing (via Stripe), transactional email delivery (via Resend), and service-visit reporting.</p>
              <p>The service is provided on an "as is" and "as available" basis. We do not guarantee uninterrupted availability, error-free operation, or that the service will meet every requirement of your business. We will make reasonable efforts to maintain uptime, but planned maintenance and unforeseen outages may occur.</p>

              <h3>Third-Party Services and Infrastructure</h3>
              <p>PoolLogic is built on, and depends on, services provided by other companies that PoolLogic does not own or control ("Third-Party Services"). These include, among others, cloud hosting and computing, databases and data storage (such as Supabase), authentication, file and photo storage, content delivery and DNS (such as Cloudflare), payment processing (Stripe), email and SMS delivery (such as Resend), mapping, geocoding, and routing, push notifications, app stores, analytics, and other software libraries and application programming interfaces (APIs). The current list of providers that process personal data is in our <a href="/privacy" style={{ color: 'var(--accent)' }}>Privacy Policy</a>.</p>
              <p>Third-Party Services can and periodically do experience outages, slowdowns, errors, maintenance, security incidents, data loss or corruption, or changes to how their services work, including changes to their features, APIs, pricing, policies, or availability, or a decision to suspend or discontinue a service. When that happens, all or part of PoolLogic may be unavailable, slow, or work incorrectly. For example, you may be unable to log in or sync the mobile app, invoices, reminders, or notifications may be delayed or not delivered, payments may fail or be delayed, Automated Features may not run or may run late, map and route information may be inaccurate, or recent changes may not be saved.</p>
              <p>PoolLogic chooses its providers with care and will use commercially reasonable efforts to work around or recover from a Third-Party Service problem once we are aware of it, but <strong>PoolLogic is not responsible for the acts, omissions, availability, or performance of any Third-Party Service</strong>, and, to the maximum extent permitted by law, is not liable for any loss or damage caused by them. Any liability PoolLogic may have is subject to Section 14 (Disclaimers & Limitation of Liability). We may add, replace, or stop using any Third-Party Service at any time. Where a Third-Party Service has its own terms that apply to you (for example, the Stripe Agreements), you are responsible for complying with them.</p>

              <h3>Your Records and Backups</h3>
              <p>Although we take reasonable steps to protect and back up the data in the Service, no system is free of risk. You are responsible for keeping your own copies of records that are important to your business, including by regularly using the export tools in the Service. To the maximum extent permitted by law, PoolLogic is not liable for the loss, corruption, or unavailability of data, except to the extent caused by PoolLogic's failure to use reasonable safeguards, and in that case our liability is subject to Section 14.</p>

              <h3>Your Contingency Plans</h3>
              <p>PoolLogic maintains its own plans for responding to outages and other problems, and you should too. Because the Service, and the Third-Party Services it relies on, may sometimes be unavailable or work incorrectly, you are responsible for having reasonable contingency plans so your business can keep operating if PoolLogic cannot be used for a period of time. For example:</p>
              <ul>
                <li>keeping current copies of your customer list, contact details, service schedules, routes, and gate codes or access notes, so your technicians can still reach and service your customers;</li>
                <li>having another way to invoice customers, take payments, and record payments received, and checking that recurring invoices and autopay charges went out as expected after any outage;</li>
                <li>having another way to contact your customers and staff; and</li>
                <li>keeping the records you need to meet your legal, tax, and contractual obligations.</li>
              </ul>
              <p>An outage, error, or delay in PoolLogic or a Third-Party Service does not change your obligations to your customers, employees, or anyone else, and you remain responsible for meeting them. PoolLogic is not a safety system: decisions about water chemistry, chemical handling, equipment, and site safety remain yours and your technicians' responsibility, and should not depend on the Service being available. To the maximum extent permitted by law, PoolLogic is not liable for losses that a reasonable contingency plan would have avoided.</p>

              <h3>Your Equipment and Connectivity</h3>
              <p>You are responsible for the devices, operating systems, browsers, internet and mobile-data connections, and location services you and your staff use to access PoolLogic, and for keeping them reasonably up to date. PoolLogic is not responsible for problems caused by them, including lost connectivity in the field, unsupported or outdated devices or software, or inaccurate GPS or location data.</p>

              <h3>Changes and Maintenance</h3>
              <p>We continually update PoolLogic and may add, change, or remove features, change how the Service works, or perform maintenance (planned or emergency) at any time. We will try to give reasonable advance notice of changes that materially reduce core functionality you are paying for, and of planned maintenance that is expected to cause significant downtime, but we are not required to do so in an emergency or where the change is required by a Third-Party Service, a security need, or law.</p>
            </Section>

            <Section id="payments" title="4. Payment Processing (Stripe)">
              <p><strong>Payments are processed by Stripe, not by PoolLogic.</strong> To send invoices or accept payments through PoolLogic, the Subscriber must onboard a <strong>Stripe Connect Express</strong> account through the PoolLogic application. As part of that onboarding, the Subscriber agrees to be bound by the <a href="https://stripe.com/legal/ssa" target="_blank" rel="noreferrer noopener">Stripe Services Agreement</a> and the <a href="https://stripe.com/legal/connect-account" target="_blank" rel="noreferrer noopener">Stripe Connected Account Agreement</a> (together, the "Stripe Agreements"). PoolLogic operates as the Connect platform; the Subscriber's relationship with Stripe is governed by the Stripe Agreements, not by these Terms.</p>

              <p>PoolLogic is not a bank, money transmitter, or payment processor. Depending on the transaction, a charge may be created on PoolLogic's platform Stripe account and the proceeds transferred to the Subscriber's connected Express account, or created directly on the connected account. In either case, PoolLogic does not hold, custody, or invest Subscriber funds beyond the brief processing window required by Stripe to settle the transaction.</p>

              <p>Stripe handles all cardholder data in a PCI-compliant environment. <strong>PoolLogic never sees, receives, or stores full card numbers, CVV codes, or other sensitive payment information.</strong></p>

              <h3>Stripe Controls Verification, Payouts, Holds, and Reserves</h3>
              <p>Stripe — not PoolLogic — controls identity verification (KYC/KYB), payout timing and method, eligibility, holds, reserves, and account restrictions on the Subscriber's connected Express account. PoolLogic is not responsible for delays, holds, reserves, payout failures, or account terminations imposed by Stripe, and is not able to override or shorten them. The Subscriber's ability to accept payments through PoolLogic depends on Stripe's continued verification and acceptance of the Subscriber's connected account.</p>

              <h3>Disputes, Chargebacks, and Refunds</h3>
              <p>All disputes, chargebacks, refunds, and reversals are between the Subscriber, the End Customer, and Stripe. PoolLogic is not responsible for resolving payment disputes, evidencing chargebacks, or recovering disputed amounts, and will not refund Subscriber fees on the basis of a chargeback.</p>

              <h3>Subscriber Liability for Stripe-Imposed Amounts</h3>
              <p>If Stripe charges, fines, holds back, reverses, or causes a negative balance on the Subscriber's connected Express account — for example due to chargebacks, refunds, ACH returns, fraud investigations, regulatory action, or termination of the connected account — those amounts are the sole responsibility of the Subscriber. Because PoolLogic operates the Connect platform, Stripe may collect those amounts from PoolLogic's platform balance, debit PoolLogic's bank account, or otherwise cause PoolLogic to bear those amounts. The Subscriber will reimburse PoolLogic in full for any such amount, together with any related fees, costs, and reasonable attorneys' fees, within ten (10) days of written notice.</p>

              <p>To secure that reimbursement obligation, the Subscriber expressly authorizes PoolLogic, without further consent and to the maximum extent permitted by law and the Stripe Agreements, to: (a) <strong>charge the Subscriber's payment method on file</strong> (including the card used to pay PoolLogic subscription fees) for the amount owed; (b) <strong>withhold, offset, or recoup against any payouts or amounts otherwise payable to the Subscriber through Stripe</strong>, including by instructing Stripe to delay, hold, or apply payouts toward the amount owed; and (c) <strong>set off the amount owed against any credit, refund, or balance otherwise owed by PoolLogic to the Subscriber</strong>. These remedies are cumulative and in addition to any other remedy available to PoolLogic. The Subscriber indemnifies PoolLogic against any Stripe-imposed amount described in this Section and any related claim.</p>

              <h3>Eligible Jurisdictions</h3>
              <p>Stripe Connect Express is available only in jurisdictions Stripe supports. The Subscriber must be lawfully established and operating in a jurisdiction where Stripe will onboard and continue to support its connected Express account. PoolLogic does not control which jurisdictions Stripe supports, and is not obligated to provide the Service to a Subscriber that Stripe declines to onboard, suspends, or terminates. If Stripe ceases to support the Subscriber's jurisdiction or connected account, the Subscriber's access to payment features through PoolLogic will end accordingly, without liability to PoolLogic.</p>

              <h3>PCI-DSS and Card Data</h3>
              <p>Subscribers may not collect, transmit, or store full card numbers, CVV codes, or other sensitive cardholder data outside of Stripe's UI and APIs. Subscribers may not request or accept card data through email, SMS, or any channel within PoolLogic that is not specifically designed for Stripe-mediated card capture. To the extent the Payment Card Industry Data Security Standard ("PCI-DSS") applies to a Subscriber's business, the Subscriber is responsible for its own PCI-DSS compliance.</p>
            </Section>

            <Section id="surcharge" title="5. Card Surcharging & Pass-Through Fees">
              <p>PoolLogic offers an optional feature that lets a Subscriber pass credit-card processing costs through to the End Customer as a separate line item ("surcharge") on the invoice. Whether to enable this feature, and on which invoices, is the Subscriber's choice. <strong>PoolLogic provides the technical capability only; the Subscriber is solely responsible for using the feature lawfully.</strong></p>

              <p>Card surcharging is regulated by card-network rules (including Visa, Mastercard, American Express, and Discover), federal law, and the laws of certain U.S. states and jurisdictions, which may prohibit surcharging, cap the surcharge amount, require advance notice to the card networks and the acquirer, require specific disclosures to the cardholder at the point of sale and on the receipt, or otherwise restrict the practice. The applicable rules change over time and vary by jurisdiction and card brand.</p>

              <p>By enabling the surcharge feature, the Subscriber represents and warrants, on each transaction, that:</p>
              <ul>
                <li>Surcharging credit-card transactions is lawful in the jurisdiction where the transaction occurs and is permitted by the Subscriber's agreements with Stripe and the card networks;</li>
                <li>The Subscriber has provided any advance notice to the card networks and acquirer required by applicable network rules before enabling surcharging;</li>
                <li>The surcharge does not exceed the lesser of the Subscriber's actual cost of card acceptance or the cap set by the applicable card-network rules;</li>
                <li>The Subscriber will not surcharge debit-card transactions, prepaid-card transactions, or any other transaction for which surcharging is prohibited;</li>
                <li>The Subscriber clearly and conspicuously discloses the surcharge to the End Customer before the End Customer authorizes the transaction, and the surcharge is shown as a separate line item on the invoice and any receipt; and</li>
                <li>The Subscriber has configured the feature accurately, including the surcharge rate and the invoices to which it applies.</li>
              </ul>

              <p>The Subscriber is solely responsible for any fine, penalty, chargeback, dispute, refund, network-rule violation, regulatory action, or claim by an End Customer or governmental authority arising out of or related to the Subscriber's use of the surcharge feature, and indemnifies PoolLogic against any such amount and any related fees, costs, and reasonable attorneys' fees. PoolLogic does not provide legal or tax advice on whether surcharging is permitted in any particular transaction, and the Subscriber should consult its own counsel.</p>

              <p>Separately, certain Subscriber-imposed fees other than card surcharges (for example, late fees, convenience fees, trip fees, or service-call fees) may also be regulated by state law or by the Subscriber's agreements with the End Customer. The Subscriber is solely responsible for the legality, accuracy, and disclosure of any such fee charged through PoolLogic.</p>
            </Section>

            <Section id="autopay" title="6. Autopay & Saved Cards">
              <p>End Customers may save a payment method to enable automatic recurring charges. When an End Customer saves a card through the PoolLogic invoice flow, they consent to recurring charges initiated by the Subscriber for services rendered.</p>
              <p>If a Subscriber adds a card on an End Customer's behalf, the Subscriber attests that they have obtained the End Customer's express permission and have read and accepted the in-app consent confirmation. Misrepresenting this consent is a material breach of these Terms and may result in account termination.</p>
              <p>End Customers may update or remove their saved payment method at any time through the controls PoolLogic exposes in the invoice or payment flow, or by contacting the Subscriber. After <strong>three consecutive declined charges</strong>, autopay is automatically disabled for that customer and the Subscriber is notified.</p>
            </Section>

            <Section id="subscriber" title="7. Subscriber Responsibilities">
              <p>Subscribers are solely responsible for the accuracy and legitimacy of invoices, estimates, and service records they send to their customers through PoolLogic.</p>
              <p>You are responsible for complying with all applicable laws in the jurisdictions where you operate, including consumer-protection regulations, sales tax obligations, late-fee rules, refund-policy disclosures, and any licensing requirements for pool service work.</p>
              <p>You must have explicit permission to charge an End Customer. You may not use PoolLogic to bill for illegal services, to defraud customers, to harass or intimidate, or to send unsolicited communications.</p>

              <h3>Multi-State and Out-of-Jurisdiction Operations</h3>
              <p>PoolLogic is offered as a single software product across the United States. PoolLogic does not tailor its features, defaults, disclosures, or templates to the law of any particular state, county, or municipality. The Subscriber is solely responsible for compliance in every jurisdiction where the Subscriber operates, where the Subscriber's End Customers are located, or where services are performed, including, without limitation: business licensing and pool-service licensing; state and local sales, use, and service taxes (including economic-nexus obligations created by serving customers across state lines); late-fee, finance-charge, and usury limits; surcharge and convenience-fee legality and disclosure rules; consumer-protection and unfair-and-deceptive-acts ("UDAP") statutes; debt-collection and collection-notice rules; recurring-billing and automatic-renewal disclosure statutes (including California's Automatic Renewal Law and analogous statutes in other states); electronic-signature and e-contracting rules (ESIGN/UETA and state equivalents); data-breach notification laws; and any industry-specific regulation applicable to the Subscriber's business.</p>
              <p>The Subscriber will not use PoolLogic to operate in any jurisdiction where doing so would violate applicable law or the Stripe Agreements. PoolLogic does not provide legal, tax, or licensing advice, and the Subscriber should consult its own counsel and tax advisors regarding multi-state operations.</p>

              <h3>Automated Features and Your Settings</h3>
              <p>PoolLogic includes features that act automatically based on settings the Subscriber chooses ("Automated Features"). These include, for example, recurring invoicing, payment reminders, autopay charges, late fees, surcharges, automatically added line items (such as chemicals and card fees), automatic pausing of End Customer accounts after an invoice has been overdue for a number of days the Subscriber sets, and pauses the Subscriber schedules to start or end on a later date. The Subscriber decides whether each Automated Feature is on and how it is configured, for its account as a whole and for each End Customer. The Subscriber is responsible for:</p>
              <ul>
                <li>reviewing and confirming its settings whenever it turns an Automated Feature on, changes it, or adds or imports End Customers;</li>
                <li>regularly monitoring what the Automated Features do (invoices sent, charges made, fees applied, and accounts paused or resumed) and promptly correcting anything that is wrong; and</li>
                <li>giving its End Customers any notice of automated billing, charges, fees, pausing, suspension, or termination that applicable law or its agreements with them require.</li>
              </ul>
              <p>PoolLogic carries out Automated Features as the Subscriber configures them. PoolLogic is not responsible for any invoice sent or not sent, charge made or not made, fee applied or not applied, or account paused, not paused, or resumed as a result of the Subscriber's settings, the data the Subscriber entered or imported, or the Subscriber's failure to review them.</p>

              <h3>Reading Ranges</h3>
              <p>PoolLogic provides recommended water-chemistry ranges, which the Service uses to flag readings on service reports and to show whether readings are in range. <strong>All ranges and flags, whether PoolLogic's recommended ranges or ranges the Subscriber sets, are an aid only.</strong> They are not a safety system or a substitute for professional judgment, and the Subscriber and its staff remain responsible for every water-treatment decision, as described in Section 3 (Your Contingency Plans). Changing ranges does not change PoolLogic's chemical dosing recommendations.</p>
              <p>The Subscriber may change the ranges its account uses. <strong>If it does, the Subscriber is solely responsible for the ranges it sets and for any outcome resulting from them</strong>, and any claim arising from them is covered by the Subscriber's indemnification obligations in Section 15. To the maximum extent permitted by law, PoolLogic is not liable for outcomes resulting from any range or flag, including its recommended ranges, and in no event for outcomes resulting from ranges the Subscriber sets. Any liability that remains is subject to Section 14 (Disclaimers & Limitation of Liability).</p>

              <h3>Pausing Service and Pause Notices</h3>
              <p>The Subscriber may pause an End Customer's service for any reason it chooses, for example when an invoice goes unpaid, when the End Customer has not responded to the Subscriber, or while a quote for needed work, such as replacing a filter cartridge, has not been approved. <strong>Whether to pause, resume, or stop service, and when, is solely the Subscriber's decision.</strong> PoolLogic does not inspect pools, assess their condition, or advise whether service should continue. Pausing service can affect a pool's water condition, equipment, and safety, and, as described in Section 3 (Your Contingency Plans), decisions about water chemistry, equipment, and site safety remain the Subscriber's responsibility.</p>
              <p>If the Subscriber chooses to send a pause notice, PoolLogic emails it to the End Customer on the Subscriber's behalf and in the Subscriber's name. <strong>The Subscriber is solely responsible for each pause notice</strong>, including the reason and any other text it writes or selects, the dates it sets, and the accuracy of the standard wording PoolLogic includes (for example, that there are no service charges while service is paused), and for making sure its billing matches what the notice says. Pause notices are messages about the End Customer's existing service and may not be used for marketing (see Section 10, Communications & SMS Consent).</p>
              <p>A pause notice does not replace any notice the Subscriber must give under its agreements with the End Customer or applicable law. Email delivery is not guaranteed: a notice may be delayed, filtered as spam, or bounced, or may not be sent at all (for example, when no email address is on file), and the pause takes effect either way. The Subscriber is responsible for confirming that each End Customer has received any notice that is required, and for giving it another way when needed. To the maximum extent permitted by law, PoolLogic is not liable for any outcome resulting from a pause, a resumption, or a pause notice, or from a notice that was not sent or not received. Any claim arising from them is covered by the Subscriber's indemnification obligations in Section 15, and any liability that remains is subject to Section 14 (Disclaimers & Limitation of Liability).</p>

              <h3>Your Agreements with Your Customers</h3>
              <p>The Subscriber's relationship with each End Customer, including the price, payment terms, late fees, and when service may be paused, suspended, or terminated, whether for non-payment or any other reason, is governed by the Subscriber's own agreements and policies with that End Customer. <strong>PoolLogic is not a party to those agreements, does not see or review them, and does not know their terms.</strong> PoolLogic does not check whether the Subscriber's settings or procedures match them.</p>
              <p>The Subscriber is solely responsible for making sure that its use of PoolLogic, including its settings for pausing accounts, any decision to pause an account, any pause notice, late fees, reminders, and any suspension or termination of service, is consistent with its agreements with each End Customer and with applicable law (including any required notice periods and late-fee limits). Any question or dispute about whether an account should have been paused, resumed, charged, or terminated, or whether a fee was owed, is between the Subscriber and the End Customer, and is covered by the Subscriber's indemnification obligations in Section 15.</p>
            </Section>

            <Section id="route-transfers" title="8. Route Transfers (Route Handover Tool)">
              <p>PoolLogic's route handover tool lets a Subscriber (the "Transferring Subscriber") send the records of selected End Customers to another Subscriber's PoolLogic account (the "Receiving Subscriber"), which accepts them with a transfer code. This Section applies to every use of the tool, whether the transfer is part of a sale or purchase of a route, a merger, a split or reorganization of a business, a transfer between related companies, or for any other reason (each, a "Route Transfer"). It applies in addition to the rest of these Terms. In this Section, "you" means the Transferring Subscriber, the Receiving Subscriber, or both, as the context requires.</p>

              <h3>PoolLogic Is Not a Party to Your Deal</h3>
              <p><strong>PoolLogic provides software only.</strong> PoolLogic is not a broker, agent, marketplace, escrow agent, appraiser, lender, or advisor, and is not a party to any agreement between the Transferring Subscriber and the Receiving Subscriber. PoolLogic does not find buyers or sellers, negotiate or set a price, verify either party's identity, finances, licensing, insurance, or authority, hold or release any purchase money, or guarantee that either party will perform.</p>
              <p>The terms of any Route Transfer, including the price, how and when it is paid, any deposit, holdback, earn-out, or clawback, any guarantee about how many customers will stay, any non-compete or non-solicitation promise, and how open balances, prepayments, and credits are handled, are solely between the parties. We strongly recommend that the parties put their deal in a written agreement and consult their own attorney, accountant, and, where appropriate, a business broker. PoolLogic will not enforce, mediate, decide, or reverse anything in a dispute between the parties.</p>
              <p><strong>If either party backs out of a deal, fails to do what it promised, or believes it was treated unfairly or wrongfully by the other party</strong>, whether before, during, or after a Route Transfer, that is solely a matter between the parties. PoolLogic is not responsible for it, will not take any action on it, and is not liable for any loss it causes, including where a party backs out after the transfer code has been shared or after a transfer has been accepted.</p>

              <h3>What Transfers and What Does Not</h3>
              <p>A Route Transfer copies to the Receiving Subscriber the information about each selected End Customer that the Service shows will transfer at the time of the transfer. Currently, that includes the End Customer's contact and property details, equipment, notes, price, service days, and service-visit reports, as they exist in the Transferring Subscriber's account at the moment the transfer is accepted. The Service shows what will and will not transfer before the transfer is sent, and we may change what transfers as we update the tool.</p>
              <p>Unless the Service expressly says otherwise, the following <strong>do not</strong> transfer and stay with the Transferring Subscriber: billing history, invoices, estimates, payments, refunds, and disputes; open balances, credits, prepayments, and deposits; saved cards, bank accounts, and autopay authorizations; photos; Automated Feature settings; communication history and consents; and anything else connected to the Transferring Subscriber's Stripe account.</p>
              <p><strong>Payment methods cannot be transferred.</strong> A saved card, bank account, or autopay authorization is tied to the Transferring Subscriber's Stripe account and to the End Customer's permission to be charged by the Transferring Subscriber. The Receiving Subscriber may not charge a transferred End Customer until that End Customer adds a payment method and authorizes charges by the Receiving Subscriber. The Service can send a bulk request asking transferred End Customers to do this, but PoolLogic does not guarantee that any End Customer will respond, and the Receiving Subscriber is responsible for collecting payment in the meantime.</p>
              <p>Before you send a Route Transfer, <strong>export any records you need to keep</strong>, including for tax, accounting, legal, warranty, or dispute purposes. After a transfer, you may no longer be able to access records that moved to the Receiving Subscriber, and PoolLogic will not restore them.</p>

              <h3>Transfer Codes</h3>
              <p>A Route Transfer is addressed to the PoolLogic account that the Transferring Subscriber chooses and is accepted with a transfer code that works for a limited time (currently 7 days, or as otherwise shown in the Service). <strong>Treat the transfer code like a key.</strong> The Transferring Subscriber is responsible for choosing the correct receiving account, for checking which End Customers are included, and for sharing the code only with the intended Receiving Subscriber and only when it is ready for the transfer to happen (for example, after the purchase price has been paid). PoolLogic is not responsible for a transfer sent to the wrong account, accepted by someone who obtained the code from or through the Transferring Subscriber, or accepted before the parties' deal was complete.</p>
              <h3>Transfers Are Final</h3>
              <p><strong>Once a Route Transfer has been accepted, it is final and cannot be undone, and PoolLogic will not take any action to reverse, cancel, alter, or unwind it</strong>, including at the request of either party, an End Customer, or anyone else, and including where the transfer was sent to the wrong account, included the wrong End Customers, was accepted before the parties' deal was complete, or is the subject of a dispute. PoolLogic will not move records back, restore access, re-send a transfer, or remove records from the Receiving Subscriber's account. If the parties want to return any End Customers, they must do so themselves, for example by the Receiving Subscriber sending a new Route Transfer back, which is entirely within its discretion.</p>
              <p><strong>Repeat transfers.</strong> Where the parties mutually agree, End Customers may be transferred again, back to the original Subscriber or on to another Subscriber, any number of times. Each transfer is a new and separate Route Transfer that must be sent and accepted through the Service, is governed by this Section, and is just as final as the first. PoolLogic is not responsible for tracking the history between transfers, for whether any earlier deal was honored, or for undoing an earlier transfer by way of a later one.</p>

              <h3>Transferring Subscriber's Promises</h3>
              <p>Each time it sends a Route Transfer, the Transferring Subscriber represents and warrants that:</p>
              <ul>
                <li>it has the right and authority to transfer the selected End Customers and their information, including any approval required from its owners, partners, franchisor, lender, or anyone else with an interest in the route or the business;</li>
                <li>the transfer is permitted by its agreements with each End Customer, by any other agreement that binds it (including any earlier route purchase agreement, non-compete, non-solicitation, or financing agreement), and by applicable law, including privacy and consumer-protection laws;</li>
                <li>it has given every notice to, and obtained every consent from, End Customers that the law or its agreements with them require before their information or service relationship is transferred;</li>
                <li>the information being transferred is accurate to the best of its knowledge, and it has not created, altered, or removed records (such as customers, prices, service history, or visit reports) to make the route appear more valuable than it is; and</li>
                <li>it will stop its own recurring invoices, autopay charges, reminders, and other Automated Features for transferred End Customers when appropriate, so that End Customers are not billed twice or contacted by both parties in error.</li>
              </ul>
              <p>The Transferring Subscriber remains responsible for everything that happened before the transfer, including invoices it issued, payments it collected, and any refund, dispute, or chargeback on those payments, whenever it arises.</p>

              <h3>Receiving Subscriber's Responsibilities</h3>
              <p>By accepting a Route Transfer, the Receiving Subscriber agrees that:</p>
              <ul>
                <li><strong>it is solely responsible for its own due diligence.</strong> It must independently verify the number of customers, prices, revenue, service history, equipment condition, and anything else that matters to its decision, using sources outside PoolLogic such as bank statements, tax returns, payout records, and contact with the customers themselves;</li>
                <li>it is responsible for the transferred End Customers from the time agreed with the Transferring Subscriber, including establishing its own service agreement, prices, payment terms, and policies with each End Customer and giving any notice the law requires;</li>
                <li>consents given to the Transferring Subscriber do not carry over. In particular, it must obtain its own consent before sending text messages or marketing to transferred End Customers (see Section 10, Communications & SMS Consent) and its own authorization before charging them;</li>
                <li>it will review the transferred information and configure its own settings and Automated Features, as described in Section 7, before relying on them; and</li>
                <li>it will use the transferred personal information only to provide and bill for its services to those End Customers, and will protect it as required by applicable law and its own privacy notices.</li>
              </ul>

              <h3>Route Reports, Metrics, and Valuation</h3>
              <p>The Service can show reports and metrics about a route, such as revenue, customer counts, service visits logged, and trends, and lets you export them ("Route Reports"). Route Reports are generated automatically from the data entered in, imported into, or recorded in the Subscriber's account. <strong>PoolLogic does not audit, verify, or certify Route Reports</strong>, and they can be incomplete or wrong, for example because of data-entry or import mistakes, payments received outside PoolLogic, refunds, disputes, how a metric is calculated, or a software error.</p>
              <p>Route Reports are not financial statements, an appraisal or valuation of a route or business, or a prediction of future revenue. Past results do not guarantee future results, and customers may leave after a route changes hands. Statements on our website or in the Service about knowing what a route is worth describe the information available in the Service; they are not a promise of any price or value. You should not rely on a Route Report as the only basis for buying, selling, pricing, or financing a route.</p>
              <p>A Subscriber that shares a Route Report, a screenshot, or exported data with anyone is solely responsible for it, including for any change made after export and for any statement made using it. PoolLogic is not responsible for any representation one party makes to another.</p>

              <h3>Customers, Retention, and Results</h3>
              <p>PoolLogic does not guarantee that any End Customer will accept a new service provider, keep their service, re-add a payment method, or pay. Telling End Customers about the change, and managing any complaint, cancellation, or request from them, is the responsibility of the parties to the Route Transfer.</p>

              <h3>Privacy and Data Responsibility</h3>
              <p>A Route Transfer involves End Customers' personal information. Each party is responsible for complying with the privacy laws that apply to it and with its own privacy notices and agreements. The Transferring Subscriber is responsible for confirming that it may disclose the information to the Receiving Subscriber; from the moment the transfer is accepted, the Receiving Subscriber is responsible for the copy it receives, and the Transferring Subscriber remains responsible for any information it keeps. PoolLogic carries out the transfer on the Subscribers' instructions and handles the information as described in our <a href="/privacy" style={{ color: 'var(--accent)' }}>Privacy Policy</a>.</p>

              <h3>Mistakes, Errors, and Disputes</h3>
              <p>You are responsible for mistakes you make with the tool, such as selecting the wrong End Customers, sending a transfer to the wrong account, or sharing a code too early. If a software error affects a Route Transfer, Section 14 (Automated Features and Software Errors) applies, except that it never requires PoolLogic to reverse, cancel, or alter a Route Transfer that has been accepted. To the maximum extent permitted by law, PoolLogic is not liable for any loss arising from a Route Transfer, including the purchase price, lost customers or revenue, the cost of any dispute, or damage to a business relationship, and any remaining liability is subject to Section 14.</p>
              <p><strong>Any issue with a Route Transfer that the parties started must be handled directly between them.</strong> Any disagreement between the Transferring Subscriber and the Receiving Subscriber, or between either of them and an End Customer, about a Route Transfer, the deal behind it, or the customers or records involved, is solely between those parties. PoolLogic will not investigate it, take sides, or act on it.</p>
              <p>If either party wants to pursue legal action against the other, it must do so outside PoolLogic, through the courts and other legal processes available to it, and PoolLogic will not be a party to that action. PoolLogic may respond to a valid court order, subpoena, or other legal process directed to it, for example by producing records, but only to the extent it is legally required to. Each party's indemnification obligations in Section 15 cover claims arising from a Route Transfer it sends or accepts, including any attempt to involve PoolLogic in a dispute between the parties.</p>

              <h3>Account Control and Ownership Disputes</h3>
              <p>PoolLogic treats the owner of a Subscriber account, and any user that owner has authorized, as authorized to send and accept Route Transfers for that account. PoolLogic is not required to resolve any dispute about who owns or controls a business, a route, a set of customers, or a PoolLogic account (for example, between business partners, or between a business and a current or former employee), and may rely on the account's records and instructions until it receives a court order or other proof it reasonably finds sufficient.</p>

              <h3>Fraud, Misuse, and Our Rights</h3>
              <p>You may not use the route handover tool to transfer End Customers you do not have the right to transfer (for example, a current or former employee or contractor taking an employer's customers), to transfer fictitious customers or altered records, to mislead a buyer, lender, or anyone else, or otherwise to commit fraud or violate these Terms or the law. PoolLogic may, at its discretion and without liability, delay or block a Route Transfer that has not yet been accepted, and may suspend or terminate the accounts involved under Section 13, if we suspect fraud, misuse, unauthorized access, or a legal requirement, or if Stripe or a government authority asks us to. Doing so does not make PoolLogic responsible for any Route Transfer, and does not change the rule that accepted Route Transfers are final. PoolLogic has no obligation to monitor or review Route Transfers.</p>

              <h3>Availability of the Tool</h3>
              <p>The route handover tool is available only on the plans shown on our <a href="/pricing" style={{ color: 'var(--accent)' }}>pricing page</a> and may require both accounts to be in good standing. We may change, limit, or discontinue the tool, the information that transfers, or the code's validity period at any time. A Route Transfer moves End Customer records only; it does not transfer a PoolLogic account, subscription, Stripe account, or these Terms. Transferring an entire business and its PoolLogic account is governed by the Assignment provision in Section 19 (General Provisions).</p>
            </Section>

            <Section id="acceptable-use" title="9. Acceptable Use">
              <p>You agree not to:</p>
              <ul>
                <li>Resell, sublicense, or otherwise commercially exploit the service except as expressly permitted.</li>
                <li>Reverse-engineer, decompile, or attempt to extract the source code of the service.</li>
                <li>Use automated scrapers, bots, or other tools to access the service in a manner not intended by the user interface.</li>
                <li>Send spam, phishing messages, or any unsolicited communications through PoolLogic-provided email or messaging features.</li>
                <li>Upload malware, viruses, or any content designed to disrupt the service or other users.</li>
                <li>Attempt to gain unauthorized access to other accounts, systems, or data.</li>
                <li>Use the service to violate any law or the rights of any third party.</li>
                <li><strong>Upload protected health information (PHI) as defined under HIPAA.</strong> PoolLogic is not a HIPAA Business Associate and is not designed to receive, store, or process PHI. If your business is subject to HIPAA, do not enter PHI into PoolLogic.</li>
              </ul>
            </Section>

            <Section id="communications" title="10. Communications & SMS Consent">
              <p>By providing a phone number, email address, or other contact information through PoolLogic, you agree that we (and the Subscriber, where applicable) may contact you about the Service using the channels you provide, including email, phone, and SMS.</p>
              <p>When you enable SMS or push notifications for invoice reminders, payment receipts, route updates, or other Service-related messages, <strong>you expressly consent to receive those messages, which may be sent using automated technology.</strong> Message and data rates may apply. You can opt out of non-essential SMS at any time by replying <strong>STOP</strong>; reply <strong>HELP</strong> for support. Opting out does not affect transactional or account-security messages reasonably required to operate the Service.</p>
              <p>Subscribers are responsible for obtaining all consents required by the Telephone Consumer Protection Act ("TCPA"), the CAN-SPAM Act, and any other applicable communications law <em>before</em> using PoolLogic to send marketing or non-transactional messages to their customers. The Subscriber represents and warrants that every recipient added to PoolLogic has provided the consents required for the messages the Subscriber sends to them. The Subscriber indemnifies PoolLogic against any claim or fine arising from a failure to obtain those consents.</p>
            </Section>

            <Section id="fees" title="11. Fees, Cancellation & Refunds">
              <p>Subscriber fees, billing cycles, and any applicable taxes are presented before purchase and are charged automatically through Stripe to the payment method you provide. By subscribing, you authorize PoolLogic to charge that payment method on each renewal date.</p>

              <h3>Subscription Pricing</h3>
              <p>PoolLogic's plans are priced by the number of the Subscriber's active (not paused) customers, at the rates shown for each plan on our <a href="/pricing" style={{ color: 'var(--accent)' }}>pricing page</a> at the time of purchase or renewal. If the Subscriber's number of active customers moves it into a different pricing bracket, its subscription fee is adjusted automatically from the following billing period. Yearly plans are billed in advance for the year at the yearly rate shown.</p>
              <p>PoolLogic does not charge a fee on the payments End Customers make to the Subscriber through the Service.</p>

              <h3>Stripe Fees</h3>
              <p>Stripe's payment processing fees are separate from PoolLogic's subscription fees. They are set by Stripe under the Stripe Agreements the Subscriber accepts when connecting its Stripe account, are deducted by Stripe from each payment, and are shown on <a href="https://stripe.com/pricing" target="_blank" rel="noreferrer noopener">Stripe's pricing page</a> and on each payment in the Subscriber's Stripe Dashboard. PoolLogic does not set, receive, or control Stripe's fees.</p>
              <p>You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the then-current billing period. Access to paid features continues until that date.</p>
              <p>Except where required by law, fees already paid are <strong>non-refundable</strong>, including for partial months or unused portions of a billing period. We may, at our sole discretion, offer prorated refunds in exceptional circumstances.</p>
              <p>Where PoolLogic offers a free trial, the trial length and any conversion behavior will be disclosed at sign-up. Unless we expressly state otherwise at sign-up, a free trial automatically converts to a paid subscription at the end of the trial period unless canceled beforehand.</p>

              <h3>Changes to Fees</h3>
              <p>We may change subscription fees, fee structures, or the features included in any tier on at least <strong>thirty (30) days'</strong> notice to the Subscriber (by email or by posting in the Service). A fee change takes effect at the start of your next renewal period following the notice. Your continued use of the Service after the new fee takes effect constitutes acceptance of the new fee. If you do not accept a fee change, your sole remedy is to cancel your subscription before the new fee takes effect, in which case access continues through the end of the then-current billing period.</p>
            </Section>

            <Section id="data" title="12. Data Ownership & Feedback">
              <p><strong>You own your data.</strong> Customer records, invoices, estimates, service reports, photos, and any other content you upload to PoolLogic remain your property.</p>
              <p>You grant PoolLogic a limited, non-exclusive, royalty-free license to host, process, transmit, and display your data solely for the purpose of operating and improving the service for you.</p>
              <p>You may export your data at any time during your subscription. On account closure or termination, you have <strong>30 days</strong> to export your data. After that period, we may delete it, subject to any legal or financial-record retention obligations (for example, Stripe transaction records, which are retained per Stripe's own policies).</p>

              <h3>Our Intellectual Property</h3>
              <p>PoolLogic and its licensors retain all right, title, and interest in and to the Service, including all software, source code, designs, UI, trademarks, logos, look and feel, and any documentation. Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service during your subscription, solely for your business's internal operations. No rights are granted by implication, estoppel, or otherwise. You may not remove or alter any copyright, trademark, or other proprietary notice that appears in the Service.</p>

              <h3>Feedback</h3>
              <p>If you send us suggestions, comments, ideas, bug reports, or other feedback about the Service ("Feedback"), you grant PoolLogic a perpetual, worldwide, royalty-free, irrevocable, sublicensable license to use, modify, and incorporate that Feedback into the Service or our other offerings without obligation or compensation. We may use Feedback freely, and you retain no rights in or claim to that Feedback once submitted.</p>
            </Section>

            <Section id="termination" title="13. Termination & Suspension">
              <h3>Suspension</h3>
              <p>We may suspend your account, or specific features of your account, at any time — with or without prior notice — if (a) a payment to PoolLogic fails or is reversed, (b) we reasonably suspect fraud, abuse, or a security risk, (c) you exceed reasonable usage limits, or (d) we need to investigate a potential breach of these Terms. Suspension is a temporary measure and may be lifted once the underlying issue is resolved. If a suspended account is not restored within a reasonable period, we may terminate it under the section below.</p>

              <h3>Termination</h3>
              <p>You may terminate your account at any time from your account settings. We may terminate your account, with or without notice, if you (a) materially breach these Terms, (b) fail to pay subscription fees after a reasonable cure period, (c) use the service for fraudulent or illegal activity, or (d) create risk or legal exposure for PoolLogic, other Subscribers, or End Customers.</p>
              <p>On termination, your right to access the service ends immediately. Records related to historical transactions, invoices, or other financial activity may be retained as required by law or by Stripe's record-keeping rules. Sections of these Terms that by their nature should survive termination (including ownership, our intellectual property, indemnification, disclaimers, limitation of liability, arbitration, and general provisions) will survive.</p>
            </Section>

            <Section id="disclaimers" title="14. Disclaimers & Limitation of Liability">
              <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR UNINTERRUPTED OPERATION.</p>
              <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, POOLLOGIC'S TOTAL CUMULATIVE LIABILITY ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE TOTAL FEES YOU PAID TO POOLLOGIC IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS ($100).</p>
              <p>POOLLOGIC WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOST REVENUE, LOST DATA, OR BUSINESS INTERRUPTION, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
              <h3>Automated Features and Software Errors</h3>
              <p>Automated Features depend on software, on the data in your account, and on third-party services (such as Stripe and email and SMS providers), and they may occasionally fail, run late, or act incorrectly. For example, an account could be paused when it should not be, fail to pause or resume when it should, or an invoice, reminder, charge, or late fee could be sent or applied in error, or not at all. PoolLogic does not guarantee that any Automated Feature will run at a particular time or produce a particular result, and you should not rely on Automated Features without monitoring them as described in Section 7.</p>
              <p>If you believe an Automated Feature did not act as configured, notify us promptly at <a href="mailto:support@poollogic.app" style={{ color: 'var(--accent)' }}>support@poollogic.app</a>. Our sole obligation, and your exclusive remedy, for an error in an Automated Feature is for PoolLogic to use commercially reasonable efforts to correct the error and, where the Service allows, to help you reverse its effect (for example, by resuming an account that was paused in error). To the maximum extent permitted by law, PoolLogic is not liable for the consequences of any such error, including lost or delayed revenue, missed or duplicate collections, refunds, End Customer complaints or cancellations, or disputes with End Customers, and any liability that remains is subject to the limits in this Section.</p>
              <p>Some jurisdictions do not allow the exclusion or limitation of certain warranties or damages, so these limits may not apply to you in full.</p>
              <p><strong>Carve-out.</strong> The limitations and exclusions in this Section do <strong>not</strong> apply to: (a) the Subscriber's payment, reimbursement, set-off, and offset obligations under Section 4 (Payment Processing); (b) the Subscriber's obligations under Section 5 (Card Surcharging & Pass-Through Fees); (c) the Subscriber's representations and obligations under Section 8 (Route Transfers); (d) the Subscriber's indemnification obligations under these Terms; or (e) any liability that cannot be limited or excluded under applicable law.</p>
            </Section>

            <Section id="indemnification" title="15. Indemnification">
              <p>You agree to defend, indemnify, and hold harmless PoolLogic, its officers, employees, and contractors from and against any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising out of or related to (a) your use of the service, (b) your breach of these Terms, (c) your violation of any law or the rights of any third party, (d) any dispute between you and an End Customer, including billing disputes, service complaints, or refund claims, or (e) any Route Transfer you send or accept under Section 8, including any dispute with the other party to it or with any End Customer involved.</p>

              <h3>Procedure</h3>
              <p>As a condition of indemnification, PoolLogic will: (a) promptly notify you in writing of any claim for which indemnification is sought (provided that a delay in notice will not relieve you of your obligations except to the extent you are materially prejudiced); (b) give you sole control of the defense and settlement of the claim, except that you may not settle any claim in a manner that admits liability on PoolLogic's part, imposes any obligation on PoolLogic, or restricts PoolLogic's operation of the Service, without PoolLogic's prior written consent (not to be unreasonably withheld); and (c) provide reasonable cooperation, at your expense, in the defense of the claim. PoolLogic may participate in the defense at its own expense with counsel of its choice.</p>
            </Section>

            <Section id="force-majeure" title="16. Force Majeure">
              <p>Neither party will be liable for any failure or delay in performance of these Terms caused by events beyond its reasonable control, including acts of God, natural disasters, severe weather, fire, flood, war, terrorism, pandemic, epidemic, public-health emergency, civil unrest, embargo, sanctions, government action or order, labor dispute, internet or telecommunications outage, power failure, cyberattack (including denial-of-service attacks and attacks on a provider), or the failure, outage, or degradation of a third-party service provider on which the affected party relies (including hosting, database, cloud-infrastructure, DNS, content-delivery, payment, email, SMS, and mapping providers such as Stripe, Supabase, Resend, Cloudflare, or any successor or replacement provider).</p>
            </Section>

            <Section id="disputes" title="17. Dispute Resolution & Arbitration">
              <p><strong>Please read this section carefully — it affects your legal rights, including your right to file a lawsuit in court and to participate in a class action.</strong></p>

              <h3>Informal Resolution</h3>
              <p>Before filing any formal claim, you agree to first try to resolve the dispute informally by sending written notice to <a href="mailto:legal@poollogic.app" style={{ color: 'var(--accent)' }}>legal@poollogic.app</a> describing the dispute and the relief sought. The parties will negotiate in good faith for at least 60 days before initiating arbitration.</p>

              <h3>Binding Arbitration</h3>
              <p>Except as set forth below, any dispute, claim, or controversy arising out of or relating to these Terms or the Service ("Dispute") will be resolved through <strong>final and binding individual arbitration</strong> administered by the American Arbitration Association ("AAA") under its Commercial Arbitration Rules (or, for consumer disputes, the AAA Consumer Arbitration Rules), and, where applicable, the AAA Mass Arbitration Supplementary Rules. The arbitration will be conducted <strong>remotely by video conference</strong> as the default, so that no party is required to travel to participate. If an in-person hearing is necessary, it will be held in Florida unless the parties agree otherwise or the arbitrator, on a showing of substantial hardship, designates a different location reasonably convenient to the parties. The arbitrator's award may be entered as a judgment in any court of competent jurisdiction.</p>

              <h3>Delegation</h3>
              <p>The arbitrator, and not any federal, state, or local court or agency, has <strong>exclusive authority</strong> to resolve any dispute relating to the interpretation, applicability, enforceability, scope, or formation of this arbitration agreement, including any claim that all or any part of this arbitration agreement is void or voidable. The only exception is that a court of competent jurisdiction may decide the enforceability of the Class Action Waiver below.</p>

              <h3>Mass Arbitration Procedure</h3>
              <p>If 25 or more similar Disputes are filed against PoolLogic by or with the coordination of the same law firm or coordinated group of firms within a 60-day period, the parties agree those Disputes will be administered as a mass arbitration under the AAA Mass Arbitration Supplementary Rules. The parties will work with AAA to: (a) appoint a single process arbitrator to resolve common procedural and threshold issues across the cases; (b) select an initial batch of no more than 25 bellwether cases on each side to proceed first; (c) stay all other cases pending resolution of the bellwethers; and (d) following resolution of the bellwethers, engage in good-faith mediation for the remaining cases before any further individual arbitrations proceed. This provision is intended to allow efficient handling of coordinated claims; it does not waive any individual claimant's right to an individual arbitration on the merits.</p>

              <h3>Class Action Waiver</h3>
              <p>YOU AND POOLLOGIC AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN AN INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, COLLECTIVE, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING. The arbitrator may not consolidate more than one person's claims and may not preside over any form of class or representative proceeding.</p>

              <h3>Exceptions</h3>
              <p>Either party may (a) bring an individual claim in a small-claims court of competent jurisdiction if the claim qualifies, and (b) seek injunctive or equitable relief in a court of competent jurisdiction to protect intellectual property rights or to enjoin unauthorized access.</p>

              <h3>Opt-Out</h3>
              <p>You may opt out of this arbitration agreement by sending written notice to <a href="mailto:legal@poollogic.app" style={{ color: 'var(--accent)' }}>legal@poollogic.app</a> within <strong>30 days</strong> of first accepting these Terms. Your notice must include your full name, account email, and a clear statement that you are opting out of arbitration. Opting out will not affect any other part of these Terms.</p>

              <h3>Time Limit on Claims</h3>
              <p>Any claim arising out of or relating to these Terms or the Service must be filed within <strong>one (1) year</strong> after the cause of action first arose; otherwise, the claim is permanently barred. If applicable law prohibits shortening the limitations period for a particular claim or claimant, the statutory period applies to that claim, and the remainder of this Section continues to apply to other claims. The 60-day informal-resolution period under "Informal Resolution" above tolls the limitations period.</p>

              <h3>Severability and Governing Law</h3>
              <p>If the class-action waiver is held unenforceable, the entire arbitration agreement will be void. If any other portion of this Section is held unenforceable, the remainder will continue in effect. If the arbitration agreement as a whole is held unenforceable, any Dispute must be brought exclusively in the state or federal courts located in Florida, and the parties consent to the personal jurisdiction of those courts.</p>
              <p>These Terms are governed by the laws of the State of Florida, without regard to its conflict-of-laws principles, <strong>except</strong> that, to the extent the law of the Subscriber's or End Customer's home jurisdiction provides a mandatory, non-waivable consumer or small-business protection that would otherwise apply, that mandatory law applies to claims by that party to the extent required. The Federal Arbitration Act governs the interpretation and enforcement of the arbitration provisions of this Section. You and PoolLogic each waive any right to a jury trial in any proceeding arising out of or related to these Terms.</p>
            </Section>

            <Section id="dmca" title="18. Copyright Complaints (DMCA)">
              <p>We respect intellectual property rights. If you believe content available through PoolLogic infringes your copyright, please send a notice complying with 17 U.S.C. § 512(c)(3) to our designated agent:</p>
              <p style={{ marginTop: 10 }}>
                <strong style={{ color: 'var(--ink-2)' }}>PoolLogic — Copyright Agent</strong><br/>
                [mailing address]<br/>
                <a href="mailto:copyright@poollogic.app" style={{ color: 'var(--accent)' }}>copyright@poollogic.app</a>
              </p>
              <p>Your notice must include: (a) a physical or electronic signature of the copyright owner or authorized agent; (b) identification of the copyrighted work claimed to have been infringed; (c) identification of the allegedly infringing material and information sufficient to locate it; (d) your contact information; (e) a statement of good-faith belief that the use is not authorized; and (f) a statement under penalty of perjury that the information in the notice is accurate and that you are authorized to act. We may remove or disable access to allegedly infringing material and may terminate repeat infringers in accordance with our policies.</p>

              <h3>Counter-Notice</h3>
              <p>If you believe your content was removed or disabled by mistake or misidentification, you may send a counter-notice complying with 17 U.S.C. § 512(g)(3) to the address above. Your counter-notice must include: (a) your physical or electronic signature; (b) identification of the material that was removed or disabled and the location where it appeared before removal; (c) a statement under penalty of perjury that you have a good-faith belief the material was removed or disabled as a result of mistake or misidentification; and (d) your name, address, and telephone number, and a statement consenting to the jurisdiction of the federal district court for the judicial district in which your address is located (or, if outside the U.S., to the jurisdiction of any judicial district in which PoolLogic may be found), and that you will accept service of process from the original complainant or that person's agent. On receipt of a valid counter-notice, we will follow the procedures and timing required by § 512(g) before restoring or continuing to disable access to the material.</p>
            </Section>

            <Section id="general" title="19. General Provisions">
              <p><strong>Entire agreement.</strong> These Terms (together with any policies referenced, including the Privacy Policy) constitute the entire agreement between you and PoolLogic regarding the Service and supersede any prior or contemporaneous agreements, communications, or proposals on the subject.</p>
              <p><strong>No oral modification; waiver.</strong> No oral or informal modification of these Terms will be binding. Any waiver or modification must be in a writing signed by an authorized representative of PoolLogic. Our failure to enforce any provision is not a waiver of our right to do so later.</p>
              <p><strong>Severability.</strong> If any provision is held invalid or unenforceable, that provision will be enforced to the maximum extent permitted by law and the remaining provisions will continue in full force and effect.</p>
              <p><strong>Assignment.</strong> You may not assign or transfer these Terms or your account, by operation of law or otherwise, without our prior written consent, except that you may assign these Terms and your account to a successor in connection with a merger, acquisition, reorganization, or sale of substantially all of your assets or your pool service business, on prior written notice to PoolLogic and provided the successor expressly assumes your obligations under these Terms and is not, in our reasonable judgment, a competitor of PoolLogic. We may assign these Terms in connection with a merger, acquisition, reorganization, sale of assets, financing, or by operation of law.</p>
              <p><strong>No third-party beneficiaries.</strong> These Terms do not create any third-party beneficiary rights.</p>
              <p><strong>Notices.</strong> Notices to PoolLogic must be sent to <a href="mailto:legal@poollogic.app" style={{ color: 'var(--accent)' }}>legal@poollogic.app</a>. We may give notice to you by email at the address associated with your account, by posting in the Service, or by other reasonable means.</p>
              <p><strong>Headings.</strong> Headings are for convenience only and do not affect interpretation.</p>
            </Section>

            <Section id="changes" title="20. Changes to These Terms">
              <p>We may update these Terms from time to time. If we make material changes, we will notify you by email and post the updated Terms on this page with a new effective date. Material changes will take effect <strong>30 days</strong> after notice. Your continued use of the service after that period constitutes acceptance of the updated Terms.</p>
              <p>For non-material changes (such as clarifications or typo corrections), we may update these Terms without individual notice.</p>
            </Section>

            <Section id="contact" title="21. Contact">
              <p>For questions about these Terms or to send a legal notice, contact us at:</p>
              <p style={{ marginTop: 12 }}>
                <strong style={{ color: 'var(--ink-2)' }}>PoolLogic</strong><br/>
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
