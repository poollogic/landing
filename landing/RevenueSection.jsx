import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import SectionHeader from './SectionHeader.jsx';
import DashboardPreview from './preview/DashboardPreview.jsx';
import LateInvoicesView from './preview/LateInvoicesView.jsx';
import RevenueMobileStory from './RevenueMobileStory.jsx';
import './revenue.css';

// "Financial watchdog" (#collections), dark. Desktop (≥ 1024px): two steps to tap, and under them a
// stage showing THE dashboard preview, the hero's own component (preview/DashboardPreview.jsx), not a
// copy: the same rail, stat cards, charts (their range switch, pool dropdown and hover) and route
// rows, here without the browser toolbar, always dark, and scaled as one piece to the stage's width.
//   Step 1  the dashboard with the billing banner, which opens as you scroll down to it
//   Step 2  Settings › Late invoices (preview/LateInvoicesView.jsx), where a cursor turns on late
//           fees and automatic pause, each time the step is shown
// Auto-play: once the stage is 35% in view, step 1 for 8s (its line fills as the timer), then step 2
// and its demo, then it stops. A tap on either step stops it for good. Below 1024px the phone story
// (RevenueMobileStory.jsx) as it was. All figures are mock data.

const STEPS = [
  {
    title: 'Nothing slips through the cracks',
    body: 'A failed card or a past-due invoice turns your dashboard red from the first late day, with one tap to fix it. Reminders go out to the customer for you.',
  },
  {
    title: 'Late fees and pauses on your terms',
    body: 'Set a flat or percentage fee and a grace period once, and the billing run adds it. On Vision, customers who stop paying are paused automatically and resume when they pay.',
  },
];

// The phone story's three beats (RevenueMobileStory.jsx), unchanged in this pass.
const MOBILE_FEATURES = [
  {
    n: '01',
    title: 'Nothing slips through the cracks',
    body: 'A card fails on autopay? An invoice goes past due? Poolnautics puts it at the top of your dashboard with one tap to fix it, and automatically sends overdue reminders to customers for you.',
  },
  {
    n: '02',
    title: 'Late fees on autopilot',
    body: 'Set a flat or percentage fee and a grace period once. Poolnautics adds it in the daily billing run. No awkward phone calls.',
  },
  {
    n: '03',
    title: 'Automatic pause and resume',
    body: 'Customers who stop paying are paused, billing and service, and resume the moment they pay. Their route slot is held.',
  },
];

const AUTO_MS = 8000; // step 1's turn in the auto-play
const FADE_MS = 400; // the steps' cross-fade (revenue.css .rv-layer)
// The banner opens once its top edge is above 72% of the window's height, and closes once it's back
// below 74.5% (the gap keeps it from flickering at the line).
const OPEN_AT = 0.72;
const CLOSE_AT = 0.745;
// The fade at the stage's foot (revenue.css .rv-stage::after, 50px), in the dashboard's own pixels
// at its 920px width: rows under it don't count as in view when the settings page scrolls.
const FADE_ROOM = 72;

// Step 2's demo: where the settings start, and where they end (reduced motion shows the end).
const START = { lateFees: false, autoPause: false, scroll: 'top', scrollMs: 0 };
const FINAL = { lateFees: true, autoPause: true, scroll: 'bottom', scrollMs: 0 };

// Desktop from 1024px up; below that, the phone story.
const WIDE = '(min-width: 1024px)';
const useMedia = (query, server) => useSyncExternalStore(
  (cb) => { const mq = window.matchMedia(query); mq.addEventListener('change', cb); return () => mq.removeEventListener('change', cb); },
  () => window.matchMedia(query).matches,
  () => server,
);

