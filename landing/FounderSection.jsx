import React, { useState } from 'react';
import { ChevronDown, User } from 'lucide-react';
import './founder.css';

// Founder's story (#founder): light, Apple-style. Centred header, then the letter
// (left) beside the photo (right); on phones the photo comes first.
// The letter: the route, the pain, why I could fix it, what techs can't fake, today.
// Desktop shows all of it; phones show two until "Read the full story" (founder.css).
// The hidden part stays in the DOM, so search engines read it.
// Apple neutrals: page #F5F5F7, text #1D1D1F, secondary #6E6E73, muted #86868B,
// hairlines #D2D2D7; accent #2676B6.

const LETTER = [
  'I moved from South Carolina to the coast planning to slow down. Instead, I bought a pool route, and the evenings I’d planned for fishing and family went to admin work and chasing people to pay their invoices.',
  'I couldn’t get a clear look at my numbers. Half my customers were well below market rate, but I didn’t know what a single stop cost me, so I couldn’t tell who needed an increase, let alone enforce one. All I had was the balance in the bank and a rough guess at what it should be if every outstanding invoice got paid that month. That’s a terrible way to run a business. Meanwhile, techs were skipping service reports and uploading old photos from their camera roll. Whatever you’re dealing with today, I’ve been there.',
  'Before pools, my job was getting people to say yes. I spent years building conversion, onboarding and marketing systems for businesses. So when I tried the pool software out there and still ended up with 17 tabs open, duct-taping Zapier, n8n and spreadsheets around it, I knew the tools were the problem. I built PoolLogic to fix my own business: billing that runs itself, late fees and automatic account pauses that enforce your rules, and the exact cost of every stop, figured from the chemical prices you set, so you know who needs a price increase. All of it runs from one admin dashboard. And because of that background, paying an invoice takes one tap, and switching over takes minutes, not months.',
  'And your techs can’t fake a report. It’s stamped with the phone’s GPS coordinates the moment they hit send, and photos can only be taken with the camera built into our iOS and Android tech app. They can’t be uploaded. You decide which readings are required. If chlorine alone is fine with you, the app won’t argue. But if you’ve ever taken the call I used to get after a lazy visit, here’s the fix: when a tech skips a required reading, they have to explain why before the report will send.',
  'Running a route is how I learned this industry was starving for real technology. Today I focus almost entirely on PoolLogic, and it’s the most rewarding work I’ve ever done. I got my evenings back, and I built PoolLogic so you can spend yours with your kids, not your invoices.',
];
/* The photo: public/brand/founder-480.webp and -960.webp (1× and 2×, a 4:5 crop of the original).
   If it ever fails, onError swaps in a neutral placeholder, so there's never a broken-image icon.
   The frame's aspect ratio reserves the space, so the photo loading never shifts the page.
   Phones (below md): a wide 3:2 card with the name pill on it; md and up: the 4:5 portrait. */
function FounderPhoto() {
  const [failed, setFailed] = useState(false);
  return (
    <figure className="founder-figure m-0">
      <div className="founder-photo relative aspect-[3/2] overflow-hidden rounded-[20px] md:aspect-[4/5] md:rounded-[28px]">
        {failed ? (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-b from-[#E8E8ED] to-[#D2D2D7] text-[#86868B]" aria-hidden="true">
            <User size={72} strokeWidth={1} />
          </div>
        ) : (
          <img
            src="/brand/founder-480.webp"
            srcSet="/brand/founder-480.webp 480w, /brand/founder-960.webp 960w"
            sizes="(min-width: 1024px) 352px, (min-width: 768px) 420px, calc(100vw - 32px)"
            width={960}
            height={1200}
            alt="Jonathan Timms, founder of PoolLogic"
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover object-[50%_14%] md:object-[60%_30%]"
          />
        )}
        <p className="founder-pill absolute bottom-4 left-4 rounded-full bg-white/70 px-3.5 py-2 text-[13px] text-[#6E6E73] backdrop-blur-md">
          <span className="font-semibold text-[#1D1D1F]">Jonathan Timms</span> – Founder of PoolLogic
        </p>
      </div>
    </figure>
  );
}

export default function FounderSection() {
  const [open, setOpen] = useState(false);
  return (
    <section id="founder" className="section bg-[#F5F5F7]" aria-labelledby="founder-heading">
      <div className="container">
        {/* Header */}
        {/* Phones: left-aligned and smaller (editorial); md and up: centred */}
        <div className="founder-head mx-auto max-w-[1000px] md:text-center">
          <p className="text-[15px] font-semibold text-[#2676B6] md:text-[17px]">Built on the route, not in a boardroom.</p>
          <h2 id="founder-heading" className="mt-2.5 text-[31px] font-bold leading-[1.12] tracking-[-0.025em] [text-wrap:pretty] md:mt-3.5 md:text-[40px] md:leading-[1.1] md:[text-wrap:balance] lg:text-[48px]">
            <span className="block text-[#1D1D1F]">Most pool software creates more work.</span>{' '}
            <span className="block text-[#86868B]">PoolLogic takes it off your plate.</span>
          </h2>
        </div>

        {/* Letter + photo */}
        <div className="founder-grid mt-6 grid grid-cols-1 gap-5 md:mt-14 md:gap-16 lg:mt-[72px] lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
          <div className="founder-photo-col w-full md:mx-auto md:max-w-[420px] lg:order-2 lg:max-w-none lg:self-center">
            <FounderPhoto />
          </div>

          <div className="lg:order-1 lg:self-center">
            {/* Phones show 2 paragraphs (fading out) until "Read the full story" (founder.css) */}
            <div id="founder-story" className={`founder-story space-y-5 text-[16px] leading-[1.6] text-[#6E6E73] md:text-[17px] md:leading-[1.65]${open ? '' : ' is-collapsed'}`}>
              {LETTER.map((p, i) => <p key={i}>{p}</p>)}
              <p className="font-medium text-[#1D1D1F]">— Jonathan Timms, Founder of PoolLogic</p>
            </div>

            <button
              type="button"
              aria-expanded={open}
              aria-controls="founder-story"
              onClick={() => setOpen((o) => !o)}
              className="mt-2.5 inline-flex md:hidden items-center gap-1.5 border-0 bg-transparent p-0 text-[16px] font-semibold text-[#2676B6] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2676B6]"
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
