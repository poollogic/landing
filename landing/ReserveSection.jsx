import React from 'react';
import ReserveCard, { ReserveIntro } from './ReserveCard.jsx';

// Homepage: "Reserve your spot", the dark close after the light founder section (dark → light → dark).
// The same intro and card as /reserve (ReserveCard.jsx): visitors pick a size, see their rate and
// reserve right here, without leaving the page.
export default function ReserveSection() {
  return (
    <section id="reserve" className="rsv-sec" aria-labelledby="reserve-section-heading">
      <div className="container">
        <div className="rsv-grid">
          <ReserveIntro as="h2" id="reserve-section-heading" />
          <ReserveCard />
        </div>
      </div>
    </section>
  );
}