function Cursor({ cursorRef, ringRef }) {
  return (
    <div ref={cursorRef} className="rv-cursor" aria-hidden="true">
      <span ref={ringRef} className="rv-ring" />
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path d="M5 2.5v17.2l4.3-4.1 2.8 6.4 3.1-1.4-2.8-6.3 6-.3z" fill="#fff" stroke="#111" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function CollectionsDemo() {
  const reduced = useMedia('(prefers-reduced-motion: reduce)', false);
  const stageRef = useRef(null);
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState('idle'); // idle → timing → done; off once a step is tapped
  const [run, setRun] = useState(0); // counts step 2's showings, so its demo replays
  const [bannerOpen, setBannerOpen] = useState(false);
  const [demo, setDemo] = useState(START);

  const show = (i) => {
    setStep(i);
    if (i === 1) setRun((n) => n + 1);
  };
  const choose = (i) => {
    setAuto('off');
    show(i);
  };

  // Auto-play starts once the stage is 35% in view...
  useEffect(() => {
    const el = stageRef.current;
    if (auto !== 'idle' || !el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.intersectionRatio >= 0.34) setAuto('timing'); }, { threshold: [0, 0.35] });
    io.observe(el);
    return () => io.disconnect();
  }, [auto]);
  // ...gives step 1 its 8 seconds, then shows step 2 and stops.
  useEffect(() => {
    if (auto !== 'timing') return undefined;
    const t = window.setTimeout(() => { setAuto('done'); show(1); }, AUTO_MS);
    return () => window.clearTimeout(t);
  }, [auto]);

  // The banner opens and closes with the page's scroll (OPEN_AT, CLOSE_AT).
  useEffect(() => {
    const banner = stageRef.current?.querySelector('.rv-layer--dash .pl-alert');
    if (!banner) return undefined;
    let open = false;
    let frame = 0;
    const check = () => {
      frame = 0;
      const top = banner.getBoundingClientRect().top;
      const h = window.innerHeight;
      if (!open && top < h * OPEN_AT) { open = true; setBannerOpen(true); }
      else if (open && top > h * CLOSE_AT) { open = false; setBannerOpen(false); }
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Step 2's demo, each time it's shown: the cursor turns on late fees, the page scrolls, it turns on
  // automatic pause, the page scrolls to the bottom. Off step 2, the settings go back to the start
  // once the step has faded out.
  useEffect(() => {
    const stage = stageRef.current;
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const timers = [];
    const at = (ms, fn) => timers.push(window.setTimeout(fn, ms));
    const cleanup = () => timers.forEach((t) => window.clearTimeout(t));
    const hide = () => cursor?.classList.remove('is-on');
    hide();

    if (step !== 1) {
      at(FADE_MS + 50, () => setDemo(START));
      return cleanup;
    }
    if (reduced || !stage || !cursor || !ring) {
      setDemo(FINAL);
      return cleanup;
    }

    // A point on the stage, in its own pixels: a switch's middle, or a spot to start from.
    const pointAt = (name) => {
      const el = stage.querySelector(`.rv-layer--set [data-demo="${name}"]`);
      const s = stage.getBoundingClientRect();
      if (!el) return { x: s.width * 0.5, y: s.height * 0.5 };
      const r = el.getBoundingClientRect();
      return { x: r.left - s.left + r.width * 0.62, y: r.top - s.top + r.height * 0.55 };
    };
    const move = (p, ms) => {
      cursor.style.setProperty('--cur-ms', `${ms}ms`);
      cursor.style.setProperty('--cur-x', `${Math.round(p.x)}px`);
      cursor.style.setProperty('--cur-y', `${Math.round(p.y)}px`);
    };
    const click = () => {
      ring.classList.remove('is-go');
      void ring.offsetWidth; // restart the ripple
      ring.classList.add('is-go');
    };

    setDemo(START);
    at(600, () => {
      const s = stage.getBoundingClientRect();
      move({ x: s.width * 0.8, y: s.height * 0.86 }, 0);
      cursor.classList.add('is-on');
    });
    at(650, () => move(pointAt('late-fees'), 850));
    at(1650, () => { click(); setDemo((d) => ({ ...d, lateFees: true })); });
    at(3000, () => setDemo((d) => ({ ...d, scroll: 'pause', scrollMs: 900 })));
    at(4050, () => move(pointAt('auto-pause'), 800));
    at(5050, () => { click(); setDemo((d) => ({ ...d, autoPause: true })); });
    at(5700, () => setDemo((d) => ({ ...d, scroll: 'bottom', scrollMs: 700 })));
    at(6500, hide);
    return cleanup;
  }, [step, run, reduced]);

  return (
    <>
      <div className="rv-steps">
        <p className="rv-steps-label">Tap one to try it</p>
        <div className="rv-steps-row">
          {STEPS.map((s, i) => {
            const on = step === i;
            const timing = on && auto === 'timing' && i === 0;
            const filled = on && !timing && !(auto === 'idle' && i === 0);
            return (
              <button
                key={s.title}
                type="button"
                className={`rv-step${on ? ' is-active' : ''}${timing ? ' is-timing' : ''}${filled ? ' is-filled' : ''}`}
                aria-pressed={on}
                onClick={() => choose(i)}
              >
                <span className="rv-step-line" aria-hidden="true"><i /></span>
                <span className="rv-step-title">{s.title}</span>
                <span className="rv-step-body">{s.body}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div ref={stageRef} className="rv-stage">
        <div className={`rv-layer rv-layer--dash${step === 0 ? ' is-on' : ''}`} inert={step === 0 ? undefined : ''}>
          <DashboardPreview stage browserBar={false} theme="dark" staticRail banner={{ open: bannerOpen }} />
        </div>
        <div className={`rv-layer rv-layer--set${step === 1 ? ' is-on' : ''}`} inert={step === 1 ? undefined : ''}>
          <DashboardPreview stage browserBar={false} theme="dark" staticRail active="Settings">
            <LateInvoicesView {...demo} bottomInset={FADE_ROOM} />
          </DashboardPreview>
        </div>
        <Cursor cursorRef={cursorRef} ringRef={ringRef} />
      </div>
    </>
  );
}

export default function RevenueSection() {
  const wide = useMedia(WIDE, true);
  return (
    <section id="collections" className="rv" aria-labelledby="revenue-heading">
      <div className="rv-inner container">
        <SectionHeader
          id="revenue-heading"
          eyebrow="Financial watchdog"
          title={<>
            <span className="rv-h2-a">Stop chasing customers</span>{' '}
            <span className="rv-h2-b">who ignore their invoices.</span>
          </>}
          subtitle="Let Poolnautics play the bad guy. Reminders and late fees follow your rules automatically, so you never send another awkward text."
        />

        {wide ? <CollectionsDemo /> : <RevenueMobileStory features={MOBILE_FEATURES} />}
      </div>
    </section>
  );
}
