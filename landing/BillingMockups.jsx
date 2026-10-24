import React from 'react';
import { ChevronDown, Lock } from 'lucide-react';
import StripeWordmark from './StripeWordmark.jsx';
import CompanyMark from './CompanyMark.jsx';
import PhoneFrame, { StatusIcons } from './PhoneFrame.jsx';
import './billing.css';

// The Billing section's phone mockup, shown by BillingScrollMorph: the shared iPhone
// frame (PhoneFrame.jsx) with the customer's unpaid invoice in the customer portal (as portal.poollogic.app
// shows it at 390px wide). All names, addresses and amounts are MOCK data
// (Bayside Pool Co. / Jimmy McGill, matching the laptop invoice).

/* ---------- iPhone: the customer's invoice in the portal ---------- */

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
              <div>9800 Montgomery Blvd NE</div>
              <div>Albuquerque, NM 87111</div>
              <div>Phone: <span className="bz-inv-phone">(505) 293-7665</span></div>
              <div>billing@baysidepool.example</div>
            </div>
          </div>

          <div className="bz-inv-k">Bill to</div>
          <div className="bz-inv-name">Jimmy McGill</div>
          <div className="bz-inv-addr">160 Candelaria Rd NW</div>
          <div className="bz-inv-addr">Albuquerque, NM 87107</div>
          <div className="bz-inv-addr">j.mcgill@ice-station-zebra.com</div>
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
    <PhoneFrame className={embedded ? 'bz-phone--embedded' : ''}>
      <InvoiceScreen />
    </PhoneFrame>
  );
}
