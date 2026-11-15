import React from 'react';
import { Check, LoaderCircle } from 'lucide-react';
import useAiChatDemo from './useAiChatDemo.js';
import AiChat, { AiChatReply, AiChatTool, AiChatTurn, AiChatUser } from './AiChat.jsx';

// The /ai-and-automations hero: an AI assistant connected to Poolnautics, drawn with the conventions
// people know from AI chat apps (tool-use rows that spin then check, a typing cursor, a composer
// with a tools chip) but no other company's look: the brands that connect today are named in text
// elsewhere on the page. Customers and amounts are MOCK data (the homepage's Better Call Saul
// cast); the tool names and what they do are the app's own. Four exchanges, typed the way people
// type to an assistant (the replies are written properly):
//   1. get_accounts_receivable gives each customer's oldest days past due, hence "42 days late".
//   2. send_invoice sends an invoice that's already issued again, as a payment reminder once it's
//      overdue, as the company, with the link to pay (routes/hono/_mcpBillingTools.ts). It won't
//      send the billing run's own monthly invoices, so these three are invoices the office issued.
//   3. propose_price_change ("Ask first", PriceProposal.jsx further down): the same proposal, all
//      212 customers before anyone is left out. There, Howard Hamlin ($160 a month) is unticked:
//      $30,740 - $160 = $30,580 for 211, and 211 × $10 = $2,110 more.
//   4. Asked to approve it, it can't: no tool takes an approval, and a yes in the chat doesn't count.
//      An owner or admin approves it signed in to Poolnautics, on the proposal's own page (ai/approvals
//      branch, docs/ai-approvals.md). No tool call, so its answer comes where a tool row would.
// The whole conversation is in the HTML from the start (pre-rendered), each step fading in. Once
// the page runs, useAiChatDemo plays it like a live chat, once, then it stays finished (below 960px,
// from the first answer on, once the whole window is on screen: see useAiChatDemo). The window
// has a fixed height and its body scrolls; steps not shown yet take no space. While it plays,
// screen readers get the whole transcript (a hidden copy) instead of the half-played one, and
// nothing is announced as it appears. Reduced motion keeps the finished conversation, scrolled to
// its end. The window and its parts are AiChat.jsx's (theme dark). Styles: ai.css (.ai-chat*, .ai-approval*).

const OVERDUE = [
  ['Kim Wexler', '42 days late', 'warn', '$385.00'],
  ['Howard Hamlin', '74 days late', 'late', '$520.00'],
  ['Chuck McGill', '118 days late', 'critical', '$240.00'],
];
const ASKS = [
  'who owes us more than 30 days',
  'send all 3 a reminder',
  'chlorines up again raise everyone who hasnt had an increase in a year by 10 bucks',
  'go ahead and approve it',
];

// The playback, step by step (keys name the steps; see useAiChatDemo).
const SCRIPT = {
  turns: [
    { ask: ASKS[0], user: 'u1', turn: 'a1', tools: ['ar'], reply: 'r1' },
    { ask: ASKS[1], user: 'u2', turn: 'a2', tools: ['remind'], reply: 'r2' },
    { ask: ASKS[2], user: 'u3', turn: 'a3', tools: ['propose'], reply: 'r3' },
    { ask: ASKS[3], user: 'u4', turn: 'a4', tools: [], reply: 'r4' },
  ],
};

// Entrance delays (ms), after the hero copy: the finished conversation, before playback starts.
const at = (ms) => ({ animationDelay: `${ms}ms` });
const STEP = 'ai-chat-step animate-mktg-fade-up motion-reduce:animate-none';

/** The price change the assistant proposed, waiting for the owner, as the app's card shows it. */
function ApprovalCard() {
  return (
    <div className="ai-approval">
      <p className="ai-approval-status"><span className="ai-approval-dot" aria-hidden="true" />Waiting for your approval</p>
      <p className="ai-approval-what">212 customers · +$10 a month each</p>
      <p className="ai-approval-total">
        <b>$30,740 <span aria-hidden="true">→</span><span className="sr-only">to</span> $32,860</b> a month{' '}
        <span className="ai-approval-year">(+$25,440 a year)</span>
      </p>
      <span className="ai-approval-btn">Review and approve <span aria-hidden="true">→</span></span>
    </div>
  );
}

