import React, { useEffect, useState } from 'react';

// A guide's "On this page" list (guide.css .gd-toc): sticky beside the article on desktop, a two-column
// box above it on tablets, one column on phones. Its links are plain #anchors, so they work without
// JavaScript and scroll smoothly (index.html), or straight there for anyone who asks for less motion
// (guide.css). The item for the part being read is marked as the visitor scrolls: the last part whose
// top is within 160px of the window's top, as the reference does it. Server and first render mark the
// first part, so the pre-rendered page and the browser agree.

export default function GuideToc({ items, articleId }) {
  const [current, setCurrent] = useState(items[0][0]);

  useEffect(() => {
    const sections = [...document.querySelectorAll(`#${articleId} section[id]`)];
    if (!sections.length) return undefined;
    let frame = 0;
    const read = () => {
      frame = 0;
      let cur = sections[0];
      sections.forEach((s) => { if (s.getBoundingClientRect().top < 160) cur = s; });
      setCurrent(cur.id);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [articleId]);

  return (
    <nav className="gd-toc" aria-label="On this page">
      <p>On this page</p>
      <ol>
        {items.map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`} className={id === current ? 'is-on' : undefined} aria-current={id === current ? 'location' : undefined}>{label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
