import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';

// /workflow's "Setup flow" band, straight under the hero (#your-way): a few of the ~10 setup questions on
// the left, the company settings they're saved to in the middle, and what three screens do as a result on
// the right. Tapping an answer rewrites the lines it changes; thin connectors carry pulses of light between
// the columns, ending on each card's centre as measured after layout. Below 1040px the columns stack and
// each question shows its own result. Styles: workflow.css ("Setup flow"). The first render uses fixed
// starting positions, the same on the server and in the browser; the measured ones replace them before
// the first paint.

// Sample questions. `feeds` lists which screens (by index in getScreens) each answer changes.
// `effect` is the [screen, line] shown inside the question card on tablet and mobile.
const QUESTIONS = [
  { text: 'To schedule a diagnostic, do you collect before or after?', options: ['Before the job', 'After the job', 'No charge'], feeds: [1], effect: [1, 0] },
  { text: 'To schedule a job, do you wait on a quote approval or invoice in advance?', options: ['Wait on quote approval', 'Invoice in advance'], feeds: [0, 1, 2], effect: [2, 0] },
  { text: 'When a technician marks a job complete, how soon should the invoice send?', options: ['5 min (default)', 'Immediately', 'Custom delay'], feeds: [0], effect: [0, 2] },
  { text: 'Should your technician see the customer’s phone number?', options: ['Yes', 'No'], feeds: [1], effect: [1, 2] },
];
const DEFAULT_ANSWERS = [0, 0, 0, 1]; // phone number defaults to "No"

// What each screen does for a given set of answers.
function getScreens([diagnostic, order, wait, phone]) {
  const quote = order === 0;
  return [
    {
      title: 'Office dashboard',
      rules: [
        quote ? 'Price a request once. It goes out as a quote.' : 'Price a request once. It goes out as an invoice.',
        quote ? 'Work order opens when the customer approves.' : 'Work order opens when the customer pays.',
        !quote
          ? 'Jobs are already paid when they finish.'
          : wait === 0
            ? 'Finished jobs are invoiced after 5 minutes.'
            : wait === 1
              ? 'Finished jobs are invoiced immediately.'
              : 'Finished jobs are invoiced after your custom delay.',
      ],
    },
    {
      title: 'Technician app',
      rules: [
        diagnostic === 0
          ? 'Diagnostics reach your tech once they’re paid.'
          : diagnostic === 1
            ? 'Diagnostics are billed after the job.'
            : 'Diagnostics are no charge. Nothing to collect.',
        quote ? 'Marks a job complete and it bills itself.' : 'Marks a job complete. It’s already paid.',
        phone === 1 ? 'Prices and customer phone stay hidden.' : 'Prices stay hidden. Customer phone is shown.',
      ],
    },
    {
      title: 'Your customer',
      rules: [
        quote ? 'Gets a quote and approves it.' : 'Gets an invoice and pays it.',
        quote ? 'Work starts after approval.' : 'Work starts after payment.',
        quote ? 'Gets the invoice once the job is done.' : 'Nothing more to pay when the job is done.',
      ],
    },
  ];
}

// Where each connector meets its card, as a percentage of the diagram height. These are only
// starting values: the real card centres are measured after layout (see the effect below).
const START_GEO = { inY: [10, 30, 50, 70, 90], outY: [16.667, 50, 83.333] };
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function Gradient({ id, from, to }) {
  return (
    <defs>
      <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0">
        <stop offset="0" stopColor="#2e85ff" stopOpacity={from} />
        <stop offset="1" stopColor="#2e85ff" stopOpacity={to} />
      </linearGradient>
    </defs>
  );
}