export default function AssistantChat() {
  const [ref, bodyRef, frame] = useAiChatDemo(SCRIPT);
  const played = !!frame; // playing, or played and settled: the entrance fades are off for good
  const f = frame?.settled ? null : frame; // the frame while it plays

  /** The conversation. With p (a playing frame), steps not reached yet are hidden; without, it's all there. */
  const conversation = (p) => {
    const hidden = p ? 'true' : undefined; // while it plays, screen readers read the transcript copy instead
    // Before playback: the static step (fades in on its delay). During it: hidden until its turn.
    const step = (key, ms) => ({
      className: `${STEP}${p ? (p.shown[key] ? ' ai-in' : ' ai-hide') : ''}`,
      style: played ? undefined : at(ms),
    });

    /** A tool call: spins while it "runs", then checks. count: how many times it ran. */
    const tool = (key, name, delay, count) => {
      const done = played ? undefined : { '--done': `${delay + 550}ms` };
      const s = step(key, delay);
      return (
        <AiChatTool
          name={name}
          count={count}
          className={`${s.className}${p?.running.includes(key) ? ' is-running' : ''}`}
          style={s.style}
          mark={<>
            {!played && <LoaderCircle size={15} strokeWidth={2.2} className="ai-tool-spin" style={done} />}
            {p?.running.includes(key) && <span className="ai-spin" />}
            <span className={`ai-tool-done${p ? (p.done[key] ? ' ai-pop' : ' ai-hide') : ''}`} style={done}><Check size={11} strokeWidth={3} /></span>
          </>}
        />
      );
    };

    const user = (key, ms, text) => {
      const s = step(key, ms);
      return <AiChatUser className={s.className} style={s.style} aria-hidden={hidden}>{text}</AiChatUser>;
    };
    /** The assistant's turn: its tool row, then its reply, across the full width. */
    const assistant = (key, children) => (
      <AiChatTurn className={p && !p.shown[key] ? 'ai-hide' : undefined} aria-hidden={hidden}>{children}</AiChatTurn>
    );
    const reply = (key, ms, children) => {
      const s = step(key, ms);
      return <AiChatReply className={s.className} style={s.style}>{children}</AiChatReply>;
    };

    return (
      <>
        {user('u1', 350, ASKS[0])}
        {assistant('a1', <>
          {tool('ar', 'get_accounts_receivable', 700)}
          {reply('r1', 1350, <>
            <p>Three customers are more than 30 days past due, <strong>$1,145</strong> in all:</p>
            <table className="ai-chat-table">
              <caption className="sr-only">Customers more than 30 days past due</caption>
              <tbody>
                {OVERDUE.map(([name, late, severity, amount]) => (
                  <tr key={name}>
                    <th scope="row">{name}</th>
                    <td className={`ai-age ai-age--${severity}`}>{late}</td>
                    <td className="font-tnum">{amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>)}
        </>)}

        {user('u2', 2000, ASKS[1])}
        {assistant('a2', <>
          {tool('remind', 'send_invoice', 2300, 3)}
          {reply('r2', 2950, <p>Done. Each one got their invoice again from your company email, with a link to pay.</p>)}
        </>)}

        {user('u3', 3500, ASKS[2])}
        {assistant('a3', <>
          {tool('propose', 'propose_price_change', 3800)}
          {reply('r3', 4450, <ApprovalCard />)}
        </>)}

        {user('u4', 5000, ASKS[3])}
        {assistant('a4', reply('r4', 5450, <p>I can’t approve it, and a yes in this chat doesn’t count. An owner or admin approves it in Poolnautics, where you can leave anyone out first.</p>))}
      </>
    );
  };

  return (
    <AiChat
      theme="dark"
      rootRef={ref}
      bodyRef={bodyRef}
      className={played ? 'is-demo' : undefined}
      aria-label="Example conversation: an AI assistant connected to Poolnautics"
      bodyProps={{ tabIndex: 0, role: 'region', 'aria-label': 'Example conversation' }}
      typed={f?.typed}
      press={f?.press}
    >
      {f && <div className="sr-only">{conversation(null)}</div>}
      {conversation(f)}
    </AiChat>
  );
}
