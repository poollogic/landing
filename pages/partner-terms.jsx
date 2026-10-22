import React, { useEffect, useState } from 'react';
import { PARTNER, usd, payoutRows, leftLine, perkLine, trialEveryone, TRIAL_ENDS } from '../partnerProgram.js';

// Partner Program Terms — built like pages/terms.jsx (same TOC, Section and
// .terms-* classes). Numbers come from partnerProgram.js. Draft: a lawyer
// reviews it before the public apply form opens (PARTNER.termsDraft hides the
// banner once that's done).

const SECTIONS = [
  { id: 'about', title: 'About These Terms' },
  { id: 'joining', title: 'Joining & Approval' },
  { id: 'link-code-page', title: 'Your Link, Code & Page' },
  { id: 'brand', title: 'Using the PoolLogic Brand' },
  { id: 'referrals', title: 'What Counts as a Referral' },
  { id: 'earnings', title: 'Referral Payments & What You Earn' },
  { id: 'retention', title: 'Retention & Take-Backs' },
  { id: 'adjustments', title: 'Refunds & Adjustments' },
  { id: 'payment', title: 'Payment & W-9' },
  { id: 'disclosure', title: 'Disclosure (FTC)' },
  { id: 'prohibited', title: 'What You May Not Do' },
  { id: 'content-review', title: 'Content Review' },
  { id: 'audience-offer', title: 'The Audience Offer' },
  { id: 'ending', title: 'Ending the Partnership' },
  { id: 'contractor', title: 'Independent Contractor' },
  { id: 'taxes', title: 'Taxes' },
  { id: 'confidentiality', title: 'Confidentiality & Data' },
  { id: 'general', title: 'General Provisions' },
  { id: 'changes', title: 'Changes to These Terms' },
  { id: 'contact', title: 'Contact' },
];

const link = { color: 'var(--accent)' };
const Mail = () => <a href={`mailto:${PARTNER.email}`} style={link}>{PARTNER.email}</a>;

