import React from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Gauge } from 'lucide-react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/guides/guide.css';
import Nav from '../landing/Nav.jsx';
import GuideToc from '../landing/guides/GuideToc.jsx';
import AskList from '../landing/guides/AskList.jsx';
import StabilizerChart from '../landing/guides/StabilizerChart.jsx';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { ctaHref } from '../landing/onboarding.js';
import { TRIAL_DAYS } from '../aiFacts.js';
import { Footer } from '../components/site-chrome.jsx';
import { CHEM_GUIDE_PATH } from '../landing/guides/chemicalsMeta.js';
import {
  STAB_GUIDE_PATH, STAB_GUIDE_DESCRIPTION, STAB_GUIDE_H1, STAB_GUIDE_H1_LEAD, STAB_GUIDE_H1_SOFT, STAB_GUIDE_LEDE, STAB_GUIDE_PUBLISHED, STAB_GUIDE_BYLINE,
} from '../landing/guides/stabilizerMeta.js';

// /guides/pool-stabilizer-cyanuric-acid: the fifth guide, from the owner's brief of 2026-11-28
// (stabilizer-guide-ide-prompt.md): its copy, order, ids and new pieces, on the first guide's template
// (pages/guide-raise-prices.jsx, landing/guides/guide.css). One h1 (two tones), an h2 per part, h3s for
// "Why it creeps up", the two signs cards and the FAQ's questions. The hero has no gd-vis cards: its right
// column is the chart panel (landing/guides/StabilizerChart.jsx). The tables, the two cards and the FAQ are
// guide.css's "fifth guide" rules; the question list is the chemicals guide's (landing/guides/AskList.jsx).
// Everything is in the pre-rendered markup, the chart included. The byline is the one the owner chose for
// the chemicals guide; in the Article the author is Poolnautics, as the partner companies aren't named.

const ORIGIN = 'https://getpoolnautics.com';
const PAGE_URL = `${ORIGIN}${STAB_GUIDE_PATH}`;
const AI_SETTINGS_URL = 'https://app.poolnautics.app/settings/ai-assistants';

