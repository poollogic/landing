import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import PreviewSidebar from "./preview/PreviewSidebar.jsx";
import Segmented from "./preview/Segmented.jsx";
import "./preview/preview.css";

/**
 * BillingScrollMorph — pinned "Billing on autopilot" section.
 *   You set it:  a MacBook shows the owner's Billing tab in the PoolLogic web app (light theme).
 *   They get it: scrolling into the pinned section plays a 0.9s morph — the laptop switches to the
 *                customer's invoice page and the phone rises in with the same unpaid invoice.
 * The section is scroll-gated while the morph plays; anchor/nav links bypass the gate.
 *
 * Usage:
 *   <BillingScrollMorph id="billing" phone={<BillingPhone />} />
 * Requires framer-motion ≥ 10 and the Inter font (300–800).
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

const SETUP_BULLETS = [
  ["Each customer, their own cadence", "Monthly, quarterly or yearly — on the day you choose for each account."],
  ["Nothing slips through", "Chemicals your techs log and card fees are added automatically."],
  ["Paid without asking", "Saved cards are charged automatically on autopay accounts."],
];
const RESULT_BULLETS = [
  ["One-tap Stripe checkout", "Card, Apple Pay or ACH — no logins, no PDFs."],
  ["Self-serve receipts & history", "Every invoice, payment and visit report in one place."],
  ["Any device, anywhere", "Looks perfect on a phone, tablet or desktop."],
];

/* ---------- Laptop showing the desktop invoice (modeled on the live PoolLogic portal invoice) ---------- */
const AppleLogo = () => (
  <svg width="10" height="12" viewBox="0 0 10 12">
    <path fill="#111" d="M8.3 6.4c0-1.5 1.2-2.2 1.3-2.3-.7-1-1.8-1.2-2.2-1.2-.9-.1-1.8.6-2.3.6s-1.2-.5-2-.5C2 3 1 3.6.5 4.6c-1.1 1.9-.3 4.7.8 6.2.5.8 1.1 1.6 1.9 1.6.8 0 1-.5 2-.5s1.2.5 2 .5 1.3-.8 1.8-1.5c.6-.8.8-1.6.8-1.7 0 0-1.5-.6-1.5-2.8zM6.8 1.9C7.2 1.4 7.5.7 7.4 0c-.6 0-1.4.4-1.8.9-.4.4-.7 1.1-.6 1.8.7 0 1.4-.4 1.8-.8z" />
  </svg>
);

/* ---------- Pixel-faithful replica of the live PoolLogic customer portal (portal.poollogic.app) ----------
   Rendered at a real desktop size (1680×1050) and scaled into the laptop screen, so proportions,
   whitespace and type match the actual page. Tokens copied from the live portal's computed styles.
   Requires the Inter font (Google Fonts or @fontsource/inter). Demo data is fictional. */
const PORTAL = {
  blue: "rgb(38,118,182)",
  ink: "oklch(0.216 0.006 56.043)", // stone-900
  body: "oklch(0.444 0.011 73.639)", // stone-600
  muted: "oklch(0.553 0.013 58.071)", // stone-500
  label: "oklch(0.709 0.01 56.259)", // stone-400
  line: "oklch(0.923 0.003 48.717)", // stone-200
};
const DESK_W = 1680, DESK_H = 1050, MENU_H = 24, TOOLBAR_H = 53;
const SF = "-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue',system-ui,sans-serif";