const PartnerTermsPage = () => {
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
          {PARTNER.termsDraft && (
            <div role="note" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20,
              padding: '6px 12px', border: '1px solid var(--line)', borderRadius: 999,
              background: 'var(--bg-soft)', fontSize: 13, fontWeight: 600, color: 'var(--ink-3)',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--ink-6)' }} />
              Draft — pending legal review
            </div>
          )}
          <h1 style={{ fontSize: 'clamp(36px, 4.4vw, 56px)', letterSpacing: '-0.035em', lineHeight: 1.05, color: 'var(--ink)' }}>
            Partner Program Terms
          </h1>
          <p style={{ marginTop: 16, fontSize: 16, color: 'var(--ink-4)', lineHeight: 1.6, maxWidth: 640 }}>
            These terms govern the PoolLogic Partner Program: how you refer pool service companies to PoolLogic, what you earn, how you're paid, and what you agree to do and not do. The plain-English overview is on the <a href="/partners" style={link}>Partner Program page</a>; where the two differ, these terms apply.
          </p>
          <div style={{ marginTop: 22, display: 'flex', gap: 28, flexWrap: 'wrap', fontSize: 13.5, color: 'var(--ink-5)' }}>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Version:</strong> {PARTNER.termsVersion}</span>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Effective:</strong> when you accept them</span>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Updated:</strong> {PARTNER.termsUpdated}</span>
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
            <Section id="about" title="1. About These Terms">
              <p>These Partner Program Terms ("Partner Terms") form a binding agreement between you ("Partner," "you") and PoolLogic ("we," "our," or "us"). You accept them when you click to accept them, sign them, or first share a PoolLogic partner link or code after we approve you. We record the version you accepted ({PARTNER.termsVersion} for this one) and when.</p>
              <p>If we agree different numbers with you in writing (a "custom offer"), the custom offer's numbers replace the standard ones below; everything else in these Partner Terms still applies.</p>
              <p>These Partner Terms are separate from the PoolLogic <a href="/terms" style={link}>Terms of Service</a>. If you also run a pool company on PoolLogic, the Terms of Service govern that account.</p>
            </Section>

            <Section id="joining" title="2. Joining & Approval">
              <p>To join, you must be at least 18, live in and be able to receive payments in {PARTNER.country}, and be approved by us. We may approve or decline any application for any reason, and an application does not create a partnership.</p>
              <p>You agree that what you tell us when you apply (who you are, where you reach pool professionals, your audience and how you'll share PoolLogic) is true, and that you'll tell us if it materially changes. We may verify that you own or control the channels you list before your partner page names you.</p>
            </Section>

            <Section id="link-code-page" title="3. Your Link, Code & Page">
              <p>Once approved, you receive a referral link, a partner page at <strong>{PARTNER.pageBase}&lt;your handle&gt;</strong>, and one or more referral codes. We may also issue codes for individual videos or campaigns. Codes are 4–16 letters and numbers, may not include reserved words (such as "poollogic," "free," "promo" or a competitor's name), and are never reissued once retired.</p>
              <p>We host and control your partner page. We may edit it, pause it, or take it down at any time, including to correct an offer or a claim. Your link, codes and page are licensed to you only while you're an active partner.</p>
            </Section>

            <Section id="brand" title="4. Using the PoolLogic Brand">
              <p>While you're an active partner, we grant you a limited, non-exclusive, non-transferable, revocable license to use the PoolLogic name, logo and the materials in the <a href="/partners/kit" style={link}>partner kit</a> solely to promote PoolLogic under these Partner Terms. You may not alter the logo, or use the brand in a way that suggests you are PoolLogic, work for PoolLogic, or speak for it.</p>
              <p>You may not register or use "PoolLogic," or anything confusingly similar, in a domain name, social media handle, username, page or group name, or app name.</p>
            </Section>

            <Section id="referrals" title="5. What Counts as a Referral">
              <p>A "Referred Company" is a pool service business that creates a new PoolLogic account after following your link or entering your code, and that we credit to you under the rules below.</p>
              <ul>
                <li><strong>Links</strong> are remembered for {PARTNER.linkDays} days from the click, on that browser.</li>
                <li><strong>A code entered at sign-up</strong> takes priority over a remembered link, unless the code and the link point to different partners or a sales representative, in which case we review the claim and decide.</li>
                <li><strong>A PoolLogic sales representative's</strong> earlier link or confirmed deal takes priority over a partner's referral.</li>
                <li>Otherwise, the <strong>most recent link</strong> within {PARTNER.linkDays} days wins.</li>
              </ul>
              <p>None of these count as a referral: an existing PoolLogic customer; a company that has, or recently had, a PoolLogic account (matched on details such as email, phone or payout bank); your own company, a company you own part of, or your employees'. A company, and its owner, can be credited to one partner only, ever.</p>
              <p>A code may be added after sign-up only within 7 days, and only if no other partner or representative already has the company; such a claim is reviewed before it's credited. Our records decide who referred a company, and our decision on a contested claim is final.</p>
            </Section>

            <Section id="earnings" title="6. Referral Payments & What You Earn">
              <p>You earn a one-time <strong>Referral Payment</strong> for each Referred Company that becomes a paying customer. The amount is set by the PoolLogic plan the Referred Company is on and its number of active customers, both as of its <strong>First Paid Month</strong>: the first full monthly billing period after any free trial that the company has paid PoolLogic for (on yearly billing, the first month the yearly payment covers).</p>
              <table className="terms-table" style={{ width: '100%', borderCollapse: 'collapse', margin: '8px 0 16px', fontSize: 15 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px 0', borderBottom: '1px solid var(--line)' }}>Active customers</th>
                    <th style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid var(--line)' }}>Insight</th>
                    <th style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid var(--line)' }}>Vision</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutRows().map((r) => (
                    <tr key={r.customers}>
                      <td style={{ padding: '7px 0', borderBottom: '1px solid var(--line)' }}>{r.customers}</td>
                      <td style={{ padding: '7px 0', borderBottom: '1px solid var(--line)', textAlign: 'right' }}>{usd(r.insight)}</td>
                      <td style={{ padding: '7px 0', borderBottom: '1px solid var(--line)', textAlign: 'right' }}>{usd(r.vision)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ul>
                <li><strong>When it counts.</strong> The Referral Payment is added to your payable balance for the next monthly payout after the First Paid Month has been paid.</li>
                <li><strong>One per company.</strong> Each Referred Company earns one Referral Payment, once. Later changes to its plan, size or billing period don't change it or earn another.</li>
                <li><strong>Only paid plans count.</strong> A company that never pays for a plan, or whose plan is free, waived or discounted to zero, earns nothing.</li>
                <li><strong>Large companies.</strong> Companies with more than {PARTNER.customAbove} active customers are priced individually; no standard Referral Payment applies to them unless we agree an amount with you in writing first.</li>
              </ul>
              <p>There is no percentage or recurring commission on a Referred Company's payments. PoolLogic sets its own prices and may change them; any earnings figure we publish is an example, not a promise.</p>
            </Section>

            <Section id="retention" title="7. Retention & Take-Backs">
              <p>We take back a Referral Payment if, before <strong>day {PARTNER.clawbackBeforeDay}</strong> counted from the Referred Company's First Paid Month:</p>
              <ul>
                <li>the company leaves: {leftLine()}; or</li>
                <li>the payment for its First Paid Month is refunded, credited or charged back; or</li>
                <li>we reasonably determine the referral or the payment was fraudulent or broke these Partner Terms.</li>
              </ul>
              <p>An amount taken back is deducted from your next payout. If it's more than you're owed, the negative balance carries into the next payout, and the one after, until it's cleared.</p>
            </Section>

            <Section id="adjustments" title="8. Refunds & Adjustments">
              <p>If PoolLogic refunds or credits the payment for a Referred Company's First Paid Month, its Referral Payment is taken back as in Section 7.</p>
              <p>We may reverse any credit or amount that we reasonably believe came from fraud, self-referral, a breach of these Partner Terms, or our error, and recover amounts already paid by deducting them from future payouts or, if none are due, by asking you to repay them within 30 days.</p>
            </Section>

            <Section id="payment" title="9. Payment & W-9">
              <p>We pay monthly, by the <strong>{PARTNER.payout.byDay}</strong>, once your payable balance is at least <strong>{usd(PARTNER.payout.minimum)}</strong>. Smaller balances, and negative balances from amounts taken back, carry forward. We pay by {PARTNER.payout.methods}, in U.S. dollars.</p>
              <p>We need a completed <strong>Form W-9</strong> before your first payout. Until we have it, earnings accrue but are not paid. Changes to your payout details must be confirmed by email to the address we have on file, and may hold the next payout for 7 days.</p>
              <p>Tell us within 60 days if you think a payout is wrong; after that, the payout is final.</p>
            </Section>

            <Section id="disclosure" title="10. Disclosure (FTC)">
              <p>Under the Federal Trade Commission's Guides Concerning the Use of Endorsements and Testimonials in Advertising (<strong>16 CFR Part 255</strong>), your partnership with PoolLogic is a material connection that you must disclose clearly and conspicuously, every time you promote PoolLogic, in the content itself.</p>
              <ul>
                <li>Say it at the <strong>start</strong> of the mention, in words (for example: "I get paid if you sign up with my link or code"), and show it on screen at the same time in video ("Paid partnership with PoolLogic").</li>
                <li>Put the disclosure in the first line of any description or caption, above any "more" cut-off, next to your link.</li>
                <li>Use each platform's paid-partnership tools as well, but not instead: a platform label, "#affiliate," "#sp," "#partner," or a note only in comments is not enough on its own.</li>
                <li>Only say you use PoolLogic if you actually do, and only share honest opinions.</li>
              </ul>
              <p>The <a href="/partners/kit" style={link}>partner kit</a> has the exact wording for each platform. We monitor partner content and may require you to fix or remove anything that doesn't meet this Section.</p>
            </Section>

            <Section id="prohibited" title="11. What You May Not Do">
              <p>You agree not to:</p>
              <ul>
                <li>Bid on "PoolLogic," misspellings or close variations in search or social advertising, or run paid ads that send people straight to PoolLogic or your link without your own content.</li>
                <li>List PoolLogic codes on coupon, deal, discount-code or cash-back sites.</li>
                <li>Use cookie stuffing, pop-unders, hidden frames, forced clicks, or anything else that sets a referral without a person deliberately following your link.</li>
                <li>Send unsolicited email, texts or direct messages, or use purchased or scraped lists. You are responsible for complying with the CAN-SPAM Act, the Telephone Consumer Protection Act and similar laws.</li>
                <li>Post fake reviews or testimonials, or anything else prohibited by the FTC's rule on consumer reviews and testimonials (<strong>16 CFR Part 465</strong>).</li>
                <li>Pay, rebate or reward people for signing up, or share your earnings with them, unless we approve it in writing.</li>
                <li>Refer yourself, your own company, a company you own part of, or your employees.</li>
                <li>Make claims we haven't approved, including "free processing," savings figures, comparisons naming a competitor, or anything implying you work for or speak for PoolLogic.</li>
                <li>Film, screenshot or share real customer data from any PoolLogic account.</li>
                <li>Promote PoolLogic alongside content that is unlawful, hateful, harassing or misleading.</li>
              </ul>
            </Section>

            <Section id="content-review" title="12. Content Review">
              <p>Send us your first piece of content that mentions PoolLogic before it's published, so we can check the disclosure and the claims. After that, we may review your content at any time, including in a periodic check of how PoolLogic is being promoted.</p>
              <p>If we ask you to correct or remove content that breaks these Partner Terms or the law, you agree to do so within <strong>48 hours</strong>. We may pause your link, codes and page until it's fixed.</p>
            </Section>

            <Section id="audience-offer" title="13. The Audience Offer">
              {PARTNER.perkLive ? (
                <p>Companies that sign up with your link or code get, after the {PARTNER.trial.everyoneDays}-day free trial everyone gets ({trialEveryone()}), <strong>{perkLine()}</strong> (the "audience offer"); on yearly billing, the discount is {PARTNER.perk.percentOff}% of one month's price. {TRIAL_ENDS}</p>
              ) : (
                <p>We intend to offer companies that sign up with your link or code {perkLine()}, after the standard {PARTNER.trial.everyoneDays}-day free trial (the "audience offer"). It is not available yet, and you may not promote it until we tell you it's live.</p>
              )}
              <p>The audience offer is PoolLogic's to set, may have limits, and applies only to companies that are eligible under Section 5. You may only describe it as we publish it. We'll give you at least <strong>30 days' notice</strong> before changing or ending it; a change applies to new sign-ups only, not to companies that already have it.</p>
            </Section>

            <Section id="ending" title="14. Ending the Partnership">
              <p>Either of us may end the partnership at any time, for any reason, by notice to the other.</p>
              <h3>Without cause</h3>
              <p>If either of us ends the partnership without cause, you're still paid the Referral Payment for each Referred Company credited to you before it ended, once its First Paid Month is paid, subject to Section 7 and these Partner Terms. Your link, codes and page stop working, and you must stop promoting PoolLogic as a partner.</p>
              <h3>For breach</h3>
              <p>If we end the partnership because you broke these Partner Terms, you forfeit all unpaid amounts, and we may recover amounts already paid that relate to the breach.</p>
              <p>Sections that by their nature should survive ending (including payment of earned amounts, recovery, confidentiality, taxes and general provisions) will survive.</p>
            </Section>

            <Section id="contractor" title="15. Independent Contractor">
              <p>You are an independent contractor, not an employee, agent, joint venturer or franchisee of PoolLogic. You decide how, when and where you create content. You may not make commitments on PoolLogic's behalf. You are responsible for your own expenses, equipment and insurance, and you may promote other products, including competitors', unless a custom offer says otherwise.</p>
            </Section>

            <Section id="taxes" title="16. Taxes">
              <p>You are responsible for all taxes on what you earn. We collect a Form W-9 before your first payout and issue a <strong>Form 1099-NEC</strong> where U.S. tax law requires one. If you don't provide a valid W-9, we may be required to withhold tax from your payouts. Nothing PoolLogic tells you is tax advice.</p>
            </Section>

            <Section id="confidentiality" title="17. Confidentiality & Data">
              <p>"Confidential Information" means non-public information we share with you as a partner, including your statement details, which companies signed up with your link or code and their status, custom offer terms, and unreleased features. You'll use it only to take part in the program, won't disclose it, and will protect it with reasonable care. You won't say publicly that a particular company uses PoolLogic without that company's permission.</p>
              <p>We show partners each Referred Company's status and the Referral Payment credited on it only, never its customers, the payments it collects from them, or its revenue. We handle your personal information as described in our <a href="/privacy" style={link}>Privacy Policy</a>.</p>
            </Section>

            <Section id="general" title="18. General Provisions">
              <p><strong>Limitation of liability.</strong> To the maximum extent permitted by law, PoolLogic's total liability arising out of or relating to these Partner Terms will not exceed the amounts we paid you under them in the twelve (12) months before the claim, and PoolLogic will not be liable for any indirect, incidental, special, consequential or punitive damages, including lost profits.</p>
              <p><strong>Indemnification.</strong> You will defend, indemnify and hold harmless PoolLogic from any claim, fine or loss (including reasonable attorneys' fees) arising from your content, your promotion of PoolLogic, or your breach of these Partner Terms or the law.</p>
              <p><strong>Disputes and governing law.</strong> These Partner Terms are governed by the laws of the State of Florida, without regard to its conflict-of-laws principles. Disputes are resolved as set out in the Dispute Resolution &amp; Arbitration section of our <a href="/terms#disputes" style={link}>Terms of Service</a>, which applies to you as if you were a Subscriber.</p>
              <p><strong>Entire agreement.</strong> These Partner Terms, any custom offer we agree in writing, and the policies they reference are the entire agreement about the program and replace any earlier discussions.</p>
              <p><strong>Assignment.</strong> You may not assign or transfer these Partner Terms, your earnings or your codes without our written consent. We may assign them in connection with a merger, acquisition or sale of assets.</p>
              <p><strong>Severability and waiver.</strong> If any provision is unenforceable, the rest stays in effect. Our not enforcing a provision is not a waiver of it.</p>
            </Section>

            <Section id="changes" title="19. Changes to These Terms">
              <p>We may update these Partner Terms. For material changes, including to the Referral Payment amounts, what counts as a First Paid Month or the payout rules, we'll email you at least <strong>30 days</strong> before they take effect and post the new version here. Changes don't reduce what you've already earned. If you don't accept a change, you may end the partnership before it takes effect, and Section 14's without-cause terms apply.</p>
            </Section>

            <Section id="contact" title="20. Contact">
              <p>For questions about the program or these Partner Terms:</p>
              <p style={{ marginTop: 12 }}>
                <strong style={{ color: 'var(--ink-2)' }}>PoolLogic Partner Program</strong><br/>
                <Mail /><br/>
                Legal notices: <a href="mailto:legal@poollogic.app" style={link}>legal@poollogic.app</a>
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

export default PartnerTermsPage;
