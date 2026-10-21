import React, { useEffect, useRef } from 'react';

// Water ripples that follow the mouse across the hero background. A classic
// two-buffer height map at 1/3 resolution (CSS scales and blurs it up), drawn
// as light only on a transparent canvas. Waves come only from the mouse. The
// loop sleeps when the water is still or the hero is offscreen, and the whole
// effect is off for reduced motion and touch / no-hover devices.

const SCALE = 3;
const DAMPING = 0.945;
const TRAIL_STEP = 6; // sim px between drops along a fast move
const TRAIL_MAX = 40; // drops per mousemove at most
const QUIET = 0.4; // below this everywhere, the water is still

export default function HeroRipples() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let W = 0, H = 0, cur, next, img;
    let raf = 0;
    let visible = true;
    let last = null;

    const build = () => {
      const r = hero.getBoundingClientRect();
      W = Math.max(3, Math.round(r.width / SCALE));
      H = Math.max(3, Math.round(r.height / SCALE));
      canvas.width = W;
      canvas.height = H;
      cur = new Float32Array(W * H);
      next = new Float32Array(W * H);
      img = ctx.createImageData(W, H);
      ctx.clearRect(0, 0, W, H);
    };

    /** A cosine-falloff drop of `radius` sim px. */
    const drop = (cx, cy, radius, strength) => {
      const r2 = radius * radius;
      for (let dy = -radius; dy <= radius; dy++) {
        const y = Math.round(cy + dy);
        if (y < 1 || y > H - 2) continue;
        for (let dx = -radius; dx <= radius; dx++) {
          const d2 = dx * dx + dy * dy;
          if (d2 >= r2) continue;
          const x = Math.round(cx + dx);
          if (x < 1 || x > W - 2) continue;
          cur[y * W + x] += strength * 0.5 * (1 + Math.cos((Math.PI * Math.sqrt(d2)) / radius));
        }
      }
      wake();
    };

    const frame = () => {
      raf = 0;
      // Propagate into `next`, then swap.
      let energy = 0;
      for (let y = 1; y < H - 1; y++) {
        for (let x = 1, i = y * W + 1; x < W - 1; x++, i++) {
          const v = ((cur[i - 1] + cur[i + 1] + cur[i - W] + cur[i + W]) / 2 - next[i]) * DAMPING;
          next[i] = v;
          if (v > energy) energy = v;
          else if (-v > energy) energy = -v;
        }
      }
      const t = cur; cur = next; next = t;

      // Light only: lit faces pale blue, shadowed faces deep navy, the rest clear.
      const data = img.data;
      for (let y = 1; y < H - 1; y++) {
        for (let x = 1, i = y * W + 1; x < W - 1; x++, i++) {
          const slope = -(cur[i + 1] - cur[i - 1]) - (cur[i + W] - cur[i - W]);
          const p = i * 4;
          if (slope > 0) {
            data[p] = 170; data[p + 1] = 220; data[p + 2] = 255;
            data[p + 3] = Math.min(70, slope * 2);
          } else {
            data[p] = 5; data[p + 1] = 25; data[p + 2] = 60;
            data[p + 3] = Math.min(55, -slope * 1.6);
          }
        }
      }
      ctx.putImageData(img, 0, 0);

      if (energy > QUIET) wake();
      else {
        cur.fill(0);
        next.fill(0);
        ctx.clearRect(0, 0, W, H);
      }
    };

    function wake() {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    }

    const toSim = (e) => {
      const r = hero.getBoundingClientRect();
      return { x: (e.clientX - r.left) / SCALE, y: (e.clientY - r.top) / SCALE };
    };
    const onMove = (e) => {
      const p = toSim(e);
      if (last) {
        const dx = p.x - last.x;
        const dy = p.y - last.y;
        const steps = Math.min(TRAIL_MAX, Math.max(1, Math.floor(Math.hypot(dx, dy) / TRAIL_STEP)));
        for (let k = 1; k <= steps; k++) drop(last.x + (dx * k) / steps, last.y + (dy * k) / steps, 4, 45);
      } else {
        drop(p.x, p.y, 4, 45);
      }
      last = p;
    };
    const onLeave = () => { last = null; };
    const onDown = (e) => {
      const p = toSim(e);
      drop(p.x, p.y, 8, 360);
    };

    build();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
      if (visible) wake();
    });
    io.observe(hero);
    let resizeT = 0;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = window.setTimeout(build, 120);
    };

    hero.addEventListener('mousemove', onMove, { passive: true });
    hero.addEventListener('mouseleave', onLeave);
    hero.addEventListener('mousedown', onDown);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeT);
      io.disconnect();
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
      hero.removeEventListener('mousedown', onDown);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={ref} className="hero-ripples" aria-hidden="true" />;
}
