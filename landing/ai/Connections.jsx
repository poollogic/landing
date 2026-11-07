import React from 'react';

// Settings › AI connections, as a coded mockup: each connection named, with its level, when it
// was last used and its own Revoke; one switch for all AI access. Connection names are MOCK data.

const CONNECTIONS = [
  ['Office laptop', 'Claude Code', 'Send to customers', '2 min ago'],
  ['Bookkeeping', 'VS Code', 'Read only', 'Yesterday'],
  ['Route planning', 'Cursor', 'Make changes', 'Oct 28'],
];

export default function Connections() {
  return (
    <div className="ai-conns" role="group" aria-label="Example: the AI connections list in Settings">
      <div className="ai-conns-head">
        <span className="ai-conns-title">AI connections</span>
        <span className="ai-switch-row">
          AI access
          <span className="ai-switch is-on" aria-hidden="true"><i /></span>
          <span className="sr-only">is on</span>
        </span>
      </div>
      <ul>
        {CONNECTIONS.map(([name, app, level, used]) => (
          <li key={name} className="ai-conn">
            <span className="ai-conn-main">
              <b>{name}</b>
              <span>{app} · Last used {used}</span>
            </span>
            <span className="ai-conn-level">{level}</span>
            <span className="ai-conn-revoke" aria-hidden="true">Revoke</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
