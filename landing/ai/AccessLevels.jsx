import React, { useState } from 'react';
import { Check, Lock } from 'lucide-react';
import { ACCESS_LEVELS } from '../../aiFacts.js';

// The three AI access levels as a control: pick one and the levels it includes light up (they
// build on each other). Every level's text is always on the page, so all of it is in the
// pre-rendered HTML; only the styling changes. Styles: ai.css (.ai-levels*).

export default function AccessLevels() {
  const [level, setLevel] = useState(1); // index into ACCESS_LEVELS; starts on "Make changes"
  const total = ACCESS_LEVELS.slice(0, level + 1).reduce((n, l) => n + l.tools, 0);
  return (
    <div className="ai-levels">
      <div className="ai-levels-head">
        <fieldset className="ai-seg">
          <legend className="sr-only">Access level</legend>
          {ACCESS_LEVELS.map((l, i) => (
            <label key={l.key}>
              <input type="radio" name="ai-access-level" className="sr-only" checked={level === i} onChange={() => setLevel(i)} />
              <span className="ai-seg-opt">{l.name}</span>
            </label>
          ))}
        </fieldset>
        <p className="ai-levels-total" aria-live="polite">
          <strong className="font-tnum">{total}</strong> of 30 tools
        </p>
      </div>

      <ol className="ai-levels-list">
        {ACCESS_LEVELS.map((l, i) => {
          const on = i <= level;
          return (
            <li key={l.key} className={`ai-level${on ? ' is-on' : ''}`}>
              <div className="ai-level-top">
                <h3 className="ai-level-name">
                  {on ? <Check size={16} strokeWidth={2.4} aria-hidden="true" /> : <Lock size={15} strokeWidth={2} aria-hidden="true" />}
                  {l.name}
                </h3>
                <span className="ai-level-count font-tnum">{i === 0 ? `${l.tools} tools` : `+${l.tools} tools`}</span>
              </div>
              <p className="ai-level-summary">
                {l.summary}
                {!on && <span className="sr-only"> Not included at the level selected.</span>}
              </p>
              <ul className="ai-level-unlocks">
                {l.unlocks.map((u) => <li key={u}>{u}</li>)}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
