import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowLeft, BanknoteX, Calendar, Check, ChevronDown, Clock, Info, Loader2, Mail, Receipt, Upload,
} from 'lucide-react';

// A copy of the app's Import customers screen (poollogic-web-app:
// customer-import/CustomerImportPage.tsx, import-kit/UploadCard.tsx,
// customer-import/steps/PreviewStep.tsx and BillingSetupStep.tsx), playing a
// fake import on a loop: a file is dropped, a column and two cells are
// fixed, billing is set, and the customers are imported. Laid out at a 1040px
// design width and scaled down to fit narrower screens. Decorative: nothing
// in it is a control. All names, figures and menu options are MOCK data.

const DESIGN_W = 1040;
const STEPS = ['Upload your spreadsheet', 'Automatic import', 'Review before saving'];
const WORKS_WITH = ['QuickBooks', 'Jobber', 'Skimmer', 'Excel', 'Google Sheets', 'Numbers'];

const ROWS = [
  { first: 'Avery', last: 'Collins', street: '2148 Tramway Ln NE', city: 'Albuquerque' },
  { first: 'Marisol', last: 'Vega', street: '412 Loma Larga Rd', city: 'Corrales' },
  { first: 'Derek', last: 'Holloway', street: '8812 Osuna Rd NE', city: 'Albuquerque' },
  { first: 'Priya', last: 'Raman', street: '2270 Cabezon Blvd', city: 'Rio Rancho' },
  { first: 'Tom', last: 'Castelano', street: '903 Montaño Rd NW', city: 'Albuquerque' },
];

const COLUMNS = [
  { key: 'first', label: 'First Name', note: 'from “Fn”', w: 130 },
  { key: 'last', label: 'Last Name', note: 'from “Ln”', w: 140 },
  { key: 'type', label: 'Type', note: 'not in your file', w: 160 },
  { key: 'biz', label: 'Business name', note: 'not in your file', w: 150 },
  { key: 'street', label: 'Address', note: 'from “Svc Addr”', w: 190 },
  { key: 'city', label: 'City', note: 'from “City”', w: 130 },
];

const ADDRESS_SOURCES = ['Svc Addr', 'Billing Addr', 'Mailing Address'];
const TYPES = ['Home', 'Vacation rental', 'HOA / community', 'Apartments', 'Condo', 'Hotel / resort', 'Gym / club', 'School', 'City / municipal', 'Other commercial'];
const TERMS = ['Due upon receipt', 'Net 7 — 7 days', 'Net 15 — 15 days', 'Net 30 — 30 days'];

const INITIAL = {
  step: 1,
  dropHover: false,
  addrOpen: false,
  editing: false,
  tomLast: 'Castelano',
  typeOpen: false,
  typeHover: null,
  marisolType: 'Home',
  pressContinue: false,
  dateFocus: false,
  dateSelected: false,
  date: '11/01/2026',
  summaryDate: 'Nov 1',
  flash: false,
  termsOpen: false,
  termsHover: null,
  terms: 'Net 15 — 15 days',
  importing: 'idle', // idle | busy | done
  toast: false,
};

const START = { x: 1080, y: 520 };
const CANCELLED = Symbol('cancelled');

