import React, { useRef } from 'react';
import {
  AlarmClock, Blocks, Building2, ChevronDown, CircleUser, CreditCard, FileText, Info, Palette, Receipt,
  ShieldCheck, Truck, UserCog, Users, Zap,
} from 'lucide-react';
import useBrowserLayoutEffect from '../useBrowserLayoutEffect.js';

// Settings › Late invoices, in the dashboard preview's shell (DashboardPreview.jsx, with Settings
// active in the rail): the app's settings column (settings/settingsNav.ts, its groups, labels and
// icons) and the Late invoices page (settings/pages/BillingSettings.tsx, part "late"), as one card of
// rows. A picture: #collections turns its switches on and scrolls it (RevenueSection.jsx).
//
//   lateFees   "Charge late fees" on, with its four rows open under it
//   autoPause  "Automatic pause" on, with "Pause after" open under it
//   scroll     'top' | 'pause' (Automatic pause in view) | 'bottom'; `scrollMs`, how long it takes;
//              `bottomInset`, design px at the panel's foot that don't count as in view (a fade)

const NAV = [
  {
    label: 'Business',
    items: [
      ['General', Building2], ['Plan', Users], ['Branding', Palette], ['Documents', FileText],
      ['Automations', Zap], ['Technicians', UserCog], ['Fleet', Truck], ['Integrations', Blocks],
    ],
  },
  { label: 'Billing', items: [['Payments', CreditCard], ['Invoices', Receipt], ['Autopay terms', ShieldCheck], ['Late invoices', AlarmClock]] },
  { label: 'You', items: [['Account', CircleUser]] },
];
const ACTIVE = 'Late invoices';

const Switch = ({ on, demo }) => (
  <span className={`pl-set-switch${on ? ' is-on' : ''}`} data-demo={demo}><i /></span>
);

const InfoTip = () => <Info size={13} strokeWidth={1.75} className="pl-set-info" aria-hidden="true" />;

/** One row: the label and its hint on the left, the control on the right (`field`: a 400px column). */
function Row({ label, hint, field, children }) {
  return (
    <div className={`pl-set-row${field ? ' is-field' : ''}`}>
      <div className="pl-set-words">
        <div className="pl-set-label">{label}</div>
        <p className="pl-set-hint">{hint}</p>
      </div>
      <div className="pl-set-control">{children}</div>
    </div>
  );
}

/** Rows that open under a switch: their height animates (preview.css .pl-set-more). */
const More = ({ open, children }) => (
  <div className={`pl-set-more${open ? ' is-open' : ''}`}>
    <div className="pl-set-clip">{children}</div>
  </div>
);

const Field = ({ prefix, select, children }) => (
  <span className={`pl-set-field${select ? ' is-select' : ''}`}>
    {prefix && <span className="pl-set-prefix">{prefix}</span>}
    <span className="pl-set-value">{children}</span>
    {select && <ChevronDown size={14} strokeWidth={1.75} className="pl-set-chev" aria-hidden="true" />}
  </span>
);

export default function LateInvoicesView({ lateFees = false, autoPause = false, scroll = 'top', scrollMs = 0, bottomInset = 0 }) {
  const bodyRef = useRef(null);
  const pageRef = useRef(null);

  // The page's scroll: a transform on the page (so it can take exactly scrollMs), to the top, to
  // where Automatic pause is in view, or to the bottom. Measured when asked, after the rows above
  // have opened.
  useBrowserLayoutEffect(() => {
    const body = bodyRef.current;
    const page = pageRef.current;
    if (!body || !page) return;
    const view = body.clientHeight - bottomInset;
    const max = Math.max(0, page.scrollHeight - view);
    let y = 0;
    if (scroll === 'bottom') y = max;
    else if (scroll === 'pause') {
      const row = page.querySelector('[data-row="auto-pause"]');
      if (row) y = Math.min(max, Math.max(0, row.offsetTop + row.offsetHeight + 24 - view));
    }
    page.style.setProperty('--set-ms', `${scrollMs}ms`);
    page.style.setProperty('--set-y', `${Math.round(y)}px`);
  }, [scroll, scrollMs, bottomInset]);

  return (
    <div className="pl-panel pl-set">
      <nav className="pl-set-nav" aria-hidden="true">
        <p className="pl-set-nav-title">Settings</p>
        {NAV.map((g) => (
          <div key={g.label} className="pl-set-group">
            <p className="pl-set-group-label">{g.label}</p>
            {g.items.map(([label, Icon]) => (
              <span key={label} className={`pl-set-item${label === ACTIVE ? ' is-active' : ''}`}>
                <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        ))}
      </nav>

      <div ref={bodyRef} className="pl-set-body" aria-hidden="true">
        <div ref={pageRef} className="pl-set-page">
          <h3 className="pl-set-title">Late invoices</h3>
          <p className="pl-set-desc">What happens when an invoice goes past due. Applies to invoices that go overdue from now on.</p>
          <p className="pl-set-section">When an invoice is late</p>

          <div className="pl-set-card">
            <Row label="Reminders" hint="An email the day after an invoice is due, with a link to pay; with a late fee, a firmer one the day it’s added. Autopay customers still hear if a payment fails.">
              <Switch on />
            </Row>

            <Row label={<>Charge late fees<InfoTip /></>} hint="Add a fee to invoices that go past due. Nothing already overdue is charged.">
              <Switch on={lateFees} demo="late-fees" />
            </Row>
            <More open={lateFees}>
              <Row field label="Fee type" hint="A fixed dollar amount per invoice.">
                <Field select>Flat amount ($)</Field>
              </Row>
              <Row field label="Fee amount" hint="e.g. 25 = $25.00 flat fee. Up to $500.">
                <Field prefix="$">25</Field>
              </Row>
              <Row field label="Grace period" hint="Days past the due date before a fee applies. 0 for none, up to 90.">
                <Field>10</Field>
              </Row>
              <Row label="Auto-apply late fees" hint="Applied in the daily billing run once the grace period is up. Off, you add them by hand.">
                <Switch on />
              </Row>
            </More>

            <div data-row="auto-pause">
              <Row
                label={<>Automatic pause<InfoTip /><span className="pl-set-tag">Vision</span></>}
                hint="Customers who stop paying are paused for you, billing and service, and resume by themselves once they pay. The route slot is held, and you’re told how long each went without service."
              >
                <Switch on={autoPause} demo="auto-pause" />
              </Row>
              <More open={autoPause}>
                <Row field label="Pause after" hint="How many days past due an invoice can get before its customer is paused: 7 days or more.">
                  <Field>30</Field>
                </Row>
              </More>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
