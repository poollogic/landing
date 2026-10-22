import React, { useState } from 'react';
import { ChevronDown, User } from 'lucide-react';

// Founder's story (#founder): light, Apple-style. Centred header, then the letter
// (left) beside the photo (right); on phones the photo comes first.
// The letter shows three paragraphs; the rest sits in #founder-more, which is
// always in the DOM (search engines read it) and opens with "Read the full story".
// Apple neutrals: page #F5F5F7, text #1D1D1F, secondary #6E6E73, muted #86868B,
// hairlines #D2D2D7; accent #2676B6.

const INTRO = [
  'After working professionally in web development, systems, and conversion optimization back in South Carolina, I moved to the coast planning to slow down. Instead, I found myself buying a pool cleaning route—and almost immediately, the time I had planned on fishing and enjoying family time was gone.',
  'I was spending hours every evening just doing admin work and chasing people to pay their invoices. I couldn’t even get a clear look at my real numbers because the software options out there were so bad. I knew 50% of my customers were drastically below market rate, but I had no effective way to actually execute and enforce a price increase.',
  'To top it off, I didn’t know what a single stop truly cost me on each account, so I had no idea which accounts actually needed an increase to make things fair. There was no real breakdown of where we stood financially. All I had was the balance in the bank and a rough guess at what it should be if every outstanding invoice got paid that month. That’s a terrible way to run a business.',
  'On top of the financial chaos, technicians were skipping service reports, and I was catching guys uploading old photos from their camera roll to bypass the system. Every issue you encounter on a daily basis, I’ve been there.',
];
const MORE = [
  'Because of my background, I knew what good software should look and feel like. I found myself navigating through 17 different open tabs, duct-taping Zapier, n8n, and messy spreadsheets together just to keep my sanity.',
  'But as I built a real solution to save my own business, my perspective shifted. I realized my true value wasn’t in running a pool route—it was in building the systems that allow pool companies to actually scale and breathe. The route was just the journey I had to take to realize this industry was starving for real technology.',
  'Today, I get to focus entirely on PoolLogic. And honestly, it is the most rewarding work I’ve ever done. There is no better feeling than hearing an owner tell me how much their business has improved, or that they finally get to spend their evenings with their kids instead of fighting with invoices.',
];
/* The photo is public/brand/founder.jpg. Until that file exists (or if it ever fails),
   onError swaps in a neutral placeholder, so there's never a broken-image icon.
   The 4:5 frame reserves the space, so the photo loading never shifts the page. */
function FounderPhoto() {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
      {failed ? (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-b from-[#E8E8ED] to-[#D2D2D7] text-[#86868B]" aria-hidden="true">
          <User size={72} strokeWidth={1} />
        </div>
      ) : (
        <img
          src="/brand/founder.jpg"
          alt="Jonathan Timms, founder of PoolLogic"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover object-[60%_30%]"
        />
      )}
      <p className="absolute bottom-4 left-4 rounded-full bg-white/70 px-3.5 py-2 text-[13px] text-[#6E6E73] backdrop-blur-md">
        <span className="font-semibold text-[#1D1D1F]">Jonathan Timms</span> – Founder of PoolLogic
      </p>
    </div>
  );
}

export default function FounderSection() {
  const [open, setOpen] = useState(false);
  const last = INTRO.length - 1;
  return (
    <section id="founder" className="bg-[#F5F5F7] py-20 lg:py-[120px]" aria-labelledby="founder-heading">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-[1000px] text-center">
          <p className="text-[17px] font-semibold text-[#2676B6]">Built by an owner, not a tech company.</p>
          <h2 id="founder-heading" className="mt-3.5 text-[40px] font-bold leading-[1.1] tracking-[-0.025em] [text-wrap:balance] lg:text-[48px]">
            <span className="block text-[#1D1D1F]">I didn’t set out to build a software company.</span>
            <span className="block text-[#86868B]">But the pool industry desperately needed one.</span>
          </h2>
        </div>

        {/* Letter + photo */}
        <div className="mt-14 grid grid-cols-1 gap-16 lg:mt-[72px] lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
          <div className="mx-auto w-full max-w-[420px] lg:order-2 lg:max-w-none lg:self-center">
            <FounderPhoto />
          </div>

          <div className="lg:order-1 lg:self-center">
            <div className="space-y-5 text-[17px] leading-[1.65] text-[#6E6E73]">
              {INTRO.map((p, i) => (
                <p
                  key={i}
                  className={i === last && !open
                    ? "relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-[30px] after:bg-[linear-gradient(rgba(245,245,247,0),#F5F5F7)] after:content-['']"
                    : undefined}
                >
                  {p}
                </p>
              ))}
            </div>

            {/* The rest of the letter: always in the DOM, opened with the button below */}
            <div
              id="founder-more"
              aria-hidden={!open}
              style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0, transition: 'grid-template-rows .45s ease, opacity .45s ease' }}
            >
              <div className="min-h-0 overflow-hidden" style={{ paddingTop: open ? 20 : 0, transition: 'padding-top .45s ease' }}>
                <div className="space-y-5 text-[17px] leading-[1.65] text-[#6E6E73]">
                  {MORE.map((p, i) => <p key={i}>{p}</p>)}
                  <p className="font-medium text-[#1D1D1F]">— Jonathan Timms, Founder of PoolLogic</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              aria-expanded={open}
              aria-controls="founder-more"
              onClick={() => setOpen((o) => !o)}
              className="mt-2.5 inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-[16px] font-semibold text-[#2676B6] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2676B6]"
            >
              {open ? 'Show less' : 'Read the full story'}
              <ChevronDown size={14} strokeWidth={2.2} aria-hidden="true" className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
