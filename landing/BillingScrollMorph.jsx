import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import CompanyMark from "./CompanyMark.jsx";

/**
 * BillingScrollMorph — Apple-style pinned section with a scroll-TRIGGERED morph.
 * Owner Setup  ──(scroll past 30%: plays 0.9s)──►  Customer Experience; scroll back reverses.
 * Light parallax drift stays scroll-linked.
 *
 * Usage:
 *   <BillingScrollMorph id="billing" phone={<PhoneMockup />} setupCard={<SetupCard />} />
 * `phone` and `setupCard` are your existing mockups (the .bz-phone / .bz-settings UIs).
 * If omitted, lightweight placeholders render instead.
 */

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="mt-[3px] flex-none">
    <circle cx="10" cy="10" r="10" fill="rgba(59,130,246,.15)" />
    <path d="M6 10.4l2.6 2.6L14 7.6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Bullets = ({ items }) => (
  <ul className="mt-7 grid gap-4">
    {items.map(([title, desc]) => (
      <li key={title} className="flex gap-3">
        <Check />
        <div>
          <div className="text-base font-semibold text-slate-900">{title}</div>
          <div className="mt-0.5 text-sm leading-relaxed text-slate-500">{desc}</div>
        </div>
      </li>
    ))}
  </ul>
);

// Copy shared by the pinned (desktop) and stacked (phone/tablet) layouts.
const OWNER_COPY = {
  eyebrow: "BILLING ON AUTOPILOT",
  title: "Zero-click billing. Effortless collections.",
  body: "Set the next invoice date once. PoolLogic adds the base rate, chemicals and card fees, then emails every invoice on schedule. No batches. No “Send” button.",
};
const CUSTOMER_COPY = {
  eyebrow: "THE CUSTOMER EXPERIENCE",
  title: "Your customers automatically receive a beautiful invoice on their billing day. Without you doing anything!",
  body: "Zero manual sending, no messy PDF attachments. Just a clean breakdown of their weekly service and a giant button to pay instantly via Stripe.",
};

const SETUP_BULLETS = [
  ["Card fees covered", "Surcharges stay within your state’s cap, automatically."],
  ["Self-serve receipts", "Customers download their own history and receipts."],
  ["Any date, any cadence", "Monthly, quarterly or yearly — billed on the day you pick."],
];
const RESULT_BULLETS = [
  ["Seamless Stripe Checkouts", "Card, Apple Pay or ACH in a single tap."],
  ["Digital Service History", "Every visit, chemical reading and photo, logged."],
  ["Any Device, Anywhere", "Looks perfect on a phone, tablet or desktop."],
];

/* ---------- Laptop showing the desktop invoice (modeled on the live PoolLogic portal invoice) ----------
   Branded like the phone's invoice (BillingMockups.jsx): the same Bayside mark and wordmark
   (.bz-inv-logo / .bz-inv-wm, billing.css), the same "INVOICE" heading, blue #2676b6 and Inter. */
function InvoiceCard() {
  return (
    <div className="overflow-hidden rounded-[14px] border border-[#EDF0F4] bg-white text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,.06),0_14px_30px_-12px_rgba(15,23,42,.18)] [font-family:Inter,ui-sans-serif,system-ui,sans-serif] [font-feature-settings:'tnum','cv11']">
      <div className="px-[26px] pb-5 pt-[18px]">
        <div className="flex items-start justify-between">
          <span className="bz-inv-logo">
            <CompanyMark size={52} />
            <span className="bz-inv-wm">BAYSIDE</span>
            <span className="bz-inv-wm2">POOL CO.</span>
          </span>
          <div className="text-right">
            <div className="bz-inv-title leading-none">Invoice</div>
            <div className="mt-2 text-[10.5px] leading-relaxed text-slate-500">
              INV - 1025<br />
              <b className="text-slate-400">DATE:</b> 12/14/2026<br />
              <b className="text-slate-400">DUE DATE:</b> 12/29/2026
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-4 text-[10px] leading-normal text-slate-600">
          <div>
            <div className="text-[9px] font-bold tracking-wider text-slate-400">FROM</div>
            <div className="my-0.5 text-[13px] font-bold text-slate-900">BAYSIDE POOL CO.</div>
            1180 Harbor Blvd<br />Clearwater, FL 33755
          </div>
          <div>
            <div className="text-[9px] font-bold tracking-wider text-slate-400">TO</div>
            <div className="my-0.5 text-[13px] font-bold text-slate-900">Avery Collins</div>
            2148 Palmetto Dr<br />Dunedin, FL 34698
          </div>
        </div>

        <div className="-mx-[26px] mt-3.5 grid grid-cols-[1fr_40px_60px_64px] bg-[#2676b6] px-[26px] py-2 text-[9px] font-bold tracking-wider text-white">
          <span>DESCRIPTION</span><span className="text-center">QTY</span>
          <span className="text-right">PRICE</span><span className="text-right">TOTAL</span>
        </div>
        <div className="grid grid-cols-[1fr_40px_60px_64px] items-center border-b border-slate-100 py-2.5 text-[11px]">
          <div>
            <div className="text-xs font-semibold">Weekly Pool Service - Monthly Billing</div>
            <div className="mt-0.5 text-[9.5px] leading-snug text-slate-500">
              4 visits · chemistry testing &amp; balancing, surface cleaning, equipment check
            </div>
          </div>
          <span className="text-center text-slate-600">1</span>
          <span className="text-right text-slate-600">$145.00</span>
          <b className="text-right">$145.00</b>
        </div>

        <div className="mt-2 flex justify-end">
          <div className="w-[220px] text-[11px] leading-[1.9]">
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>$145.00</span></div>
            <div className="flex justify-between text-slate-600"><span>Card fee (2.9%)</span><span>$4.21</span></div>
            <div className="mt-0.5 flex justify-between border-t border-slate-200 pt-0.5 text-sm font-bold">
              <span>Total</span><span>$149.21</span>
            </div>
          </div>
        </div>

        <button className="mt-3 h-[46px] w-full rounded-[10px] bg-[#2676b6] text-[15px] font-bold text-white shadow-[0_12px_24px_-8px_rgba(38,118,182,.65)]">
          Pay now · $149.21
        </button>
      </div>
    </div>
  );
}

