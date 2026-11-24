import React from 'react';
import { ArrowUp, Check, ChevronRight, Plug, Plus, X } from 'lucide-react';

// The "Your AI assistant" window, Guardrails' (Guardrails.jsx, light; the old dark hero's is now
// /claude's own copy, landing/claude/hero/): the shell (title bar with "Poolnautics connected", the conversation, the
// composer) and its parts. One set of markup; the theme is CSS variables on the root (.ai-chat--light
// sets them; every rule falls back to the dark value), so the hero renders exactly as it did. Styles:
// ai.css ("The assistant window").
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
    <Root ref={rootRef} className={join('ai-chat', theme === 'light' && 'ai-chat--light', className)} style={Object.keys(own).length ? own : undefined} {...rest}>
      <div className="ai-chat-bar">
        <span className="ai-chat-title">{title}</span>
        <span className="ai-chat-conn"><span className="ai-live-dot" aria-hidden="true" />Poolnautics connected</span>
      </div>
      <div ref={bodyRef} className="ai-chat-body" {...bodyProps}>{children}</div>
      {composer && <AiChatComposer typed={typed} press={press} />}
    </Root>
  );
}

/** The composer: a drawing of one (typed: the question being typed; press: the send button pressed). */
export function AiChatComposer({ typed, press }) {
  return (
    <div className="ai-chat-composer" aria-hidden="true">
      <span className="ai-composer-plus"><Plus size={16} strokeWidth={2} /></span>
      {typed != null
        ? <span className="ai-composer-text is-typing"><span>{typed}</span></span>
        : <span className="ai-composer-text">Ask about your business…</span>}
      <span className="ai-composer-tools"><Plug size={12} strokeWidth={2} /><i className="ai-composer-dot" />Poolnautics</span>
      <span className={join('ai-chat-send', press && 'ai-press')}><ArrowUp size={15} strokeWidth={2.2} /></span>
    </div>
  );
}

/** What the person asked. */
export function AiChatUser({ className, children, ...rest }) {
  return <p className={join('ai-chat-user', className)} {...rest}><span className="sr-only">You: </span>{children}</p>;
}

/** The assistant's turn: its tool calls, then its reply, across the full width. */
export function AiChatTurn({ className, children, ...rest }) {
  return (
    <div className={join('ai-turn', className)} {...rest}>
      <div className="ai-turn-body">
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
    <div className={join('ai-tool', className)} {...rest}>
      <Plug size={14} strokeWidth={2} aria-hidden="true" className="ai-tool-plug" />
      <span className="ai-tool-label">
        <span className="sr-only">{status === 'blocked' && !mark ? 'Tried the Poolnautics tool ' : 'Used the Poolnautics tool '}</span>
        <span aria-hidden="true">Poolnautics</span>
        <ChevronRight size={13} strokeWidth={2} aria-hidden="true" />
        <code>{name}</code>
        {count && <><b className="ai-tool-count" aria-hidden="true">×{count}</b><span className="sr-only"> {count} times</span></>}
      </span>
      <span className="ai-tool-status" aria-hidden="true">
        {mark ?? (status === 'blocked'
          ? <span className="ai-tool-done is-blocked"><X size={10} strokeWidth={3} /></span>
          : <span className="ai-tool-done"><Check size={11} strokeWidth={3} /></span>)}
      </span>
    </div>
  );
}

/** The assistant's reply: text on the window (dark), or a card (light). */
export function AiChatReply({ className, children, ...rest }) {
  return <div className={join('ai-chat-reply', className)} {...rest}>{children}</div>;
}

/** A reply's verdict: a round mark and a bold label. tone: 'no' (red !), 'ask' (blue !), 'done' (green tick). */
export function AiChatStatus({ tone, children }) {
  return (
    <p className={`ai-chat-status ai-chat-status--${tone}`}>
      <span className="ai-chat-status-mark" aria-hidden="true">{tone === 'done' ? <Check size={12} strokeWidth={3.4} /> : '!'}</span>
      {children}
    </p>
  );
}

/** The lower part of a reply, in its own inset: an optional caps label, then anything. */
export function AiChatDetail({ label, children }) {
  return (
    <div className="ai-chat-detail">
      {label && <p className="ai-chat-detail-label">{label}</p>}
      {children}
    </div>
  );
}
