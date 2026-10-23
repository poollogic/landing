import React, { useState } from 'react';
import { FeatureList, SizeStep, Stepper } from './ReserveSize.jsx';

// Homepage: "Reserve your spot", the dark close after the light founder section (dark → light → dark).
// The same first step as /reserve (ReserveSize.jsx): pick a size, see your rate. Next carries the
// size over to /reserve (?size=), which opens on step 2, "Lock in your rate".
export default function ReserveSection() {
  const [size, setSize] = useState('');
  const next = () => { window.location.href = `/reserve?size=${encodeURIComponent(size)}`; };
  return (
    <section id="reserve" className="rsv-sec" aria-labelledby="reserve-section-heading">
      <div className="container">
        <div className="rsv-grid">
          <div className="rsv-intro">
            <p className="hero-eyebrow">White-glove onboarding</p>
            <h2 id="reserve-section-heading" className="hero-title">Reserve your spot.</h2>
            <p className="hero-sub">
              See your price now. We’ll move your customers over and <strong>set everything up with you</strong> on a
              10-minute call.
            </p>
            <FeatureList />
          </div>
          <div className="rsv-card">
            <Stepper step={1} size={size} />
            <SizeStep size={size} onSize={setSize} onNext={next} />
          </div>
        </div>
      </div>
    </section>
  );
}
