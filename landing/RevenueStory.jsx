/* RevenueStory.jsx — scroll story for the Revenue Protection section (#collections).
   The original section stays as-is (header, the three feature columns, the dashboard frame).
   While you scroll, the features row + dashboard pin in place and the app "plays":
     Beat 1  Nothing Slips Through the Cracks   dashboard: "Invoices past due" highlights, "Overdue notices sent" toast
     Beat 2  Late Fees on Autopilot          cursor clicks Settings → Settings ▸ Billing, turns on
                                             "Charge late fees" then "Auto-apply late fees"
     Beat 3  Automatic Pause & Resume        page scrolls to Overdue, turns on "Automatic pause"
                                             (Chemical costs is visible below but never touched)
   Each feature column gets a red progress bar and lights up during its beat.

   Usage (inside the existing section component) — see IDE_PROMPT_revenue_story.md:
     const sectionRef = useRef(null);
     useRevenueStory(sectionRef);
     <section ref={sectionRef} id="collections" className="rv section">
       <RevenueStoryStyles />
       …head…
       <div className="rvs-track"><div className="rvs-sticky">
         <div className="rv-features">…each .rv-feature starts with <FeatureBar />…</div>
         <div className="rv-snippet"><div className="rv-frame">
           <aside className="rv-side">…</aside>
           <div className="rv-main">
             <div className="rvs-dash">…existing dashboard content… <OverdueToast /></div>
             <RevenueSettingsLayer />
           </div>
           <StoryCursor />
         </div></div>
       </div></div>
     </section>
*/
import { useEffect } from "react";

