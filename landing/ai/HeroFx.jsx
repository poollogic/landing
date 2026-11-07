import React, { useEffect, useRef } from 'react';

// The /ai-integrations hero's light, behind its content: a fade at the hero's foot, then the smoke
// canvas, then the beam canvas (in that order, so the beam draws over the smoke). The canvases are
// empty in the pre-rendered HTML; once the page has hydrated, the WebGL code (heroFx.js) loads in
// its own chunk and starts, and it stops and releases its contexts when the page unmounts. It
// finds the hero and the assistant window from here: they're this component's section and the
// figure inside it. Styles: ai.css (.ai-hero-fade, .ai-hero-smoke, .ai-hero-beam).

export default function HeroFx() {
  const smokeRef = useRef(null);
  const beamRef = useRef(null);

  useEffect(() => {
    let stop = null;
    let cancelled = false;
    import('./heroFx.js').then(
      ({ default: startHeroFx }) => {
        const smoke = smokeRef.current;
        const beam = beamRef.current;
        const hero = beam?.parentElement;
        const card = hero?.querySelector('figure.ai-chat');
        if (cancelled || !card) return;
        stop = startHeroFx({ hero, card, smoke, beam });
      },
      () => {}, // decoration: if the chunk won't load, the hero stays as it is
    );
    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);

  return (
    <>
      <div className="ai-hero-fade" aria-hidden="true" />
      <canvas ref={smokeRef} className="ai-hero-smoke" aria-hidden="true" />
      <canvas ref={beamRef} className="ai-hero-beam" aria-hidden="true" />
    </>
  );
}