const AppleLogo = () => (
  <svg width="10" height="12" viewBox="0 0 10 12">
    <path fill="#111" d="M8.3 6.4c0-1.5 1.2-2.2 1.3-2.3-.7-1-1.8-1.2-2.2-1.2-.9-.1-1.8.6-2.3.6s-1.2-.5-2-.5C2 3 1 3.6.5 4.6c-1.1 1.9-.3 4.7.8 6.2.5.8 1.1 1.6 1.9 1.6.8 0 1-.5 2-.5s1.2.5 2 .5 1.3-.8 1.8-1.5c.6-.8.8-1.6.8-1.7 0 0-1.5-.6-1.5-2.8zM6.8 1.9C7.2 1.4 7.5.7 7.4 0c-.6 0-1.4.4-1.8.9-.4.4-.7 1.1-.6 1.8.7 0 1.4-.4 1.8-.8z" />
  </svg>
);

/* ---------- Keyboard deck, seen slightly from above ----------
   A flat 616×300 deck tilted back 78° with a 1400px perspective.
   Projected depth ≈ 300·cos78°·f and the front edge widens by f = 1400 / (1400 − 300·sin78°) ≈ 1.265. */
const DECK_W = 616, DECK_L = 300, DECK_TILT = 78, DECK_PERSP = 1400;
const _f = DECK_PERSP / (DECK_PERSP - DECK_L * Math.sin((DECK_TILT * Math.PI) / 180));
const DECK_H = Math.round(DECK_L * Math.cos((DECK_TILT * Math.PI) / 180) * _f); // ≈ 79
const FRONT_W = Math.round(DECK_W * _f); // ≈ 779

const Key = ({ w = 1 }) => (
  <span
    style={{ flex: `${w} 1 0` }}
    className="h-full rounded-[4px] bg-gradient-to-b from-[#1E2024] to-[#0E0F11] shadow-[inset_0_1px_0_rgba(255,255,255,.10),0_1px_0_rgba(0,0,0,.5)]"
  />
);
const KeyRow = ({ widths, h = 22 }) => (
  <div className="flex gap-[5px]" style={{ height: h }}>
    {widths.map((w, i) => <Key key={i} w={w} />)}
  </div>
);
const ones = (n) => Array(n).fill(1);
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

