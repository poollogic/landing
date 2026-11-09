import React, { useEffect, useState } from 'react';

// Technician App Terms — what a technician agrees to with the box on the
// phone app's location screen ("I agree to the Technician App Terms and have
// read the Privacy Policy"), the first time they sign in. Built like
// pages/terms.jsx (same TOC, Section and .terms-* classes). The phone links
// here (https://getpoolnautics.com/technician-terms); VERSION is the
// agreement version it records (SIGNIN_AGREEMENT_VERSION in the app), so a
// change here that needs agreeing again moves both together.

const VERSION = '2026-11-10';
const EFFECTIVE = 'November 10, 2026';

const SECTIONS = [
  { id: 'about', title: 'About these terms' },
  { id: 'company', title: 'Your company is in charge' },
  { id: 'location', title: 'Location in the app' },
  { id: 'using', title: 'Using the app' },
  { id: 'mileage', title: 'Mileage records' },
  { id: 'information', title: 'Your information' },
  { id: 'warranty', title: 'No warranty' },
  { id: 'liability', title: 'Limitation of liability' },
  { id: 'changes', title: 'Changes' },
  { id: 'contact', title: 'Contact' },
];

const link = { color: 'var(--accent)' };
const Privacy = () => <a href="/privacy" style={link}>Privacy Policy</a>;

const TechnicianTermsPage = () => {
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
            Technician App Terms
          </h1>
          <p style={{ marginTop: 16, fontSize: 16, color: 'var(--ink-4)', lineHeight: 1.6, maxWidth: 640 }}>
            These terms cover using the Poolnautics app as a pool technician. You agree to them by checking the box on the app's location screen the first time you sign in. They're short on purpose; the <Privacy /> has the details on your information.
          </p>
          <div style={{ marginTop: 22, display: 'flex', gap: 28, flexWrap: 'wrap', fontSize: 13.5, color: 'var(--ink-5)' }}>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Effective:</strong> {EFFECTIVE}</span>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Version:</strong> {VERSION}</span>
            <span><strong style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Provider:</strong> Poolnautics LLC</span>
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
            <div style={{
              marginBottom: 36, padding: '16px 20px', borderRadius: 12,
              background: 'var(--bg-soft)', border: '1px solid var(--line)',
              fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-3)',
            }}>
              <strong style={{ color: 'var(--ink-2)' }}>In short:</strong> your company decides which features are on and how your information is used. Each service report records where it was sent from. If your company turns them on, the app logs your miles and your company may review the routes you drive during work hours. You can change location access in your phone's Settings at any time.
            </div>

            <Section id="about" title="1. About these terms">
              <p>These Technician App Terms ("Terms") are between you and Poolnautics LLC ("Poolnautics," "we," "us"). They apply when you use the Poolnautics technician app as a technician, employee or subcontractor of a pool service company that uses Poolnautics ("your company").</p>
              <p>You accept these Terms by checking the box on the app's location screen ("I agree to the Technician App Terms and have read the Privacy Policy") the first time you sign in. If we change them, the app will ask you to agree again.</p>
            </Section>

            <Section id="company" title="2. Your company is in charge">
              <p>Your company chose Poolnautics and controls your account. It decides which features are turned on for you, what you can see in the app, and how the information you create is used, stored and shared.</p>
              <p>Your company is responsible for giving you any notices and getting any consents the law requires before turning on location features for you. Questions about how your information is used should go to your company first.</p>
            </Section>

            <Section id="location" title="3. Location in the app">
              <p><strong style={{ color: 'var(--ink-2)' }}>Service reports.</strong> Each service report and "can't service" report records the phone's location when it's sent, to confirm the visit. Your company sees it, and it appears in the service report your company sends its customer.</p>
              <p><strong style={{ color: 'var(--ink-2)' }}>Mileage logging.</strong> If your company turns it on for you, the app records your location while your route is under way to work out the miles you drive between stops.</p>
              <p><strong style={{ color: 'var(--ink-2)' }}>Route review.</strong> Your company may review the routes you drive during work hours. When it does, the app records your location during work hours, including when the app is closed if location access is set to Always.</p>
              <p>You can change the app's location access at any time in your phone's Settings. Some features, like visit confirmation and mileage, don't work without it. The <Privacy /> explains what's collected, who sees it and how long it's kept.</p>
            </Section>

            <Section id="using" title="4. Using the app">
              <p>Keep your sign-in to yourself and don't let anyone else use your account. Send accurate reports, readings and photos.</p>
              <p>Don't use apps or settings that fake your phone's location, and don't try to interfere with how the app records location or mileage. The app notes locations that look simulated.</p>
            </Section>

            <Section id="mileage" title="5. Mileage records">
              <p>Mileage worked out by the app is a record-keeping aid, not tax, payroll or legal advice. Phones can miss or misjudge locations because of signal, settings, battery or other conditions, so some miles may be estimated (and marked) or missing.</p>
              <p>Keep your own records, such as daily odometer readings, and review them with a tax professional if you use them for taxes. You can download your own mileage in the app under Settings › Mileage.</p>
            </Section>

            <Section id="information" title="6. Your information">
              <p>The <Privacy /> describes the information the app collects, who can see it, and how long it's kept. Your company also has its own policies about the information it keeps.</p>
            </Section>

            <Section id="warranty" title="7. No warranty">
              <p>The app is provided "as is" and "as available." Location technology isn't perfect, and we don't promise that recorded locations, routes, times or mileage will be complete, accurate or always available.</p>
            </Section>

            <Section id="liability" title="8. Limitation of liability">
              <p>To the fullest extent the law allows, Poolnautics isn't liable for losses that come from using, relying on, or being unable to use the app, including records that are missing, estimated or inaccurate. Decisions about pay, reimbursement or your work are made by your company, not by Poolnautics.</p>
            </Section>

            <Section id="changes" title="9. Changes">
              <p>We may update these Terms. When we do, we'll change the date at the top, and the app will ask you to agree to the new version before you continue.</p>
            </Section>

            <Section id="contact" title="10. Contact">
              <p>Questions about your work or your information: contact your company. Questions about these Terms: contact Poolnautics through the details on our <a href="/contact" style={link}>Contact</a> page.</p>
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

export default TechnicianTermsPage;
