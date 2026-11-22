import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './legal.css';

// The legal pages' shared layout (Terms, Privacy, Technician App Terms): the title block, the
// "On this page" column (desktop) or sticky bar (phones and tablets), the article, print and
// back-to-top. Styles in legal.css. Pre-rendered (entry-server.jsx), so everything the server
// draws — subsection ids, the contents list — comes from the children alone, never the window.
//
// A page passes its Sections as children. Each Section's <h3>s get a stable id (the section id plus
// a slug of the heading) unless they already have one; existing ids (#customers, #mail-service,
// #leaving…) are linked from the apps and other pages and never change. A paragraph written in
// capitals (the warranty and class-action text) is drawn as a callout; its words don't change.

/** The text inside a React node. */
const textOf = (node) => {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (React.isValidElement(node)) return textOf(node.props.children);
  return '';
};

const slug = (s) => s.toLowerCase().replace(/&/g, ' and ').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/** A paragraph that's mostly capitals: the disclaimers and the class-action waiver. */
const isCapitals = (text) => {
  const letters = text.match(/[A-Za-z]/g) ?? [];
  if (letters.length < 60) return false;
  return letters.filter((c) => c >= 'A' && c <= 'Z').length / letters.length > 0.6;
};

/** A Section's subsections: each <h3>'s id (its own, or the section's plus a slug) and title. */
function subsectionsOf(sectionId, children) {
  const out = [];
  const seen = new Set();
  React.Children.forEach(children, (c) => {
    if (!React.isValidElement(c) || c.type !== 'h3') return;
    const title = textOf(c.props.children).trim();
    let id = c.props.id;
    if (!id) {
      const base = `${sectionId}-${slug(title)}`;
      id = base;
      for (let n = 2; seen.has(id); n++) id = `${base}-${n}`;
    }
    seen.add(id);
    out.push({ id, title });
  });
  return out;
}

/** "8. Route Transfers…" → { number: '8', rest: 'Route Transfers…' }. */
const splitNumber = (title) => {
  const m = /^(\d+)\.\s*(.*)$/.exec(title);
  return m ? { number: m[1], rest: m[2] } : { number: '', rest: title };
};

export function Section({ id, title, children }) {
  const subs = subsectionsOf(id, children);
  let i = 0;
  const body = React.Children.map(children, (c) => {
    if (!React.isValidElement(c)) return c;
    if (c.type === 'h3') return React.cloneElement(c, { id: subs[i++].id });
    if (c.type === 'p' && isCapitals(textOf(c.props.children))) {
      return React.cloneElement(c, { className: [c.props.className, 'legal-caps'].filter(Boolean).join(' ') });
    }
    return c;
  });
  return (
    <section id={id} className="legal-section">
      <h2>{title}</h2>
      <div className="legal-body">{body}</div>
    </section>
  );
}

/** Where a heading counts as "being read": a little below the top of the screen. */
const readLine = () => Math.min(window.innerHeight * 0.3, 180);

