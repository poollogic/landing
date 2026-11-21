import React, { useEffect, useState } from 'react';

// /delete-account: how to ask for a Poolnautics account to be deleted, with or without the app, and
// what's deleted and kept. Google Play requires this page for the app ("Poolnautics", developer
// Poolnautics LLC) and the URL is in the Play Console listing, so it stays at exactly /delete-account.
// It must work without signing in. Built like pages/technician-terms.jsx (same TOC, Section and
// .terms-* classes).
//
// Its wording follows the Privacy Policy (pages/privacy.jsx): Section 2, "Deleting a technician
// account", and Sections 10 (Data Retention, "When a Subscriber Leaves") and 12 (Subscriber Rights).
// When those change, change this page with them, and don't say anything here they don't.

const UPDATED = 'November 21, 2026';
const PRIVACY = 'privacy@getpoolnautics.com';

const SECTIONS = [
  { id: 'steps', title: 'How to ask' },
  { id: 'technicians', title: 'Technicians (phone app)' },
  { id: 'companies', title: 'Companies and office users (web app)' },
  { id: 'questions', title: 'Questions' },
];

const link = { color: 'var(--accent)' };
const strong = { color: 'var(--ink-2)' };
const Mail = () => <a href={`mailto:${PRIVACY}`} style={link}>{PRIVACY}</a>;
const Contact = ({ children = 'Contact page' }) => <a href="/contact?topic=question" style={link}>{children}</a>;

