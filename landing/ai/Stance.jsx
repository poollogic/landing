import React, { useEffect, useLayoutEffect, useRef } from 'react';

// /ai-integrations' stance, right after the hero, as one statement (not an H2: those read as
// searches); everything below it is the proof. Light and type only, on the homepage's light
// section ground (#F5F5F7, its founder section's and FAQ's), so the page runs dark, light, dark;
// data-theme="light" turns the "On this page" bar light over it (SectionNav.jsx).
// When 40% of it is on screen, "Your AI. Your tools. Your data." rise in one after another and
// the fine print fades in after them, once. It arrives pre-rendered and fully visible: they're
// hidden on hydration only while still below the fold, so nothing already seen flashes, and
// reduced motion (or no IntersectionObserver) hides nothing. The headline keeps the page's scroll
// reveal (data-reveal, useReveal). The CSV export is every plan's (the homepage FAQ). Styles:
// ai.css (.ai-stance*).
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function Stance() {
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    const section = ref.current;
    const trio = section?.querySelector('.ai-stance-trio');
    if (!trio || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (trio.getBoundingClientRect().top <= window.innerHeight) return undefined; // already seen
    section.dataset.entrance = 'waiting'; // a data attribute: React never touches it
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.dataset.entrance = 'in';
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(section);
    return () => {
      io.disconnect();
      delete section.dataset.entrance;
    };
  }, []);

  return (
    <section ref={ref} className="section ai-stance bg-[#F5F5F7]" data-theme="light" aria-label="Why Poolnautics">
      <div className="container">
        <p className="ai-stance-line" data-reveal="">
          <span>Most pool software is built to lock you in.</span>{' '}
          <span>Poolnautics is built to connect.</span>
        </p>
        <p className="ai-stance-trio">
          <span className="ai-stance-item"><span className="ai-stance-your">Your</span> AI.</span>{' '}
          <span className="ai-stance-item"><span className="ai-stance-your">Your</span> tools.</span>{' '}
          <span className="ai-stance-item"><span className="ai-stance-your">Your</span> data.</span>
        </p>
        <p className="ai-stance-fine">
          Bring Claude, ChatGPT, Grok or your own model through the built-in MCP server. Export everything as CSV, on
          every plan.
        </p>
      </div>
    </section>
  );
}
