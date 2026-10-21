import React, { useEffect, useRef } from 'react';
import { CalendarDays, Check, ChevronDown, ChevronRight, ChevronsUpDown, Lock } from 'lucide-react';
import StripeWordmark from './StripeWordmark.jsx';
import CompanyMark from './CompanyMark.jsx';
import './billing.css';

// Section 2: zero-click billing. A light, Apple-style section after the dark
// hero. On the right, an iPhone showing the customer's invoice in the
// customer portal, and in front of it the dark customer settings card from
// the app. All names, addresses and amounts are MOCK data.

const FEATURES = [
  {
    title: 'Card fees covered',
    body: 'Set your own card surcharge. PoolLogic keeps it within your state’s cap, and turns it off in states that don’t allow surcharges. Bank transfers (ACH) carry no surcharge and cost you far less than cards.',
  },
  {
    title: 'Self-serve receipts',
    body: 'Clients see their full payment history and download a receipt for every payment, for taxes or HOA boards, on their own.',
  },
  {
    title: 'Any date, any cadence',
    body: 'Monthly, quarterly or yearly. Join on the 14th, billed on the 14th.',
  },
];

/* ---------- iPhone: the customer's invoice in the portal ---------- */

const StatusIcons = () => (
  <span className="bz-sb-icons">
    <svg width="18" height="12" viewBox="0 0 18 12" fill="#fff" aria-hidden="true">
      <rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" />
    </svg>
    <svg width="16" height="12" viewBox="0 0 16 12" fill="#fff" aria-hidden="true">
      <path d="M8 2.6c2.2 0 4.2.8 5.7 2.2l1.2-1.3C13 1.7 10.6.7 8 .7S3 1.7 1.1 3.5l1.2 1.3C3.8 3.4 5.8 2.6 8 2.6Z" />
      <path d="M8 6.2c1.2 0 2.3.4 3.2 1.2l1.2-1.3C11.2 5 9.7 4.3 8 4.3S4.8 5 3.6 6.1l1.2 1.3C5.7 6.6 6.8 6.2 8 6.2Z" />
      <path d="M8 9.8 9.7 8a2.6 2.6 0 0 0-3.4 0L8 9.8Z" />
    </svg>
    <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true">
      <rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="#fff" strokeOpacity=".4" />
      <rect x="2" y="2" width="20" height="9" rx="2.5" fill="#fff" />
      <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="#fff" fillOpacity=".45" />
    </svg>
  </span>
);

function InvoiceScreen() {
  return (
    <div className="bz-screen-content">
      <div className="bz-statusbar">
        <span className="bz-sb-time">9:41</span>
        <StatusIcons />
      </div>
      <div className="bz-stripebar">
        <Lock size={14} strokeWidth={2.4} />
        <span>Secure checkout by</span>
        <StripeWordmark height={17} />
      </div>

      <div className="bz-page">
        <div className="bz-card bz-pay">
          <div className="bz-pay-status"><Check size={14} strokeWidth={2.75} /> Payment received</div>
          <div className="bz-pay-amt">$149.21</div>
          <div className="bz-pay-meta">Received Nov 14 at 7:02 AM via Visa ···· 4242</div>
          <div className="bz-track">
            <span className="bz-track-line" />
            <div className="bz-step">
              <span className="bz-dot"><Check size={11} strokeWidth={3.2} /></span>
              <span className="bz-step-label">Submitted</span>
            </div>
            <div className="bz-step is-end">
              <span className="bz-dot"><Check size={11} strokeWidth={3.2} /></span>
              <span className="bz-step-label">Received</span>
            </div>
          </div>
        </div>

        <div className="bz-card bz-inv">
          <div className="bz-inv-title">Invoice</div>
          <div className="bz-inv-top">
            {/* The company's logo: the mark, with its wordmark stacked under it */}
            <span className="bz-inv-logo">
              <CompanyMark size={52} />
              <span className="bz-inv-wm">BAYSIDE</span>
              <span className="bz-inv-wm2">POOL CO.</span>
            </span>
            <div className="bz-inv-co">
              <div className="bz-inv-coname">BAYSIDE POOL CO.</div>
              <div>1180 Harbor Blvd</div>
              <div>Clearwater, FL 33755</div>
              <div>Phone: <span className="bz-inv-phone">(727) 555-0142</span></div>
            </div>
          </div>

          <div className="bz-inv-k">Bill to</div>
          <div className="bz-inv-name">Avery Collins</div>
          <div className="bz-inv-addr">2148 Palmetto Dr</div>
          <div className="bz-inv-addr">Dunedin, FL 34698</div>

          <div className="bz-inv-meta">
            <div><div className="bz-inv-mh">Invoice number</div><div className="bz-inv-mv">INV - 1024</div></div>
            <div><div className="bz-inv-mh">Date</div><div className="bz-inv-mv">11/14/2026</div></div>
            <div className="is-end"><div className="bz-inv-mh">Due date</div><div className="bz-inv-mv">11/29/2026</div></div>
          </div>

          <div className="bz-inv-details"><ChevronDown size={16} strokeWidth={2.2} /> View details</div>

          <div className="bz-inv-line is-first"><span>Subtotal</span><span>$145.00</span></div>
          <div className="bz-inv-line"><span>Card fee (2.9%)</span><span>$4.21</span></div>
          <div className="bz-inv-total"><span>Total</span><span>$149.21</span></div>
        </div>
      </div>
    </div>
  );
}

