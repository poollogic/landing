import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// /ai-integrations' "On this page" bar, from the signed-off prototype (poollogic-hero v23): three
// frosted pills on a clear bar (the brand, which goes back to the top; the section links; Reserve
// your spot) that slides down once the hero has scrolled away and goes again when the closing
// call to action comes up. A blue highlight slides to the section you're in (grey under the
// pointer), and a thin blue line along the links' pill shows how far down the page you are.
// Clicking a link scrolls there and holds its highlight until the scroll ends. Over a light
// section (section[data-theme="light"]: mark any light section so) it turns light (.on-light),
// while that section is under the bar's middle. Hidden, it's
// aria-hidden and out of the tab order. Client only: it mounts after hydration, into <body> (as
// the prototype did, so it takes the body's type), and the pre-rendered HTML doesn't carry it.
// Positions update through refs on each scroll frame; React renders what's shown and the current
// link. Styles: ai.css (.ai-onpage*); sections get scroll-margin-top there too.

const SECTIONS = [
  ['connect-ai', 'AI assistant'],
  ['guardrails', 'Guardrails'],
  ['technician-app', 'Tech app'],
  ['webhooks', 'Webhooks'],
  ['automations', 'Automations'],
  ['leads', 'Leads'],
  ['texting', 'Texting'],
  ['developers', 'API'],
  ['faq', 'FAQ'],
];

export default function SectionNav() {
  const [items, setItems] = useState(null); // null on the server and the first render
  const [shown, setShown] = useState(false);
  const [current, setCurrent] = useState(null);
  const [onLight, setOnLight] = useState(false);
  const barRef = useRef(null);
  const wrapRef = useRef(null);
  const railRef = useRef(null);
  const indRef = useRef(null);
  const handlers = useRef(null); // set by the effect below, for the events in the markup

  useEffect(() => setItems(SECTIONS.filter(([id]) => document.getElementById(id))), []);

  useEffect(() => {
    if (!items) return undefined;
    const bar = barRef.current, wrap = wrapRef.current, rail = railRef.current, ind = indRef.current;
    const hero = document.querySelector('.ai-page section.hero');
    const closeSec = document.querySelector('.ai-page section.ai-close');
    const links = [...rail.querySelectorAll('a')];
    const secs = items.map(([id]) => document.getElementById(id));
    const link = (id) => links.find((a) => a.dataset.id === id);
    let cur = null, lock = null, lockT = 0, raf = 0, end = null;

    // The highlight: blue on the current link, grey (hov) under the pointer, gone with no current link.
    const place = (a, hov) => { if (!a) { ind.style.opacity = 0; return; } ind.classList.toggle('is-hover', !!hov); ind.style.opacity = 1; ind.style.width = a.offsetWidth + 'px'; ind.style.transform = `translateX(${a.offsetLeft}px)`; };
    // Light while a light section is under the bar's middle (looked up each time, so any light
    // section counts, whenever it mounts).
    const shade = () => {
      const mid = bar.offsetHeight / 2;
      const lights = document.querySelectorAll('section[data-theme="light"]');
      setOnLight([...lights].some((s) => { const r = s.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; }));
    };
    // Edge fades on the links' pill when it scrolls sideways.
    const fades = () => { wrap.classList.toggle('fl', rail.scrollLeft > 2); wrap.classList.toggle('fr', rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 2); };
    const setActive = (id) => {
      cur = id; setCurrent(id);
      const act = link(id) ?? null;
      place(act); if (act && rail.scrollWidth > rail.clientWidth) rail.scrollLeft = act.offsetLeft - rail.clientWidth / 2 + act.offsetWidth / 2;
    };
    const tick = () => {
      let id = null; for (const s of secs) if (s.getBoundingClientRect().top <= 136) id = s.id;
      if (lock) id = lock; if (id !== cur) setActive(id);
      setShown(!!hero && hero.getBoundingClientRect().bottom < 60 && (!closeSec || closeSec.getBoundingClientRect().top > innerHeight * .55));
      if (secs.length && closeSec) { const a0 = secs[0].offsetTop - 200, b0 = closeSec.offsetTop - innerHeight; rail.style.setProperty('--p', Math.max(0, Math.min(1, (scrollY - a0) / (b0 - a0)))); }
      fades();
      shade();
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; tick(); }); };
    const onResize = () => { place(link(cur)); fades(); shade(); };
    const unlock = () => { lock = null; removeEventListener('scrollend', end); end = null; };

    handlers.current = {
      fades,
      hover: (a) => { if (a.dataset.id !== cur) place(a, true); },
      leave: () => place(link(cur)),
      pick: (id) => { // a click: hold its highlight until the scroll ends
        lock = id; setActive(id); clearTimeout(lockT);
        if (end) removeEventListener('scrollend', end);
        end = unlock; addEventListener('scrollend', end); lockT = setTimeout(end, 1200);
      },
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    tick();
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onResize);
      if (end) removeEventListener('scrollend', end);
      cancelAnimationFrame(raf);
      clearTimeout(lockT);
      handlers.current = null;
    };
  }, [items]);

  if (!items) return null;
  const tab = shown ? undefined : -1;
  const toTop = (e) => {
    e.preventDefault();
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return createPortal(
    <div ref={barRef} className={`ai-onpage${shown ? ' is-shown' : ''}${onLight ? ' on-light' : ''}`} aria-hidden={shown ? undefined : 'true'}>
      <a className="ai-onpage-brand" href="#" aria-label="Back to top" tabIndex={tab} onClick={toTop}><i /><b>Poolnautics</b></a>
      <div ref={wrapRef} className="ai-onpage-wrap">
        <nav ref={railRef} className="ai-onpage-rail" aria-label="On this page" onScroll={() => handlers.current?.fades()} onMouseLeave={() => handlers.current?.leave()}>
          <span ref={indRef} className="ai-onpage-ind" />
          {items.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              data-id={id}
              aria-current={current === id ? 'true' : undefined}
              tabIndex={tab}
              onMouseEnter={(e) => handlers.current?.hover(e.currentTarget)}
              onClick={() => handlers.current?.pick(id)}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
      <a className="ai-onpage-cta" href="/reserve" tabIndex={tab}>Reserve your spot <span>→</span></a>
    </div>,
    document.body,
  );
}
