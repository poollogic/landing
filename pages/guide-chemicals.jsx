import React, { useEffect, useRef } from 'react';
import { ArrowRight, Droplet, ListChecks, ReceiptText, TriangleAlert } from 'lucide-react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/guides/guide.css';
import Nav from '../landing/Nav.jsx';
import GuideToc from '../landing/guides/GuideToc.jsx';
import AskList, { AskVar } from '../landing/guides/AskList.jsx';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { ctaHref } from '../landing/onboarding.js';
import { TRIAL_DAYS } from '../aiFacts.js';
import { Footer } from '../components/site-chrome.jsx';
import {
  CHEM_GUIDE_PATH, CHEM_GUIDE_DESCRIPTION, CHEM_GUIDE_H1, CHEM_GUIDE_H1_LEAD, CHEM_GUIDE_H1_SOFT, CHEM_GUIDE_LEDE, CHEM_GUIDE_PUBLISHED, CHEM_GUIDE_BYLINE,
} from '../landing/guides/chemicalsMeta.js';
import { STAB_GUIDE_PATH } from '../landing/guides/stabilizerMeta.js';

// /guides/how-to-find-out-if-a-pool-tech-is-stealing-chemicals: the fourth guide, from the owner's brief of
// 2026-11-28 (guide-page-ide-prompt.md): its copy, order, ids and new pieces, on the first guide's template
// (pages/guide-raise-prices.jsx, landing/guides/guide.css). One h1 (two tones), an h2 per step and section,
// the FAQ's questions as h3s. The byline under the lede is the owner's (2026-11-28); in the Article it is
// Poolnautics, as the partner companies aren't named. The new pieces (the hero's split bar and moving card, the warning box, the
// panel's question list, the byline) are guide.css's "fourth guide" rules, scoped to this page (.guide-chem,
// .gd-hero--chem). Everything is in the pre-rendered markup; the page's own script is only the two Copy
// buttons and the hero card's scroll parallax (desktop, motion allowed).

const ORIGIN = 'https://getpoolnautics.com';
const PAGE_URL = `${ORIGIN}${CHEM_GUIDE_PATH}`;
const AI_SETTINGS_URL = 'https://app.poolnautics.app/settings/ai-assistants';

// Its image (the share image) is added in entry-server.jsx from ROUTE_META, where the PNG's path lives.
export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${PAGE_URL}#article`,
    headline: CHEM_GUIDE_H1,
    description: CHEM_GUIDE_DESCRIPTION,
    url: PAGE_URL,
    mainEntityOfPage: PAGE_URL,
    datePublished: CHEM_GUIDE_PUBLISHED,
    dateModified: CHEM_GUIDE_PUBLISHED,
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
      { '@type': 'ListItem', position: 3, name: 'How to find out if a pool tech is stealing chemicals', item: PAGE_URL },
    ],
  },
];

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

/* ---------- Hero ---------- */

const SHORTCUTS = [
  ['receipts', 'Logged vs. bought', ReceiptText],
  ['readings', 'Dose vs. reading', Droplet],
  ['results', 'What each result means', ListChecks],
];

const PARALLAX = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

/** The hero's two cards. From 1024px, with motion allowed, the small card rises a little as the hero
 *  scrolls away: --gd-sy (the scroll, 0 to the hero's height) on .gd-vis, which guide.css turns into a
 *  `translate`, so it adds to the card's own animated transform. */