function Phone() {
  return (
    <div className="bz-phone">
      <div className="bz-screen">
        <InvoiceScreen />
        <span className="bz-island" />
        <span className="bz-home" />
      </div>
    </div>
  );
}

/* ---------- The customer settings card (dark) ---------- */

const Toggle = ({ on }) => <span className={`bz-tg${on ? ' is-on' : ''}`}><span /></span>;

function SettingsCard() {
  return (
    <div className="bz-settings">
      <div className="bz-st-head">
        <div className="bz-st-who">
          <div className="bz-st-name">Avery Collins</div>
          <div className="bz-st-sub">2148 Palmetto Dr <span className="bz-st-sep" /> Weekly service</div>
        </div>
        <div className="bz-st-rate">$145<small>per month</small></div>
      </div>

      <div className="bz-st-next">
        <div className="bz-st-k">Next invoice</div>
        <div className="bz-st-field">
          <CalendarDays size={16} strokeWidth={1.75} />
          <span className="bz-st-date">Dec 14, 2026</span>
          <span className="bz-st-cycle">Monthly <ChevronsUpDown size={13} strokeWidth={2} /></span>
        </div>
        <div className="bz-st-help">Charges <b>$149.21</b> automatically on the 14th</div>
      </div>

      <div className="bz-st-list">
        <div className="bz-st-row">
          <span className="bz-st-l">Payment terms</span>
          <span className="bz-st-pill">Net 15 <ChevronsUpDown size={12} strokeWidth={2} /></span>
        </div>
        <div className="bz-st-row">
          <span className="bz-st-l">Card surcharge<small>2.9% passed to customer</small></span>
          <Toggle on />
        </div>
        <div className="bz-st-row">
          <span className="bz-st-l">Bill chemicals<small>Add usage to each invoice</small></span>
          <Toggle />
        </div>
      </div>

      <div className="bz-st-auto">
        <span className="bz-visa"><span className="bz-visa-chip" /><span className="bz-visa-mark">VISA</span></span>
        <div className="bz-st-auto-text">
          <div className="bz-st-auto-title">Autopay ···· 4242</div>
          <div className="bz-st-auto-sub">Auto-charge on</div>
        </div>
        <Toggle on />
      </div>
    </div>
  );
}

/** A gentle scroll parallax: the card drifts a little more than the phone. */
function useStageParallax(stageRef) {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const card = stage.querySelector('.bz-settings');
    const phone = stage.querySelector('.bz-phone');
    const floor = stage.querySelector('.bz-floor-card');
    let raf = 0;
    const update = () => {
      raf = 0;
      if (window.innerWidth < 760 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        card.style.translate = '';
        phone.style.translate = '';
        if (floor) floor.style.opacity = '';
        return;
      }
      const r = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      let p = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2);
      p = Math.max(-1, Math.min(1, p));
      // `translate`, not `transform`: the card keeps its scale(.82).
      card.style.translate = `0 ${(p * 24).toFixed(1)}px`;
      phone.style.translate = `0 ${(p * -10).toFixed(1)}px`;
      if (floor) floor.style.opacity = (1 - Math.abs(p) * 0.3).toFixed(2);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [stageRef]);
}

/** Scale the phone + settings group (491px design) to its column. */
const STAGE_W = 491;

function useStageScale(innerRef, stageRef) {
  useEffect(() => {
    const inner = innerRef.current;
    const stage = stageRef.current;
    if (!inner || !stage) return undefined;
    const fit = () => {
      const cs = getComputedStyle(inner);
      const contentW = inner.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const twoCol = cs.gridTemplateColumns.trim().split(/\s+/).length > 1;
      const avail = twoCol ? (contentW - parseFloat(cs.columnGap)) / 2 : contentW;
      const s = Math.min(1.08, Math.max(0.62, (avail / STAGE_W) * 0.92));
      stage.style.setProperty('--s', s.toFixed(4));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [innerRef, stageRef]);
}

export default function BillingSection() {
  const innerRef = useRef(null);
  const stageRef = useRef(null);
  useStageScale(innerRef, stageRef);
  useStageParallax(stageRef);
  return (
    <section id="billing" className="bz" aria-labelledby="billing-heading">
      <div className="bz-inner" ref={innerRef}>
        <div className="bz-copy">
          <p className="bz-eyebrow">Billing on autopilot</p>
          <h2 id="billing-heading" className="bz-h2">Zero-click billing.<br />Effortless collections.</h2>
          <p className="bz-body">
            Set the next invoice date once. PoolLogic adds the base rate, chemicals and card fees, then emails every
            invoice on schedule. No batches. No “Send” button.
          </p>
          <ul className="bz-list">
            {FEATURES.map((f) => (
              <li key={f.title}>
                <Check size={16} strokeWidth={2.5} className="bz-check" aria-hidden="true" />
                <div>
                  <div className="bz-ft">{f.title}</div>
                  <p className="bz-fd">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <a className="bz-link" href="/pricing">See how billing works <ChevronRight size={14} strokeWidth={2.2} aria-hidden="true" /></a>
        </div>

        <div className="bz-stage" ref={stageRef} aria-hidden="true">
          <span className="bz-floor bz-floor-phone" />
          <span className="bz-floor bz-floor-card" />
          <Phone />
          <SettingsCard />
        </div>
      </div>
    </section>
  );
}