const DeleteAccountPage = () => {
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
            Delete your Poolnautics account
          </h1>
          <p style={{ marginTop: 16, fontSize: 16, color: 'var(--ink-4)', lineHeight: 1.6, maxWidth: 640 }}>
            How to ask for your account in Poolnautics, the app by Poolnautics LLC, to be deleted, with or without the app, and what is deleted and what is kept. You don't need to sign in.
          </p>
          <div style={{ marginTop: 22, display: 'flex', gap: 28, flexWrap: 'wrap', fontSize: 13.5, color: 'var(--ink-5)' }}>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>App:</strong> Poolnautics</span>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Developer:</strong> Poolnautics LLC</span>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Updated:</strong> {UPDATED}</span>
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
            {/* The steps, first: Google Play asks for them near the top. */}
            <section id="steps" style={{
              scrollMarginTop: 96, marginBottom: 36, padding: '18px 22px', borderRadius: 12,
              background: 'var(--bg-soft)', border: '1px solid var(--line)',
              fontSize: 15, lineHeight: 1.6,
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--ink)', marginBottom: 10, lineHeight: 1.3 }}>
                How to ask for your account to be deleted
              </h2>
              <div className="terms-body">
                <p><strong style={strong}>Technicians, in the Poolnautics phone app:</strong></p>
                <ol style={{ margin: '0 0 12px', paddingLeft: 22, listStyleType: 'decimal' }}>
                  <li>Open <strong style={strong}>Settings</strong>.</li>
                  <li>Tap <strong style={strong}>Delete Account</strong>, at the bottom.</li>
                  <li>Confirm. Your account is deleted straight away.</li>
                </ol>
                <p><strong style={strong}>Technicians, without the app:</strong> send us a message from our <Contact /> (choose "Ask a question"), or email <Mail />. Include the email address on your account and the company you work for.</p>
                <p><strong style={strong}>Company owners and admins:</strong> delete your company's account in the Poolnautics web app under <strong style={strong}>Settings › Plan</strong>, or email <Mail /> (<a href="#companies" style={link}>details below</a>).</p>
                <p><strong style={strong}>Office users</strong> who only want their own login removed: ask your company's admin, or <Contact>contact us</Contact>.</p>
              </div>
            </section>

            <Section id="technicians" title="1. Technicians (the Poolnautics phone app)">
              <h3 style={subHeadStyle}>Delete your account in the app</h3>
              <p>In the app, open Settings, tap Delete Account at the bottom, and confirm. It takes effect straight away.</p>

              <h3 style={subHeadStyle}>Ask without the app</h3>
              <p>If you can't use the app, send us a message from our <Contact /> (choose "Ask a question"), or email <Mail />. Include:</p>
              <ul>
                <li>the email address on your account, and</li>
                <li>the pool service company you work for.</li>
              </ul>
              <p>Because your company controls your account, we may need to confirm the request with your company, or with you by email, before we delete it.</p>

              <h3 style={subHeadStyle}>What is deleted</h3>
              <ul>
                <li>Your login is deleted.</li>
                <li>Your name is replaced with "Former technician" (or "Former team member" for other staff).</li>
                <li>Your email address, phone number, username, PIN, home address, personal notes, and shopping list are removed.</li>
                <li>Your push notification tokens are deleted, and anything on your phone not yet sent, along with your mileage stored there, is erased.</li>
              </ul>
              <p>Your company's admins and managers are notified by email.</p>

              <h3 style={subHeadStyle}>What your company keeps, and for how long</h3>
              <p>Your company keeps its business records of your work, under "Former technician", each for as long as the <a href="/privacy#retention" style={link}>Privacy Policy</a> says:</p>
              <ul>
                <li><strong style={strong}>Service reports</strong>, with their locations, and <strong style={strong}>work orders</strong>: kept with your company's account, and deleted when its account is deleted (60 days after its plan ends, or sooner if it asks). Service report photos are deleted about two months after the visit.</li>
                <li><strong style={strong}>Mileage records</strong>: kept as part of your company's business records for as long as its account exists, and deleted on your company's request or when its account is deleted.</li>
                <li><strong style={strong}>Vehicle records and documents</strong> (the vehicle record, check-ins, oil change history, registration and insurance card): kept until your company removes you from its team, or its account is deleted.</li>
                <li><strong style={strong}>Location agreements</strong>: kept as a record with your company's account data.</li>
                <li><strong style={strong}>Drive history</strong>: deleted 30 days after it was recorded.</li>
                <li><strong style={strong}>App status</strong>: deleted 60 days after the phone last reported.</li>
              </ul>
              <p>The details are in the <a href="/privacy#deleting-technician-account" style={link}>Privacy Policy, Section 2 ("Deleting a technician account")</a> and <a href="/privacy#retention" style={link}>Section 10 (Data Retention)</a>.</p>
            </Section>

            <Section id="companies" title="2. Company owners and office users (the web app)">
              <h3 style={subHeadStyle}>Deleting your company's account and its data</h3>
              <ul>
                <li><strong style={strong}>In the web app.</strong> Any admin can delete the company's account and data at any time in the Poolnautics web app (Settings › Plan). To confirm, the admin types the company's name and enters a code we email to the company email address, not to the admin. Once confirmed, deletion is final and can't be undone: the plan ends at once, no one can sign in to the web app or the technician app, and the data is deleted, normally within a day.</li>
                <li><strong style={strong}>By asking us.</strong> Email <Mail />. We confirm the request with the same kind of code, sent to the company email address, and delete the data within 30 days.</li>
                <li><strong style={strong}>When a plan ends.</strong> The account becomes <strong style={strong}>read-only for 60 days</strong>: office users can view everything and admins can export it, but no one can change anything, and choosing a plan during the 60 days restores everything. 30 days and 7 days before the deletion date, we email the date to every admin and to the company email address. After the 60 days, the account and its data are permanently deleted.</li>
                <li><strong style={strong}>When deletion waits.</strong> We delay deletion while a card dispute is open, a payment is still processing, or the company owes money on its Stripe account or we can't confirm that it doesn't, and while we need to keep the data for a legal reason, such as a legal request, or at the company's request while it arranges to come back. We delete it once the reason ends.</li>
              </ul>

              <h3 style={subHeadStyle}>What is deleted</h3>
              <p>The company's account and its data: its customers' data, service history, invoices and payment records, routes, requests, files (including photos, logos, mileage records, vehicle documents, and exports), and its users' logins. Its customers' records in its Stripe account are deleted too, including their saved cards and bank accounts. We then email its admins and its company email address that it's done.</p>

              <h3 style={subHeadStyle}>What is kept, and for how long</h3>
              <ul>
                <li><strong style={strong}>Our own business records about the company:</strong> a record that its account existed and was closed (its name, email address, Stripe account and customer IDs, the dates, and why); each payment it took through Poolnautics, without the payer's name or any customer details; our bills to it, including Mail Service bills and letters, without recipients' names or addresses; and sales commission records. We keep these for as long as we need them for tax and accounting, card disputes, legal claims, and our legal obligations, which is generally at least seven years.</li>
                <li><strong style={strong}>Email delivery:</strong> the list of email addresses that bounced or reported our emails as spam, without the company's name.</li>
                <li><strong style={strong}>Backups and our providers:</strong> deleted data remains in our database backups until they expire, within 7 days, and copies of photos held in Cloudflare's network expire within 7 days. Our email, error-monitoring, background-job, and printing-and-mailing providers keep their own logs for their own retention periods.</li>
                <li><strong style={strong}>Stripe:</strong> we don't delete the company's Stripe account itself, which belongs to the company. The records Stripe holds are governed by Stripe's own retention policies.</li>
              </ul>
              <p>The details are in the Privacy Policy, <a href="/privacy#retention" style={link}>Section 10 (Data Retention)</a>, under <a href="/privacy#leaving" style={link}>"When a Subscriber Leaves"</a>, and <a href="/privacy#subscriber-rights" style={link}>Section 12 (Subscriber Rights)</a>.</p>

              <h3 style={subHeadStyle}>Removing only your own login</h3>
              <p>An office user who only wants their own login removed should ask their company's admin, or <Contact>contact us</Contact>. If your company removes you from its team (Remove member), your name, email address, and phone number are deleted from its account.</p>
            </Section>

            <Section id="questions" title="3. Questions">
              <p>Questions: <Contact>contact us</Contact>.</p>
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

export default DeleteAccountPage;
