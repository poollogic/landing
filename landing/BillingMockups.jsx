import React from 'react';
import { ChevronDown, Lock } from 'lucide-react';
import StripeWordmark from './StripeWordmark.jsx';
import CompanyMark from './CompanyMark.jsx';
import './billing.css';

// The Billing section's phone mockup, shown by BillingScrollMorph: an iPhone with
// the customer's unpaid invoice in the customer portal (as portal.poollogic.app
// shows it at 390px wide). All names, addresses and amounts are MOCK data
// (Bayside Pool Co. / Melissa Tater, matching the laptop invoice).

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
              <div>Phone: <span className="bz-inv-phone">(248) 434-5508</span></div>
              <div>billing@baysidepool.example</div>
            </div>
          </div>

          <div className="bz-inv-k">Bill to</div>
          <div className="bz-inv-name">Melissa Tater</div>
          <div className="bz-inv-addr">123 Fake Street</div>
          <div className="bz-inv-addr">Wilmington, NC 28401</div>
          <div className="bz-inv-addr">melissa.tater@example.com</div>
          <div className="bz-inv-addr">(505) 842-5662</div>

          <div className="bz-inv-meta">
            <div><div className="bz-inv-mh">Invoice number</div><div className="bz-inv-mv">INV - 1056</div></div>
            <div><div className="bz-inv-mh">Date</div><div className="bz-inv-mv">12/14/2026</div></div>
            <div className="is-end"><div className="bz-inv-mh">Due date</div><div className="bz-inv-mv">12/29/2026</div></div>
          </div>

          <div className="bz-inv-details"><ChevronDown size={16} strokeWidth={2.2} /> View details</div>

          <div className="bz-inv-line is-first"><span>Subtotal</span><span>$145.00</span></div>
          <div className="bz-inv-line"><span>Card fee (2.9%)</span><span>$4.21</span></div>
          <div className="bz-inv-total"><span>Total</span><span>$149.21</span></div>
          <div className="bz-inv-pay">Pay now</div>
        </div>

        {/* The account balance card: only its top shows, above the home indicator. */}
        <div className="bz-card bz-balance">
          <div className="bz-bal-k">Total account balance</div>
          <div className="bz-bal-row"><span className="bz-bal-amt">$149.21</span><span className="bz-bal-open">1 open</span></div>
          <div className="bz-bal-hr" />
          <div className="bz-bal-inv"><span>INV-1056 <span className="bz-bal-tag">VIEWING</span></span><span>$149.21</span></div>
          <div className="bz-bal-due">Due Dec 29, 2026</div>
        </div>
      </div>
    </div>
  );
}

/** `embedded`: a plain block at its natural 262×586 size, for a parent that positions it (BillingScrollMorph). */
export function BillingPhone({ embedded = false }) {
  return (
    <div className={`bz-phone${embedded ? ' bz-phone--embedded' : ''}`}>
      <div className="bz-screen">
        <InvoiceScreen />
        <span className="bz-island" />
        <span className="bz-home" />
      </div>
    </div>
  );
}
