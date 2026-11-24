import React from 'react';

// /ai-and-automations' stance, right under the trial band: white, type only. Two-line, two-tone
// heading (an h2 that looks as the line always did: ai.css styles .ai-stance-line, not the tag), one
// sentence, then three columns: your AI, the blueprint, the protection layer. Each title's first
// word is grey, the rest ink. No links or buttons. The heading and columns keep the page's scroll
// reveal (data-reveal, useReveal). Styles: ai.css (.ai-stance*).

const COLUMNS = [
  ['Your', 'AI.', 'Claude, ChatGPT, Grok or your own model, connected through the built-in MCP server.'],
  ['The', 'blueprint.', 'Your AI is handed how Poolnautics works: the guides, your settings and your automations. There’s nothing to teach it.'],
  ['The', 'protection layer.', 'Every action is logged, customer emails are previewed before they go out, price changes wait for your approval, and no AI can charge a card.'],
];

export default function Stance() {
  return (
    <section className="section ai-stance bg-white" data-theme="light" aria-label="Why Poolnautics">
      <div className="container">
        <h2 className="ai-stance-line" data-reveal="">
          <span>Most pool company software locks you into its AI.</span>{' '}
          <span>Poolnautics works with the one you choose.</span>
        </h2>
        <p className="ai-stance-fine">
          Our job is to help you run your business as efficiently as you can, not to sell you a chatbot we built.
        </p>
        <ul className="ai-stance-cols" data-reveal="">
          {COLUMNS.map(([lead, rest, text]) => (
            <li key={rest} className="ai-stance-col">
              <h3><span className="ai-stance-your">{lead}</span> {rest}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