// Its image (the share image) is added in entry-server.jsx from ROUTE_META, where the PNG's path lives.
export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${PAGE_URL}#article`,
    headline: STAB_GUIDE_H1,
    description: STAB_GUIDE_DESCRIPTION,
    url: PAGE_URL,
    mainEntityOfPage: PAGE_URL,
    datePublished: STAB_GUIDE_PUBLISHED,
    dateModified: STAB_GUIDE_PUBLISHED,
    author: { '@id': `${ORIGIN}/#organization` },
    inLanguage: 'en-US',
    publisher: { '@id': `${ORIGIN}/#organization` },
    isPartOf: { '@id': `${ORIGIN}/#website` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${ORIGIN}/guides` },
      { '@type': 'ListItem', position: 3, name: 'Pool stabilizer (cyanuric acid)', item: PAGE_URL },
    ],
  },
];

const SHORTCUTS = [
  ['level', 'The right level', Gauge],
  ['raise', 'How to raise it', ArrowUp],
  ['lower', 'How to lower it', ArrowDown],
];

const TOC = [
  ['what', 'What stabilizer does'],
  ['level', 'The right level'],
  ['test', 'How to test it'],
  ['raise', 'How to raise it'],
  ['lower', 'How to lower it'],
  ['signs', 'Signs it is off'],
  ['questions', 'Common questions'],
];

const QUESTIONS = [
  ['Low stabilizer', 'Which pools have low stabilizer?'],
  ['High stabilizer', 'Which pools have stabilizer above 80?'],
  ['Recently treated', 'Which pools got stabilizer this month?'],
];

const Part = ({ n }) => <span className="gd-num"><i>{n}</i>Part {n}</span>;

/** A table (guide.css .gd-table) in its scrolling frame. cols: header cells; rows: cells; num: the column
 *  indexes holding short figures (no wrapping, tabular digits). */
function Table({ cols, rows, stack, num = [] }) {
  return (
    <div className="gd-table-wrap">
      <table className={`gd-table${stack ? ' is-stack' : ''}`}>
        <thead><tr>{cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>{r.map((c, i) => <td key={i} className={num.includes(i) ? 'num' : undefined}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function GuideStabilizerPage() {
  const theme = usePreviewTheme();
  return (
    <div className="mktg guide-page guide-stab relative min-h-screen font-sans antialiased">
      <Nav tone="light" overlay />
      <main>
        <header className="gd-hero gd-hero--stab">
          <div className="container">
            <div className="gd-hero-grid">
              <div>
                <p className="gd-eyebrow">Guide for pool owners and pool pros</p>
                <h1>{STAB_GUIDE_H1_LEAD} <span className="gd-h1-soft">{STAB_GUIDE_H1_SOFT}</span></h1>
                <p className="gd-lede">{STAB_GUIDE_LEDE}</p>
                <p className="gd-byline">{STAB_GUIDE_BYLINE}</p>
                <ul className="gd-in">
                  {SHORTCUTS.map(([id, label, Icon]) => (
                    <li key={id}>
                      <a href={`#${id}`}>
                        <Icon strokeWidth={1.9} aria-hidden="true" />
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <StabilizerChart />
            </div>
          </div>
        </header>

        <div className="container">
          <div className="gd-body">
            <GuideToc items={TOC} articleId="gd-art" />

            <article className="gd-art" id="gd-art">
              <div className="gd-short">
                <h2>The short version</h2>
                <ol>
                  <li>Stabilizer, conditioner and cyanuric acid (CYA) are all the same thing.</li>
                  <li>It shields chlorine from sunlight. Outdoor pools need it. Indoor pools do not.</li>
                  <li>Aim for 40 to 50 ppm. 30 is acceptable. Salt water pools often run 60 to 80.</li>
                  <li>To raise it, about 13 ounces of granular stabilizer per 10,000 gallons adds 10 ppm.</li>
                  <li>To lower it, replace water. Nothing else is as reliable.</li>
                  <li>Chlorine tablets add stabilizer every time you use them, so the level creeps up.</li>
                </ol>
              </div>

              <section id="what" aria-labelledby="what-title">
                <Part n={1} />
                <h2 id="what-title">What pool stabilizer does</h2>
                <p>Sunlight destroys chlorine. In an outdoor pool with no stabilizer, about a third of the chlorine can be gone after a single hour of strong sun. With 30 ppm of stabilizer, that loss drops to about 3%.</p>
                <p>Stabilizer protects it. Cyanuric acid holds on to chlorine loosely in the water, so the sun cannot break it down as fast and one dose lasts far longer.</p>
                <p>There is a cost. Chlorine that is being held by stabilizer works more slowly. The more stabilizer in the water, the more chlorine you need to do the same job. That is why the goal is the right amount, not as much as possible.</p>
                <div className="gd-note"><p><b>Four names, one chemical.</b> Pool stabilizer, pool conditioner, cyanuric acid and CYA all mean the same thing.</p></div>
              </section>

              <section id="level" aria-labelledby="level-title">
                <Part n={2} />
                <h2 id="level-title">The right stabilizer level</h2>
                <p>For most outdoor pools the ideal is 40 to 50 ppm. 30 is acceptable, but it leaves less of a cushion.</p>
                <Table
                  stack
                  cols={['Type of pool', 'Target', 'Why']}
                  rows={[
                    ['Outdoor chlorine pool', '40 to 50 ppm ideal, 30 acceptable', 'Enough to protect chlorine from the sun without slowing it much'],
                    ['Salt water pool', '60 to 80 ppm', 'A salt cell makes chlorine slowly, so extra protection helps'],
                    ['Indoor pool', 'None', 'No sunlight, so no benefit'],
                    ['Public or commercial pool', 'Follow your health code', 'Many codes cap it at 100 ppm, and the national model code uses 90'],
                  ]}
                />
                <p>Keep chlorine in step with it. A common rule is to hold free chlorine at 7.5% of your stabilizer level or higher. At 40 ppm of stabilizer, that means at least 3 ppm of chlorine. At 80 ppm, it means 6.</p>
                <div className="gd-pull"><p>If a pool needs more and more chlorine to stay clear, check the stabilizer before you buy more chlorine.</p></div>
              </section>

              <section id="test" aria-labelledby="test-title">
                <Part n={3} />
                <h2 id="test-title">How to test it</h2>
                <p>We recommend a drop test kit for the most accurate result. Test strips are quick, but they are a rough guide at best for stabilizer.</p>
                <ul className="gd-list">
                  <li><b>Monthly.</b> Test at least once a month in season.</li>
                  <li><b>After big changes.</b> Test again after heavy rain, a big refill, or any partial drain.</li>
                  <li><b>Before you add any.</b> It is far easier to add more than to take it out.</li>
                </ul>
                <div className="gd-note"><p><b>Reading maxed out?</b> Most kits stop at 100 ppm. Mix the pool sample half and half with tap water, test again, and double the result.</p></div>
              </section>

              <section id="raise" aria-labelledby="raise-title">
                <Part n={4} />
                <h2 id="raise-title">How to raise stabilizer</h2>
                <p>About 13 ounces of granular stabilizer raises 10,000 gallons by 10 ppm.</p>
                <Table
                  num={[1, 2]}
                  cols={['Pool size', 'To add 10 ppm', 'To add 30 ppm']}
                  rows={[
                    ['10,000 gallons', '13 oz', '2 lb 7 oz'],
                    ['15,000 gallons', '1 lb 4 oz', '3 lb 11 oz'],
                    ['20,000 gallons', '1 lb 10 oz', '4 lb 14 oz'],
                    ['30,000 gallons', '2 lb 7 oz', '7 lb 5 oz'],
                  ]}
                />
                <p>An example. A 15,000 gallon pool tests at 10 ppm and you want 40. You need 30 more ppm, which is about 3 pounds 11 ounces.</p>
                <ol className="gd-steps">
                  <li><b>Test first.</b> Then work out the dose for your pool size.</li>
                  <li><b>Add less than you think you need.</b> You can always add more next week.</li>
                  <li><b>Wait before you retest.</b> Stabilizer dissolves slowly. Give it several days.</li>
                </ol>
                <div className="gd-pull"><p>Raising stabilizer takes a scoop. Lowering it takes a pump and a water bill.</p></div>
              </section>

              <section id="lower" aria-labelledby="lower-title">
                <Part n={5} />
                <h2 id="lower-title">How to lower stabilizer</h2>
                <p>The reliable way to lower stabilizer is to replace water. It does not evaporate and it barely breaks down, so it stays until the water it is in leaves the pool.</p>
                <p>The math is simple. The share of water to replace equals the share of stabilizer you want gone.</p>
                <Table
                  num={[1, 2]}
                  cols={['Now', 'Target', 'Water to replace']}
                  rows={[
                    ['70 ppm', '50 ppm', 'About 30%'],
                    ['100 ppm', '50 ppm', '50%'],
                    ['120 ppm', '40 ppm', 'About 67%'],
                  ]}
                />
                <p>Stabilizer reducers are sold, but they are expensive and results are mixed. Reverse osmosis services can filter it out where they are available. Check local rules before you drain, and never empty a pool completely without knowing it is safe for that pool.</p>
                <h3 className="gd-sub">Why it creeps up</h3>
                <p>Chlorine tablets are the usual cause. Trichlor tablets add about 6 ppm of stabilizer for every 10 ppm of chlorine they deliver. Dichlor shock adds it too. A pool run on tablets all season can climb well past 100 ppm without anyone adding a scoop of stabilizer.</p>
                <div className="gd-note"><p><b>Liquid chlorine and cal hypo add none.</b> If a tablet pool is near the top of its range, switch it to liquid until the level comes down.</p></div>
              </section>

              <section id="signs" aria-labelledby="signs-title">
                <Part n={6} />
                <h2 id="signs-title">Signs your stabilizer is off</h2>
                <div className="gd-two">
                  <div className="is-low">
                    <h3><i aria-hidden="true" />Too low</h3>
                    <ul>
                      <li>Chlorine is fine in the morning and gone by late afternoon.</li>
                      <li>The pool uses far more chlorine in sunny weeks than cloudy ones.</li>
                      <li>You keep adding chlorine and the reading never holds.</li>
                    </ul>
                  </div>
                  <div className="is-high">
                    <h3><i aria-hidden="true" />Too high</h3>
                    <ul>
                      <li>Chlorine reads normal, but algae keeps coming back.</li>
                      <li>The pool needs more chlorine every month to stay clear.</li>
                      <li>The water goes dull or cloudy even though the numbers look right. People often call this chlorine lock.</li>
                    </ul>
                  </div>
                </div>
                <p>
                  If you run a route, this matters twice. A pool with the wrong stabilizer level burns through chlorine, and on paper that looks exactly like a technician overdosing. Before you question the tech, test the pool. See{' '}
                  <a className="gd-a" href={CHEM_GUIDE_PATH}>how to find out if a pool tech is stealing chemicals</a>.
                </p>
              </section>

              <div className="gd-proof">
                <span className="gd-num">Run a pool route?</span>
                <h2>Know the stabilizer level on every pool</h2>
                <p>Your technicians log readings at every visit in Poolnautics. Connect Claude, ChatGPT or Grok and ask which pools need attention before you drive out.</p>
                <div className="gd-proof-row">
                  <a className="hero-cta gd-cta" href={AI_SETTINGS_URL} target="_blank" rel="noopener">Add AI Assistant<ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" /></a>
                  <a className="gd-ghost" href={ctaHref(theme)}>Not on Poolnautics? Start your {TRIAL_DAYS}-day trial</a>
                </div>
                <AskList questions={QUESTIONS} note="Use whichever ones help." />
              </div>

              <section id="questions" className="gd-faq" aria-labelledby="questions-title">
                <span className="gd-num">FAQ</span>
                <h2 id="questions-title">Common questions</h2>
                <h3>Is pool stabilizer the same as conditioner and cyanuric acid?</h3>
                <p>Yes. Stabilizer, conditioner, cyanuric acid and CYA are the same chemical under different names.</p>
                <h3>How much stabilizer should I add to my pool?</h3>
                <p>About 13 ounces of granular stabilizer per 10,000 gallons raises the level by 10 ppm. Test first, then add only what gets you to 40 to 50 ppm.</p>
                <h3>Do chlorine tablets have stabilizer in them?</h3>
                <p>Yes. Trichlor tablets add about 6 ppm of stabilizer for every 10 ppm of chlorine. That is why tablet pools drift high over a season.</p>
                <h3>Does pool shock have stabilizer?</h3>
                <p>Some does. Dichlor shock contains it. Cal hypo and liquid chlorine do not.</p>
                <h3>Can I lower stabilizer without draining?</h3>
                <p>Not reliably. Reducers exist but are expensive and do not work in every pool. Replacing part of the water is the dependable fix.</p>
                <h3>Do indoor pools need stabilizer?</h3>
                <p>No. Its only job is to protect chlorine from sunlight.</p>
              </section>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
