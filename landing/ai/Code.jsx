import React from 'react';

// Code panels for /ai-integrations: a window bar, then code that scrolls sideways inside
// itself (never the page). JSON is coloured by a tiny tokenizer; other code is shown as given,
// with comments dimmed. Two colours only: keys and comments muted, values white (ai.css .ai-code).

/** JSON, indented, with small objects and arrays kept on one line (shorter panels). */
export function formatJson(value, indent = '') {
  const inline = JSON.stringify(value, null, 1)?.replace(/\n\s*/g, ' ').replace(/\[ /g, '[').replace(/ \]/g, ']');
  if (value === null || typeof value !== 'object' || inline.length + indent.length <= 72) return inline;
  const next = `${indent}  `;
  const items = Array.isArray(value)
    ? value.map((v) => next + formatJson(v, next))
    : Object.entries(value).map(([k, v]) => `${next}${JSON.stringify(k)}: ${formatJson(v, next)}`);
  return `${Array.isArray(value) ? '[' : '{'}\n${items.join(',\n')}\n${indent}${Array.isArray(value) ? ']' : '}'}`;
}

function jsonTokens(text, highlightLine) {
  return text.split('\n').map((line, i) => {
    const parts = [];
    const re = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?)/g;
    let last = 0;
    let m;
    while ((m = re.exec(line))) {
      if (m.index > last) parts.push(line.slice(last, m.index));
      if (m[1] && m[2]) parts.push(<span key={m.index} className="tk-key">{m[1]}</span>, m[2]);
      else parts.push(<span key={m.index} className="tk-val">{m[0]}</span>);
      last = m.index + m[0].length;
    }
    parts.push(line.slice(last));
    return <span key={i} className={`ai-code-line${highlightLine && line.includes(highlightLine) ? ' is-hl' : ''}`}>{parts}{'\n'}</span>;
  });
}

function jsTokens(text) {
  return text.split('\n').map((line, i) => {
    const c = line.indexOf('//');
    return (
      <span key={i} className="ai-code-line">
        {c === -1 ? line : <>{line.slice(0, c)}<span className="tk-comment">{line.slice(c)}</span></>}
        {'\n'}
      </span>
    );
  });
}

export default function Code({ title, label, code, lang = 'json', highlight, className = '' }) {
  return (
    <figure className={`ai-code ${className}`}>
      <figcaption className="ai-code-bar">
        <span className="ai-chat-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="ai-code-title">{title}</span>
        {label && <span className="ai-code-label">{label}</span>}
      </figcaption>
      {/* Scrolls sideways on its own; focusable so keyboards can scroll it too. */}
      <pre tabIndex={0} aria-label={title}><code>{lang === 'json' ? jsonTokens(code, highlight) : jsTokens(code)}</code></pre>
    </figure>
  );
}
