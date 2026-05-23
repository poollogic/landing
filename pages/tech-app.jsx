import React from 'react';

// Tech app deep-dive — the long-form story of the on-truck mobile app.
// Linked from the "Built differently" section on the homepage.

const TechAppPage = () => (
  <main style={{ background: 'var(--bg)', color: 'var(--ink-2)' }}>
    <Hero />
    <ProblemStrip />
    <Capability
      index="01"
      eyebrow="Required fields"
      title="Reports can't go out half-empty."
      body="Set CYA, chlorine, pH, and a stop photo as required. The tech literally can't submit until they're in. The 'you didn't even service my pool' calls stop the day you turn it on."
      bullets={[
        'Per-customer or fleet-wide field rules',
        'Photos required for any flagged stop',
        'Out-of-range readings prompt a second photo',
      ]}
      visual={<RequiredFieldsMock />}
    />
    <Capability
      index="02"
      eyebrow="Smart subject lines"
      title="The subject line tells the truth before the customer opens it."
      body="If water level reads low, the report's subject changes to flag it. Same for stuck-pump pressure, low chlorine, or any condition you set. Customers see the issue at a glance instead of digging through a PDF."
      bullets={[
        'Triggered by readings, not by hand',
        'Configurable conditions per metric',
        'Sent the moment the stop closes',
      ]}
      visual={<InboxMock />}
      reverse
    />
    <Capability
      index="03"
      eyebrow="Pool profile"
      title="One setup. The app does the math forever."
      body="Filter type, pool size, baseline pressure, surface, salt or chlorine — stored once on the pool profile. From then on, dosage calculations, LSI, and pressure thresholds happen automatically based on what's actually in the water and what's actually installed."
      bullets={[
        'Live LSI recalculates on every reading',
        'Chemical doses sized to the pool',
        'Filter pressure tracked against the baseline',
      ]}
      visual={<ProfileMock />}
    />
    <Capability
      index="04"
      eyebrow="Pressure alerts"
      title="The tech gets pinged at +8 PSI. The customer doesn't get a call from you."
      body="Once a pool's baseline filter pressure is recorded, the app watches every visit. The moment a reading lands more than 8 PSI over baseline, the tech sees an alert in-app and the report flags it for the customer."
      bullets={[
        'Threshold configurable per pool',
        'Logged to service history automatically',
        'Surfaces in the daily audit if ignored',
      ]}
      visual={<PressureAlertMock />}
      reverse
    />
    <Capability
      index="05"
      eyebrow="Filter cleanings"
      title="Logged automatically. Shown on the customer's report."
      body="When a tech runs a filter cleaning in-app, it's added to that pool's service history and surfaced on the customer's next service report — without anyone typing 'I cleaned the filter' into a notes field. They see what they paid for; you stop fielding calls about it."
      bullets={[
        'Recorded in one tap from the cleaning flow',
        'Appears on the report as a line item',
        'Counts toward fleet & per-pool history',
      ]}
      visual={<FilterCleaningMock />}
    />
    <Workflow />
    <Reliability />
    <FinalCTA />
  </main>
);

// ───────── hero ─────────

const Hero = () => (
  <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 80, paddingBottom: 96 }}>
    <div aria-hidden="true" style={{
      position: 'absolute', inset: '0 0 auto 0', height: 480, zIndex: -1, pointerEvents: 'none',
      background: 'radial-gradient(900px 360px at 50% 0%, color-mix(in oklab, var(--accent) 4%, transparent), transparent 70%)',
    }} />
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 64, alignItems: 'center' }}>
        <div>
          <a href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: 'var(--ink-5)',
            fontFamily: "'Geist Mono', monospace",
            textDecoration: 'none', marginBottom: 24,
          }}>← Platform overview</a>
          <h1 style={{
            fontSize: 'clamp(36px, 4.6vw, 60px)',
            letterSpacing: '-0.035em',
            lineHeight: 1.02,
            color: 'var(--ink)',
            textWrap: 'balance',
          }}>
            The tech app, built for the truck.
          </h1>
          <p style={{
            marginTop: 22,
            fontSize: 18,
            lineHeight: 1.55,
            color: 'var(--ink-4)',
            maxWidth: 540,
            textWrap: 'balance',
          }}>
            Most pool software hands the tech a form and hopes for the best. PoolLogic's app enforces what matters, calculates what's tedious, and surfaces what's drifting — so a new hire runs the route like a ten-year vet, and the report writes itself.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <a href="/contact" className="btn btn-accent">Get a demo</a>
            <a href="/" className="btn btn-outline">Back to overview</a>
          </div>
          <div style={{
            marginTop: 28, display: 'flex', gap: 22, flexWrap: 'wrap',
            fontFamily: "'Geist Mono', monospace", fontSize: 11.5, color: 'var(--ink-5)',
          }}>
            <span>iOS · Android · works offline</span>
            <span>· one tap from route to report</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Phone>
            <RequiredFieldsScreen />
          </Phone>
        </div>
      </div>
    </div>
  </section>
);

