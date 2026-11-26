import React from 'react';
import { Check, LoaderCircle } from 'lucide-react';
import useChatDemo from './useChatDemo.js';
import AiChat, { AiChatReply, AiChatTool, AiChatTurn, AiChatUser } from './ChatWindow.jsx';

// /claude's hero chat: a copy of /ai-and-automations' AssistantChat.jsx (2026-11-23, classes ai- → ch-), so a change to
// that page's hero never reaches this one. As it was there: an AI assistant connected to Poolnautics, drawn with the conventions
// people know from AI chat apps (tool-use rows that spin then check, a typing cursor, a composer
// with a tools chip) but no other company's look: the brands that connect today are named in text
// elsewhere on the page. Customers and amounts are MOCK data (the homepage's Better Call Saul
// cast); the tool names and what they do are the app's own. Five exchanges, typed the way people
// type to an assistant (the replies are written properly):
//   1. get_accounts_receivable gives each customer's oldest days past due, hence "42 days late".
//   2. send_invoice sends an invoice that's already issued again, as a payment reminder once it's
//      overdue, as the company, with the link to pay (routes/hono/_mcpBillingTools.ts). It won't
//      send the billing run's own monthly invoices, so these three are invoices the office issued.
//      Its first call sends nothing: it returns a preview (who each goes to and the total), which
//      Claude shows; only on a yes does it call again and send (as /ai-and-automations' Guardrails
//      demo says: nothing goes out until the preview is confirmed).
//   3. propose_price_change (PriceProposal.jsx further down): the same proposal, all 212 customers
//      before anyone is left out. There, Howard Hamlin ($160 a month) is unticked: $30,740 - $160 =
//      $30,580 for 211, and 211 × $10 = $2,110 more. Any connection with Make changes can propose;
//      there's no switch for it (since 2026-11-24), and every proposal waits for an owner or admin.
//   4. Asked to approve it, it can't: no tool takes an approval, and a yes in the chat doesn't count.
//      An owner or admin approves it signed in to Poolnautics, on the proposal's own page (on the
//      app's main since 2026-11-24). No tool call, so its answer comes where a tool row would.
// The whole conversation is in the HTML from the start (pre-rendered), each step fading in. Once
// the page runs, useAiChatDemo plays it like a live chat, once, then it stays finished (below 960px,
// from the first answer on, once the whole window is on screen: see useAiChatDemo). The window
// has a fixed height and its body scrolls; steps not shown yet take no space. While it plays,
// screen readers get the whole transcript (a hidden copy) instead of the half-played one, and
// nothing is announced as it appears. Reduced motion keeps the finished conversation, scrolled to
// its end. The window and its parts are ChatWindow.jsx's (theme dark). Styles: claudeHero.css (.ch-chat*, .ch-approval*).
// Here the window is titled "Claude", with its own label (title, label).

const OVERDUE = [
  ['Kim Wexler', '42 days late', 'warn', '$385.00'],
  ['Howard Hamlin', '74 days late', 'late', '$520.00'],
  ['Chuck McGill', '118 days late', 'critical', '$240.00'],
];
const ASKS = [
  'who owes us more than 30 days',
  'send all 3 a reminder',
  'yes',
  'chlorines up again raise everyone who hasnt had an increase in a year by 10 bucks',
  'go ahead and approve it',
];

// The playback, step by step (keys name the steps; see useAiChatDemo).
const SCRIPT = {
  turns: [
    { ask: ASKS[0], user: 'u1', turn: 'a1', tools: ['ar'], reply: 'r1' },
    { ask: ASKS[1], user: 'u2', turn: 'a2', tools: ['preview'], reply: 'r2' },
    { ask: ASKS[2], user: 'u2b', turn: 'a2b', tools: ['remind'], reply: 'r2b' },
    { ask: ASKS[3], user: 'u3', turn: 'a3', tools: ['propose'], reply: 'r3' },
    { ask: ASKS[4], user: 'u4', turn: 'a4', tools: [], reply: 'r4' },
  ],
};

// Entrance delays (ms), after the hero copy: the finished conversation, before playback starts.
const at = (ms) => ({ animationDelay: `${ms}ms` });
const STEP = 'ch-chat-step animate-mktg-fade-up motion-reduce:animate-none';

