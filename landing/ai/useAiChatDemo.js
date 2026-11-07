import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

// Plays the hero's assistant chat (AssistantChat.jsx) like a live AI chat, once: each question is
// typed into the composer and sent, then the assistant's tool row and its answer appear, and it
// stays on the finished conversation. Returns [ref for the figure, ref for the scrolling body,
// frame]. The frame is null until playback starts, and stays null for reduced motion, so the
// server and the first render show the finished conversation (what crawlers, no-JS visitors and
// reduced-motion users get). Afterwards it's SETTLED: the finished conversation again, with
// nothing left to animate. Steps not shown yet take no space; the window has a fixed height and
// its body scrolls, so nothing outside it moves. After each step the body follows to the end,
// unless the reader has scrolled up. It starts 400ms after the window first comes on screen in a
// visible tab (a page opened in a background tab plays when it's first looked at); scrolled away
// or switched from midway, it settles at once, scrolled to the end, rather than playing again.
// Every wait is cancelled through an AbortController.

const FRESH = {
  typed: null, // the composer's text while a question is typed; null shows the placeholder
  press: false, // the send button's press
  shown: {}, // revealed steps, by key
  running: [], // the tools spinning
  done: {}, // tools checked, by key
};
const SETTLED = { settled: true };
const NEAR_END = 60; // px: a reader this close to the end is followed; further up, left alone

const rnd = (min, max) => min + Math.random() * (max - min);

/** The wait (ms) after typing `ch`, before `next`: uneven, the way people type. */
function keyDelay(ch, next) {
  let ms = rnd(48, 92);
  if (ch === ' ') ms += rnd(30, 80);
  if (/[,.?]/.test(ch)) ms += rnd(150, 280);
  if (/[\d$']/.test(ch) || /[\d$']/.test(next)) ms += rnd(30, 70); // numbers and symbols take a look at the keys
  if (Math.random() < 0.04) ms += rnd(200, 420); // a thinking pause
  if (Math.random() < 0.2) ms *= 0.55; // a quick burst
  return ms;
}

/**
 * @param {{ turns: Array<{ ask: string, user: string, turn: string, tools: string[], reply: string }> }} script
 *   Step keys: the user bubble, the assistant's turn, its tools (maybe none) and its reply (a
 *   module-level constant, so it's stable).
 */
export default function useAiChatDemo(script) {
  const ref = useRef(null);
  const bodyRef = useRef(null);
  const [frame, setFrame] = useState(null);

  useEffect(() => {
    const el = ref.current;
    const body = bodyRef.current;
    if (!el || !body) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const toEnd = () => { body.scrollTop = body.scrollHeight; };
    if (typeof IntersectionObserver === 'undefined') return undefined;

    // Following the conversation down: on while a scroll we started is under way, off the moment
    // the reader scrolls, taps or presses a key in it.
    let following = false;
    let followT = 0;
    const nearEnd = () => following || body.scrollHeight - body.scrollTop - body.clientHeight <= NEAR_END;
    const follow = () => {
      following = true;
      clearTimeout(followT);
      body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
      followT = setTimeout(() => { following = false; }, 900);
    };
    const letGo = () => { following = false; };
    const READER = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
    READER.forEach((type) => body.addEventListener(type, letGo, { passive: true }));

    let ac = null;
    let onScreen = false;
    let wait = 0;

    const play = async (signal) => {
      const sleep = (ms) =>
        new Promise((resolve, reject) => {
          if (signal.aborted) return reject(signal.reason);
          const onAbort = () => { clearTimeout(t); reject(signal.reason); };
          const t = setTimeout(() => { signal.removeEventListener('abort', onAbort); resolve(); }, ms);
          signal.addEventListener('abort', onAbort, { once: true });
        });
      const patch = (fn) => setFrame((f) => ({ ...f, ...fn(f) }));
      const shown = (f, keys) => ({ ...f.shown, ...Object.fromEntries(keys.map((k) => [k, true])) });
      // A step appears: rendered now, then followed if the reader was at the end.
      const reveal = (fn) => {
        const stick = nearEnd();
        flushSync(() => patch(fn));
        if (stick) follow();
      };

      for (const [i, turn] of script.turns.entries()) {
        if (i > 0) await sleep(1100);
        // The question, typed into the composer in a person's rhythm, then sent.
        await sleep(rnd(350, 600));
        for (let n = 1; n <= turn.ask.length; n++) {
          patch(() => ({ typed: turn.ask.slice(0, n) }));
          if (n < turn.ask.length) await sleep(keyDelay(turn.ask[n - 1], turn.ask[n]));
        }
        await sleep(rnd(500, 700));
        patch(() => ({ press: true }));
        await sleep(440);
        reveal((f) => ({ press: false, typed: null, shown: shown(f, [turn.user]) }));
        // The assistant's turn, 500ms later: its tool row 550ms after that, spinning, then checked as
        // the answer appears 750ms on. A turn with no tools answers where the tool row would be.
        await sleep(500);
        await sleep(550);
        if (turn.tools.length) {
          reveal((f) => ({ running: turn.tools, shown: shown(f, [turn.turn, ...turn.tools]) }));
          await sleep(750);
        }
        reveal((f) => ({ running: [], done: { ...f.done, ...Object.fromEntries(turn.tools.map((t) => [t, true])) }, shown: shown(f, [turn.turn, turn.reply]) }));
      }
      await sleep(450); // the last fade-in finishes before it settles
    };

    let state = 'idle'; // then 'playing', then 'done' for good
    const done = (interrupted) => {
      if (state === 'done') return;
      ac?.abort();
      clearTimeout(wait);
      state = 'done';
      flushSync(() => setFrame(SETTLED));
      if (interrupted) toEnd();
      unwatch();
    };
    const start = () => {
      if (state !== 'idle' || reduce.matches || !onScreen || document.hidden) return;
      state = 'playing';
      ac = new AbortController();
      setFrame(FRESH);
      const { signal } = ac;
      wait = setTimeout(() => play(signal).then(() => done(false), () => {}), 400); // an abort is followed by done()
    };
    // Off screen, hidden, or reduced motion turned on midway: settle rather than replay later.
    const interrupted = () => { if (state === 'playing') done(true); };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start(); else interrupted();
    });
    io.observe(el);
    const onVisibility = () => (document.hidden ? interrupted() : start());
    const onMotion = () => (reduce.matches ? interrupted() : start());
    document.addEventListener('visibilitychange', onVisibility);
    reduce.addEventListener('change', onMotion);
    function unwatch() {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      reduce.removeEventListener('change', onMotion);
    }

    // Reduced motion: the finished conversation, at its end (again once the fonts have set the text).
    if (reduce.matches) {
      toEnd();
      document.fonts?.ready.then(() => { if (state === 'idle' && reduce.matches) toEnd(); });
    }

    return () => {
      ac?.abort();
      clearTimeout(wait);
      clearTimeout(followT);
      unwatch();
      READER.forEach((type) => body.removeEventListener(type, letGo));
    };
  }, [script]);

  return [ref, bodyRef, frame];
}