export default function LegalPage({ title, intro, meta, toc, card, children }) {
  // The contents: every Section among the children, with the page's own short titles.
  const contents = useMemo(() => {
    const label = new Map((toc ?? []).map((s) => [s.id, s.title]));
    const out = [];
    React.Children.forEach(children, (c) => {
      if (!React.isValidElement(c) || c.type !== Section) return;
      const { number, rest } = splitNumber(c.props.title);
      out.push({ id: c.props.id, number, title: label.get(c.props.id) ?? rest, subs: subsectionsOf(c.props.id, c.props.children) });
    });
    return out;
  }, [children, toc]);

  const [active, setActive] = useState({ section: contents[0]?.id ?? null, sub: null });
  const [showTop, setShowTop] = useState(false);
  const [open, setOpen] = useState(false);
  const articleRef = useRef(null);
  const tocRef = useRef(null);
  const barRef = useRef(null);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const progressRef = useRef(null);
  const panelId = useId();

  // A link to a section (#mail-service, #customers…) opens at it: the page is drawn after the
  // browser's own jump to the hash, so it never landed. Instant, not the page's smooth scroll.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' }));
    return () => cancelAnimationFrame(frame);
  }, []);

  // One scroll handler: which section and subsection are being read, how far through the article
  // the reader is (the phone bar's line), and whether "back to top" shows.
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = readLine();
      let section = contents[0]?.id ?? null;
      let current = contents[0];
      for (const s of contents) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) { section = s.id; current = s; } else if (el) break;
      }
      let sub = null;
      for (const h of current?.subs ?? []) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= line) sub = h.id; else if (el) break;
      }
      setActive((a) => (a.section === section && a.sub === sub ? a : { section, sub }));
      setShowTop(window.scrollY > 900);
      const art = articleRef.current;
      if (art && progressRef.current) {
        const r = art.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
        progressRef.current.style.transform = `scaleX(${p})`;
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [contents]);

  // Keep the active item in view inside the contents column — the column scrolls, never the page.
  useEffect(() => {
    const nav = tocRef.current;
    if (!nav || nav.offsetParent === null) return; // hidden on phones
    const link = nav.querySelector(`[data-toc="${CSS.escape(active.sub ?? active.section ?? '')}"]`)
      ?? nav.querySelector(`[data-toc="${CSS.escape(active.section ?? '')}"]`);
    if (!link) return;
    const top = link.offsetTop;
    const bottom = top + link.offsetHeight;
    const view = nav.clientHeight - 48; // above the fade
    if (top < nav.scrollTop + 8 || bottom > nav.scrollTop + view) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      nav.scrollTo({ top: Math.max(0, top - nav.clientHeight / 3), behavior: reduce ? 'auto' : 'smooth' });
    }
  }, [active]);

  // The phone panel: opens scrolled to the current section; Escape or a tap elsewhere closes it.
  const close = useCallback((refocus) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  }, []);
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const current = panel?.querySelector('[aria-current="true"]');
    if (panel && current) panel.scrollTop = Math.max(0, current.offsetTop - panel.clientHeight / 3);
    const onKey = (e) => { if (e.key === 'Escape') close(true); };
    const onDown = (e) => { if (!barRef.current?.contains(e.target)) close(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open, close]);

  const current = contents.find((s) => s.id === active.section) ?? contents[0];

  return (
    <main className="legal-page">
      <div className="container legal-container">
        <header className="legal-head">
          <div className="legal-head-main">
            <h1>{title}</h1>
            <div className="legal-meta">
              {meta.map(([label, value]) => (
                <span key={label}><strong>{label}:</strong> {value}</span>
              ))}
            </div>
            <p className="legal-intro">{intro}</p>
          </div>
          <div className="legal-head-side">
            {card && (
              <a className="legal-card" href={card.href}>
                <strong>Customer of a pool company?</strong>
                <span>Read the short section for you →</span>
              </a>
            )}
            <button type="button" className="legal-btn legal-print" onClick={() => window.print()}>Print or save as PDF</button>
          </div>
        </header>

        <div className="legal-grid">
          {/* Phones and tablets: a sticky bar with the current section, opening the contents. */}
          <div className="legal-bar" ref={barRef}>
            <button
              ref={buttonRef}
              type="button"
              className="legal-bar-button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="legal-bar-text">
                <span className="legal-bar-label">On this page</span>
                <span className="legal-bar-title">{current ? `${current.number ? `${current.number}. ` : ''}${current.title}` : ''}</span>
              </span>
              <ChevronDown size={14} strokeWidth={2} aria-hidden="true" className="legal-bar-chevron" />
            </button>
            <span className="legal-bar-progress" ref={progressRef} aria-hidden="true" />
            <div id={panelId} className="legal-panel" ref={panelRef} hidden={!open}>
              {contents.map((s) => (
                <a key={s.id} href={`#${s.id}`} aria-current={s.id === active.section ? 'true' : undefined} onClick={() => close(false)}>
                  <span className="legal-num">{s.number}</span>
                  <span>{s.title}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Desktop: the contents column, the current section's subsections under it. */}
          <nav className="legal-toc" ref={tocRef} aria-label="On this page">
            <div className="legal-toc-label">On this page</div>
            {contents.map((s) => {
              const on = s.id === active.section;
              return (
                <div key={s.id}>
                  <a href={`#${s.id}`} data-toc={s.id} className={on ? 'is-active' : undefined} aria-current={on && !active.sub ? 'location' : undefined}>
                    <span className="legal-num">{s.number}</span>
                    <span>{s.title}</span>
                  </a>
                  {on && s.subs.length > 0 && (
                    <div className="legal-toc-subs">
                      {s.subs.map((h) => (
                        <a key={h.id} href={`#${h.id}`} data-toc={h.id} className={h.id === active.sub ? 'is-active' : undefined} aria-current={h.id === active.sub ? 'location' : undefined}>
                          {h.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <article className="legal-article" ref={articleRef}>
            {children}
          </article>
        </div>
      </div>

      <button
        type="button"
        className={`legal-top${showTop ? ' is-shown' : ''}`}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0 })}
      >
        <ChevronDown size={18} strokeWidth={2} aria-hidden="true" className="legal-top-icon" />
      </button>
    </main>
  );
}