export default function SetupFlowSection() {
  const [answers, setAnswers] = useState(DEFAULT_ANSWERS);
  // The last question changed, plus a counter so repeat changes replay the animations.
  const [last, setLast] = useState(null);

  // Measure the vertical centre of every card so the connector lines always land on it,
  // whatever the cards' heights. Re-measures when anything in the diagram resizes.
  const gridRef = useRef(null);
  const [geo, setGeo] = useState(START_GEO);
  useIsoLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;
    const centres = (wireSelector, cardSelector) => {
      const wire = grid.querySelector(wireSelector).getBoundingClientRect();
      if (!wire.height) return null;
      return [...grid.querySelectorAll(cardSelector)].map((card) => {
        const box = card.getBoundingClientRect();
        return Math.round(((box.top + box.height / 2 - wire.top) / wire.height) * 1000) / 10;
      });
    };
    const measure = () => {
      const inY = centres('.rf-sf-w1', '.rf-sf-in .rf-sf-node');
      const outY = centres('.rf-sf-w2', '.rf-sf-out .rf-sf-node');
      if (!inY || !outY) return;
      setGeo((prev) => (prev.inY.join() === inY.join() && prev.outY.join() === outY.join() ? prev : { inY, outY }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    grid.querySelectorAll('.rf-sf-node').forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const choose = (q, option) => {
    if (answers[q] === option) return;
    setAnswers((prev) => prev.map((value, i) => (i === q ? option : value)));
    setLast((prev) => ({ q, tick: (prev?.tick ?? 0) + 1 }));
  };

  const screens = getScreens(answers);
  const hotOut = last ? QUESTIONS[last.q].feeds : [];

  return (
    <section id="your-way" className="rf-section rf-dark rf-setupflow" aria-labelledby="your-way-heading">
      <div className="rf-inner">
        <div className="section-head section-head--center">
          <p className="section-eyebrow">Setup</p>
          <h2 id="your-way-heading" className="section-title">
            About 10 questions to automate your pool service.
          </h2>
          <p className="section-sub">
            Explaining workflows and automations is never sexy… The good news: we’ve already done all the
            work, so you don’t have to. Answer 10 or 11 simple questions from your dashboard, and every screen
            follows your rules.
          </p>
        </div>

        <div className="rf-sf-grid" ref={gridRef}>
          <p className="rf-sf-label rf-sf-l1">Your answers<span>Tap one to try it</span></p>
          <ul className="rf-sf-stack rf-sf-in" role="list">
            {QUESTIONS.map(({ text, options, effect: [screen, line] }, q) => (
              <li key={text}>
                <div className="rf-sf-node">
                  <p className="rf-sf-title">{text}</p>
                  <div className="rf-sf-opts" role="group" aria-label={text}>
                    {options.map((option, i) => (
                      <button
                        key={option}
                        type="button"
                        className={answers[q] === i ? 'is-on' : undefined}
                        aria-pressed={answers[q] === i}
                        onClick={() => choose(q, i)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <p key={screens[screen].rules[line]} className="rf-sf-effect">
                    <span>{screens[screen].title}</span>
                    {screens[screen].rules[line]}
                  </p>
                </div>
              </li>
            ))}
            <li>
              <div className="rf-sf-node rf-sf-node--more">+ 6 or 7 more, depending on your answers</div>
            </li>
          </ul>

          <div className="rf-sf-wire rf-sf-w1" aria-hidden="true">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <Gradient id="rf-sf-g-in" from={0.25} to={0.9} />
              {geo.inY.map((y, i) => {
                const d = `M0,${y} C55,${y} 45,50 100,50`;
                const isMore = i === QUESTIONS.length;
                const hot = last?.q === i;
                return (
                  <g key={i}>
                    <path className={isMore ? 'rf-sf-line is-faint' : 'rf-sf-line'} stroke="url(#rf-sf-g-in)" d={d} />
                    {!isMore && (
                      <path
                        key={hot ? last.tick : 'idle'}
                        className={hot ? 'rf-sf-pulse is-hot' : 'rf-sf-pulse'}
                        style={{ '--d': `${i * 0.6}s` }}
                        d={d}
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="rf-sf-hubwrap">
            <div className="rf-sf-hub">
              {last && <i key={last.tick} className="rf-sf-ring" aria-hidden="true" />}
              <p className="rf-sf-title">Your company settings</p>
              <p className="rf-sf-body">Your standard operating procedure, saved in one place.</p>
              <span className="rf-sf-once"><Check size={14} aria-hidden="true" />Answered once</span>
            </div>
          </div>

          <div className="rf-sf-wire rf-sf-w2" aria-hidden="true">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <Gradient id="rf-sf-g-out" from={0.9} to={0.35} />
              {geo.outY.map((y, i) => {
                const d = `M0,50 C55,50 45,${y} 100,${y}`;
                const hot = hotOut.includes(i);
                return (
                  <g key={i}>
                    <path className="rf-sf-line" stroke="url(#rf-sf-g-out)" d={d} />
                    <path
                      key={hot ? last.tick : 'idle'}
                      className={hot ? 'rf-sf-pulse is-hot' : 'rf-sf-pulse'}
                      style={{ '--d': `${1.6 + i * 0.4}s`, '--hd': '0.35s' }}
                      d={d}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          <p className="rf-sf-label rf-sf-l3">Your rules</p>
          <ul className="rf-sf-stack rf-sf-out" role="list" aria-live="polite">
            {screens.map(({ title, rules }, i) => (
              <li key={title}>
                <div className="rf-sf-node">
                  {hotOut.includes(i) && <i key={last.tick} className="rf-sf-ring" aria-hidden="true" />}
                  <p className="rf-sf-title">{title}</p>
                  <ul className="rf-sf-rules" role="list">
                    {/* Keyed by text so a changed line remounts and plays its swap-in animation. */}
                    {rules.map((rule) => (
                      <li key={rule}><Check size={14} aria-hidden="true" /><span>{rule}</span></li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="rf-sf-foot">
          <strong>You can always change your settings later.</strong> A solid standard operating procedure is the
          foundation that lets your company run efficiently, grow and make more money.
        </p>
      </div>
    </section>
  );
}