/** The fake pointer: black arrow, white edge; optionally carrying a CSV file. */
function Pointer({ cursor }) {
  return (
    <div
      className={`demo-pointer${cursor.visible ? ' is-on' : ''}${cursor.press ? ' is-press' : ''}`}
      style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)`, transitionDuration: `${cursor.dur}ms, 250ms` }}
    >
      <svg className="demo-pointer-arrow" width="22" height="24" viewBox="0 0 22 24">
        <path d="M2 2 L2 19 L6.5 14.8 L9.6 21.6 L12.6 20.3 L9.6 13.6 L15.6 13.6 Z" fill="#000" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      {cursor.carrying && (
        <svg className="demo-pointer-file" width="30" height="38" viewBox="0 0 30 38">
          <path d="M3 1.5 H19 L28.5 11 V35 a1.5 1.5 0 0 1 -1.5 1.5 H3 A1.5 1.5 0 0 1 1.5 35 V3 A1.5 1.5 0 0 1 3 1.5 Z" fill="#fff" stroke="#cbd2da" />
          <path d="M19 1.5 V9.5 a1.5 1.5 0 0 0 1.5 1.5 H28.5" fill="#eef1f4" stroke="#cbd2da" />
          <path d="M7 16 H23 M7 20 H23 M7 24 H18" stroke="#dde2e8" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="0" y="27" width="19" height="9" rx="2" fill="#16a34a" />
          <text x="9.5" y="33.6" textAnchor="middle" fontSize="6.4" fontWeight="700" fill="#fff" fontFamily="Inter, system-ui, sans-serif">CSV</text>
        </svg>
      )}
    </div>
  );
}

/** A native-style (macOS) select menu: check in the left gutter, blue highlight. */
function NativeMenu({ at, options, value, hover }) {
  if (!at) return null;
  return (
    <div className="demo-native" style={{ left: at.x, top: at.y, minWidth: at.w }}>
      {options.map((o) => (
        <div key={o} data-t={`opt-${o}`} className={`demo-native-opt${hover === o ? ' is-hover' : ''}`}>
          <span className="demo-native-check">{value === o && <Check size={12} strokeWidth={2.6} />}</span>
          {o}
        </div>
      ))}
    </div>
  );
}

function Stepper({ step }) {
  return (
    <ol className="demo-steps">
      {STEPS.map((label, i) => (
        <li key={label} className={`demo-step${i + 1 === step ? ' is-current' : ''}`}>
          <span className="demo-step-num">{i + 1}</span>
          {label}
        </li>
      ))}
    </ol>
  );
}

function UploadScene({ s }) {
  return (
    <div className="demo-upload">
      <div className={`demo-drop${s.dropHover ? ' is-hover' : ''}`}>
        <div className="demo-drop-title">Bring the spreadsheet you already use.</div>
        <div className="demo-drop-sub">From CSV, Excel, Skimmer, Pool Brain or QuickBooks. Messy is fine.</div>
        <div className="demo-drop-actions">
          <span className="demo-choose" data-t="choose"><Upload size={14} strokeWidth={2} /> Choose file</span>
          <span className="demo-drop-or">or drop it here</span>
        </div>
        <div className="demo-time"><Clock size={13} strokeWidth={2} /> Usually under 2 minutes · Nothing is saved until you review it</div>
        <div className="demo-works">
          <span className="demo-works-label">Works with</span>
          {WORKS_WITH.join(' · ')}
        </div>
      </div>
      <p className="demo-template">No spreadsheet yet? <u>Download a blank template</u></p>
    </div>
  );
}

function ReviewScene({ s }) {
  const cell = (r, i, key) => {
    if (key === 'type') {
      const v = i === 1 ? s.marisolType : 'Home';
      return (
        <span className="demo-select" data-t={i === 1 ? 'type-marisol' : undefined}>
          {v} <ChevronDown size={13} strokeWidth={2} />
        </span>
      );
    }
    if (key === 'biz') return <span className="demo-empty">—</span>;
    if (key === 'last' && i === 4) {
      return (
        <span data-t="tom-last">
          {s.tomLast}
          {s.editing && <span className="demo-caret" />}
        </span>
      );
    }
    return r[key];
  };
  return (
    <div className="demo-review">
      <p className="demo-review-note">
        5 customers — click any cell to fix it. Click a column’s name to change which of your columns fills it.
        <Info size={14} strokeWidth={1.75} className="demo-info" />
      </p>
      <div className="demo-table-wrap">
        <table className="demo-table">
          <thead>
            <tr>
              <th className="demo-th-active">Active</th>
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  style={{ width: c.w }}
                  className={c.key === 'street' && s.addrOpen ? 'is-open' : undefined}
                  data-t={c.key === 'street' ? 'addr-head' : undefined}
                >
                  <span className="demo-th-label">{c.label} <ChevronDown size={13} strokeWidth={1.75} /></span>
                  <span className="demo-th-note">{c.note}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.first} className="demo-row" style={{ '--i': i }}>
                <td className="demo-td-active"><span className="demo-check"><Check size={12} strokeWidth={3} /></span></td>
                {COLUMNS.map((c) => (
                  <td key={c.key} className={c.key === 'last' && i === 4 && s.editing ? 'is-editing' : undefined}>
                    {cell(r, i, c.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BillingScene({ s }) {
  return (
    <div className="demo-billing">
      <p className="demo-lead">Choose how these customers are billed.</p>
      <div className="demo-options">
        <div className="demo-option is-on">
          <span className="demo-option-icon is-blue"><Receipt size={17} strokeWidth={1.9} /></span>
          <span className="demo-option-text"><b>Bill them</b><span>Invoices go out on a schedule</span></span>
          <span className="demo-radio is-on" />
        </div>
        <div className="demo-option">
          <span className="demo-option-icon"><BanknoteX size={17} strokeWidth={1.9} /></span>
          <span className="demo-option-text"><b>Don’t bill yet</b><span>Set up billing per customer later</span></span>
          <span className="demo-radio" />
        </div>
      </div>

      <div className="demo-fields">
        <label className="demo-field">
          <span className="demo-label">First invoice date <Info size={13} strokeWidth={1.75} /></span>
          <span className={`demo-input${s.dateFocus ? ' is-focus' : ''}`} data-t="date">
            <Calendar size={15} strokeWidth={1.75} />
            <span className={s.dateSelected ? 'demo-selected' : undefined}>{s.date}</span>
            {s.dateFocus && !s.dateSelected && <span className="demo-caret" />}
          </span>
          <span className="demo-hint">Or a date your spreadsheet gives</span>
        </label>
        <label className="demo-field">
          <span className="demo-label">Billing cycle <Info size={13} strokeWidth={1.75} /></span>
          <span className="demo-input is-select">Monthly <ChevronDown size={14} strokeWidth={2} /></span>
        </label>
        <label className="demo-field">
          <span className="demo-label">Payment terms</span>
          <span className={`demo-input is-select${s.termsOpen ? ' is-focus' : ''}`} data-t="terms">{s.terms} <ChevronDown size={14} strokeWidth={2} /></span>
          <span className="demo-hint">Days after invoice is sent before payment is due</span>
        </label>
        <div className="demo-field">
          <span className="demo-label">Extras</span>
          <span className="demo-extra"><span className="demo-box" /> Add chemicals to invoice <Info size={13} strokeWidth={1.75} /></span>
          <span className="demo-extra is-disabled"><span className="demo-box" /> CC surcharge exempt</span>
        </div>
      </div>

      <div className="demo-summary">
        <Mail size={15} strokeWidth={1.9} />
        <span>
          On <b className={s.flash ? 'is-flash' : undefined}>{s.summaryDate}</b>, 5 customers are emailed invoices totalling <b>$750.00</b> automatically.
        </span>
      </div>
    </div>
  );
}

export default function ImportDemo() {
  const fitRef = useRef(null);
  const rootRef = useRef(null);
  const scaleRef = useRef(1);
  const visible = useRef(true);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(null);
  const [s, setS] = useState(INITIAL);
  const [cursor, setCursor] = useState({ ...START, visible: false, dur: 0, press: false, carrying: true });
  const [menus, setMenus] = useState({ addr: null, type: null, terms: null });
  const [reduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const set = useCallback((p) => setS((prev) => ({ ...prev, ...p })), []);

  // Scale the 1040px design to the column.
  useLayoutEffect(() => {
    const fit = fitRef.current;
    const root = rootRef.current;
    if (!fit || !root) return undefined;
    const apply = () => {
      const sc = Math.min(1, fit.clientWidth / DESIGN_W);
      scaleRef.current = sc;
      setScale(sc);
      setHeight(root.offsetHeight * sc);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(fit);
    return () => ro.disconnect();
  }, []);

  // The timeline.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (reduced) {
      setS({ ...INITIAL, step: 2, tomLast: 'Castellano' });
      return undefined;
    }
    let cancelled = false;
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; });
    io.observe(root);

    /** Waits `ms`, but only counts time while the demo is on screen. */
    const wait = (ms) => new Promise((resolve, reject) => {
      let left = ms;
      let last = performance.now();
      const tick = () => {
        if (cancelled) { reject(CANCELLED); return; }
        const now = performance.now();
        if (visible.current) left -= now - last;
        last = now;
        if (left <= 0) resolve();
        else setTimeout(tick, Math.min(left, 60));
      };
      tick();
    });
    const pointAt = (t, ox = 0.5, oy = 0.5) => {
      const el = root.querySelector(`[data-t="${t}"]`);
      if (!el) return START;
      const r = el.getBoundingClientRect();
      const b = root.getBoundingClientRect();
      const sc = scaleRef.current;
      return { x: (r.left - b.left + r.width * ox) / sc - 3, y: (r.top - b.top + r.height * oy) / sc - 2 };
    };
    const menuAt = (t, gap = 4) => {
      const el = root.querySelector(`[data-t="${t}"]`);
      const r = el.getBoundingClientRect();
      const b = root.getBoundingClientRect();
      const sc = scaleRef.current;
      return { x: (r.left - b.left) / sc, y: (r.bottom - b.top) / sc + gap, w: r.width / sc };
    };
    const move = async (t, dur = 750, ox, oy) => {
      setCursor((c) => ({ ...c, ...pointAt(t, ox, oy), dur, visible: true }));
      await wait(dur + 40);
    };
    const click = async () => {
      setCursor((c) => ({ ...c, press: true }));
      await wait(130);
      setCursor((c) => ({ ...c, press: false }));
    };
    const type = async (from, to, setter, ms = 85) => {
      let text = from;
      while (!to.startsWith(text)) { text = text.slice(0, -1); setter(text); await wait(70); }
      for (const ch of to.slice(text.length)) { text += ch; setter(text); await wait(ms); }
    };

    const run = async () => {
      for (;;) {
        // ---- reset ----
        setS(INITIAL);
        setMenus({ addr: null, type: null, terms: null });
        setCursor({ ...START, visible: false, dur: 0, press: false, carrying: true });
        await wait(700);

        // ---- 1. Upload: the file is carried to Choose file and dropped ----
        setCursor((c) => ({ ...c, visible: true }));
        await wait(80);
        await move('choose', 1300);
        set({ dropHover: true });
        await wait(420);
        setCursor((c) => ({ ...c, carrying: false }));
        set({ step: 2, dropHover: false });
        await wait(1400);

        // ---- 2. Review: a column source, a typo, a customer type ----
        await move('addr-head', 800, 0.3, 0.32);
        await click();
        set({ addrOpen: true });
        setMenus((m) => ({ ...m, addr: menuAt('addr-head', 2) }));
        await wait(1500);
        set({ addrOpen: false });
        setMenus((m) => ({ ...m, addr: null }));
        await wait(350);

        await move('tom-last', 750, 0.85);
        await click();
        set({ editing: true });
        await wait(300);
        await type('Castelano', 'Castellano', (t) => set({ tomLast: t }));
        await wait(450);
        set({ editing: false });
        await wait(250);

        await move('type-marisol', 750, 0.4);
        await click();
        set({ typeOpen: true });
        setMenus((m) => ({ ...m, type: menuAt('type-marisol') }));
        await wait(450);
        await move('opt-Vacation rental', 450, 0.35);
        set({ typeHover: 'Vacation rental' });
        await wait(300);
        await click();
        set({ marisolType: 'Vacation rental', typeOpen: false, typeHover: null });
        setMenus((m) => ({ ...m, type: null }));
        await wait(500);

        await move('continue', 800);
        set({ pressContinue: true });
        await click();
        set({ pressContinue: false });
        set({ step: 3 });
        await wait(1000);

        // ---- 3. Billing: a later first invoice, due on receipt, import ----
        await move('date', 800, 0.4);
        await click();
        set({ dateFocus: true, dateSelected: true });
        await wait(500);
        set({ dateSelected: false, date: '' });
        await type('', '12/01/2026', (t) => set({ date: t }), 75);
        set({ summaryDate: 'Dec 1', flash: true });
        await wait(700);
        set({ flash: false, dateFocus: false });
        await wait(300);

        await move('terms', 750, 0.5);
        await click();
        set({ termsOpen: true });
        setMenus((m) => ({ ...m, terms: menuAt('terms') }));
        await wait(450);
        await move('opt-Due upon receipt', 450, 0.35);
        set({ termsHover: 'Due upon receipt' });
        await wait(300);
        await click();
        set({ terms: 'Due upon receipt', termsOpen: false, termsHover: null });
        setMenus((m) => ({ ...m, terms: null }));
        await wait(600);

        await move('continue', 850);
        await click();
        set({ importing: 'busy' });
        await wait(1300);
        set({ importing: 'done', toast: true });
        await wait(2800);
        setCursor((c) => ({ ...c, visible: false }));
        set({ toast: false });
        await wait(400);
      }
    };
    run().catch((e) => { if (e !== CANCELLED) throw e; });
    return () => { cancelled = true; io.disconnect(); };
  }, [reduced, set]);

  const sceneClass = (n) => `demo-scene${s.step === n ? ' is-active' : s.step > n ? ' is-past' : ''}`;
  const primaryLabel = s.step === 2 ? 'Continue'
    : s.importing === 'busy' ? <><Loader2 size={15} strokeWidth={2.2} className="demo-spin" /> Importing</>
    : s.importing === 'done' ? <><Check size={15} strokeWidth={2.6} /> Imported</>
    : 'Import 5 customers';

  return (
    <div className="demo-fit" ref={fitRef} style={{ height: height ?? undefined }} aria-hidden="true">
      <div className="demo" ref={rootRef} style={{ transform: scale < 1 ? `scale(${scale})` : undefined }}>
        <div className="demo-head">
          <div>
            <div className="demo-back"><ArrowLeft size={15} strokeWidth={1.9} /> Customers</div>
            <div className="demo-title">Import customers</div>
          </div>
          <div className={`demo-actions${s.step >= 2 ? ' is-on' : ''}`}>
            <span className="demo-back-btn">Back</span>
            <span className={`demo-primary${s.pressContinue ? ' is-press' : ''}`} data-t="continue">{primaryLabel}</span>
          </div>
        </div>
        <div className="demo-stepper"><Stepper step={s.step} /></div>

        <div className="demo-stage">
          <div className={sceneClass(1)}><UploadScene s={s} /></div>
          <div className={sceneClass(2)}><ReviewScene s={s} /></div>
          <div className={sceneClass(3)}><BillingScene s={s} /></div>
        </div>

        {/* Menus float above the scenes, so nothing clips them. */}
        {menus.addr && (
          <div className="demo-menu" style={{ left: menus.addr.x, top: menus.addr.y, minWidth: menus.addr.w }}>
            <div className="demo-menu-label">Fill Address from</div>
            {ADDRESS_SOURCES.map((o, i) => (
              <div key={o} className={`demo-menu-opt${i === 0 ? ' is-on' : ''}`}>{o}{i === 0 && <Check size={14} strokeWidth={2.2} />}</div>
            ))}
            <div className="demo-menu-opt is-muted">Leave empty</div>
          </div>
        )}
        <NativeMenu at={menus.type} options={TYPES} value={s.marisolType} hover={s.typeHover} />
        <NativeMenu at={menus.terms} options={TERMS} value={s.terms} hover={s.termsHover} />

        <div className={`demo-toast${s.toast ? ' is-on' : ''}`}>
          <span className="demo-toast-check"><Check size={12} strokeWidth={3} /></span>
          5 customers imported
        </div>

        {!reduced && <Pointer cursor={cursor} />}
      </div>
    </div>
  );
}
