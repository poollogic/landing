import React, { useState } from 'react';
import '../landing/landing.css';
import '../landing/hero.css';
import Nav from '../landing/Nav.jsx';
import ReserveCard, { ReserveIntro } from '../landing/ReserveCard.jsx';
import { isSize } from '../landing/ReserveSize.jsx';
import { Footer } from '../components/site-chrome.jsx';

// /reserve: "Reserve your spot". While landing/onboarding.js is set to 'reserve', the site's
// sign-up buttons come here. The intro and the card are shared with the homepage's reserve
// section (landing/ReserveCard.jsx), so both always match. A link with ?size= (a size already
// picked) opens the card on step 2. The section is the homepage hero's (.hero: its glow).
// Differences from the homepage section, for visitors who came here to reserve: a focused header
// (Nav focused), a line on what PoolLogic is (context), and on one-column screens the card right
// after the heading, before the checked points (reserve.css .rsv-hero).

export default function ReservePage() {
  const [initialSize] = useState(() => {
    const v = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('size') : null;
    return isSize(v) ? v : '';
  });
  return (
    <div className="mktg rsv-page relative flex min-h-screen flex-col font-sans text-mktg-muted antialiased">
      <Nav focused />
      <main className="flex-1">
        <section className="hero rsv-hero relative overflow-x-clip" aria-labelledby="reserve-heading">
          <div className="container">
            <div className="rsv-grid">
              <ReserveIntro as="h1" id="reserve-heading" context />
              <ReserveCard initialSize={initialSize} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