const Ico = ({ d, c = "#6E6E73", s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const Lock = ({ c }) => (
  <svg width="11" height="13" viewBox="0 0 10 12"><rect y="5" width="10" height="7" rx="1.6" fill={c} /><path d="M2.4 5V3.5a2.6 2.6 0 0 1 5.2 0V5" stroke={c} strokeWidth="1.4" fill="none" /></svg>
);
// Official Bayside mark — identical to the logo in the site's phone mockup (.bz-inv-logo)
const BaysideLogo = ({ size = 66 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="lp-circle" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1f4f7e" /><stop offset="100%" stopColor="#0e3556" /></linearGradient>
      <linearGradient id="lp-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7fc4ec" /><stop offset="100%" stopColor="#3b8fd1" /></linearGradient>
      <clipPath id="lp-top"><path d="M 41 32 L 56 32 C 61.4 32 65.5 36.1 65.5 41.5 C 65.5 46.9 61.4 51 56 51 L 41 51 Z" /></clipPath>
      <clipPath id="lp-bottom"><path d="M 41 55 L 58 55 C 63.8 55 68.5 59.6 68.5 65.5 C 68.5 71.4 63.8 76 58 76 L 41 76 Z" /></clipPath>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#lp-circle)" />
    <circle cx="50" cy="50" r="44" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.18" />
    <path fillRule="evenodd" clipRule="evenodd" fill="#fff" d="M 30 22 L 56 22 C 65.4 22 73 29.6 73 39 C 73 43.8 71 48.2 67.7 51.4 C 72.4 54.3 75.5 59.5 75.5 65.5 C 75.5 75.2 67.7 83 58 83 L 30 83 Z M 41 32 L 56 32 C 61.4 32 65.5 36.1 65.5 41.5 C 65.5 46.9 61.4 51 56 51 L 41 51 Z M 41 55 L 58 55 C 63.8 55 68.5 59.6 68.5 65.5 C 68.5 71.4 63.8 76 58 76 L 41 76 Z" />
    <g clipPath="url(#lp-top)">
      <rect x="41" y="32" width="25" height="19" fill="url(#lp-water)" />
      <path d="M 39 43 Q 47 39 53 43 T 67 43" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.7" />
    </g>
    <g clipPath="url(#lp-bottom)">
      <rect x="41" y="55" width="28" height="21" fill="url(#lp-water)" />
      <path d="M 39 67 Q 49 62 56 67 T 71 67" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.75" />
    </g>
  </svg>
);
const CARD_W = 766;
const At = ({ top, left, right, style, children }) => (
  <div style={{ position: "absolute", top, left, right, ...style }}>{children}</div>
);
const META_LABEL = { fontWeight: 600, color: PORTAL.label, letterSpacing: 0.4 };
const COLS = { display: "grid", gridTemplateColumns: "430px 72px 102px 1fr" }; // QTY / PRICE / TOTAL columns as on the portal
const Party = ({ left, label, name, lines }) => (
  <>
    <At top={221} left={left} style={{ fontSize: 12, lineHeight: "16px", fontWeight: 700, letterSpacing: 0.6, color: PORTAL.label }}>{label}</At>
    <At top={248} left={left} style={{ width: 330, fontSize: 18.5, lineHeight: "24px", fontWeight: 700, letterSpacing: -0.3 }}>{name}</At>
    <At top={280.6} left={left} style={{ width: 330, fontSize: 12.6, lineHeight: "17.8px", color: PORTAL.body }}>
      {lines.map((l) => <div key={l}>{l}</div>)}
    </At>
  </>
);
const TotalRow = ({ top, label, value }) => (
  <At top={top} left={495} style={{ width: 223, display: "flex", justifyContent: "space-between", fontSize: 14, lineHeight: "20px", color: PORTAL.body }}>
    <span>{label}</span><span>{value}</span>
  </At>
);
const TrafficLight = ({ c }) => (
  <span style={{ width: 12, height: 12, borderRadius: 999, background: c, boxShadow: "inset 0 0 0 .5px rgba(0,0,0,.18)" }} />
);

function MacSafariInvoice() {
  return (
    <div
      style={{
        position: "absolute", left: 0, top: 0, width: DESK_W, height: DESK_H, overflow: "hidden",
        transform: `scale(${592 / DESK_W})`, transformOrigin: "0 0",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", WebkitFontSmoothing: "antialiased",
        letterSpacing: -0.16, color: PORTAL.ink,
      }}
    >
      {/* macOS menu bar */}
      <div style={{ height: MENU_H, background: "#EDEDF0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px 0 18px", font: `500 13px/1 ${SF}`, color: "#1d1d1f", letterSpacing: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <AppleLogo /><b style={{ fontWeight: 700 }}>Safari</b>
          {["File", "Edit", "View", "History", "Bookmarks", "Window", "Help"].map((m) => <span key={m}>{m}</span>)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontWeight: 400 }}>
          <Ico c="#1d1d1f" s={15} d={<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0" />} />
          <span style={{ position: "relative", display: "inline-block", width: 24, height: 11, border: "1.4px solid #1d1d1f", borderRadius: 3 }}>
            <span style={{ position: "absolute", top: 1.5, bottom: 1.5, left: 1.5, right: 6, background: "#1d1d1f", borderRadius: 1 }} />
          </span>
          <span>Mon Dec 14&nbsp;&nbsp;9:41 AM</span>
        </div>
      </div>

      {/* Safari toolbar */}
      <div style={{ height: TOOLBAR_H - 1, background: "#F6F6F6", borderBottom: "1px solid #D9D9DB", display: "flex", alignItems: "center", padding: "0 16px", gap: 14 }}>
        <span style={{ display: "flex", gap: 8 }}><TrafficLight c="#FF5F57" /><TrafficLight c="#FEBC2E" /><TrafficLight c="#28C840" /></span>
        <span style={{ marginLeft: 14, display: "flex" }}><Ico d={<><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M9 4v16" /></>} /></span>
        <span style={{ display: "flex", gap: 10 }}><Ico d={<path d="M15 6l-6 6 6 6" />} /><Ico c="#C7C7CC" d={<path d="M9 6l6 6-6 6" />} /></span>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ width: 560, height: 34, borderRadius: 9, background: "#E8E8EA", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, font: `400 14px/1 ${SF}`, color: "#1d1d1f", letterSpacing: 0 }}>
            <Lock c="#6E6E73" />portal.poollogic.app
          </div>
        </div>
        <span style={{ display: "flex", gap: 18 }}>
          <Ico d={<><path d="M12 3v12M7.5 7.5L12 3l4.5 4.5" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /></>} />
          <Ico d={<path d="M12 5v14M5 12h14" />} />
          <Ico d={<><rect x="7" y="7" width="13" height="13" rx="2.5" /><path d="M4 16V6a2 2 0 0 1 2-2h10" /></>} />
        </span>
      </div>

      {/* Page viewport — layout measured from the live portal (every value is relative to the 766px card) */}
      <div style={{ position: "relative", height: DESK_H - MENU_H - TOOLBAR_H, overflow: "hidden", background: "#F5F5F5" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: DESK_W, color: PORTAL.ink, background: "linear-gradient(180deg,#fff 0px,#fff 300px,#F4F4F5 1000px)" }}>
          {/* Stripe bar (top of page) */}
          <div style={{ height: 40, background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14, fontWeight: 500, letterSpacing: 0.1 }}>
            <Lock c="#fff" />Secure checkout by <b style={{ fontWeight: 800, fontSize: 15, letterSpacing: -0.4 }}>stripe</b>
          </div>

          <div style={{ position: "relative", width: CARD_W, height: 896, margin: "54px auto 80px" }}>
            {/* Zoom controls (round, 61px right of the card) */}
            <div style={{ position: "absolute", left: CARD_W + 61, top: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {[<path key="p" d="M12 5v14M5 12h14" />, <path key="m" d="M5 12h14" />].map((d, i) => (
                <span key={i} style={{ width: 37, height: 37, borderRadius: 999, background: "#fff", boxShadow: `0 0 0 1px ${PORTAL.line},0 2px 6px rgba(0,0,0,.06)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1c1917" strokeWidth="2.6" strokeLinecap="round">{d}</svg>
                </span>
              ))}
            </div>

            {/* Invoice card */}
            <div style={{ position: "absolute", inset: 0, background: "#fff", border: `1px solid ${PORTAL.line}`, borderRadius: 20, boxShadow: "0 1px 2px rgba(0,0,0,.03),0 6px 28px rgba(0,0,0,.06)", overflow: "hidden" }}>
              <At top={23} left={703}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PORTAL.label} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
              </At>

              {/* Logo */}
              <At top={66} left={54} style={{ width: 106, display: "flex", flexDirection: "column", alignItems: "center", gap: 7, color: "rgb(28,91,145)" }}>
                <BaysideLogo />
                <span style={{ fontSize: 15, lineHeight: "15px", fontWeight: 800, letterSpacing: 0.6 }}>BAYSIDE</span>
                <span style={{ fontSize: 10, lineHeight: "10px", fontWeight: 600, letterSpacing: 3.4, marginRight: -3.4 }}>POOL CO.</span>
              </At>

              {/* Title + meta */}
              <At top={44} right={48} style={{ textAlign: "right", fontSize: 44, lineHeight: "44px", fontWeight: 300, letterSpacing: -0.9, color: PORTAL.blue }}>Invoice</At>
              <At top={103} right={48} style={{ textAlign: "right", fontSize: 14.5, lineHeight: "24px", color: PORTAL.muted }}>
                <div>INV - 1056</div>
                <div><b style={META_LABEL}>DATE:</b> 12/14/2026</div>
                <div><b style={META_LABEL}>DUE DATE:</b> 12/29/2026</div>
              </At>

              {/* From / To */}
              <Party left={48} label="FROM" name="BAYSIDE POOL CO." lines={["9800 Montgomery Blvd NE", "Albuquerque, NM 87111", "billing@baysidepool.example", "(248) 434-5508"]} />
              <Party left={407} label="TO" name="Jimmy McGill" lines={["160 Candelaria Rd NW", "Albuquerque, NM 87107", "j.mcgill@ice-station-zebra.com", "(505) 842-5662"]} />

              {/* Table header */}
              <At top={399} left={0} style={{ ...COLS, right: 0, height: 44.5, padding: "0 48px", alignItems: "center", background: PORTAL.blue, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 0.55 }}>
                <span>DESCRIPTION</span><span style={{ textAlign: "center" }}>QTY</span><span style={{ textAlign: "center" }}>PRICE</span><span style={{ textAlign: "right" }}>TOTAL</span>
              </At>

              {/* Line item */}
              <At top={492.5} left={48} style={{ width: 398, fontSize: 14.5, lineHeight: "20px", fontWeight: 600 }}>Weekly Pool Service - Monthly Billing</At>
              <At top={518.5} left={48} style={{ width: 398, fontSize: 12.6, lineHeight: "18.3px", color: PORTAL.body }}>
                Comprehensive weekly pool service provided throughout the month and billed monthly. Service includes water chemistry testing and balancing, cleaning of pool surfaces, debris removal, and proactive inspection of pool equipment to maintain optimal performance .
              </At>
              <At top={532} left={48} style={{ ...COLS, width: 670, fontSize: 14.5, lineHeight: "20px" }}>
                <span /><span style={{ textAlign: "center", color: PORTAL.body }}>1</span>
                <span style={{ textAlign: "center", color: PORTAL.body }}>$145.00</span>
                <b style={{ textAlign: "right", fontWeight: 700 }}>$145.00</b>
              </At>

              {/* Totals */}
              <TotalRow top={638.6} label="Subtotal" value="$145.00" />
              <TotalRow top={671.3} label="Card fee (2.9%)" value="$4.21" />
              <At top={703} left={495} style={{ width: 223, height: 1, background: PORTAL.line }} />
              <At top={716} left={495} style={{ width: 223, display: "flex", justifyContent: "space-between", alignItems: "baseline", fontWeight: 700, lineHeight: "28px", fontSize: 22 }}>
                <span>Total</span><span style={{ letterSpacing: -0.4 }}>$149.21</span>
              </At>

              {/* Pay */}
              <At top={800} left={48} style={{ width: 670, height: 48, borderRadius: 8, background: PORTAL.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 500 }}>Pay now</At>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Keyboard deck, seen slightly from above ----------
   A flat 616×300 deck tilted back in the laptop's 3D scene (1400px perspective). The tilt is animated:
   79° in "You set it" → 84° in "They get it".
   Projected depth = 300·cos θ·f and the front edge widens by f = 1400 / (1400 − 300·sin θ). */
const DECK_W = 616, DECK_L = 300, DECK_PERSP = 1400;
const deckF = (deg) => DECK_PERSP / (DECK_PERSP - DECK_L * Math.sin((deg * Math.PI) / 180));
const deckH = (deg) => DECK_L * Math.cos((deg * Math.PI) / 180) * deckF(deg);
const FRONT_W = Math.round(DECK_W * deckF(78)); // ≈ 779 (final pose; used for the "16px from the copy" rule)

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

function KeyboardDeck({ tilt, flat }) {
  // The deck lives in the laptop's shared 3D scene (see <Laptop/>), so it turns together with the screen.
  // Its front edge and the table shadows are 3D children of the deck. When the laptop faces straight ahead
  // the scene drops its camera (so the screen renders sharp) and the deck takes over the exact same one.
  const h = useTransform(tilt, (d) => deckH(d)); // layout space for the deck
  const rot = useTransform(tilt, (d) => `rotateX(${d}deg)`);
  const perspective = useTransform(flat, (f) => (f ? `${SCENE_PERSP}px` : "none"));
  const perspectiveOrigin = useTransform(tilt, (d) => `50% ${SCENE_OY * (LID_H + deckH(d)) - LID_H}px`);
  return (
    <motion.div className="relative" style={{ width: DECK_W, height: h, transformStyle: "preserve-3d", perspective, perspectiveOrigin, zoom: SS }}>
      <motion.div
        className="absolute left-0 top-0 rounded-b-[26px] bg-[linear-gradient(180deg,#6E7177_0%,#8A8D93_18%,#93969C_60%,#868990_100%)] shadow-[inset_0_2px_0_rgba(0,0,0,.35),inset_0_-1px_0_rgba(255,255,255,.25)]"
        style={{ width: DECK_W, height: DECK_L, transformOrigin: "50% 0", transform: rot, transformStyle: "preserve-3d" }}
      >
        {/* Table shadow (on the table plane, just under the deck) */}
        <div className="pointer-events-none absolute rounded-[50%] blur-[22px]"
          style={{ left: -70, right: -70, top: 60, bottom: -260, transform: "translateZ(-1px)", background: "radial-gradient(50% 50% at 50% 46%, rgba(15,23,42,.55), rgba(15,23,42,.24) 50%, transparent 78%)" }} />
        {/* Contact shadow along the front edge */}
        <div className="pointer-events-none absolute rounded-[50%] blur-[5px]"
          style={{ left: 6, right: 6, bottom: -40, height: 64, transform: "translateZ(-0.5px)", background: "radial-gradient(closest-side, rgba(15,23,42,.65), rgba(15,23,42,.25) 65%, transparent)" }} />
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
        {/* Front edge: a real 3D face, inset from the rounded corners (no curl) */}
        <div className="absolute"
          style={{ left: 12, right: 12, bottom: 0, height: 8, transformOrigin: "50% 100%", transform: "rotateX(-90deg)", borderRadius: "0 0 14px 14px / 0 0 6px 6px", background: "linear-gradient(180deg,#9A9DA3 0%,#6E7177 45%,#4B4E54 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.4)" }} />
      </motion.div>
    </motion.div>
  );
}

/* ---------- Owner view: the PoolLogic web app (light theme) on app.poollogic.app ----------
   Drawn as a 1280×800 Mac desktop scaled into the 592×370 screen. The web page itself is shown at
   Safari's 112% page zoom (browser chrome stays normal size) so the UI is readable at landing-page scale. */
const APP = {
  ink: "#1C1917", muted: "#78716C", dim: "#A8A29E", line: "rgba(15,23,42,.07)",
  side: "#F8F8F9", tabs: "#F4F4F5", link: "rgb(38,118,182)", green: "#34C77B", toggle: "#3B82F6",
};
const APP_ZOOM = 1.12;
const OWNER_INVOICES = [
  ["Nov 14", "Paid", "Nov 14th"],
  ["Oct 14", "Paid", "Oct 14th"],
  ["Sep 14", "Paid", "Sep 15th"],
  ["Aug 14", "Paid", "Aug 14th"],
  ["Jul 14", "Paid", "Jul 16th"],
];
const Toggle = ({ on }) => (
  <span style={{ position: "relative", width: 42, height: 24, borderRadius: 999, background: on ? APP.toggle : "#D4D4D8", flex: "none" }}>
    <span style={{ position: "absolute", top: 3, [on ? "right" : "left"]: 3, width: 18, height: 18, borderRadius: 999, background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,.2)" }} />
  </span>
);
const CheckBox = () => (
  <span style={{ width: 18, height: 18, borderRadius: 4, border: "1.5px solid #D6D3D1", background: "#fff", flex: "none" }} />
);
const Field = ({ label, children, sub }) => (
  <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 16, padding: "8px 0", alignItems: "start" }}>
    <div style={{ color: APP.muted, fontSize: 14, paddingTop: 4 }}>{label}</div>
    <div>
      {children}
      {sub && <div style={{ color: APP.dim, fontSize: 12.5, marginTop: 6, lineHeight: 1.45 }}>{sub}</div>}
    </div>
  </div>
);

function OwnerRows() {
  return OWNER_INVOICES.map(([d, st, when]) => (
    <div key={d} style={{ display: "grid", gridTemplateColumns: "62px 1fr auto", alignItems: "center", padding: "8px 0", fontSize: 14 }}>
      <span style={{ color: APP.muted }}>{d}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 9, whiteSpace: "nowrap" }}>
        <span style={{ width: 7, height: 7, borderRadius: 999, background: APP.green }} />
        <span style={{ color: APP.ink }}>{st}</span>
        <span style={{ color: APP.muted }}>{when}</span>
      </span>
      <span style={{ color: APP.ink, fontWeight: 600 }}>$149.21</span>
    </div>
  ));
}

function OwnerDesktopApp() {
  return (
    <div style={{ width: 1280, height: 800, transform: `scale(${592 / 1280})`, transformOrigin: "0 0", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", WebkitFontSmoothing: "antialiased", letterSpacing: -0.16, color: APP.ink, background: "#fff" }}>
      {/* macOS menu bar */}
      <div style={{ height: 24, background: "#EDEDF0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px 0 18px", font: `500 13px/1 ${SF}`, color: "#1d1d1f", letterSpacing: 0 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <AppleLogo /><b>Safari</b>
          {["File", "Edit", "View", "History", "Bookmarks", "Window", "Help"].map((m) => <span key={m}>{m}</span>)}
        </div>
        <span style={{ fontWeight: 400 }}>Mon Dec 14&nbsp;&nbsp;9:41 AM</span>
      </div>
      {/* Safari toolbar */}
      <div style={{ height: 51, background: "#F6F6F6", borderBottom: "1px solid #D9D9DB", display: "flex", alignItems: "center", padding: "0 16px", gap: 14 }}>
        <span style={{ display: "flex", gap: 8 }}><TrafficLight c="#FF5F57" /><TrafficLight c="#FEBC2E" /><TrafficLight c="#28C840" /></span>
        <span style={{ marginLeft: 12, display: "flex", gap: 10 }}><Ico s={17} d={<path d="M15 6l-6 6 6 6" />} /><Ico s={17} c="#C7C7CC" d={<path d="M9 6l6 6-6 6" />} /></span>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ width: 480, height: 32, borderRadius: 9, background: "#E8E8EA", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, font: `400 14px/1 ${SF}`, color: "#1d1d1f", letterSpacing: 0 }}>
            <Lock c="#6E6E73" />app.poollogic.app
          </div>
        </div>
        <Ico s={17} d={<path d="M12 5v14M5 12h14" />} />
      </div>

      {/* Web app at 112% page zoom */}
      <div style={{ display: "flex", zoom: APP_ZOOM, width: 1280 / APP_ZOOM, height: 725 / APP_ZOOM }}>
        {/* Sidebar: the app's real rail, shared with the hero's dashboard preview; always light here */}
        <div className="theme-scope light pl-rail-host" style={{ display: "flex", flex: "none" }}>
          <PreviewSidebar active="Customers" decorative />
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "18px 28px", position: "relative" }}>
          <div style={{ color: APP.link, fontSize: 13.5, display: "flex", alignItems: "center", gap: 4 }}><Ico s={14} c={APP.link} d={<path d="M15 6l-6 6 6 6" />} />Customers</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 6 }}>
            <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>Jimmy McGill</span>
            <span style={{ color: APP.muted, fontSize: 14 }}>160 Candelaria Rd NW · Weekly service</span>
          </div>
          {/* The app's segmented tabs, shared with the hero's dashboard preview (light theme) */}
          <div className="theme-scope light pl-rail-host" style={{ display: "flex", marginTop: 16 }}>
            <Segmented options={["Overview", "Service & Notes", "Billing", "Reports"]} value="Billing" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 32, marginTop: 16 }}>
            {/* Settings column */}
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Subscription</div>
              <div style={{ fontSize: 21, fontWeight: 700, marginTop: 2 }}>$145.00 <span style={{ fontSize: 14, fontWeight: 400, color: APP.muted }}>/ month</span></div>
              <div style={{ marginTop: 8 }}>
                <Field label="Rate" sub="invoices $145.00 every month">
                  <span style={{ display: "flex", justifyContent: "space-between", width: 220, fontSize: 15 }}><span><span style={{ color: APP.muted }}>$</span> 145</span><span style={{ color: APP.muted, fontSize: 13 }}>/ mo ⌄</span></span>
                </Field>
                <Field label="Billing cycle"><span style={{ fontSize: 15 }}>Monthly</span></Field>
                <Field label="Invoice delivery"><span style={{ fontSize: 15 }}>Email only</span></Field>
                <Field
                  label="Next invoice date"
                  sub={<>On Dec 14, <span style={{ color: APP.ink }}>Jimmy McGill</span> is emailed a <b style={{ color: APP.ink, fontWeight: 600 }}>$149.21</b> invoice automatically, then every month.</>}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 15 }}>
                    <Ico s={15} c={APP.muted} d={<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>} />Dec 14, 2026
                  </span>
                </Field>
                <Field label="Payment terms" sub="Days after invoice is sent"><span style={{ fontSize: 15 }}>Net 15 — 15 days</span></Field>
                <Field label="CC surcharge exemption"><span style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14.5 }}><CheckBox />Exempt from 2.9% surcharge</span></Field>
                <Field label="Chemical charges"><span style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14.5 }}><CheckBox />Add chemicals to invoice</span></Field>
              </div>
            </div>

            {/* Activity column */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>Pending Charges <span style={{ color: APP.muted, fontWeight: 400, marginLeft: 6 }}>None</span></span>
                <span style={{ color: APP.muted, fontSize: 14 }}>+ Add</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 30 }}>Recent invoices</div>
              <div style={{ marginTop: 4 }}><OwnerRows /></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 26 }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>Autopay <span style={{ marginLeft: 8, fontSize: 11.5, fontWeight: 600, color: APP.green, background: "rgba(52,199,123,.13)", borderRadius: 999, padding: "2px 9px" }}>● Active</span></span>
                <span style={{ color: APP.muted, fontSize: 13.5 }}>Replace&nbsp;&nbsp;&nbsp;&nbsp;Remove</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 50, height: 30, borderRadius: 7, background: "#fff", color: "#1a1f71", font: "800 13px/30px Inter, sans-serif", textAlign: "center", boxShadow: "0 0 0 1px rgba(15,23,42,.12)" }}>VISA</span>
                  <span style={{ fontSize: 15 }}>•••• 4242</span>
                </span>
                <span style={{ color: APP.muted, font: "13px ui-monospace, monospace" }}>03/30</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
                <span><div style={{ fontSize: 15, fontWeight: 500 }}>Charge automatically</div><div style={{ color: APP.muted, fontSize: 13, marginTop: 2 }}>Apply card to each recurring invoice</div></span>
                <Toggle on />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Realistic space-gray laptop: aluminium rim, notch, glass bezel, hinge, deck ----------
   Screen = customer invoice page (portal) underneath, owner app on top; the owner app crossfades away.

   Sharpness: Chrome rasterizes a layer that has a perspective transform at 1x and stretches it, so the
   screen text went blurry on retina displays. Two fixes, both leaving the geometry pixel-identical:
   - the lid and deck are drawn at SS× size (CSS zoom) and the scene scales them back down by 1/SS, so the
     1x raster has SS× the pixels (the turned owner view and the transition);
   - when the laptop faces straight ahead (turn 0, the customer view at rest) the scene has no perspective
     at all and the deck gets the identical camera of its own, so the screen is a plain 2D layer.
   The box grows around its centre, so the origins and the translate below compensate for the SS× size. */
const SS = 2; // supersampling factor
const LID_H = 398; // lid height: rim 2 + bezel 11 + screen 370 + bezel 13 + rim 2
const SCENE_PERSP = 1400, SCENE_OY = 0.46; // camera distance and its height (46% down the laptop)
function Laptop({ tilt, turn, owner }) {
  // Screen + keyboard are projected by ONE camera, so the owner-view turn looks physically right.
  // Nothing between this root and the deck may set overflow, opacity, filter or will-change (it would flatten the 3D).
  const flat = useTransform(turn, (t) => Math.abs(t) < 0.001);
  const shrink = `scale3d(${0.9 / SS}, ${0.9 / SS}, ${1 / SS})`;
  const sceneTransform = useTransform(turn, (t) => (Math.abs(t) < 0.001 ? shrink : `perspective(${SCENE_PERSP}px) rotateY(${t}deg) ${shrink}`));
  const translate = useTransform(tilt, (d) => `22px ${(SS - 1) * (0.5 - SCENE_OY) * (LID_H + deckH(d))}px`);
  return (
    <motion.div style={{ width: DECK_W * SS, translate, transform: sceneTransform, transformOrigin: `50% ${SCENE_OY * 100}%`, transformStyle: "preserve-3d" }}>
      {/* Lid — aluminium rim */}
      <div
        className="relative rounded-b-[6px] rounded-t-[22px] bg-[linear-gradient(180deg,#8E9197_0%,#6C6F75_45%,#55585E_100%)] p-[2px]"
        style={{ zoom: SS, boxShadow: "0 2px 4px rgba(15,23,42,.12), 0 28px 56px -18px rgba(15,23,42,.42), 0 60px 110px -40px rgba(15,23,42,.30)" }}
      >
        {/* Black glass bezel */}
        <div className="relative rounded-b-[4px] rounded-t-[20px] bg-[#050608] px-[10px] pb-[13px] pt-[11px] shadow-[inset_0_0_0_1px_rgba(255,255,255,.07),inset_0_1px_0_rgba(255,255,255,.12)]">
          {/* Notch + camera */}
          <div className="absolute left-1/2 top-[11px] z-10 flex h-[13px] w-[84px] -translate-x-1/2 items-center justify-center rounded-b-lg bg-[#050608]">
            <span className="h-[5px] w-[5px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#3B4A66,#0B0F18_70%)] ring-1 ring-[#111722]" />
          </div>
          {/* Screen */}
          <div className="relative h-[370px] w-[592px] overflow-hidden rounded-b-[2px] rounded-t-[8px] bg-[#F5F5F5]">
            <MacSafariInvoice />
            {/* Owner app on top: crossfades away like a page navigation */}
            <motion.div className="absolute inset-0 z-[5] overflow-hidden bg-white" style={{ opacity: owner.opacity, scale: owner.scale, visibility: owner.visibility }}>
              <OwnerDesktopApp />
            </motion.div>
            {/* Glass glare + inner edge */}
            <div className="pointer-events-none absolute inset-0 z-[6] bg-[linear-gradient(118deg,rgba(255,255,255,.22)_0%,rgba(255,255,255,.04)_34%,rgba(255,255,255,0)_35%)]" />
            <div className="pointer-events-none absolute inset-0 z-[6] rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(0,0,0,.35),inset_0_0_18px_rgba(0,0,0,.08)]" />
          </div>
        </div>
      </div>
      <KeyboardDeck tilt={tilt} flat={flat} />
    </motion.div>
  );
}

/* ---------- Fallback (swap for your real phone mockup) ---------- */
const PhoneFallback = () => (
  <div className="h-[586px] w-[262px] overflow-hidden rounded-[2rem] border-8 border-slate-900 bg-white shadow-2xl" />
);

/* ---------- Easing + timeline helpers ---------- */
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const seg = (P, a, b) => clamp01((P - a) / (b - a));
const eCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eOut = (t) => 1 - Math.pow(1 - t, 3);
const eSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
const lerp = (a, b, t) => a + (b - a) * t;

/* Owner-view pose of the laptop (stage px). LAP_Y0 is tuned so the bottom of the laptop sits on the
   same horizontal line in both views (the larger scale + steeper keyboard are offset by moving it down). */
const LAP_X0 = -62, LAP_Y0 = 119, LAP_S0 = 1.08;
const LAP_Y1 = 170;
/* Fine-tuned poses (stage px; the stage scales with the column, and the column's right edge IS the container edge,
   so these hold at every width). Laptop transform-origin is 72% 55% of the laptop (LAP_ORIGIN). The dx values are tuned for the 1120 container
   (measured from the lid/deck edges and the phone's outer ring). */
const OWNER = { dx: 88, grow: 0.1235, turn: -10, deck: 79 };          // "You set it": bigger, centered between copy+16px and container edge, turned 10°
const CUSTOMER = { dx: 101, dy: -128, grow: 0.213, deck: 84 };          // "They get it": laptop 21% bigger, higher, 16px from the copy
// 72% 55% of the laptop, expressed in its SS×-size layout box (which grows around its centre)
const LAP_ORIGIN = `${50 + 22 / SS}% ${50 + 5 / SS}%`;
const PHONE = { dx: 66, dy: 190, grow: 0.1025 };                        // phone: right edge on the container edge, standing lower/in front

/* ---------- Main component ---------- */
export default function BillingScrollMorph({ phone, id = "billing" }) {
  const trackRef = useRef(null);

  /* HYBRID: the section stays pinned; crossing a scroll threshold PLAYS the owner→customer
     morph as a timed animation (reverses when scrolling back). Nothing is scroll-linked.
     The section is 132vh tall, i.e. pinned for 32vh of scrolling. A small scroll into the pin
     (ZONE px) triggers the morph, and the page is held just inside the far end of the pin in the
     direction of travel (EDGE px from the end going down, from the start going up). Because the
     section is pinned the jump can't be seen, and once the morph is done the next scroll moves the
     page: no dead scrolling either way. Order: top < holdOut < gIn … gOut < holdIn < end, so the
     pin must be at least 2 × ZONE of scroll — don't make the section shorter. */
  const EDGE = 24; // hold this far inside the pin's edges (absorbs momentum without moving the section)
  const ZONE = 56; // triggers sit beyond the hold points, so holding never re-triggers the other direction
  const MORPH_MS = 900;
  const reduceMotion = useReducedMotion();

  const [phase, setPhase] = useState(0); // 0 = "You set it" (owner), 1 = "They get it" (customer)
  const morph = useMotionValue(0); // 0 → 1, time-driven (linear; each beat below has its own easing)
  const gateRef = useRef({ phase: 0, locked: false, animating: false, holdY: 0, lastInput: 0, bypassUntil: 0 });

  /* SCROLL GATE — the visitor can't scroll past the section (even with a fast fling) until the morph
     has finished. Crossing the trigger moves the page to the far end of the pin and holds it there
     while the morph plays; trackpad inertia is swallowed too. Anchor / nav links (#billing, /#faq …)
     bypass the gate so site navigation always works. Works the same in reverse. */
  useEffect(() => {
    const G = gateRef.current;
    const KEYS = new Set([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"]);
    const jump = (y) => window.scrollTo({ top: y, behavior: "instant" });
    const geo = () => {
      const el = trackRef.current;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const span = Math.max(1, el.offsetHeight - window.innerHeight);
      const end = top + span;
      return {
        top, span, end,
        gIn: top + ZONE, // forward once you're ZONE px into the pin
        gOut: end - ZONE, // reverse once you're ZONE px back from the end
        holdIn: end - EDGE, // forward hold: near the end, but inside the pin
        holdOut: top + EDGE, // reverse hold: near the start, but inside the pin
      };
    };
    const setTo = (target) => {
      G.phase = target;
      setPhase(target);
    };
    // Initial state matches where the page loaded (e.g. refresh mid-page)
    if (window.scrollY > geo().gIn) {
      G.phase = 1;
      morph.set(1);
      setPhase(1);
    }

    let raf = 0;
    const watchRelease = () => {
      // Unlock once the morph is (nearly) done AND input has been quiet for 100ms (kills trackpad momentum)
      if (G.locked && !G.animating && performance.now() - G.lastInput > 100) G.locked = false;
      if (G.locked) raf = requestAnimationFrame(watchRelease);
    };
    const gate = (target, y) => {
      setTo(target);
      G.locked = true;
      G.animating = true;
      G.holdY = y;
      jump(y);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(watchRelease);
    };

    const onScroll = () => {
      if (performance.now() < G.bypassUntil) return;
      if (G.locked) {
        if (Math.abs(window.scrollY - G.holdY) > 1) jump(G.holdY); // also catches scrollbar drags
        return;
      }
      const g = geo();
      if (G.phase === 0 && window.scrollY > g.gIn) gate(1, g.holdIn);
      else if (G.phase === 1 && window.scrollY < g.gOut) gate(0, g.holdOut);
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
        const t = window.scrollY > geo().gIn ? 1 : 0;
        morph.set(t);
        setTo(t);
      }, 1550);
    };
    const onClick = (e) => e.target.closest?.('a[href*="#"]') && bypass();

    // The toggle: play the morph to the chosen view and move the page to the matching point of the
    // pinned section (invisible while it's pinned), so the next scroll doesn't flip it straight back.
    G.goTo = (target) => {
      if (G.phase === target || G.locked) return;
      const g = geo();
      gate(target, target === 1 ? g.holdIn : g.holdOut);
    };

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
      G.goTo = null;
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
      duration: (MORPH_MS / 1000) * Math.max(0.35, dist), // shorter if reversing mid-way
      ease: "linear", // the beats below carry their own easing
      onUpdate: (v) => {
        if (Math.abs(phase - v) < 0.25) G.animating = false; // unlock while the last bits settle
      },
      onComplete: () => (G.animating = false),
    });
    return () => controls.stop();
  }, [phase, morph, reduceMotion]);

  /* ---------- Choreography ----------
     P runs 0.40 → 1.00 over the morph; everything starts the moment the trigger fires:
       0.40–1.00  laptop eases from its owner pose to its customer pose (scale, turn, keyboard tilt)
       0.49–0.73  the screen switches to the customer's invoice + the toggle slides to "They get it"
       0.61–1.00  the phone fades in and rises into place (no overshoot)
       0.40–0.61 / 0.61–0.91  left copy out / in                                                    */
  const P = useTransform(morph, (m) => 0.4 + 0.6 * m);
  const textRef = useRef(null);
  const rightRef = useRef(null);
  const stageRef = useRef(null);


  // Left column
  const t1Opacity = useTransform(P, (v) => 1 - eCubic(seg(v, 0.4, 0.58)));
  const t1Y = useTransform(P, (v) => -40 * eCubic(seg(v, 0.4, 0.61)));
  const t2Opacity = useTransform(P, (v) => eCubic(seg(v, 0.64, 0.88)));
  const t2Y = useTransform(P, (v) => lerp(40, 0, eCubic(seg(v, 0.61, 0.91))));
  const t1Events = useTransform(P, (v) => (v < 0.64 ? "auto" : "none"));
  const t2Events = useTransform(P, (v) => (v < 0.64 ? "none" : "auto"));

  // Screen switch: the owner app crossfades to the customer's invoice page
  const sw = useTransform(P, (v) => eCubic(seg(v, 0.49, 0.73)));
  const ownerOpacity = useTransform(sw, (t) => 1 - t);
  const ownerScale = useTransform(sw, (t) => lerp(1, 1.015, t));
  const ownerVisibility = useTransform(sw, (t) => (t >= 1 ? "hidden" : "visible"));

  // Toggle
  const pillX = useTransform(sw, (k) => `${k * 100}%`);
  const ownerColor = useTransform(sw, [0, 1], ["#ffffff", "#64748B"]);
  const customerColor = useTransform(sw, [0, 1], ["#64748B", "#ffffff"]);

  // Laptop: owner pose → customer pose (same baseline)
  const mv = useTransform(P, (v) => eSine(seg(v, 0.4, 1)));
  const invX = useMotionValue(-105); // customer-view X (measured below)
  // One continuous path: every laptop property is driven by the same progress (mv)
  const lapX = useTransform([mv, invX], ([t, x]) => lerp(LAP_X0, x, t) + lerp(OWNER.dx, CUSTOMER.dx, t));
  const lapY = useTransform(mv, (t) => lerp(LAP_Y0, LAP_Y1, t) + CUSTOMER.dy * t);
  const lapScale = useTransform(mv, (t) => lerp(LAP_S0, 1, t) * (1 + CUSTOMER.grow * t) * (1 + OWNER.grow * (1 - t)));
  const ownerAmt = useTransform(mv, (t) => { const k = 1 - t; return k * k * (3 - 2 * k); }); // smoothstep: 1 owner → 0 customer
  const turn = useTransform(ownerAmt, (e) => OWNER.turn * e);
  const tilt = useTransform(ownerAmt, (e) => lerp(CUSTOMER.deck, OWNER.deck, e));

  // Phone: hidden in the owner view, pops in after the screen switch
  const phoneOpacity = useTransform(P, (v) => eCubic(seg(v, 0.61, 0.82)));
  const phoneY = useTransform(P, (v) => -48 + PHONE.dy + lerp(40, 0, eOut(seg(v, 0.61, 1))));
  const phoneScale = useTransform(P, (v) => lerp(0.86, 0.9, eOut(seg(v, 0.61, 1))) * (1 + PHONE.grow));

  // Scale the device stage to fit the right column (composition is ~760×700 stage px)
  const stageScale = useMotionValue(0.75);
  useLayoutEffect(() => {
    const fit = () => {
      const r = rightRef.current?.getBoundingClientRect();
      if (r) stageScale.set(Math.min(1, r.width / 760, r.height / 700));
    };
    fit();
    const ro = new ResizeObserver(fit);
    rightRef.current && ro.observe(rightRef.current);
    return () => ro.disconnect();
  }, [stageScale]);

  // Push the laptop (customer view) as far left as the copy allows: its front lip stops GAP px from the text.
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
      invX.set(Math.min(-60, Math.max(-230, x)));
    };
    measure();
    document.fonts?.ready.then(measure); // the copy wraps differently once the web font has loaded
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [invX]);

  const center = "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";
  const owner = { opacity: ownerOpacity, scale: ownerScale, visibility: ownerVisibility };

  return (
    <section id={id} ref={trackRef} className="relative h-[132vh] bg-white">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-white">
        <div className="container grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* LEFT — copy */}
          <div className="relative h-[420px] lg:h-[560px]">
            <motion.div style={{ opacity: t1Opacity, y: t1Y, pointerEvents: t1Events }} className="absolute inset-0 flex flex-col justify-center">
              <p className="text-xs font-bold tracking-[.14em] text-slate-500">BILLING ON AUTOPILOT</p>
              <h2 className="mt-3.5 text-4xl font-bold leading-tight tracking-tight text-slate-900">
                Set it once. Every customer billed on their own schedule.
              </h2>
              <p className="mt-4 max-w-[500px] text-[17px] leading-relaxed text-slate-500">
                Give each customer a rate, a first invoice date and a cadence. PoolLogic builds every recurring
                invoice, adds chemicals and card fees, and emails it on the right day — every time. No billing runs.
                No “Send” button.
              </p>
              <Bullets items={SETUP_BULLETS} />
            </motion.div>

            <motion.div ref={textRef} style={{ opacity: t2Opacity, y: t2Y, pointerEvents: t2Events }} className="absolute inset-0 flex flex-col justify-center">
              <p className="text-xs font-bold tracking-[.14em] text-blue-500">THE CUSTOMER EXPERIENCE</p>
              <h2 className="mt-3.5 text-4xl font-bold leading-tight tracking-tight text-slate-900">
                They get a clean invoice — and pay in one tap.
              </h2>
              <p className="mt-4 max-w-[500px] text-[17px] leading-relaxed text-slate-500">
                Every invoice arrives on schedule with a clear breakdown and a Pay now button: card, Apple Pay or ACH
                through Stripe. Receipts and service history are always there when they need them.
              </p>
              <Bullets items={RESULT_BULLETS} />
            </motion.div>
          </div>

          {/* RIGHT — devices (scaled down on smaller screens) */}
          <div ref={rightRef} className="relative h-[520px] [perspective:1600px] lg:h-[640px]">
            {/* "You set it | They get it" toggle — fixed position in both views; clicking plays the morph */}
            <div className="absolute left-1/2 top-6 z-[70] flex -translate-x-1/2 rounded-full border border-slate-900/[.07] bg-white/80 p-1 text-[12.5px] font-semibold tracking-[-.1px] shadow-[0_1px_2px_rgba(15,23,42,.06),0_10px_28px_-12px_rgba(15,23,42,.3)] backdrop-blur-md">
              <motion.span style={{ x: pillX }} className="absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-full bg-slate-900" />
              <motion.button
                type="button"
                aria-pressed={phase === 0}
                onClick={() => gateRef.current.goTo?.(0)}
                style={{ color: ownerColor }}
                className="relative flex w-[124px] cursor-pointer items-center justify-center gap-1.5 rounded-full py-[9px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" /></svg>
                You set it
              </motion.button>
              <motion.button
                type="button"
                aria-pressed={phase === 1}
                onClick={() => gateRef.current.goTo?.(1)}
                style={{ color: customerColor }}
                className="relative flex w-[124px] cursor-pointer items-center justify-center gap-1.5 rounded-full py-[9px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
                They get it
              </motion.button>
            </div>

            <motion.div ref={stageRef} className="absolute inset-0 origin-center" style={{ scale: stageScale }}>
              {/* Laptop: owner app → customer invoice */}
              <div className={center} style={{ zIndex: 10 }}>
                <motion.div style={{ x: lapX, y: lapY, scale: lapScale, transformOrigin: LAP_ORIGIN }}>
                  <Laptop tilt={tilt} turn={turn} owner={owner} />
                </motion.div>
              </div>

              {/* Phone: customer invoice, pops in after the switch */}
              <div className={center} style={{ zIndex: 30 }}>
                <motion.div
                  style={{ x: 180 + PHONE.dx, y: phoneY, scale: phoneScale, opacity: phoneOpacity }}
                  className="will-change-transform [filter:drop-shadow(0_1px_1.5px_rgba(15,23,42,.22))_drop-shadow(0_10px_14px_rgba(15,23,42,.18))_drop-shadow(0_30px_40px_rgba(15,23,42,.20))]"
                >
                  {phone ?? <PhoneFallback />}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
