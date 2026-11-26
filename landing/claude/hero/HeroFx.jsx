import React, { useEffect, useRef, useState } from 'react';

// /claude's hero light (a copy of /ai-and-automations' HeroFx.jsx, 2026-11-23, classes ai- → ch-), behind its content: a fade at the hero's foot, then the smoke
// canvas, then the beam canvas (in that order, so the beam draws over the smoke). The canvases are
// empty in the pre-rendered HTML; once the page has hydrated, the WebGL code (heroFx.js) loads in
// its own chunk and starts, and it stops and releases its contexts when the page unmounts. It
// finds the hero and the assistant window from here: they're this component's section and the
// figure inside it. Styles: claudeHero.css (.ch-hero-fade, .ch-hero-smoke, .ch-hero-beam).
// It starts once the page has loaded and the browser is idle, so the effects never compete with the
// first paint or the page becoming usable.
//
// Phones (PHONE, under 768px): nothing starts: no WebGL context, no shaders, no animation loop (the CSS
// hides the canvases too, and gives the chat card an outline instead). If the window crosses 768px after
// load (rotation, resizing), the effects start when it gets wide enough and stop, releasing their
// contexts, when it gets narrow again. A canvas whose context has been released can't get another, so
// each stop also swaps in fresh canvases (gen) for the next start.

const PHONE = '(max-width: 767.98px)'; // claudeHero.css hides the canvases below this too

export default function HeroFx() {
  const smokeRef = useRef(null);
  const beamRef = useRef(null);
  const [gen, setGen] = useState(0); // bumped after each stop: new canvases for the next start
  const pageLoaded = useRef(false);

  useEffect(() => {
    const phone = matchMedia(PHONE);
    let stop = null;
    let cancelled = false;
    let idle = 0;
    let pending = false; // a start is queued (idle callback or chunk load)
    const start = () => import('./heroFx.js').then(
      ({ default: startHeroFx }) => {
        pending = false;
        const smoke = smokeRef.current;
        const beam = beamRef.current;
        const hero = beam?.parentElement;
        const card = hero?.querySelector('figure.ch-chat');
        if (cancelled || stop || phone.matches || !card) return;
        stop = startHeroFx({ hero, card, smoke, beam });
      },
      () => { pending = false; }, // decoration: if the chunk won't load, the hero stays as it is
    );
    const whenIdle = () => {
      pageLoaded.current = true;
      if (phone.matches || stop || pending) return;
      pending = true;
      idle = 'requestIdleCallback' in window ? requestIdleCallback(start, { timeout: 2000 }) : setTimeout(start, 200);
    };
    const cancelIdle = () => { if ('cancelIdleCallback' in window) cancelIdleCallback(idle); else clearTimeout(idle); };
    // Crossing 768px: start when wide enough, stop (and release the contexts) when narrow again.
    const onChange = () => {
      if (!phone.matches) { if (pageLoaded.current) whenIdle(); return; }
      cancelIdle();
      pending = false;
      if (stop) {
        stop();
        stop = null;
        setGen((g) => g + 1); // the released canvases are replaced; this effect runs again for them
      }
    };
    phone.addEventListener('change', onChange);
    if (pageLoaded.current || document.readyState === 'complete') whenIdle();
    else addEventListener('load', whenIdle, { once: true });
    return () => {
      cancelled = true;
      phone.removeEventListener('change', onChange);
      removeEventListener('load', whenIdle);
      cancelIdle();
      stop?.();
    };
  }, [gen]);

  return (
    <>
      <div className="ch-hero-fade" aria-hidden="true" />
      <canvas key={`smoke${gen}`} ref={smokeRef} className="ch-hero-smoke" aria-hidden="true" />
      <canvas key={`beam${gen}`} ref={beamRef} className="ch-hero-beam" aria-hidden="true" />
    </>
  );
}
