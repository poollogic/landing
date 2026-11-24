import React from 'react';
import { ArrowUp, Check, ChevronRight, Plug, Plus, X } from 'lucide-react';

// /claude's hero chat window: a copy of /ai-and-automations' AiChat.jsx (2026-11-23, classes ai- → ch-),
// so a change there never reaches this hero. The shell (title bar with "Poolnautics connected", the
// conversation, the composer) and its parts. Styles: claudeHero.css ("The assistant window"; only the
// dark theme is copied).
//
// theme: 'dark' | 'light'. scale: CSS zoom, layout and all. height: a fixed height (the hero's 632px is
// in the CSS). composer: false leaves it out. The composer is a drawing: hidden from screen readers and
// never focusable.

const join = (...c) => c.filter(Boolean).join(' ');

export default function AiChat({
  theme = 'dark', scale, height, composer = true, typed, press, title = 'Your AI assistant',
  as: Root = 'figure', className, style, rootRef, bodyRef, bodyProps, children, ...rest
}) {
  const own = { ...(scale && scale !== 1 ? { zoom: scale } : null), ...(height ? { height } : null), ...style };
  return (
    <Root ref={rootRef} className={join('ch-chat', theme === 'light' && 'ai-chat--light', className)} style={Object.keys(own).length ? own : undefined} {...rest}>
      <div className="ch-chat-bar">
        <span className="ch-chat-title">{title}</span>
        <span className="ch-chat-conn"><span className="ch-live-dot" aria-hidden="true" />Poolnautics connected</span>
      </div>
      <div ref={bodyRef} className="ch-chat-body" {...bodyProps}>{children}</div>
      {composer && <AiChatComposer typed={typed} press={press} />}
    </Root>
  );
}

/** The composer: a drawing of one (typed: the question being typed; press: the send button pressed). */
export function AiChatComposer({ typed, press }) {
  return (
    <div className="ch-chat-composer" aria-hidden="true">
      <span className="ch-composer-plus"><Plus size={16} strokeWidth={2} /></span>
      {typed != null
        ? <span className="ch-composer-text is-typing"><span>{typed}</span></span>
        : <span className="ch-composer-text">Ask about your business…</span>}
      <span className="ch-composer-tools"><Plug size={12} strokeWidth={2} /><i className="ch-composer-dot" />Poolnautics</span>
      <span className={join('ch-chat-send', press && 'ch-press')}><ArrowUp size={15} strokeWidth={2.2} /></span>
    </div>
  );
}

/** What the person asked. */
export function AiChatUser({ className, children, ...rest }) {
  return <p className={join('ch-chat-user', className)} {...rest}><span className="sr-only">You: </span>{children}</p>;
}

/** The assistant's turn: its tool calls, then its reply, across the full width. */
export function AiChatTurn({ className, children, ...rest }) {
  return (
    <div className={join('ch-turn', className)} {...rest}>
      <div className="ch-turn-body">
        <span className="sr-only">Your AI assistant:</span>
        {children}
      </div>
    </div>
  );
}

/**
 * A tool call: "Poolnautics › name" and its mark. status: 'done' (a blue tick) or 'blocked' (a red x);
 * or mark, to draw the mark yourself (the hero's spinner). count: how many times it ran.
 */
export function AiChatTool({ name, count, status = 'done', mark, className, ...rest }) {
  return (
    <div className={join('ch-tool', className)} {...rest}>
      <Plug size={14} strokeWidth={2} aria-hidden="true" className="ch-tool-plug" />
      <span className="ch-tool-label">
        <span className="sr-only">{status === 'blocked' && !mark ? 'Tried the Poolnautics tool ' : 'Used the Poolnautics tool '}</span>
        <span aria-hidden="true">Poolnautics</span>
        <ChevronRight size={13} strokeWidth={2} aria-hidden="true" />
        <code>{name}</code>
        {count && <><b className="ch-tool-count" aria-hidden="true">×{count}</b><span className="sr-only"> {count} times</span></>}
      </span>
      <span className="ch-tool-status" aria-hidden="true">
        {mark ?? (status === 'blocked'
          ? <span className="ch-tool-done is-blocked"><X size={10} strokeWidth={3} /></span>
          : <span className="ch-tool-done"><Check size={11} strokeWidth={3} /></span>)}
      </span>
    </div>
  );
}

/** The assistant's reply: text on the window (dark), or a card (light). */
export function AiChatReply({ className, children, ...rest }) {
  return <div className={join('ch-chat-reply', className)} {...rest}>{children}</div>;
}

/** A reply's verdict: a round mark and a bold label. tone: 'no' (red !), 'ask' (blue !), 'done' (green tick). */
export function AiChatStatus({ tone, children }) {
  return (
    <p className={`ch-chat-status ch-chat-status--${tone}`}>
      <span className="ch-chat-status-mark" aria-hidden="true">{tone === 'done' ? <Check size={12} strokeWidth={3.4} /> : '!'}</span>
      {children}
    </p>
  );
}

/** The lower part of a reply, in its own inset: an optional caps label, then anything. */
export function AiChatDetail({ label, children }) {
  return (
    <div className="ch-chat-detail">
      {label && <p className="ch-chat-detail-label">{label}</p>}
      {children}
    </div>
  );
}
