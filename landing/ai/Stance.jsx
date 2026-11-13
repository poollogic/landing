import React, { useEffect, useLayoutEffect, useRef } from 'react';

// /ai-and-automations' stance, right after the hero, as one statement (not an H2: those read as
// searches); everything below it is the proof. Light and type only, on the homepage's light
// section ground (#F5F5F7, its founder section's and FAQ's), so the page runs dark, light, dark.
// When 40% of it is on screen, "Your AI. Your tools. Your data." rise in one after another and
// the fine print fades in after them, once. It arrives pre-rendered and fully visible: they're
// hidden on hydration only while still below the fold, so nothing already seen flashes, and
// reduced motion (or no IntersectionObserver) hides nothing. The headline keeps the page's scroll
// reveal (data-reveal, useReveal). The CSV export is every plan's (the homepage FAQ). Styles:
// ai.css (.ai-stance*).
// Below 768px the three are a list on a rail, each with its part of the fine print under it
// (.ai-stance-desc, hidden on desktop); the rail's animation needs the distances between the items,
// measured here into --rail, --midpx and --mid (after hydration, and on every resize).
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

  useEffect(() => {
    const trio = ref.current?.querySelector('.ai-stance-trio');
    const items = trio ? [...trio.querySelectorAll('.ai-stance-item')] : [];
    if (items.length !== 3) return undefined;
    // offsetTop, not getBoundingClientRect: the entrance's transform mustn't count.
    const measure = () => {
      const rail = items[2].offsetTop - items[0].offsetTop, midpx = items[1].offsetTop - items[0].offsetTop;
      trio.style.setProperty('--rail', `${rail}px`);
      trio.style.setProperty('--midpx', `${midpx}px`);
      trio.style.setProperty('--mid', rail > 0 ? String(midpx / rail) : '0');
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trio);
    return () => ro.disconnect();
  }, []);

  return (
    <section ref={ref} className="section ai-stance bg-[#F5F5F7]" data-theme="light" aria-label="Why Poolnautics">
      <div className="container">
        <p className="ai-stance-line" data-reveal="">
          <span>Most pool software is built to lock you in.</span>{' '}
          <span>Poolnautics is built to connect.</span>
        </p>
        <p className="ai-stance-trio">
          <span className="ai-stance-item"><span className="ai-stance-your">Your</span> AI.<span className="ai-stance-desc">Bring Claude, ChatGPT, Grok or your own model.</span></span>{' '}
          <span className="ai-stance-item"><span className="ai-stance-your">Your</span> tools.<span className="ai-stance-desc">Connected through the built-in MCP server.</span></span>{' '}
          <span className="ai-stance-item"><span className="ai-stance-your">Your</span> data.<span className="ai-stance-desc">Export everything as CSV, on every plan.</span></span>
        </p>
        <p className="ai-stance-fine">
          Bring Claude, ChatGPT, Grok or your own model through the built-in MCP server. Export everything as CSV, on
          every plan.
        </p>
      </div>
    </section>
  );
}