// ───────── problem strip ─────────

const ProblemStrip = () => (
  <section style={{ paddingBlock: 32 }}>
    <div className="container">
      <div style={{
        border: '1px solid var(--line)',
        borderRadius: 16,
        padding: '20px 28px',
        background: 'var(--bg)',
        display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 28,
      }}>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-5)' }}>
          What goes wrong without it
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, fontSize: 13.5, color: 'var(--ink-3)' }}>
          {[
            'Tech submits a report with no chlorine reading',
            'Filter pressure creeps up for weeks unnoticed',
            'Customer calls because "I don\'t see anything in the email"',
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 10 }}>
              <span style={{ flexShrink: 0, color: 'var(--ink-6)', fontFamily: "'Geist Mono', monospace" }}>0{i + 1}</span>
              <span style={{ textWrap: 'balance' }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 500, fontFamily: "'Geist Mono', monospace" }}>
          Fixed below ↓
        </div>
      </div>
    </div>
  </section>
);

// ───────── capability block ─────────

const Capability = ({ index, eyebrow, title, body, bullets, visual, reverse }) => (
  <section style={{ paddingBlock: 80 }}>
    <div className="container">
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center',
        direction: reverse ? 'rtl' : 'ltr',
      }}>
        <div style={{ direction: 'ltr' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: "'Geist Mono', monospace",
            fontSize: 11, letterSpacing: '0.1em', color: 'var(--ink-5)',
            marginBottom: 16,
          }}>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>// {index}</span>
            <span style={{ textTransform: 'uppercase' }}>{eyebrow}</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(26px, 2.8vw, 36px)',
            letterSpacing: '-0.028em',
            lineHeight: 1.1,
            color: 'var(--ink)',
            textWrap: 'balance',
          }}>{title}</h2>
          <p style={{ marginTop: 18, fontSize: 16, lineHeight: 1.6, color: 'var(--ink-4)' }}>{body}</p>
          <ul style={{ marginTop: 22, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bullets.map((b, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, fontSize: 14, color: 'var(--ink-3)' }}>
                <span style={{
                  flexShrink: 0, marginTop: 7, width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)',
                }} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ direction: 'ltr', display: 'flex', justifyContent: 'center' }}>
          {visual}
        </div>
      </div>
    </div>
  </section>
);

// ───────── workflow ─────────

const Workflow = () => (
  <section style={{ paddingBlock: 80, background: 'var(--bg-soft)' }}>
    <div className="container">
      <div style={{ textAlign: 'center', maxWidth: 640, marginInline: 'auto', marginBottom: 48 }}>
        <h2 style={{ fontSize: 'clamp(24px, 2.6vw, 32px)', letterSpacing: '-0.025em', lineHeight: 1.1, color: 'var(--ink)' }}>
          A day on the truck.
        </h2>
        <p style={{ marginTop: 14, fontSize: 15.5, lineHeight: 1.55, color: 'var(--ink-4)' }}>
          Four taps between pulling in the driveway and the customer's report landing in their inbox.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          ['Arrive', 'Tap the stop. App opens to this pool\'s profile, dose calculator pre-loaded.'],
          ['Log', 'Drop chemistry readings. Required fields turn green as they\'re filled.'],
          ['Service', 'App suggests dosages. Filter cleanings logged in a tap. Pressure check auto-compares to baseline.'],
          ['Submit', 'Close the stop. Branded report fires to the customer. Invoice queued if it\'s their billing day.'],
        ].map(([step, body], i) => (
          <div key={i} style={{
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: 22,
            position: 'relative',
          }}>
            <div style={{
              fontFamily: "'Geist Mono', monospace", fontSize: 10.5, letterSpacing: '0.1em',
              color: 'var(--accent)', fontWeight: 600, marginBottom: 10,
            }}>STEP 0{i + 1}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{step}</div>
            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.5, color: 'var(--ink-4)' }}>{body}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ───────── reliability ─────────