const CSS = `
.rvs-track{position:relative}
  .rvs-sticky{position:sticky;transform-origin:50% 0;padding-top:26px}
  @media (max-width:1023px){.rvs-track{height:auto!important}.rvs-sticky{position:static;transform:none!important;margin:0!important;padding-top:0}.rvs-sticky .rv-snippet{margin-top:72px}.rvs-set,.rvs-cur,.rvs-bar,.rvs-toast{display:none}.rv-feature.rvs-dim{opacity:1}}
  @media (prefers-reduced-motion:reduce){.rvs-cur{display:none}}
  .rvs-sticky .rv-snippet{margin-top:44px}
  .rv-feature{position:relative;transition:opacity .45s ease}
  .rv-feature.rvs-dim{opacity:.38}
  .rvs-bar{position:absolute;left:0;right:28px;top:-18px;height:2px;border-radius:2px;background:rgba(255,255,255,.08);overflow:hidden}
  .rvs-bar>i{position:absolute;inset:0;transform-origin:0 50%;transform:scaleX(0);background:#FF0036;border-radius:2px}
  .rv-main{position:relative;overflow:hidden}
  .rvs-dash{transform-origin:50% 35%;will-change:transform,opacity,filter}
  .rvs-set{position:absolute;inset:0;opacity:0;pointer-events:none;display:flex;font-family:Inter,ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased;color:#fff;border-radius:inherit;background:rgb(19,21,27)}
  .rvs-snav{width:190px;flex:none;padding:30px 12px;border-right:1px solid rgba(255,255,255,.05)}
  .rvs-snav h4{margin:0 10px;font-size:17px;font-weight:600;letter-spacing:-.3px}
  .rvs-snav small{display:block;margin:18px 10px 6px;font-size:11px;font-weight:600;color:rgba(226,232,240,.5);letter-spacing:.07em}
  .rvs-snav div{height:32px;border-radius:8px;display:flex;align-items:center;gap:10px;padding:0 10px;font-size:13px;font-weight:500;color:rgba(226,232,240,.7)}
  .rvs-snav div.on{background:rgba(255,255,255,.06);color:#fff}
  .rvs-snav svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
  .rvs-body{position:relative;flex:1;overflow:hidden}
  .rvs-scroll{padding:30px 40px 40px 36px;will-change:transform}
  .rvs-body h3{margin:0;font-size:20px;font-weight:600;letter-spacing:-.35px}
  .rvs-body .sub{margin-top:3px;font-size:12.5px;color:rgba(203,213,225,.62)}
  .rvs-body h5{margin:22px 0 2px;font-size:14px;font-weight:600;letter-spacing:-.14px}
  .rvs-row{display:flex;align-items:center;gap:28px;padding:10px 0;transition:opacity .4s ease}
  .rvs-row.dim{opacity:.4}
  .rvs-row .l{flex:1;min-width:0}
  .rvs-row .t{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500;letter-spacing:-.16px}
  .rvs-row .d{margin-top:3px;font-size:12.5px;line-height:1.45;color:rgba(203,213,225,.62);max-width:330px}
  .rvs-row .c{width:250px;flex:none;display:flex;justify-content:flex-end}
  .rvs-field{width:100%;height:34px;border-radius:8px;background:rgba(148,163,184,.09);display:flex;align-items:center;gap:8px;padding:0 12px;font-size:13px}
  .rvs-field em{font-style:normal;color:rgba(203,213,225,.6)}
  .rvs-sw{position:relative;width:38px;height:22px;border-radius:999px;background:#475569;transition:background-color .3s ease;flex:none}
  .rvs-sw i{position:absolute;left:2px;top:2px;width:18px;height:18px;border-radius:999px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .5s cubic-bezier(.34,1.56,.64,1)}
  .rvs-sw.on{background:#2676B6}
  .rvs-sw.on i{transform:translateX(16px)}
  .rvs-sw b{position:absolute;inset:0;border-radius:999px;box-shadow:0 0 0 2px #2676B6;opacity:0;pointer-events:none}
  .rvs-sw.on b{animation:rvsPulse .9s ease-out .1s}
  @keyframes rvsPulse{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(1.9)}}
  .rvs-cur{position:absolute;left:0;top:0;width:22px;height:22px;z-index:30;pointer-events:none;opacity:0;filter:drop-shadow(0 2px 3px rgba(0,0,0,.5));will-change:transform}
  .rvs-ring{position:absolute;left:-14px;top:-14px;width:28px;height:28px;border-radius:999px;border:2px solid rgba(255,255,255,.85);opacity:0}
  .rvs-ring.go{animation:rvsRing .55s ease-out}
  @keyframes rvsRing{0%{opacity:.9;transform:scale(.3)}100%{opacity:0;transform:scale(1.5)}}
  .rvs-btn{height:32px;padding:0 14px;border-radius:8px;background:rgba(148,163,184,.12);display:inline-flex;align-items:center;font-size:13px;font-weight:500}
  .rvs-toast{position:absolute;right:36px;top:28px;display:flex;gap:12px;align-items:center;padding:12px 16px 12px 12px;border-radius:12px;background:rgb(30,32,40);border:1px solid rgba(255,255,255,.09);box-shadow:0 18px 40px -12px rgba(0,0,0,.6);font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#fff;opacity:0;transform:translateY(-10px);transition:opacity .35s ease,transform .5s cubic-bezier(.34,1.56,.64,1)}
  .rvs-toast.show{opacity:1;transform:none}
  .rvs-toast .ic{width:30px;height:30px;border-radius:999px;background:#2676B6;display:flex;align-items:center;justify-content:center;flex:none}
  .rvs-toast b{display:block;font-size:13.5px;font-weight:600}
  .rvs-toast span:not(.ic){display:block;font-size:12px;color:rgba(203,213,225,.65);margin-top:1px}
  .rv-rows li{transition:background-color .4s ease;border-radius:8px}
  .rv-rows li.rvs-hl{background:rgba(255,0,54,.1)}
  .rv-nav{transition:background-color .25s ease,color .25s ease}
  .rv-nav.rvs-hover{background:rgba(255,255,255,.05)}
`;

export function RevenueStoryStyles() {
  return <style>{CSS}</style>;
}

export function FeatureBar() {
  return (
    <span className="rvs-bar" aria-hidden>
      <i />
    </span>
  );
}

