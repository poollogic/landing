import React, { useEffect, useState } from 'react';

// Terms of Service — starter content. Review with counsel before publishing.
// Find-and-replace placeholders if needed:
//   PoolLogic          legal entity name
//   Florida                 governing state
//   May 23, 2026            effective date
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
            These terms govern your use of PoolLogic. Please read them carefully — by creating an account or using the service, you agree to them, including the binding arbitration and class-action waiver in Section 16.
          </p>
          <div style={{ marginTop: 22, display: 'flex', gap: 28, flexWrap: 'wrap', fontSize: 13.5, color: 'var(--ink-5)' }}>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Effective:</strong> May 15, 2026</span>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Updated:</strong> May 23, 2026</span>
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
            </Section>

            <Section id="acceptable-use" title="8. Acceptable Use">
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

            <Section id="communications" title="9. Communications & SMS Consent">
              <p>By providing a phone number, email address, or other contact information through PoolLogic, you agree that we (and the Subscriber, where applicable) may contact you about the Service using the channels you provide, including email, phone, and SMS.</p>
              <p>When you enable SMS or push notifications for invoice reminders, payment receipts, route updates, or other Service-related messages, <strong>you expressly consent to receive those messages, which may be sent using automated technology.</strong> Message and data rates may apply. You can opt out of non-essential SMS at any time by replying <strong>STOP</strong>; reply <strong>HELP</strong> for support. Opting out does not affect transactional or account-security messages reasonably required to operate the Service.</p>
              <p>Subscribers are responsible for obtaining all consents required by the Telephone Consumer Protection Act ("TCPA"), the CAN-SPAM Act, and any other applicable communications law <em>before</em> using PoolLogic to send marketing or non-transactional messages to their customers. The Subscriber represents and warrants that every recipient added to PoolLogic has provided the consents required for the messages the Subscriber sends to them. The Subscriber indemnifies PoolLogic against any claim or fine arising from a failure to obtain those consents.</p>
            </Section>

            <Section id="fees" title="10. Fees, Cancellation & Refunds">
              <p>Subscriber fees, billing cycles, and any applicable taxes are presented before purchase and are charged automatically through Stripe to the payment method you provide. By subscribing, you authorize PoolLogic to charge that payment method on each renewal date.</p>
              <p>You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the then-current billing period. Access to paid features continues until that date.</p>
              <p>Except where required by law, fees already paid are <strong>non-refundable</strong>, including for partial months or unused portions of a billing period. We may, at our sole discretion, offer prorated refunds in exceptional circumstances.</p>
              <p>Where PoolLogic offers a free trial, the trial length and any conversion behavior will be disclosed at sign-up. Unless we expressly state otherwise at sign-up, a free trial automatically converts to a paid subscription at the end of the trial period unless canceled beforehand.</p>

              <h3>Changes to Fees</h3>
              <p>We may change subscription fees, fee structures, or the features included in any tier on at least <strong>thirty (30) days'</strong> notice to the Subscriber (by email or by posting in the Service). A fee change takes effect at the start of your next renewal period following the notice. Your continued use of the Service after the new fee takes effect constitutes acceptance of the new fee. If you do not accept a fee change, your sole remedy is to cancel your subscription before the new fee takes effect, in which case access continues through the end of the then-current billing period.</p>
            </Section>

            <Section id="data" title="11. Data Ownership & Feedback">
              <p><strong>You own your data.</strong> Customer records, invoices, estimates, service reports, photos, and any other content you upload to PoolLogic remain your property.</p>
              <p>You grant PoolLogic a limited, non-exclusive, royalty-free license to host, process, transmit, and display your data solely for the purpose of operating and improving the service for you.</p>
              <p>You may export your data at any time during your subscription. On account closure or termination, you have <strong>30 days</strong> to export your data. After that period, we may delete it, subject to any legal or financial-record retention obligations (for example, Stripe transaction records, which are retained per Stripe's own policies).</p>

              <h3>Our Intellectual Property</h3>
              <p>PoolLogic and its licensors retain all right, title, and interest in and to the Service, including all software, source code, designs, UI, trademarks, logos, look and feel, and any documentation. Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service during your subscription, solely for your business's internal operations. No rights are granted by implication, estoppel, or otherwise. You may not remove or alter any copyright, trademark, or other proprietary notice that appears in the Service.</p>

              <h3>Feedback</h3>
              <p>If you send us suggestions, comments, ideas, bug reports, or other feedback about the Service ("Feedback"), you grant PoolLogic a perpetual, worldwide, royalty-free, irrevocable, sublicensable license to use, modify, and incorporate that Feedback into the Service or our other offerings without obligation or compensation. We may use Feedback freely, and you retain no rights in or claim to that Feedback once submitted.</p>
            </Section>

            <Section id="termination" title="12. Termination & Suspension">
              <h3>Suspension</h3>
              <p>We may suspend your account, or specific features of your account, at any time — with or without prior notice — if (a) a payment to PoolLogic fails or is reversed, (b) we reasonably suspect fraud, abuse, or a security risk, (c) you exceed reasonable usage limits, or (d) we need to investigate a potential breach of these Terms. Suspension is a temporary measure and may be lifted once the underlying issue is resolved. If a suspended account is not restored within a reasonable period, we may terminate it under the section below.</p>

              <h3>Termination</h3>
              <p>You may terminate your account at any time from your account settings. We may terminate your account, with or without notice, if you (a) materially breach these Terms, (b) fail to pay subscription fees after a reasonable cure period, (c) use the service for fraudulent or illegal activity, or (d) create risk or legal exposure for PoolLogic, other Subscribers, or End Customers.</p>
              <p>On termination, your right to access the service ends immediately. Records related to historical transactions, invoices, or other financial activity may be retained as required by law or by Stripe's record-keeping rules. Sections of these Terms that by their nature should survive termination (including ownership, our intellectual property, indemnification, disclaimers, limitation of liability, arbitration, and general provisions) will survive.</p>
            </Section>

            <Section id="disclaimers" title="13. Disclaimers & Limitation of Liability">
              <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR UNINTERRUPTED OPERATION.</p>
              <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, POOLLOGIC'S TOTAL CUMULATIVE LIABILITY ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE TOTAL FEES YOU PAID TO POOLLOGIC IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS ($100).</p>
              <p>POOLLOGIC WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOST REVENUE, LOST DATA, OR BUSINESS INTERRUPTION, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
              <p>Some jurisdictions do not allow the exclusion or limitation of certain warranties or damages, so these limits may not apply to you in full.</p>
              <p><strong>Carve-out.</strong> The limitations and exclusions in this Section do <strong>not</strong> apply to: (a) the Subscriber's payment, reimbursement, set-off, and offset obligations under Section 4 (Payment Processing); (b) the Subscriber's obligations under Section 5 (Card Surcharging & Pass-Through Fees); (c) the Subscriber's indemnification obligations under these Terms; or (d) any liability that cannot be limited or excluded under applicable law.</p>
            </Section>

            <Section id="indemnification" title="14. Indemnification">
              <p>You agree to defend, indemnify, and hold harmless PoolLogic, its officers, employees, and contractors from and against any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising out of or related to (a) your use of the service, (b) your breach of these Terms, (c) your violation of any law or the rights of any third party, or (d) any dispute between you and an End Customer, including billing disputes, service complaints, or refund claims.</p>

              <h3>Procedure</h3>
              <p>As a condition of indemnification, PoolLogic will: (a) promptly notify you in writing of any claim for which indemnification is sought (provided that a delay in notice will not relieve you of your obligations except to the extent you are materially prejudiced); (b) give you sole control of the defense and settlement of the claim, except that you may not settle any claim in a manner that admits liability on PoolLogic's part, imposes any obligation on PoolLogic, or restricts PoolLogic's operation of the Service, without PoolLogic's prior written consent (not to be unreasonably withheld); and (c) provide reasonable cooperation, at your expense, in the defense of the claim. PoolLogic may participate in the defense at its own expense with counsel of its choice.</p>
            </Section>

            <Section id="force-majeure" title="15. Force Majeure">
              <p>Neither party will be liable for any failure or delay in performance of these Terms caused by events beyond its reasonable control, including acts of God, natural disasters, severe weather, fire, flood, war, terrorism, pandemic, epidemic, public-health emergency, civil unrest, embargo, sanctions, government action or order, labor dispute, internet or telecommunications outage, power failure, or the failure of a third-party service provider on which the affected party relies (including Stripe, Supabase, Resend, Cloudflare, or any successor or replacement provider).</p>
            </Section>

            <Section id="disputes" title="16. Dispute Resolution & Arbitration">
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

            <Section id="dmca" title="17. Copyright Complaints (DMCA)">
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

            <Section id="general" title="18. General Provisions">
              <p><strong>Entire agreement.</strong> These Terms (together with any policies referenced, including the Privacy Policy) constitute the entire agreement between you and PoolLogic regarding the Service and supersede any prior or contemporaneous agreements, communications, or proposals on the subject.</p>
              <p><strong>No oral modification; waiver.</strong> No oral or informal modification of these Terms will be binding. Any waiver or modification must be in a writing signed by an authorized representative of PoolLogic. Our failure to enforce any provision is not a waiver of our right to do so later.</p>
              <p><strong>Severability.</strong> If any provision is held invalid or unenforceable, that provision will be enforced to the maximum extent permitted by law and the remaining provisions will continue in full force and effect.</p>
              <p><strong>Assignment.</strong> You may not assign or transfer these Terms or your account, by operation of law or otherwise, without our prior written consent, except that you may assign these Terms and your account to a successor in connection with a merger, acquisition, reorganization, or sale of substantially all of your assets or your pool service business, on prior written notice to PoolLogic and provided the successor expressly assumes your obligations under these Terms and is not, in our reasonable judgment, a competitor of PoolLogic. We may assign these Terms in connection with a merger, acquisition, reorganization, sale of assets, financing, or by operation of law.</p>
              <p><strong>No third-party beneficiaries.</strong> These Terms do not create any third-party beneficiary rights.</p>
              <p><strong>Notices.</strong> Notices to PoolLogic must be sent to <a href="mailto:legal@poollogic.app" style={{ color: 'var(--accent)' }}>legal@poollogic.app</a>. We may give notice to you by email at the address associated with your account, by posting in the Service, or by other reasonable means.</p>
              <p><strong>Headings.</strong> Headings are for convenience only and do not affect interpretation.</p>
            </Section>

            <Section id="changes" title="19. Changes to These Terms">
              <p>We may update these Terms from time to time. If we make material changes, we will notify you by email and post the updated Terms on this page with a new effective date. Material changes will take effect <strong>30 days</strong> after notice. Your continued use of the service after that period constitutes acceptance of the updated Terms.</p>
              <p>For non-material changes (such as clarifications or typo corrections), we may update these Terms without individual notice.</p>
            </Section>

            <Section id="contact" title="20. Contact">
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