const Reliability = () => (
  <section style={{ paddingBlock: 80 }}>
    <div className="container">
      <div style={{
        border: '1px solid var(--line)',
        borderRadius: 20,
        padding: '40px 48px',
        background: 'var(--bg)',
        display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48, alignItems: 'center',
      }}>
        <div>
          <h2 style={{ fontSize: 'clamp(22px, 2.4vw, 28px)', letterSpacing: '-0.025em', lineHeight: 1.15, color: 'var(--ink)', textWrap: 'balance' }}>
            Built to keep working when the bars drop.
          </h2>
          <p style={{ marginTop: 14, fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-4)' }}>
            The truck app stores every action locally and reconciles when the connection comes back. Works on the cheap phone your seasonal hire bought at Walmart.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            ['Offline-first', 'Submit reports with no signal. They sync when you\'re back online.'],
            ['Low spec friendly', 'Runs on 5-year-old phones. No 200MB downloads per route.'],
            ['No double-entry', 'Same data the office sees — written once, by the person who saw the pool.'],
          ].map(([k, v]) => (
            <div key={k} style={{ padding: 16, background: 'var(--bg-soft)', border: '1px solid var(--line-2)', borderRadius: 12 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)' }}>{k}</div>
              <div style={{ marginTop: 6, fontSize: 12.5, lineHeight: 1.5, color: 'var(--ink-5)' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ───────── final cta ─────────

const FinalCTA = () => (
  <section style={{ paddingBlock: 96 }}>
    <div className="container" style={{ textAlign: 'center', maxWidth: 640, marginInline: 'auto' }}>
      <h2 style={{ fontSize: 'clamp(28px, 3.2vw, 40px)', letterSpacing: '-0.03em', lineHeight: 1.05, color: 'var(--ink)', textWrap: 'balance' }}>
        Put it in front of a tech today.
      </h2>
      <p style={{ marginTop: 18, fontSize: 16, lineHeight: 1.55, color: 'var(--ink-4)' }}>
        Import your real routes. The tech app is in the App Store and Play Store the moment your account is live.
      </p>
      <div style={{ display: 'inline-flex', gap: 12, marginTop: 28 }}>
        <a href="/contact" className="btn btn-accent">Get a demo</a>
        <a href="/" className="btn btn-outline">Back to overview</a>
      </div>
    </div>
  </section>
);

// ───────── visuals: phone frame + screens ─────────

const Phone = ({ children }) => (
  <div style={{
    width: 290, padding: 12,
    background: 'linear-gradient(180deg, #1f242b 0%, #0f1217 100%)',
    borderRadius: 38,
    boxShadow: '0 30px 60px -30px rgba(15, 23, 42, .35), 0 0 0 1px rgba(255,255,255,.04) inset',
    position: 'relative',
  }}>
    <div style={{
      position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
      width: 80, height: 18, background: '#0c1015', borderRadius: 12, zIndex: 2,
    }} />
    <div style={{
      background: '#fff',
      borderRadius: 28,
      overflow: 'hidden',
      minHeight: 540,
      position: 'relative',
      fontFamily: "'Geist', sans-serif",
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 24px 0',
        fontSize: 11, color: '#52525b', fontFamily: "'Geist Mono', monospace",
      }}>
        <span>9:42</span>
        <span style={{ display: 'flex', gap: 6, opacity: 0.6 }}>
          <span>●●●</span><span>●●</span>
        </span>
      </div>
      <div style={{ padding: '14px 18px 24px' }}>
        {children}
      </div>
    </div>
  </div>
);

const ScreenHeader = ({ kicker, title, time }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <div style={{
        fontSize: 10.5, fontFamily: "'Geist Mono', monospace",
        textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', fontWeight: 500,
      }}>{kicker}</div>
      {time && <div style={{ fontSize: 10, color: '#a1a1aa', fontFamily: "'Geist Mono', monospace" }}>{time}</div>}
    </div>
    <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4, color: '#09090b', letterSpacing: '-0.015em' }}>{title}</div>
  </div>
);

// — screen: required fields —

const RequiredFieldsScreen = () => (
  <>
    <ScreenHeader kicker="Stop 04 of 14" title="1402 Bayshore Blvd" time="9:42" />
    <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[
        ['pH', '7.4', true],
        ['Chlorine', '2.8', true],
        ['CYA', '—', false],
        ['Photo of pool', 'Tap to add', false],
        ['Filter pressure', '14 psi', true],
      ].map(([label, value, ok], i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 12px',
          background: ok ? '#fbfbfc' : 'color-mix(in oklab, var(--accent) 8%, white)',
          border: `1px solid ${ok ? '#f1f1f3' : 'color-mix(in oklab, var(--accent) 32%, transparent)'}`,
          borderRadius: 10,
        }}>
          <div>
            <div style={{ fontSize: 11.5, color: '#a1a1aa', fontFamily: "'Geist Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2, color: ok ? '#09090b' : 'color-mix(in oklab, var(--accent) 80%, black)' }}>{value}</div>
          </div>
          {ok
            ? <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 600, fontFamily: "'Geist Mono', monospace" }}>✓</span>
            : <span style={{ fontSize: 9.5, color: 'var(--accent)', fontWeight: 600, fontFamily: "'Geist Mono', monospace", letterSpacing: '0.1em' }}>REQUIRED</span>}
        </div>
      ))}
    </div>
    <button disabled style={{
      marginTop: 16, width: '100%',
      padding: '12px 14px',
      background: '#e4e4e7', color: '#a1a1aa',
      border: 0, borderRadius: 10,
      fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
    }}>Submit (2 fields missing)</button>
  </>
);

const RequiredFieldsMock = () => <Phone><RequiredFieldsScreen /></Phone>;

// — screen: inbox / smart subject —

const InboxMock = () => (
  <Phone>
    <ScreenHeader kicker="Inbox preview" title="What the customer sees" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
      {[
        { from: 'PoolLogic', subj: '⚠ Water level low · 3204 Coquina Ct', time: '4:42p', highlight: true },
        { from: 'PoolLogic', subj: 'Service complete · 1402 Bayshore Blvd', time: 'Mon' },
        { from: 'PoolLogic', subj: 'Filter cleaning logged · 3204 Coquina Ct', time: 'Mon' },
        { from: 'PoolLogic', subj: 'Service complete · 614 S Rome Ave', time: 'Sun' },
      ].map((m, i) => (
        <div key={i} style={{
          padding: '11px 12px',
          borderRadius: 10,
          background: m.highlight ? 'color-mix(in oklab, var(--accent) 6%, white)' : '#fbfbfc',
          border: `1px solid ${m.highlight ? 'color-mix(in oklab, var(--accent) 26%, transparent)' : '#f1f1f3'}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#a1a1aa', fontFamily: "'Geist Mono', monospace" }}>
            <span style={{ color: m.highlight ? 'var(--accent)' : '#71717a', fontWeight: 600 }}>{m.from}</span>
            <span>{m.time}</span>
          </div>
          <div style={{
            fontSize: 13, marginTop: 4,
            fontWeight: m.highlight ? 600 : 500,
            color: m.highlight ? 'color-mix(in oklab, var(--accent) 80%, black)' : '#18181b',
            lineHeight: 1.35,
          }}>{m.subj}</div>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 14, fontSize: 10.5, color: '#a1a1aa', fontFamily: "'Geist Mono', monospace", textAlign: 'center' }}>
      Subject auto-flagged from reading
    </div>
  </Phone>
);

// — screen: pool profile + LSI —

const ProfileMock = () => (
  <Phone>
    <ScreenHeader kicker="Pool profile" title="3204 Coquina Ct" />
    <div style={{
      padding: 12, background: '#fbfbfc', border: '1px solid #f1f1f3', borderRadius: 10,
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 11.5,
    }}>
      {[
        ['Pool size', '18,400 gal'],
        ['Surface', 'Pebble Tec'],
        ['Filter', 'Cartridge'],
        ['Baseline psi', '12 psi'],
        ['Sanitizer', 'Saltwater'],
        ['Heater', 'Gas · 400k BTU'],
      ].map(([k, v]) => (
        <div key={k}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9.5, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k}</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#18181b', marginTop: 2 }}>{v}</div>
        </div>
      ))}
    </div>
    <div style={{
      marginTop: 12,
      padding: 12,
      background: 'color-mix(in oklab, var(--accent) 5%, white)',
      border: '1px solid color-mix(in oklab, var(--accent) 20%, transparent)',
      borderRadius: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live LSI</div>
        <div style={{ fontSize: 10, color: '#a1a1aa', fontFamily: "'Geist Mono', monospace" }}>Recalculating</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: '#09090b', fontVariantNumeric: 'tabular-nums' }}>−0.12</span>
        <span style={{ fontSize: 11, color: '#71717a', fontWeight: 500 }}>Balanced</span>
      </div>
    </div>
    <div style={{
      marginTop: 10, padding: 12, background: '#fbfbfc', border: '1px solid #f1f1f3', borderRadius: 10,
    }}>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9.5, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suggested dose</div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#18181b', marginTop: 4 }}>4 oz muriatic acid · raises alk balance</div>
    </div>
  </Phone>
);

// — screen: pressure alert —

const PressureAlertMock = () => (
  <Phone>
    <ScreenHeader kicker="Stop 07 of 14" title="907 S Boulevard" time="10:31" />
    <div style={{
      padding: 14, borderRadius: 12,
      background: 'color-mix(in oklab, var(--accent) 10%, white)',
      border: '1px solid color-mix(in oklab, var(--accent) 36%, transparent)',
      display: 'flex', gap: 12, alignItems: 'flex-start',
    }}>
      <span style={{
        flexShrink: 0, width: 9, height: 9, borderRadius: '50%',
        background: 'var(--accent)',
        boxShadow: '0 0 0 5px color-mix(in oklab, var(--accent) 18%, transparent)',
        marginTop: 4,
      }} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#09090b' }}>Filter pressure +8.4 PSI over baseline</div>
        <div style={{ fontSize: 11.5, color: '#3f3f46', marginTop: 4, lineHeight: 1.45 }}>
          Baseline 12 psi · reading 20.4 psi. Recommend cleaning before next visit.
        </div>
      </div>
    </div>
    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[
        ['Log cleaning now', true],
        ['Schedule for next visit', false],
        ['Acknowledge — already cleaned', false],
      ].map(([label, primary], i) => (
        <button key={i} style={{
          padding: '11px 14px',
          background: primary ? 'var(--accent)' : '#fff',
          color: primary ? '#fff' : '#18181b',
          border: `1px solid ${primary ? 'var(--accent)' : '#e4e4e7'}`,
          borderRadius: 10,
          fontSize: 13, fontWeight: 500, textAlign: 'left',
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}>{label}</button>
      ))}
    </div>
    <div style={{
      marginTop: 14, padding: 10, borderRadius: 10, background: '#fbfbfc', border: '1px solid #f1f1f3',
      fontSize: 11, color: '#71717a', fontFamily: "'Geist Mono', monospace",
    }}>
      Pressure history: 12 · 12 · 13 · 15 · 20.4
    </div>
  </Phone>
);

// — screen: filter cleaning logged + on report —

const FilterCleaningMock = () => (
  <Phone>
    <ScreenHeader kicker="Service report" title="3204 Coquina Ct" />
    <div style={{
      padding: '12px 14px', borderRadius: 10,
      background: 'color-mix(in oklab, var(--accent) 6%, white)',
      border: '1px solid color-mix(in oklab, var(--accent) 22%, transparent)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{
        width: 24, height: 24, borderRadius: '50%',
        background: 'var(--accent)',
        color: '#fff', fontSize: 12, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>✓</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#09090b' }}>Filter cleaning logged</div>
        <div style={{ fontSize: 11, color: '#71717a', marginTop: 1, fontFamily: "'Geist Mono', monospace" }}>Auto-added to service report</div>
      </div>
    </div>
    <div style={{
      marginTop: 14, padding: 14, borderRadius: 10,
      background: '#fbfbfc', border: '1px solid #f1f1f3',
    }}>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9.5, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>What the customer sees</div>
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
        {[
          ['Skim & brush', '✓'],
          ['Vacuum', '✓'],
          ['Chemistry check', '✓'],
          ['Filter cleaning', '✓'],
          ['Stabilizer added (1 lb)', '✓'],
        ].map(([k, v], i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '5px 0',
          }}>
            <span style={{ color: '#3f3f46' }}>{k}</span>
            <span style={{ color: 'var(--accent)', fontFamily: "'Geist Mono', monospace", fontSize: 11, fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
    <div style={{
      marginTop: 12, padding: 10, borderRadius: 10, background: '#fbfbfc', border: '1px solid #f1f1f3',
      fontSize: 11, color: '#71717a', lineHeight: 1.45,
    }}>
      <span style={{ color: '#3f3f46', fontWeight: 600 }}>Pool history</span> &nbsp;Filter cleaned 6 times in last 12 months.
    </div>
  </Phone>
);

export default TechAppPage;