export function StoryCursor() {
  return (
    <div className="rvs-cur" aria-hidden>
      <span className="rvs-ring" />
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path d="M5 2.5v17.2l4.3-4.1 2.8 6.4 3.1-1.4-2.8-6.3 6-.3z" fill="#fff" stroke="#111" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ---------- Settings ▸ Billing (dark app replica) ---------- */
const ICONS = {
  gen: <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1" />,
  bill: (<><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M2.5 10h19" /></>),
  plan: (<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5M16 4.8a3.5 3.5 0 0 1 0 6.4M18.5 14.8c1.6.8 2.6 2.6 3 5.2" /></>),
  brand: (<><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-1.4-1.2-1.8-1.2-3 0-1 .8-1.6 1.8-1.6H17a4 4 0 0 0 4-4C21 6.4 17 3 12 3z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10" cy="7" r="1" /><circle cx="15" cy="7.5" r="1" /></>),
  doc: (<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>),
  int: (<><rect x="3" y="12" width="9" height="9" rx="1.5" /><rect x="12" y="12" width="9" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><path d="M3 12V6.5A1.5 1.5 0 0 1 4.5 5H10" /></>),
  acct: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="10" r="3" /><path d="M6.7 18.4c1.2-1.8 3.1-2.9 5.3-2.9s4.1 1.1 5.3 2.9" /></>),
  info: (<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>),
  chev: <path d="m6 9 6 6 6-6" />,
};
const Ico = ({ k, size = 15 }) => (
  <svg viewBox="0 0 24 24" style={{ width: size, height: size, stroke: "currentColor", fill: "none", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" }}>
    {ICONS[k]}
  </svg>
);
const Row = ({ t, d, c, cls = "", info }) => (
  <div className={`rvs-row ${cls}`}>
    <div className="l">
      <div className="t">
        {t}
        {info && <span style={{ color: "rgba(203,213,225,.5)", display: "inline-flex" }}><Ico k="info" size={13} /></span>}
      </div>
      <div className="d">{d}</div>
    </div>
    <div className="c">{c}</div>
  </div>
);
const Field = ({ v, pre, chev }) => (
  <div className="rvs-field">
    {pre && <em>{pre}</em>}
    <span style={{ flex: 1 }}>{v}</span>
    {chev && <span style={{ color: "rgba(203,213,225,.7)", display: "inline-flex" }}><Ico k="chev" size={14} /></span>}
  </div>
);
const Switch = ({ id }) => (
  <span className="rvs-sw" data-sw={id}>
    <b />
    <i />
  </span>
);
/** "Overdue notices sent" toast — render inside .rvs-dash (on the dashboard). */
export function OverdueToast() {
  return (
    <div className="rvs-toast" aria-hidden>
      <span className="ic">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></svg>
      </span>
      <div>
        <b>Overdue notices sent</b>
        <span>3 customers · reminders went out automatically</span>
      </div>
    </div>
  );
}

export function RevenueSettingsLayer() {
  return (
    <div className="rvs-set" aria-hidden>
      <div className="rvs-snav">
        <h4>Settings</h4>
        <small>BUSINESS</small>
        <div><Ico k="gen" />General</div>
        <div className="on"><Ico k="bill" />Billing</div>
        <div><Ico k="plan" />Plan</div>
        <div><Ico k="brand" />Branding</div>
        <div><Ico k="doc" />Documents</div>
        <div><Ico k="int" />Integrations</div>
        <small style={{ marginTop: 22 }}>YOU</small>
        <div><Ico k="acct" />Account</div>
      </div>
      <div className="rvs-body">
        <div className="rvs-scroll">
          <h3>Billing</h3>
          <div className="sub">How you get paid, and what you add on top of the work.</div>
          <h5>Rates and fees</h5>
          <Row info t="Card processing fee" d="Added to credit card payments, never debit. Maximum 3% (the Visa/Mastercard cap)." c={<Field v="2.9" />} />
          <h5 style={{ marginTop: 26 }} data-rvs="late">Late fees</h5>
          <Row info t="Charge late fees" d="Add a fee to invoices that go past due. Nothing already overdue is charged." c={<Switch id="late" />} />
          <Row cls="dep-late dim" t="Fee type" d="A fixed dollar amount per invoice." c={<Field v="Flat amount ($)" chev />} />
          <Row cls="dep-late dim" t="Fee amount" d="e.g. 25 = $25.00 flat fee" c={<Field v="25" pre="$" />} />
          <Row cls="dep-late dim" t="Grace period" d="Days past the due date before a fee applies. 0 for none." c={<Field v="10" />} />
          <Row cls="dep-late dim" t="Auto-apply late fees" d="Applied in the daily billing run once the grace period is up. Off, you add them by hand." c={<Switch id="auto" />} />
          <h5 style={{ marginTop: 26 }} data-rvs="overdue">Overdue</h5>
          <Row info t="Automatic pause" d="Customers who stop paying are paused for you, billing and service, and resume by themselves once they pay. The route slot is held." c={<Switch id="pause" />} />
          <Row cls="dep-pause dim" t="Pause after" d="How many days past due an invoice can get before its customer is paused." c={<Field v="30" />} />
          {/* Shown for realism; the story never interacts with it. */}
          <h5 style={{ marginTop: 26 }}>Chemical costs</h5>
          <Row t="Chemical pricing" d="Per-unit cost of what goes in the water." c={<span className="rvs-btn">Manage</span>} />
          <div style={{ height: 60 }} />
        </div>
      </div>
    </div>
  );
}

/* ---------- The scroll engine ----------
   Imperative on purpose: one rAF loop writes transforms/classes directly, so scrolling never re-renders React. */
const BEATS = [[0, 0.3], [0.3, 0.62], [0.62, 1]];
const CLICKS = [0.4, 0.525, 0.585, 0.715];
const clamp = (v) => Math.max(0, Math.min(1, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

export function useRevenueStory(sectionRef, enabled = true) {
  useEffect(() => {
    const S = sectionRef.current;
    if (!S || !enabled) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = (s) => S.querySelector(s);
    const track = q(".rvs-track"), sticky = q(".rvs-sticky"), frame = q(".rv-frame");
    const dash = q(".rvs-dash"), set = q(".rvs-set"), scrollEl = q(".rvs-scroll");
    const navs = [...S.querySelectorAll(".rv-side .rv-nav")];
    const navSettings = navs.find((n) => n.textContent.trim() === "Settings");
    const navDash = navs.find((n) => n.textContent.trim() === "Dashboard");
    const feats = [...S.querySelectorAll(".rv-feature")];
    const swLate = q('[data-sw="late"]'), swAuto = q('[data-sw="auto"]'), swPause = q('[data-sw="pause"]');
    const lateH = q('[data-rvs="late"]'), overdueH = q('[data-rvs="overdue"]'), pauseAfterRow = q(".dep-pause");
    const toast = q(".rvs-toast"), pastDueRow = S.querySelectorAll(".rv-rows li")[1]; // "Invoices past due" row
    const cur = q(".rvs-cur"), ring = q(".rvs-ring");
    if (!track || !sticky || !frame || !dash || !set || !navSettings || !navDash) return;

    const pt = (el, fx = 0.5, fy = 0.5) => {
      const f = frame.getBoundingClientRect(), r = el.getBoundingClientRect(), k = f.width / frame.offsetWidth || 1;
      return [(r.left + r.width * fx - f.left) / k, (r.top + r.height * fy - f.top) / k];
    };
    const WAY = [
      [0.22, () => [frame.offsetWidth * 0.62, frame.offsetHeight * 0.72]],
      [0.37, () => pt(navSettings, 0.35, 0.55)],
      [0.47, () => pt(navSettings, 0.35, 0.55)],
      [0.51, () => pt(swLate, 0.55, 0.6)],
      [0.54, () => pt(swLate, 0.55, 0.6)],
      [0.575, () => pt(swAuto, 0.55, 0.6)],
      [0.6, () => pt(swAuto, 0.55, 0.6)],
      [0.69, () => pt(swPause, 0.55, 0.6)],
      [0.74, () => pt(swPause, 0.55, 0.6)],
      [0.84, () => pt(pauseAfterRow, 0.3, 0.9)],
      [1, () => pt(pauseAfterRow, 0.3, 0.9)],
    ];
    const state = { late: false, auto: false, pause: false, toast: false };
    let scaleNow = 1, topNow = 0, sp = 0, last = -1, raf = 0, active = false;

    function layout() {
      active = mq.matches;
      sticky.style.transform = "";
      sticky.style.marginBottom = "";
      if (!active) { track.style.height = ""; sticky.style.top = ""; return; }
      const h = sticky.offsetHeight, vh = window.innerHeight;
      scaleNow = Math.min(1, (vh - 32) / h);
      topNow = Math.max(16, (vh - h * scaleNow) / 2);
      sticky.style.top = topNow + "px";
      if (scaleNow < 1) {
        sticky.style.transform = `scale(${scaleNow})`;
        sticky.style.marginBottom = `${-(h * (1 - scaleNow))}px`;
      }
      track.style.height = h * scaleNow + vh * 1.9 + "px"; // ≈ 1.9 screens of scroll for the story
    }
    function progress() {
      const r = track.getBoundingClientRect();
      const run = track.offsetHeight - sticky.offsetHeight * scaleNow;
      return clamp(-(r.top - topNow) / Math.max(1, run));
    }
    function click() {
      ring.classList.remove("go");
      void ring.offsetWidth;
      ring.classList.add("go");
    }
    function render(p, prev) {
      const beat = p < BEATS[1][0] ? 0 : p < BEATS[2][0] ? 1 : 2;
      feats.forEach((f, i) => {
        f.classList.toggle("rvs-dim", i !== beat);
        const bar = f.querySelector(".rvs-bar>i");
        if (bar) bar.style.transform = `scaleX(${seg(p, BEATS[i][0], BEATS[i][1] - 0.02)})`;
      });
      navSettings.classList.toggle("rvs-hover", p > 0.36 && p < 0.4);
      const onSet = p >= 0.4;
      navSettings.classList.toggle("is-active", onSet);
      navDash.classList.toggle("is-active", !onSet);
      // dashboard → settings ("click" into Settings)
      const z = ease(seg(p, 0.4, 0.5));
      dash.style.transform = `scale(${1 + 0.08 * z})`;
      dash.style.opacity = String(1 - z);
      dash.style.filter = z > 0.001 ? `blur(${6 * z}px)` : "";
      const zi = ease(seg(p, 0.42, 0.52));
      set.style.opacity = String(zi);
      set.style.transform = `scale(${0.97 + 0.03 * zi})`;
      // beat 1: overdue notices go out
      const showToast = p >= 0.1;
      if (toast && showToast !== state.toast) {
        state.toast = showToast;
        toast.classList.toggle("show", showToast);
      }
      if (pastDueRow) pastDueRow.classList.toggle("rvs-hl", p > 0.06 && p < 0.4);
      // switches + dependent fields
      const late = p >= 0.525, auto = p >= 0.585, pause = p >= 0.715;
      if (auto !== state.auto) {
        state.auto = auto;
        swAuto.classList.toggle("on", auto);
      }
      if (late !== state.late) {
        state.late = late;
        swLate.classList.toggle("on", late);
        set.querySelectorAll(".dep-late").forEach((r) => r.classList.toggle("dim", !late));
      }
      if (pause !== state.pause) {
        state.pause = pause;
        swPause.classList.toggle("on", pause);
        set.querySelectorAll(".dep-pause").forEach((r) => r.classList.toggle("dim", !pause));
      }
      // page scroll inside the app: Late fees to the top (so Auto-apply is visible), then Overdue
      const toLate = lateH.offsetTop - 24, toOverdue = overdueH.offsetTop - 110;
      const sy = lerp(lerp(0, toLate, ease(seg(p, 0.545, 0.57))), toOverdue, ease(seg(p, 0.62, 0.67)));
      scrollEl.style.transform = `translateY(${-sy}px)`;
      // cursor
      let x, y;
      if (p <= WAY[0][0]) [x, y] = WAY[0][1]();
      else {
        let i = WAY.findIndex((w) => w[0] >= p);
        if (i < 0) i = WAY.length - 1;
        const [a, fa] = WAY[i - 1] || WAY[0], [b, fb] = WAY[i];
        const t = ease(seg(p, a, b)), A = fa(), B = fb();
        x = lerp(A[0], B[0], t);
        y = lerp(A[1], B[1], t);
      }
      cur.style.opacity = String(seg(p, 0.2, 0.25) * (1 - seg(p, 0.8, 0.86)));
      cur.style.transform = `translate(${x - 5}px,${y - 3}px)`;
      if (prev >= 0) CLICKS.forEach((c) => { if (prev < c && p >= c) click(); });
    }
    function tick() {
      if (active) {
        const target = progress();
        sp = reduce ? target : sp + (target - sp) * 0.14; // spring-like smoothing
        if (Math.abs(target - sp) < 0.0004) sp = target;
        if (sp !== last) { render(sp, last); last = sp; }
      }
      raf = requestAnimationFrame(tick);
    }
    layout();
    render(0, -1);
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", layout);
    mq.addEventListener("change", layout);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
      mq.removeEventListener("change", layout);
    };
  }, [sectionRef, enabled]);
}