function HeroGap() {
  const ref = useRef(null);
  useEffect(() => {
    const vis = ref.current;
    if (!vis) return undefined;
    const mq = window.matchMedia(PARALLAX);
    const hero = vis.closest('header');
    let frame = 0;
    const read = () => {
      frame = 0;
      const max = hero ? hero.offsetHeight : 0;
      vis.style.setProperty('--gd-sy', String(Math.min(Math.max(window.scrollY, 0), max)));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };
    const sync = () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
      if (mq.matches) {
        window.addEventListener('scroll', onScroll, { passive: true });
        read();
      } else {
        vis.style.removeProperty('--gd-sy');
      }
    };
    sync();
    mq.addEventListener('change', sync);
    return () => {
      mq.removeEventListener('change', sync);
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div
      className="gd-vis"
      ref={ref}
      role="img"
      aria-label="Jason, liquid chlorine, 4 weeks: 240 gallons bought on his card, 148 gallons logged at his pools, 92 gallons not on any report. Why it matters: chemicals cost money. Every unlogged gallon comes out of your profit."
    >
      <div className="gd-vis-card">
        <span className="gd-vis-k">Jason · liquid chlorine · 4 weeks</span>
        <div className="gd-vis-r"><span>Bought on his card</span><b>240 gal</b></div>
        <div className="gd-vis-r is-credit"><span>Logged at his pools</span><b>−148 gal</b></div>
        <div className="gd-vis-bar" aria-hidden="true"><i className="is-in" /><i className="is-gap" /></div>
        <div className="gd-vis-r is-total"><span>Not on any report</span><b>92 gal</b></div>
      </div>
      <div className="gd-vis-next">
        <span className="gd-vis-k">Why it matters</span>
        <p className="gd-vis-say">Chemicals cost money!</p>
        <small>Every unlogged gallon comes out of your profit.</small>
      </div>
    </div>
  );
}

/* ---------- The Poolnautics panel: questions to copy (landing/guides/AskList.jsx) ---------- */

const QUESTIONS = [
  ['Logged vs. bought', 'How many gallons of acid and chlorine did [tech name] use over the past 4 weeks, week by week?'],
  ['Dosing vs. the team', 'What is the average chemical cost per stop per technician?'],
  ['Biggest doses', 'Which pools did [tech name] add the most chlorine to this month?'],
  ['Chlorine readings', 'What is the average chlorine reading per stop for each technician?'],
  ['Stabilizer', 'Which pools have low stabilizer?'],
];

/* ---------- The page ---------- */

const TOC = [
  ['quiet', 'Say nothing yet'],
  ['receipts', 'Compare logged with bought'],
  ['dosing', 'Compare him to the team'],
  ['readings', 'Check doses against readings'],
  ['pools', 'Check a few pools yourself'],
  ['results', 'What each result means'],
  ['talk', 'Before you talk to him'],
  ['questions', 'Common questions'],
];

const Step = ({ n }) => <span className="gd-num"><i>{n}</i>Step {n}</span>;
const Label = ({ children }) => <span className="gd-num">{children}</span>;

export default function GuideChemicalsPage() {
  const theme = usePreviewTheme();
  return (
    <div className="mktg guide-page guide-chem relative min-h-screen font-sans antialiased">
      <Nav tone="light" overlay />
      <main>
        <header className="gd-hero gd-hero--chem">
          <div className="container">
            <div className="gd-hero-grid">
              <div>
                <p className="gd-eyebrow">Guide for pool companies · 5 steps</p>
                <h1>{CHEM_GUIDE_H1_LEAD} <span className="gd-h1-soft">{CHEM_GUIDE_H1_SOFT}</span></h1>
                <p className="gd-lede">{CHEM_GUIDE_LEDE}</p>
                <p className="gd-byline">{CHEM_GUIDE_BYLINE}</p>
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
              <HeroGap />
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
                  <li>Say nothing to the technician while you check. You want his normal routine.</li>
                  <li>Compare what he logged at service with what he bought at the distributor.</li>
                  <li>If those match, compare his dosing with your other technicians.</li>
                  <li>If his dosing is high, check the chlorine readings after his biggest doses.</li>
                  <li>Test a few of those pools yourself for stabilizer and algae.</li>
                  <li>Rule out the ordinary explanations before you talk to him.</li>
                </ol>
              </div>

              <section id="quiet" aria-labelledby="quiet-title">
                <Step n={1} />
                <h2 id="quiet-title">Do not say anything to the technician</h2>
                <div className="gd-warn" role="note">
                  <span className="gd-warn-k"><TriangleAlert strokeWidth={2.2} aria-hidden="true" />Warning</span>
                  <p className="gd-warn-h">Say nothing until you have finished checking.</p>
                  <p>You want him to keep his normal routine. The moment he knows you are looking, what he buys and what he logs will change, and the numbers you need are gone.</p>
                </div>
                <p>That means no questions, no hints, and no changes to his route, his card or his supplies. Do not mention it to your other technicians either.</p>
                <p>Everything in the next four steps can be done quietly, from records you already have and a few pool visits of your own.</p>
                <p>It protects him too. If the numbers turn out fine, he never has to know you wondered.</p>
              </section>

              <section id="receipts" aria-labelledby="receipts-title">
                <Step n={2} />
                <h2 id="receipts-title">Compare what he logged with what he bought</h2>
                <p>Start with the two numbers that should match: what he reported adding during service, and what he bought at the distributor.</p>
                <ol className="gd-steps">
                  <li><b>Pick a period.</b> Four weeks is enough to see a pattern.</li>
                  <li><b>Add up what he logged.</b> The chlorine and acid on his service reports for those dates.</li>
                  <li><b>Add up what he bought.</b> Everything on his card at the distributor for the same dates.</li>
                  <li><b>Subtract.</b> What is left never went on a service report.</li>
                </ol>
                <div className="gd-math">
                  <div className="gd-math-card"><span className="gd-math-k">His card at the distributor</span><span className="gd-math-r">Liquid chlorine <b>240 gal</b></span><span className="gd-math-r gd-math-t">Bought <b>240 gal</b></span></div>
                  <div className="gd-math-arrow" aria-hidden="true"><Arrow /></div>
                  <div className="gd-math-card is-after"><span className="gd-math-k">His service reports</span><span className="gd-math-r">Logged at pools <b>148 gal</b></span><span className="gd-math-r gd-math-t">Unaccounted <b>92 gal</b></span></div>
                </div>
                <p>If he bought 240 gallons of chlorine and logged 148, there are 92 gallons that never went on a service report. That is 38% of what he bought, well past a 10% allowance. That gap is what you ask about.</p>
                <div className="gd-note"><p><b>Allow for a 10% discrepancy.</b> We typically recommend it. Nobody can report perfectly when they are dosing a pool as well as they can. A tech might put in slightly over a gallon but under a gallon and a half, because that is what works for the pool.</p></div>
                <div className="gd-note"><p><b>Allow for what is sitting on his truck.</b> A tech who stocked up on the last day of the period will look short on paper. Count the truck, or stretch the period until that evens out.</p></div>
                <p>If the two numbers line up, he is not walking off with product. He may still be using too much of it, so go to Step 3.</p>
              </section>

              <section id="dosing" aria-labelledby="dosing-title">
                <Step n={3} />
                <h2 id="dosing-title">Compare his dosing to your other technicians</h2>
                <p>If receipts and service reports match, the next question is whether he is overdosing. Compare how much chlorine and acid he uses per visit with a sensible benchmark.</p>
                <p>The best benchmark is your own team. Your other technicians work the same region, the same season and the same product, so their numbers are a fairer test than a textbook average.</p>
                <ul className="gd-list">
                  <li><b>Similar size.</b> Compare pools of about the same gallons.</li>
                  <li><b>Same kind of pool.</b> Chlorine against chlorine, salt against salt.</li>
                  <li><b>Same weeks.</b> July and November are not the same job.</li>
                </ul>
                <p>If his dosing is in line with everyone else’s, there is nothing here. If it is clearly higher, go to Step 4.</p>
              </section>

              <section id="readings" aria-labelledby="readings-title">
                <Step n={4} />
                <h2 id="readings-title">Check his doses against his own chlorine readings</h2>
                <p>For the pools where he logs the most chlorine, look at the chlorine level he recorded on the following visit.</p>
                <div className="gd-pull"><p>A real dose shows up in the next reading.</p></div>
                <p>Here is the pattern to look for. A 10,000 gallon pool is dosed with 2.5 gallons of liquid chlorine. A week later the chlorine reads low again.</p>
                {/* 31 ppm, the owner's choice (2026-11-28): 12.5% is 125 g of chlorine a litre, so 2.5 gal (9.46 L)
                    is 1,183 g in 37,854 L (10,000 gal), 31.25 mg/L. */}
                <p>That is a very large dose for a pool that size, roughly 31 ppm with 12.5% liquid chlorine. A healthy pool does not lose that in a week. So one of two things is true:</p>
                <ul className="gd-list">
                  <li><b>He is not putting 2.5 gallons in that pool.</b> The chlorine went somewhere else.</li>
                  <li><b>The pool cannot hold chlorine.</b> The most likely reason is low stabilizer.</li>
                </ul>
                <p>The readings alone cannot tell you which. Step 5 can.</p>
              </section>

              <section id="pools" aria-labelledby="pools-title">
                <Step n={5} />
                <h2 id="pools-title">Check a few pools yourself</h2>
                <p>Pick a few pools you think are being overdosed and test them in person. You are looking for a reason the pool would burn through chlorine.</p>
                <ul className="gd-list">
                  <li><b><a className="gd-a" href={STAB_GUIDE_PATH}>Stabilizer</a>.</b> Test it yourself. We recommend a drop test for the most accurate results. Low stabilizer is the most common reason a pool will not hold chlorine.</li>
                  <li><b>Algae.</b> Look for any that is present. Algae uses up chlorine as fast as it goes in.</li>
                  <li><b>Phosphates and nitrates.</b> Both affect how well a pool holds chlorine. What counts as high depends on your region.</li>
                </ul>
                <p>If you find one of these, his doses are probably real and the pool is the problem. Fix the pool and the chlorine use should drop.</p>
                <p>That still leaves a question about him. If he has been reporting stabilizer inaccurately, or not treating for phosphates, it is your responsibility to make sure he is trained and understands how pool chemistry works. If he has been through a CPO class and knows exactly what should be going on, there is no real excuse.</p>
                <p>Either way, do not leave it. A tech putting that many gallons into a pool unnecessarily is putting your company at risk of a phone call from a customer.</p>
                <p>If stabilizer is fine, there is no algae, and phosphates and nitrates are normal for your area, the pool should be holding chlorine. The chlorine he logged is not going into that pool.</p>
              </section>

              <div className="gd-proof">
                <span className="gd-num">Already on Poolnautics?</span>
                <h2>Then this is incredibly easy</h2>
                <p>Connect Claude, ChatGPT or Grok to your account, then paste any of the questions below. Your technicians already log chemicals and readings at every visit, so the answers come back in seconds. No hand-auditing service reports.</p>
                <div className="gd-proof-row">
                  <a className="hero-cta gd-cta" href={AI_SETTINGS_URL} target="_blank" rel="noopener">Add AI Assistant<ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" /></a>
                  <a className="gd-ghost" href={ctaHref(theme)}>Not on Poolnautics? Start your {TRIAL_DAYS}-day trial</a>
                </div>
                <AskList questions={QUESTIONS} note={<>Use whichever ones help. Swap <AskVar /> for your technician.</>} />
              </div>

              <section id="results" aria-labelledby="results-title">
                <Label>The answer key</Label>
                <h2 id="results-title">What each result means</h2>
                <p>Find the line that matches what you saw.</p>
                <ul className="gd-list">
                  <li><b>He bought much more than he logged.</b> Product is leaving the truck without a service report: taken, used on other pools, or simply not logged. Count the truck, then ask him about the gap.</li>
                  <li><b>Bought and logged match, and his dosing matches the team.</b> Nothing is wrong. Stop here.</li>
                  <li><b>Dosing is high and the next chlorine readings are high too.</b> He is overdosing. Retrain him on dosing.</li>
                  <li><b>Dosing is high, chlorine reads low, and the pool has low stabilizer, algae or high phosphates.</b> The doses are real and the pool cannot hold chlorine. Fix the pool, then deal with why he missed it.</li>
                  <li><b>Dosing is high, chlorine reads low, and the pool tests fine.</b> The logged chlorine is not going into that pool. Ask him about those pools.</li>
                </ul>
              </section>

              <section id="talk" aria-labelledby="talk-title">
                <Label>Last step</Label>
                <h2 id="talk-title">Before you talk to him</h2>
                <p>A gap in the numbers is a reason to ask, not proof. Rule out the ordinary explanations first:</p>
                <ul className="gd-list">
                  <li><b>Missed logging.</b> He added chemicals and forgot to log them.</li>
                  <li><b>Truck stock.</b> He stocked up and has not used it yet.</li>
                  <li><b>Buying for others.</b> He bought for another technician or for the shop.</li>
                  <li><b>One-off jobs.</b> A green pool cleanup uses a lot in one visit.</li>
                  <li><b>Losses.</b> Product was spilled, damaged or returned.</li>
                </ul>
                <p>When you do raise it, bring the numbers and the specific pools. Ask him to walk you through them. A tech with nothing to hide can usually explain a gap in a few minutes, and you may learn about a pool problem you did not know you had.</p>
                <div className="gd-note"><p><b>This guide is about checking the facts.</b> If it leads to discipline or letting someone go, get advice on how to handle that properly where you operate.</p></div>
              </section>

              <section id="questions" aria-labelledby="questions-title">
                <Label>FAQ</Label>
                <h2 id="questions-title">Common questions</h2>
                <h3>Does a gap between receipts and service reports prove a tech is stealing?</h3>
                <p>No. It proves product left the truck without being logged. Missed logging, truck stock and one-off jobs can all cause it.</p>
                <h3>How much chlorine should a pool tech use per pool?</h3>
                <p>It depends on pool size, season and region. The most useful comparison is your own technicians on similar pools in the same weeks.</p>
                <h3>Can low stabilizer make it look like a tech is overdosing?</h3>
                <p>Yes. A pool with low stabilizer loses chlorine quickly, so an honest tech has to keep adding more. Test the pool before you question the tech.</p>
                <h3>Do I need Poolnautics to do this?</h3>
                <p>No. The method works with any service records. Poolnautics and Claude just get you the numbers in a minute or two.</p>
              </section>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
