import React, { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// The WAIT step's delay in an automation card (Automations.jsx): a box showing the delay that opens
// a small menu under it, with five presets and a custom delay (a number and a unit). Choosing one
// calls onChange with its text ("5 minutes", "Right away") and closes the menu; so do Escape (focus
// goes back to the box) and a click outside. Styles: ai.css (.ai-delay*).

export const DELAY_PRESETS = ['Right away', '90 seconds', '5 minutes', '1 hour', '1 day'];
const UNITS = ['seconds', 'minutes', 'hours', 'days'];
// Automations wait at most 30 days in all (aiFacts.js AUTOMATION_LIMITS), so a custom delay does too.
const MAX = { seconds: 2592000, minutes: 43200, hours: 720, days: 30 };

export const formatDelay = (n, unit) => `${n} ${n === 1 ? unit.slice(0, -1) : unit}`;

export default function DelayControl({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('10');
  const [unit, setUnit] = useState('minutes');
  const id = useId();
  const wrapRef = useRef(null);
  const boxRef = useRef(null);
  const menuRef = useRef(null);

  const close = (refocus) => {
    setOpen(false);
    if (refocus) boxRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return undefined;
    menuRef.current?.querySelector('button')?.focus();
    const onDown = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const choose = (text) => {
    onChange(text);
    close(true);
  };
  const setCustom = (e) => {
    e.preventDefault();
    const n = Math.min(Math.max(1, Math.round(Number(amount)) || 1), MAX[unit]);
    setAmount(String(n));
    choose(formatDelay(n, unit));
  };

  return (
    <div
      ref={wrapRef}
      className="ai-delay"
      onKeyDown={(e) => { if (e.key === 'Escape' && open) { e.stopPropagation(); close(true); } }}
    >
      <button
        ref={boxRef}
        type="button"
        className="ai-delay-box"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        aria-label={`Delay: ${value}. Change it`}
        onClick={() => setOpen((o) => !o)}
      >
        {value}
        <ChevronDown size={14} strokeWidth={2} aria-hidden="true" />
      </button>
      <span className="ai-delay-note">You choose the delay</span>
      {open && (
        <div ref={menuRef} id={`${id}-menu`} className="ai-delay-menu" role="group" aria-label="Choose the delay">
          <div className="ai-delay-presets">
            {DELAY_PRESETS.map((p) => (
              <button key={p} type="button" className={p === value ? 'is-on' : undefined} aria-pressed={p === value} onClick={() => choose(p)}>
                {p}
              </button>
            ))}
          </div>
          <form className="ai-delay-custom" onSubmit={setCustom}>
            <label htmlFor={`${id}-n`}>Custom delay</label>
            <div className="ai-delay-row">
              <input
                id={`${id}-n`}
                type="number"
                inputMode="numeric"
                min="1"
                max={MAX[unit]}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <select aria-label="Unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              <button type="submit" className="ai-delay-set">Set</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
