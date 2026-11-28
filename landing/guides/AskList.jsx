import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

// A guide's "Optional questions to ask" list, in its closing Poolnautics card (guide.css .gd-ask-*): first
// on /guides/how-to-find-out-if-a-pool-tech-is-stealing-chemicals, then /guides/pool-stabilizer-cyanuric-acid,
// from the owners' briefs of 2026-11-28. Each row is a topic label, the question and a Copy button; "Copy all N"
// copies them as a numbered list, one per line. A button reads "Copied" (or "Copied all N") for 1.6 seconds.
// "[tech name]" is drawn as a placeholder (.gd-ask-var) but the copied text is the plain question.
// The page's wrapper needs .guide-chem or .guide-stab for the card's spacing and paragraph styles.

export const VAR = '[tech name]';

export const AskVar = () => <span className="gd-ask-var">{VAR}</span>;

function Question({ text }) {
  const parts = text.split(VAR);
  return parts.map((p, i) => (
    <React.Fragment key={i}>
      {p}
      {i < parts.length - 1 && <AskVar />}
    </React.Fragment>
  ));
}

/** Copies text to the clipboard; falls back to a hidden textarea where the Clipboard API isn't allowed. */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch { /* nothing more to try */ }
    ta.remove();
  }
}

/** Which button shows "Copied" ('all', a question's index, or null), for 1.6 seconds after its click. */
function useCopied() {
  const [done, setDone] = useState(null);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async (key, text) => {
    await copyText(text);
    setDone(key);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(null), 1600);
  };
  return [done, copy];
}

const CopyIcons = () => (
  <>
    <Copy className="ic-copy" strokeWidth={2} aria-hidden="true" />
    <Check className="ic-ok" strokeWidth={2.4} aria-hidden="true" />
  </>
);

/** questions: [topic label, question][]; note: the line under the list. */
export default function AskList({ questions, note }) {
  const [done, copy] = useCopied();
  const n = questions.length;
  const all = questions.map(([, q], i) => `${i + 1}. ${q}`).join('\n');
  return (
    <>
      <div className="gd-ask-head">
        <p className="gd-ask-h">Optional questions to ask</p>
        <button type="button" className={`gd-ask-all${done === 'all' ? ' is-done' : ''}`} onClick={() => copy('all', all)}>
          <CopyIcons />
          <span aria-live="polite">{done === 'all' ? `Copied all ${n}` : `Copy all ${n}`}</span>
        </button>
      </div>
      <ul className="gd-ask">
        {questions.map(([topic, q], i) => (
          <li key={topic}>
            <div className="gd-ask-main">
              <span className="gd-ask-step">{topic}</span>
              <span className="gd-ask-q"><Question text={q} /></span>
            </div>
            <button
              type="button"
              className={`gd-ask-copy${done === i ? ' is-done' : ''}`}
              aria-label={done === i ? 'Copied' : 'Copy question'}
              onClick={() => copy(i, q)}
            >
              <CopyIcons />
              <span>{done === i ? 'Copied' : 'Copy'}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="gd-ask-note">{note}</p>
    </>
  );
}
