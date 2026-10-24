import React from 'react';
import ReserveCard, { ReserveIntro } from './ReserveCard.jsx';

// Homepage: "See our simple pricing", the dark section after the light founder section
// (dark → light → dark). The same card as /reserve (ReserveCard.jsx), with the intro's price wording
// for visitors who are still browsing: they pick a size, see their rate and can reserve right here.
export default function ReserveSection() {
  return (
    <section id="reserve" className="rsv-sec" aria-labelledby="reserve-section-heading">
      <div className="container">
        <div className="rsv-grid">
          <ReserveIntro as="h2" id="reserve-section-heading" price />
          <ReserveCard />
        </div>
      </div>
    </section>
  );
}
