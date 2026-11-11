import React from 'react';

// The laptop's keyboard deck under the hero dashboard (desktop only; laptop.css). Decoration: in the
// pre-rendered page with its space reserved, hidden from screen readers, not focusable, and drawn
// with CSS only. The key legends come from data attributes through ::before/::after, so they're not
// text on the page for crawlers. useHeroScrollFx.js tilts the deck and moves its reflection while
// the hero is on screen; without it (no JS, reduced motion) the deck rests at 72deg.
//
// Each key: [kind, legend(s), width in fr]. Kinds: l letter, s two symbols (top, bottom), n named
// key with its label on the left (nl) or right (nr) and an optional symbol in the opposite top
// corner, f function row label, t Touch ID, b blank.

const F_KEYS = Array.from({ length: 12 }, (_, i) => ['f', `F${i + 1}`, 1]);
const letters = (s) => [...s].map((c) => ['l', c, 1]);
const sym = (pairs) => pairs.map(([t, b]) => ['s', [t, b], 1]);

const ROWS = [
  [['f', 'esc', 1.5], ...F_KEYS, ['t', '', 1]],
  [...sym([['~', '`'], ['!', '1'], ['@', '2'], ['#', '3'], ['$', '4'], ['%', '5'], ['^', '6'], ['&', '7'], ['*', '8'], ['(', '9'], [')', '0'], ['_', '-'], ['+', '=']]), ['nr', ['delete'], 1.5]],
  [['nl', ['tab'], 1.5], ...letters('QWERTYUIOP'), ...sym([['{', '['], ['}', ']'], ['|', '\\']])],
  [['nl', ['caps lock'], 1.8], ...letters('ASDFGHJKL'), ...sym([[':', ';'], ['"', "'"]]), ['nr', ['return'], 1.8]],
  [['nl', ['shift'], 2.35], ...letters('ZXCVBNM'), ...sym([['<', ','], ['>', '.'], ['?', '/']]), ['nr', ['shift'], 2.35]],
  [
    ['nl', ['fn'], 1], ['nl', ['control', '⌃'], 1], ['nl', ['option', '⌥'], 1], ['nr', ['command', '⌘'], 1.25],
    ['b', '', 5.3],
    ['nl', ['command', '⌘'], 1.25], ['nl', ['option', '⌥'], 1], ['arrows', '', 3.1],
  ],
];

function Key({ kind, legend }) {
  switch (kind) {
    case 'l': return <span className="lt-k lt-k-l" data-l={legend} />;
    case 's': return <span className="lt-k lt-k-s" data-t={legend[0]} data-b={legend[1]} />;
    case 'f': return <span className="lt-k lt-k-f" data-l={legend} />;
    case 't': return <span className="lt-k lt-k-t" />;
    case 'nl':
    case 'nr': return <span className={`lt-k lt-k-n lt-k-${kind}`} data-l={legend[0]} data-sym={legend[1]} />;
    case 'arrows':
      return (
        <span className="lt-arrows">
          <span className="lt-k lt-k-a lt-up" data-l="▲" />
          <span className="lt-k lt-k-a" data-l="◀" />
          <span className="lt-k lt-k-a" data-l="▼" />
          <span className="lt-k lt-k-a" data-l="▶" />
        </span>
      );
    default: return <span className="lt-k" />;
  }
}

export default function LaptopDeck() {
  return (
    <div className="lt-deck-box mx-auto max-w-[1120px]" aria-hidden="true">
      <div className="lt-deck">
        <div className="lt-well">
          {ROWS.map((row, r) => (
            <div key={r} className="lt-row" style={{ gridTemplateColumns: row.map(([, , w]) => `${w}fr`).join(' ') }}>
              {row.map(([kind, legend], i) => <Key key={i} kind={kind} legend={legend} />)}
            </div>
          ))}
        </div>
        <div className="lt-pad" />
        <div className="lt-sheen"><div className="lt-sheen-band" /></div>
        <div className="lt-edge" />
      </div>
    </div>
  );
}
