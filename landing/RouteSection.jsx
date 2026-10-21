import React from 'react';
import {
  ArrowRightLeft, ChartColumn, Check, Clock, Download, FileText, Lock, User,
} from 'lucide-react';
import CompanyMark from './CompanyMark.jsx';
import './route.css';

// Route acquisition, dark: how a route changes hands on PoolLogic
// (customers/handover in the app) and the route report a buyer sees. Styles in
// route.css. All names, figures and the transfer
// code are MOCK data; the code's shape is the app's: 8 letters and numbers,
// XXXX-XXXX, with no 0, O, 1, I or L.

/** Bars for the report's tiny charts: heights 0–1, the `accent` index in blue. */
function Bars({ values, accent }) {
  return (
    <span className="ra-bars">
      {values.map((v, i) => (
        <span key={i} className={i === accent ? 'is-accent' : undefined} style={{ height: `${Math.round(v * 100)}%` }} />
      ))}
    </span>
  );
}

const METRICS = [
  {
    label: 'Recurring revenue', value: '$6,960', unit: '/mo',
    chart: <Bars values={[0.42, 0.5, 0.55, 0.63, 0.72, 0.84, 1]} accent={6} />,
  },
  {
    label: 'On autopay', value: '85%', unit: '41 of 48',
    chart: <span className="ra-meter"><span style={{ width: '85%' }} /></span>,
  },
  {
    label: 'Avg. account age', value: '4.2', unit: 'yrs',
    chart: <Bars values={[0.3, 0.55, 0.8, 1, 0.7, 0.45, 0.25]} accent={3} />,
  },
  {
    label: 'Chemical cost', value: '$18.40', unit: '/stop',
    chart: (
      <svg className="ra-spark" viewBox="0 0 120 28" preserveAspectRatio="none">
        <polyline points="0,9 20,10 40,9.5 60,12 80,13 100,14.5 120,15.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
    ),
  },
  {
    label: 'Pool mix', value: '28', unit: 'salt',
    chart: (
      <span className="ra-mix-wrap">
        <span className="ra-mix"><span style={{ flex: 28 }} /><span style={{ flex: 16 }} /><span style={{ flex: 4 }} /></span>
        <span className="ra-mix-caption">16 chlorine · 4 other</span>
      </span>
    ),
  },
  {
    label: 'Service visits logged', value: '2,300', unit: '+',
    chart: <Bars values={[0.5, 0.58, 0.62, 0.7, 0.78, 0.86, 1]} accent={6} />,
  },
];

function Handover() {
  return (
    <div className="ra-panel">
      <div className="ra-panel-head">
        <span className="ra-kicker">The handover</span>
        <span className="ra-chip"><Clock size={13} strokeWidth={2} /> Takes minutes</span>
      </div>

      <div className="ra-parties">
        <div className="ra-party">
          <CompanyMark size={48} />
          <b>Bayside Pool Co.</b>
          <span>Seller</span>
        </div>
        <span className="ra-transfer" aria-hidden="true"><span className="ra-transfer-line" /><span className="ra-transfer-head" /></span>
        <div className="ra-party">
          <span className="ra-avatar"><User size={20} strokeWidth={1.75} /></span>
          <b>New owner</b>
          <span>Buyer</span>
        </div>
      </div>

      <div className="ra-pin">
        <span className="ra-pin-label">Transfer code</span>
        <span className="ra-pin-digits">
          {['K', '7', 'Q', '4', '-', '9', 'W', 'X', 'H'].map((d, i) => (d === '-' ? <i key={i}>–</i> : <span key={i}>{d}</span>))}
        </span>
      </div>

      <div className="ra-moves">
        <div>
          <div className="ra-moves-title">Moves with the route</div>
          {['48 customers', 'Prices & service days', 'Every visit report'].map((t) => (
            <div key={t} className="ra-item"><span className="ra-dot is-on"><Check size={11} strokeWidth={3} /></span>{t}</div>
          ))}
        </div>
        <div>
          <div className="ra-moves-title">Stays with you</div>
          {['Billing history', 'Saved cards', 'Bank accounts'].map((t) => (
            <div key={t} className="ra-item"><span className="ra-dot"><Lock size={10} strokeWidth={2.4} /></span>{t}</div>
          ))}
          <p className="ra-moves-note">One bulk request asks every customer to add a payment method again.</p>
        </div>
      </div>

      <div className="ra-foot">
        <FileText size={16} strokeWidth={1.75} />
        Customers keep their prices, service days and visit history, so nothing about their service changes.
      </div>
    </div>
  );
}

function RouteReport() {
  return (
    <div className="ra-panel ra-report">
      <div className="ra-report-head">
        <CompanyMark size={28} />
        <div className="ra-report-title">
          <b>Route report</b>
          <span>Bayside Pool Co. · 48 customers</span>
        </div>
        <span className="ra-chip"><Download size={13} strokeWidth={2} /> Export</span>
      </div>

      <div className="ra-grid">
        {METRICS.map((m) => (
          <div key={m.label} className="ra-cell">
            <span className="ra-cell-label">{m.label}</span>
            <span className="ra-cell-value">{m.value}<small>{m.unit}</small></span>
            <span className="ra-cell-chart">{m.chart}</span>
          </div>
        ))}
      </div>

      <div className="ra-foot">
        <ChartColumn size={16} strokeWidth={1.75} />
        Know your numbers. Everything is black and white and exportable, so potential buyers see what your route is worth.
      </div>
    </div>
  );
}

export default function RouteSection() {
  return (
    <section className="ra-section section bg-mktg-page" aria-labelledby="route-heading">
      <div className="container">
        <div className="text-center">
          <p className="ra-eyebrow mb-4">Route acquisition</p>
          <h2 id="route-heading" className="ra-h2 text-3xl font-semibold lg:text-4xl">
            Buy, sell, and transfer routes in seconds.
          </h2>
          <p className="ra-sub mx-auto mt-5 max-w-2xl text-lg">
            Selling a route on PoolLogic takes one code. And because every number lives in one place, you walk into the
            sale knowing exactly what your route is worth.
          </p>
        </div>
        <div className="ra-panels mx-auto mt-16 grid max-w-[1000px] grid-cols-1 gap-4 lg:grid-cols-2">
          <Handover />
          <RouteReport />
        </div>
      </div>
    </section>
  );
}