function KeyboardDeck() {
  return (
    <>
      <div className="relative" style={{ width: DECK_W, height: DECK_H, perspective: DECK_PERSP, perspectiveOrigin: "50% 0" }}>
        <div
          className="absolute left-0 top-0 rounded-b-[26px] bg-[linear-gradient(180deg,#6E7177_0%,#8A8D93_18%,#93969C_60%,#868990_100%)] shadow-[inset_0_2px_0_rgba(0,0,0,.35),inset_0_-1px_0_rgba(255,255,255,.25)]"
          style={{ width: DECK_W, height: DECK_L, transformOrigin: "50% 0", transform: `rotateX(${DECK_TILT}deg)` }}
        >
          {/* Hinge */}
          <div className="absolute left-1/2 top-0 h-2 w-[560px] -translate-x-1/2 rounded-b bg-gradient-to-b from-[#2B2F36] to-[#555B64]" />
          {/* Keyboard well */}
          <div className="absolute left-9 right-9 top-[22px] flex flex-col gap-[5px] rounded-lg bg-[#4E5157] p-[7px] shadow-[inset_0_1px_3px_rgba(0,0,0,.5)]">
            <KeyRow widths={ones(14)} h={13} />
            <KeyRow widths={[...ones(13), 1.5]} />
            <KeyRow widths={[1.5, ...ones(13)]} />
            <KeyRow widths={[1.8, ...ones(11), 1.8]} />
            <KeyRow widths={[2.3, ...ones(10), 2.3]} />
            <KeyRow widths={[1, 1, 1, 1.3, 6, 1.3, 1, 3]} />
          </div>
          {/* Trackpad */}
          <div className="absolute bottom-3.5 left-1/2 h-24 w-[230px] -translate-x-1/2 rounded-xl bg-gradient-to-b from-[#868990] to-[#8E9197] shadow-[inset_0_0_0_1px_rgba(0,0,0,.22),inset_0_1px_2px_rgba(0,0,0,.12)]" />
        </div>
      </div>
      {/* Front lip */}
      <div
        className="relative h-[9px] rounded-b-[14px_9px] bg-gradient-to-b from-[#8A8D93] to-[#4F5258] shadow-[inset_0_1px_0_rgba(255,255,255,.35)]"
        style={{ width: FRONT_W, marginLeft: (DECK_W - FRONT_W) / 2 }}
      />
      {/* Feet / contact shadow */}
      <div
        className="h-3 rounded-[50%] bg-[radial-gradient(closest-side,rgba(15,23,42,.38),transparent)] blur-[3px]"
        style={{ width: FRONT_W * 0.94, marginLeft: (DECK_W - FRONT_W * 0.94) / 2 }}
      />
    </>
  );
}

/* ---------- Realistic space-gray laptop: aluminium rim, notch, glass bezel, hinge, deck ---------- */
function DesktopInvoice() {
  return (
    <div className="w-[616px] scale-90" style={{ translate: "22px 0px" }}>
      {/* Lid — aluminium rim */}
      <div className="relative rounded-b-[6px] rounded-t-[22px] bg-[linear-gradient(180deg,#8E9197_0%,#6C6F75_45%,#55585E_100%)] p-[2px] shadow-[0_18px_40px_-16px_rgba(15,23,42,.30),0_46px_90px_-34px_rgba(15,23,42,.42)]">
        {/* Black glass bezel */}
        <div className="relative rounded-b-[4px] rounded-t-[20px] bg-[#050608] px-[10px] pb-[13px] pt-[11px] shadow-[inset_0_0_0_1px_rgba(255,255,255,.07),inset_0_1px_0_rgba(255,255,255,.12)]">
          {/* Notch + camera */}
          <div className="absolute left-1/2 top-[11px] z-10 flex h-[13px] w-[84px] -translate-x-1/2 items-center justify-center rounded-b-lg bg-[#050608]">
            <span className="h-[5px] w-[5px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#3B4A66,#0B0F18_70%)] ring-1 ring-[#111722]" />
          </div>
          {/* Screen: an 800×500 desktop scaled to 592×370 */}
          <div className="relative h-[370px] w-[592px] overflow-hidden rounded-b-[2px] rounded-t-[8px] bg-[#F7F8FA]">
            <div className="h-[500px] w-[800px] origin-top-left scale-[.74] bg-gradient-to-b from-[#F7F8FA] to-[#EEF1F5]">
              {/* macOS menu bar */}
              <div className="flex h-5 items-center justify-between bg-[#F0F2F6]/95 px-3.5 text-[10px] font-semibold text-gray-800">
                <div className="flex items-center gap-3.5">
                  <AppleLogo /><span>Safari</span>
                  <span className="font-medium">File</span><span className="font-medium">Edit</span><span className="font-medium">View</span>
                </div>
                <div className="flex gap-2.5 font-medium"><span>Mon Dec 14</span><span>9:41 AM</span></div>
              </div>
              {/* Safari toolbar */}
              <div className="flex h-[34px] items-center gap-[7px] border-b border-[#E3E6EB] bg-[#FBFBFC] px-3">
                <span className="h-[11px] w-[11px] rounded-full bg-[#FF5F57]" />
                <span className="h-[11px] w-[11px] rounded-full bg-[#FEBC2E]" />
                <span className="h-[11px] w-[11px] rounded-full bg-[#28C840]" />
                <div className="mx-auto flex h-[22px] w-[330px] items-center justify-center gap-1.5 rounded-[7px] bg-[#EEF0F3] text-[11px] text-gray-700">
                  🔒 portal.poollogic.app
                </div>
                <span className="w-[47px]" />
              </div>
              {/* Stripe bar */}
              <div className="flex h-[28px] items-center justify-center gap-1.5 bg-black text-[10px] text-white">
                🔒 Secure checkout by <b className="font-extrabold tracking-tight">stripe</b>
              </div>
              <div className="mx-auto mt-3 w-[560px] origin-top scale-90">
                <InvoiceCard />
              </div>
            </div>
            {/* Glass glare + inner edge */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,.22)_0%,rgba(255,255,255,.04)_34%,rgba(255,255,255,0)_35%)]" />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(0,0,0,.35),inset_0_0_18px_rgba(0,0,0,.08)]" />
          </div>
        </div>
      </div>
      <KeyboardDeck />
    </div>
  );
}