/** The price change the assistant proposed, waiting for the owner, as the app's card shows it. */
function ApprovalCard() {
  return (
    <div className="ch-approval">
      <p className="ch-approval-status"><span className="ch-approval-dot" aria-hidden="true" />Waiting for your approval</p>
      <p className="ch-approval-what">212 customers · +$10 a month each</p>
      <p className="ch-approval-total">
        <b>$30,740 <span aria-hidden="true">→</span><span className="sr-only">to</span> $32,860</b> a month{' '}
        <span className="ch-approval-year">(+$25,440 a year)</span>
      </p>
      <span className="ch-approval-btn">Review and approve <span aria-hidden="true">→</span></span>
    </div>
  );
}

export default function ClaudeChat({
  title = 'Claude',
  label = 'Example conversation: Claude connected to Poolnautics',
}) {
  const [ref, bodyRef, frame] = useChatDemo(SCRIPT);
  const played = !!frame; // playing, or played and settled: the entrance fades are off for good
  const f = frame?.settled ? null : frame; // the frame while it plays

  /** The conversation. With p (a playing frame), steps not reached yet are hidden; without, it's all there. */
  const conversation = (p) => {
    const hidden = p ? 'true' : undefined; // while it plays, screen readers read the transcript copy instead
    // Before playback: the static step (fades in on its delay). During it: hidden until its turn.
    const step = (key, ms) => ({
      className: `${STEP}${p ? (p.shown[key] ? ' ch-in' : ' ch-hide') : ''}`,
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
            {!played && <LoaderCircle size={15} strokeWidth={2.2} className="ch-tool-spin" style={done} />}
            {p?.running.includes(key) && <span className="ch-spin" />}
            <span className={`ch-tool-done${p ? (p.done[key] ? ' ch-pop' : ' ch-hide') : ''}`} style={done}><Check size={11} strokeWidth={3} /></span>
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
      <AiChatTurn className={p && !p.shown[key] ? 'ch-hide' : undefined} aria-hidden={hidden}>{children}</AiChatTurn>
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
            <table className="ch-chat-table">
              <caption className="sr-only">Customers more than 30 days past due</caption>
              <tbody>
                {OVERDUE.map(([name, late, severity, amount]) => (
                  <tr key={name}>
                    <th scope="row">{name}</th>
                    <td className={`ch-age ch-age--${severity}`}>{late}</td>
                    <td className="font-tnum">{amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>)}
        </>)}

        {user('u2', 2000, ASKS[1])}
        {assistant('a2', <>
          {tool('preview', 'send_invoice', 2300, 3)}
          {reply('r2', 2950, <>
            <p>Here’s what goes to each. Send?</p>
            <table className="ch-chat-table">
              <caption className="sr-only">The three invoices, ready to send</caption>
              <tbody>
                {OVERDUE.map(([name, , , amount]) => (
                  <tr key={name}>
                    <th scope="row">{name}</th>
                    <td className="font-tnum">{amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>)}
        </>)}

        {user('u2b', 3500, ASKS[2])}
        {assistant('a2b', <>
          {tool('remind', 'send_invoice', 3800, 3)}
          {reply('r2b', 4450, <p>Done. Each one got their invoice again from your company email, with a link to pay.</p>)}
        </>)}

        {user('u3', 5000, ASKS[3])}
        {assistant('a3', <>
          {tool('propose', 'propose_price_change', 5300)}
          {reply('r3', 5950, <ApprovalCard />)}
        </>)}

        {user('u4', 6500, ASKS[4])}
        {assistant('a4', reply('r4', 6950, <p>I can’t approve it, and a yes in this chat doesn’t count. An owner or admin approves it in Poolnautics, where you can leave anyone out first.</p>))}
      </>
    );
  };

  return (
    <AiChat
      theme="dark"
      rootRef={ref}
      bodyRef={bodyRef}
      className={played ? 'is-demo' : undefined}
      title={title}
      aria-label={label}
      bodyProps={{ tabIndex: 0, role: 'region', 'aria-label': 'Example conversation' }}
      typed={f?.typed}
      press={f?.press}
    >
      {f && <div className="sr-only">{conversation(null)}</div>}
      {conversation(f)}
    </AiChat>
  );
}
