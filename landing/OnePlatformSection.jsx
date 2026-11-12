import React, { useEffect, useRef, useState } from 'react';
import { Wordmark } from '../components/brand-logo.jsx';
import './one-platform.css';

// "The only software your pool company needs": straight after the hero. What owners still do by hand with other pool software,
// in three cards, then the pill that says Poolnautics handles all of it. Names no competitor.
//
// It plays once as it comes into view (one-platform.css): the copy rises, the X markers pop in one
// by one, the connector draws down and the pill rises. The pre-rendered page draws it finished; the
// animation is only set up when the section is still below the window, so nothing on screen blinks
// out, and never with reduced motion.

const CARDS = [
  {
    title: 'Babysitting your billing',
    items: ['Running billing batches by hand', 'Adding chemicals to invoices', 'Forgetting to invoice extra work', 'Raising prices one by one'],
  },
  {
    title: 'Trying to get paid',
    items: ['Chasing late payers', 'Adding late fees by hand', 'Pausing non-payers yourself', 'Phoning about failed cards'],
  },
  {
    title: 'Keeping tabs on techs and trucks',
    items: ['Policing service reports', 'Scrambling when a tech calls out', 'Guessing your cost per stop', 'Tracking mileage and oil changes'],
  },
];
const AREAS = ['Routes', 'Technicians', 'Billing', 'Payments', 'Fleet'];

const Cross = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#dc2626" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M6.25 6.25l5.5 5.5M11.75 6.25l-5.5 5.5" />
  </svg>
);

export default function OnePlatformSection() {
  const ref = useRef(null);
  const [anim, setAnim] = useState('none'); // 'none' (drawn finished) | 'armed' | 'in'

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight) return undefined; // already on screen
    setAnim('armed');
    // In view once its top passes 65% of the window's height (about 35% of the window is section).
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setAnim('in');
    }, { rootMargin: '0px 0px -35% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = anim === 'none' ? '' : anim === 'armed' ? ' op-anim' : ' op-anim is-in';
  return (
    <section ref={ref} id="platform" className={`op-section${cls}`} aria-labelledby="op-heading">
      <div className="op-inner">
        <h2 id="op-heading" className="op-title op-rise">
          Other pool software gives you a place to do the work. <span className="op-keep">Poolnautics does the work.</span>
        </h2>
        <p className="op-lede op-rise">The only software your pool company needs.</p>

        <div className="op-rise op-still">
          <p className="op-sub">With most pool software, you’re still…</p>
          <div className="op-cards">
            {CARDS.map((card, c) => (
              <div key={card.title} className="op-card">
                <h3 className="op-card-title">{card.title}</h3>
                <ul className="op-list">
                  {card.items.map((item, i) => (
                    <li key={item}>
                      <span className="op-x" style={{ '--d': `${(0.35 + c * 0.12 + i * 0.14).toFixed(2)}s` }}><Cross /></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="op-line" aria-hidden="true" />
        <div className="op-pill">
          <span className="op-pill-head">
            <Wordmark bg="dark" height={15} style={{ display: 'inline-block' }} />
            <span className="sr-only">Poolnautics</span>
            <span className="op-pill-handles">handles all of it</span>
          </span>
          {/* A list, so crawlers and screen readers get five plain items; the dots are drawn in CSS. */}
          <ul className="op-pill-areas">
            {AREAS.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