/* ---------- Fallbacks (swap for your real mockups) ---------- */
const PhoneFallback = () => (
  <div className="h-[586px] w-[262px] overflow-hidden rounded-[2rem] border-8 border-slate-900 bg-white shadow-2xl" />
);
const SetupCardFallback = () => (
  <div className="h-[487px] w-[330px] rounded-2xl bg-slate-800 shadow-2xl ring-1 ring-white/10" />
);

/* ---------- Main component ---------- */
// ≥1024px: the pinned section with the scroll-triggered morph and scroll gate.
// Narrower screens can't fit the pinned layout, so they get BillingStacked (below).
const PINNED_QUERY = "(min-width: 1024px)";

export default function BillingScrollMorph(props) {
  const [pinned, setPinned] = useState(() => typeof window === "undefined" || window.matchMedia(PINNED_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(PINNED_QUERY);
    const onChange = () => setPinned(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return pinned ? <BillingPinned {...props} /> : <BillingStacked {...props} />;
}

function BillingPinned({ phone, setupCard, id = "billing" }) {
  const trackRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  /* HYBRID: the section stays pinned; crossing a scroll threshold PLAYS the owner→customer
     morph as a timed animation (reverses when scrolling back). Only the gentle drift is scroll-linked. */
  const TRIGGER_IN = 0.3; // morph forward once 30% through the pinned section
  const TRIGGER_OUT = 0.22; // reverse below 22% (hysteresis prevents flicker at the boundary)
  const MORPH_MS = 900;
  const REVERSE_MS = 600; // back to the owner view: quicker, so scrolling up stays light
  const REVERSE_FROM = 0.95; // scrolling up anywhere in the pinned customer view (above 95%) shifts back
  const REVERSE_HOLD = 0.05; // …held near the top of the pinned stretch, so the next scroll moves the page
  const reduceMotion = useReducedMotion();

  const [phase, setPhase] = useState(0); // 0 = owner view, 1 = customer view
  const morph = useMotionValue(0); // 0 → 1, time-driven
  const gateRef = useRef({ phase: 0, locked: false, animating: false, quick: false, doneAt: 0, holdY: 0, lastY: 0, lastInput: 0, bypassUntil: 0 });

  /* SCROLL GATE — the visitor can't scroll past the section (even with a fast fling) until the morph
     has finished. Crossing the trigger snaps the page back to the trigger point and holds it there
     while the morph plays; trackpad inertia is swallowed too. Anchor / nav links (#billing, /#faq …)
     bypass the gate so site navigation always works. Scrolling back up shifts straight back to the owner
     view (a short 0.6s hold), then lets the same swipe keep scrolling. */
  useEffect(() => {
    const G = gateRef.current;
    const KEYS = new Set([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"]);
    const jump = (y) => window.scrollTo({ top: y, behavior: "instant" });
    const geo = () => {
      const el = trackRef.current;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const span = Math.max(1, el.offsetHeight - window.innerHeight);
      return { top, span, gIn: top + TRIGGER_IN * span, gOut: top + TRIGGER_OUT * span };
    };
    const progress = () => {
      const g = geo();
      return Math.min(1, Math.max(0, (window.scrollY - g.top) / g.span));
    };
    const setTo = (target) => {
      G.phase = target;
      setPhase(target);
    };
    // Initial state matches where the page loaded (e.g. refresh mid-page)
    if (progress() > TRIGGER_IN) {
      G.phase = 1;
      morph.set(1);
      setPhase(1);
    }

    let raf = 0;
    const watchRelease = () => {
      // Forward: once the morph is done, unlock when input has been quiet for 160ms (the rest of a
      // fling's momentum), or at most 350ms after it finished, so a slow, steady scroll that never
      // pauses isn't held forever. Reverse ("quick"): unlock as soon as the morph is done, so the
      // same swipe carries on scrolling up.
      const now = performance.now();
      if (G.locked && !G.animating) {
        if (!G.doneAt) G.doneAt = now;
        if (G.quick || now - G.lastInput > 160 || now - G.doneAt > 350) G.locked = false;
      }
      if (G.locked) raf = requestAnimationFrame(watchRelease);
    };
    const gate = (target, y, quick = false) => {
      setTo(target);
      G.locked = true;
      G.animating = true;
      G.quick = quick;
      G.doneAt = 0;
      G.holdY = y;
      jump(y);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(watchRelease);
    };

    G.lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const up = y < G.lastY;
      G.lastY = y;
      if (performance.now() < G.bypassUntil) return;
      if (G.locked) {
        if (Math.abs(y - G.holdY) > 1) jump(G.holdY); // also catches scrollbar drags
        return;
      }
      const g = geo();
      // A jump that skips the whole section (scrollbar drag, End key, a restored position): nothing to
      // show, so settle the view without holding the page there.
      if (G.phase === 0 && y > g.top + g.span) {
        morph.set(1);
        setTo(1);
      } else if (G.phase === 0 && y > g.gIn) gate(1, g.gIn);
      // Scrolling up while the customer view is pinned shifts straight back to the owner view, held
      // only while it plays, so the view changes before the page moves. The hold sits near the top of
      // the pinned stretch (an invisible jump while pinned).
      // Already above the section (a big jump past it): just reset, no hold.
      else if (G.phase === 1 && up && y < g.top + REVERSE_FROM * g.span) {
        if (y >= g.top) gate(0, Math.min(y, g.top + REVERSE_HOLD * g.span), true);
        else setTo(0);
      }
    };
    const block = (e) => {
      G.lastInput = performance.now();
      if (G.locked && e.cancelable) e.preventDefault();
    };
    const onKey = (e) => KEYS.has(e.key) && block(e);
    let bypassTimer = 0;
    const bypass = () => {
      G.bypassUntil = performance.now() + 1500;
      G.locked = false;
      clearTimeout(bypassTimer);
      bypassTimer = setTimeout(() => {
        // Settle instantly to wherever navigation landed (the section is usually off-screen by then)
        const t = progress() > TRIGGER_IN ? 1 : 0;
        morph.set(t);
        setTo(t);
      }, 1550);
    };
    const onClick = (e) => e.target.closest?.('a[href*="#"]') && bypass();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", bypass);
    document.addEventListener("click", onClick, true);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(bypassTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", bypass);
      document.removeEventListener("click", onClick, true);
    };
  }, [morph]);

  // Play the morph whenever the phase flips (interrupt-safe)
  useEffect(() => {
    const G = gateRef.current;
    if (reduceMotion) {
      morph.set(phase);
      G.animating = false;
      return;
    }
    const dist = Math.abs(phase - morph.get());
    const controls = animate(morph, phase, {
      duration: ((phase === 1 ? MORPH_MS : REVERSE_MS) / 1000) * Math.max(0.35, dist), // shorter if reversing mid-way
      ease: [0.65, 0, 0.35, 1], // smooth cubic in-out
      onComplete: () => (G.animating = false),
    });
    return () => controls.stop();
  }, [phase, morph, reduceMotion]);

  // The choreography below was tuned on a 0.18 → 0.7 timeline; map the 0 → 1 morph onto it.
  const p = useTransform(morph, (m) => 0.18 + 0.52 * m);
  const E = { ease: easeInOutSine };

  // Scroll-linked drift so the pinned section never feels frozen (nearer layers move more)
  const sp = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.0005 });
  const ownerDrift = useTransform(sp, [0, TRIGGER_IN], [0, 1]);
  const drift = useTransform(sp, [0.35, 1], [0, 1]);

  // Left column — teleprompter
  const t1Opacity = useTransform(p, [0.22, 0.4], [1, 0], E);
  const t1Out = useTransform(p, [0.18, 0.42], [0, -50], E);
  const t1Y = useTransform([t1Out, ownerDrift], ([a, d]) => a - 8 * d);
  const t2Opacity = useTransform(p, [0.46, 0.66], [0, 1], E);
  const t2In = useTransform(p, [0.44, 0.7], [50, 0], E);
  const t2Y = useTransform([t2In, drift], ([a, d]) => a - 14 * d);

  // Element A — phone: background → foreground
  const phoneScale = useTransform(p, [0.3, 0.7], [0.85, 0.9], E);
  const phoneX = 180; // already at its final x in the owner view, so the morph only lifts it
  // Rises slightly so its base lands just above the laptop deck
  const phoneRise = useTransform(p, [0.3, 0.7], [85, -48], E); // starts lower, rises into place
  // Parallax: through the customer view the phone keeps drifting up faster than the laptop
  const phoneParallax = useTransform(drift, (d) => -40 * d);
  const phoneY = useTransform([phoneRise, phoneParallax, ownerDrift], ([a, b, d]) => a + b - 16 * d);
  const phoneZ = useTransform(p, (v) => (v > 0.34 ? 30 : 5));

  // Element B — dark setup card: fades, drops, shrinks
  // Act 1 — setup card leaves on its own (blur + fade + sink), fully gone by 0.45
  const cardOpacity = useTransform(p, [0.3, 0.45], [1, 0], E);
  const cardBlur = useTransform(p, [0.32, 0.45], [0, 10], E);
  const cardFilter = useTransform(cardBlur, (b) => (b > 0.05 ? `blur(${b}px)` : "none"));
  const cardVisibility = useTransform(p, (v) => (v > 0.46 ? "hidden" : "visible"));
  const cardSink = useTransform(p, [0.3, 0.5], [-24, 46], E); // owner view: sits a little higher
  const cardY = useTransform([cardSink, ownerDrift], ([a, d]) => a - 12 * d);
  const cardScale = useTransform(p, [0.3, 0.5], [1, 0.94], E);

  // Element C — desktop invoice: rises into place
  // Act 2 — laptop arrives only as the card is gone (unblur + fade + rise) → no see-through overlap
  const invOpacity = useTransform(p, [0.42, 0.6], [0, 1], E);
  const invBlur = useTransform(p, [0.42, 0.6], [10, 0], E);
  const invFilter = useTransform(invBlur, (b) => (b > 0.05 ? `blur(${b}px)` : "none"));
  const invVisibility = useTransform(p, (v) => (v < 0.41 ? "hidden" : "visible"));
  const invRise = useTransform(p, [0.36, 0.7], [240, 170], E); // laptop settles low, behind the phone
  const invParallax = useTransform(drift, (d) => -22 * d); // slower than the phone → depth
  const invY = useTransform([invRise, invParallax], ([a, b]) => a + b);

  // Push the laptop as far left as the copy allows: its front lip stops GAP px from the text.
  const textRef = useRef(null);
  const rightRef = useRef(null);
  const stageRef = useRef(null);

  /* Stage size: the visuals stay in proportion to the copy (a little taller than its taller block)
     and always fit the window, with room for the view pill above. The composition spans
     COMP_TOP…COMP_BOTTOM px around the stage centre at scale 1 (measured across the whole morph,
     drift included). The pill sits just above it. */
  const COMP_TOP = -370, COMP_BOTTOM = 395, OVER_TEXT = 80, PILL_SPACE = 52, EDGE = 32;
  const [stageScale, setStageScale] = useState(1);
  useLayoutEffect(() => {
    const fit = () => {
      const blocks = rightRef.current?.previousElementSibling?.children;
      let textH = 0;
      for (const b of blocks ?? []) {
        const kids = b.children;
        if (kids.length) textH = Math.max(textH, kids[kids.length - 1].getBoundingClientRect().bottom - kids[0].getBoundingClientRect().top);
      }
      const span = COMP_BOTTOM - COMP_TOP;
      const byWidth = window.innerWidth < 1280 ? 0.75 : 1;
      const byText = textH ? (textH + OVER_TEXT) / span : 1;
      const byWindow = (window.innerHeight - 2 * EDGE - PILL_SPACE) / span;
      setStageScale(Math.max(0.5, Math.min(byWidth, byText, byWindow)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);
  const invX = useMotionValue(-105);
  useLayoutEffect(() => {
    const GAP = 16, LIP_HALF = FRONT_W / 2, LAPTOP_SCALE = 0.9, LAPTOP_NUDGE = 22;
    const measure = () => {
      if (!textRef.current || !rightRef.current || !stageRef.current || window.innerWidth < 1024) {
        invX.set(-105);
        return;
      }
      let textRight = 0;
      textRef.current.querySelectorAll("h2,p,li").forEach((el) => {
        const r = document.createRange();
        r.selectNodeContents(el);
        for (const rc of r.getClientRects()) textRight = Math.max(textRight, rc.right);
      });
      const col = rightRef.current.getBoundingClientRect();
      const s = stageRef.current.getBoundingClientRect().width / stageRef.current.offsetWidth || 1;
      const cx = col.left + col.width / 2;
      const x = (textRight + GAP - cx) / s - LAPTOP_NUDGE + LAPTOP_SCALE * LIP_HALF;
      // Upper bound -30 (was -60, tuned for a 1280px layout): on the site's 1120px container the
      // laptop needs ~23px more room to keep its GAP from the copy at ≥1280px.
      invX.set(Math.min(-30, Math.max(-230, x)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [invX, stageScale]);
  const invScale = useTransform(p, [0.36, 0.7], [0.92, 1], E);
  const invRotX = useTransform(p, [0.36, 0.7], [10, 0], E);

  // Contact shadow drift
  const floorX = useTransform(p, [0.3, 0.7], [-10, -40], E);
  const floorSettle = useTransform(p, [0.3, 0.7], [250, 275], E);
  const floorY = useTransform([floorSettle, drift], ([a, d]) => a - 22 * d);

  // Owner / Customer view pill
  const pillK = useTransform(p, [0.38, 0.52], [0, 1], E);
  const pillX = useTransform(pillK, (k) => `${k * 100}%`);
  const ownerColor = useTransform(pillK, [0, 1], ["#ffffff", "#64748B"]);
  const customerColor = useTransform(pillK, [0, 1], ["#64748B", "#ffffff"]);

  const center = "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";

  return (
    <section id={id} ref={trackRef} className="relative h-[200vh] bg-white">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-white">
        <div className="container grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* LEFT — teleprompter */}
          <div className="relative h-[420px] lg:h-[560px]">
            <motion.div style={{ opacity: t1Opacity, y: t1Y }} className="absolute inset-0 flex flex-col justify-center">
              <p className="text-xs font-bold tracking-[.14em] text-slate-500">{OWNER_COPY.eyebrow}</p>
              <h2 className="mt-3.5 text-4xl font-bold leading-tight tracking-tight text-slate-900">{OWNER_COPY.title}</h2>
              <p className="mt-4 max-w-[500px] text-[17px] leading-relaxed text-slate-500">{OWNER_COPY.body}</p>
              <Bullets items={SETUP_BULLETS} />
            </motion.div>

            <motion.div ref={textRef} style={{ opacity: t2Opacity, y: t2Y }} className="absolute inset-0 flex flex-col justify-center">
              <p className="text-xs font-bold tracking-[.14em] text-blue-500">{CUSTOMER_COPY.eyebrow}</p>
              <h2 className="mt-3.5 text-4xl font-bold leading-tight tracking-tight text-slate-900">{CUSTOMER_COPY.title}</h2>
              <p className="mt-4 max-w-[500px] text-[17px] leading-relaxed text-slate-500">{CUSTOMER_COPY.body}</p>
              <Bullets items={RESULT_BULLETS} />
            </motion.div>
          </div>

          {/* RIGHT — visual morph (scaled down on smaller screens) */}
          <div ref={rightRef} className="relative h-[520px] [perspective:1600px] lg:h-[640px]">
            {/* View indicator */}
            <div
              style={{ top: `calc(50% + ${Math.round(COMP_TOP * stageScale - PILL_SPACE)}px)` }}
              className="absolute left-1/2 z-40 flex -translate-x-1/2 rounded-full border border-slate-900/5 bg-white/75 p-1 text-xs font-semibold shadow-[0_1px_2px_rgba(15,23,42,.06),0_8px_24px_-10px_rgba(15,23,42,.25)] backdrop-blur-md">
              <motion.span
                style={{ x: pillX }}
                className="absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-full bg-slate-900"
              />
              <motion.span style={{ color: ownerColor }} className="relative w-[118px] py-[7px] text-center">Owner view</motion.span>
              <motion.span style={{ color: customerColor }} className="relative w-[118px] py-[7px] text-center">Customer view</motion.span>
            </div>
            <div ref={stageRef} className="absolute inset-0 origin-center" style={{ transform: `scale(${stageScale})` }}>

              {/* Contact shadow */}
              <motion.div
                style={{ x: floorX, y: floorY }}
                className={`${center} pointer-events-none h-[60px] w-[520px] rounded-[50%] bg-[radial-gradient(closest-side,rgba(15,23,42,.18),transparent)] blur-[10px]`}
              />

              {/* C — invoice */}
              <div className={center} style={{ zIndex: 10 }}>
                <motion.div style={{ opacity: invOpacity, filter: invFilter, visibility: invVisibility, y: invY, x: invX, scale: invScale, rotateX: invRotX }}>
                  <DesktopInvoice />
                </motion.div>
              </div>

              {/* B — setup card */}
              <div className={center} style={{ zIndex: 20 }}>
                <motion.div
                  style={{ opacity: cardOpacity, filter: cardFilter, visibility: cardVisibility, y: cardY, x: -70, scale: cardScale }}
                  className="rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,.10),0_12px_24px_-8px_rgba(15,23,42,.22),0_36px_72px_-28px_rgba(15,23,42,.45)]"
                >
                  {setupCard ?? <SetupCardFallback />}
                </motion.div>
              </div>

              {/* A — phone */}
              <motion.div className={center} style={{ zIndex: phoneZ }}>
                <motion.div
                  style={{ x: phoneX, y: phoneY, scale: phoneScale }}
                  className="will-change-transform [filter:drop-shadow(0_26px_40px_rgba(15,23,42,.28))]"
                >
                  {phone ?? <PhoneFallback />}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Phones and tablets (< 1024px): the two views stacked, no pinning or scroll gate ----------
   Each block (label, copy, mockup) fades and slides up as it scrolls into view; the phone drifts a
   little. Each mockup is laid out at a fixed design size and scaled to fit the column's width. */

/** Scale a fixed-size design (w × h) down to its container's width; the wrapper keeps the scaled height. */
function FitToWidth({ w, h, children }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    const fit = () => setScale(Math.min(1, el.clientWidth / w));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={ref} className="relative w-full" style={{ height: h * scale }}>
      <div className="absolute left-1/2 top-0" style={{ width: w, height: h, marginLeft: -w / 2, transform: `scale(${scale})`, transformOrigin: "50% 0" }}>
        {children}
      </div>
    </div>
  );
}

/** A small parallax drift (±px) for the phone while its block crosses the viewport. */
function useDrift(ref, px) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [px, -px]);
  return reduce ? 0 : y;
}

function StackedBlock({ label, copy, eyebrowClass, bullets, children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="inline-flex rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">{label}</span>
      <p className={`mt-6 text-xs font-bold tracking-[.14em] ${eyebrowClass}`}>{copy.eyebrow}</p>
      <h2 className="mt-3.5 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">{copy.title}</h2>
      <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-slate-500">{copy.body}</p>
      <Bullets items={bullets} />
      <div className="mt-10">{children}</div>
    </motion.div>
  );
}

// Owner: the setup card in front, the phone peeking out behind it, lower and to the right.
function OwnerVisual({ phone, setupCard }) {
  const ref = useRef(null);
  const drift = useDrift(ref, 18);
  return (
    <div ref={ref}>
      <FitToWidth w={470} h={610}>
        {/* Scale on the wrapper: the drift's inline transform would replace a scale on the same element. */}
        <div className="absolute left-[222px] top-[96px] origin-top-left scale-[.85]">
          <motion.div className="[filter:drop-shadow(0_26px_40px_rgba(15,23,42,.28))]" style={{ y: drift }}>
            {phone ?? <PhoneFallback />}
          </motion.div>
        </div>
        <div className="absolute left-0 top-[40px] rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,.10),0_12px_24px_-8px_rgba(15,23,42,.22),0_36px_72px_-28px_rgba(15,23,42,.45)]">
          {setupCard ?? <SetupCardFallback />}
        </div>
      </FitToWidth>
    </div>
  );
}

// Customer: the laptop, with the phone in front of its right side, above the base.
function CustomerVisual({ phone }) {
  const ref = useRef(null);
  const drift = useDrift(ref, 22);
  return (
    <div ref={ref}>
      <FitToWidth w={760} h={520}>
        <div className="absolute left-[2px] top-[-12px]">
          <DesktopInvoice />
        </div>
        <div className="absolute left-[548px] top-[8px] origin-top-left scale-[.72]">
          <motion.div className="[filter:drop-shadow(0_26px_40px_rgba(15,23,42,.28))]" style={{ y: drift }}>
            {phone ?? <PhoneFallback />}
          </motion.div>
        </div>
      </FitToWidth>
    </div>
  );
}

function BillingStacked({ phone, setupCard, id = "billing" }) {
  return (
    <section id={id} className="section relative overflow-x-clip bg-white">
      <div className="container">
        <StackedBlock label="Owner view" copy={OWNER_COPY} eyebrowClass="text-slate-500" bullets={SETUP_BULLETS}>
          <OwnerVisual phone={phone} setupCard={setupCard} />
        </StackedBlock>
        <div className="mt-20">
          <StackedBlock label="Customer view" copy={CUSTOMER_COPY} eyebrowClass="text-blue-500" bullets={RESULT_BULLETS}>
            <CustomerVisual phone={phone} />
          </StackedBlock>
        </div>
      </div>
    </section>
  );
}
