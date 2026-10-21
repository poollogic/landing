import React from 'react';
import { Hero, Features, Pricing, FAQ, FinalCTA } from '../components/sections.jsx';

// The previous homepage, kept at /landing (out of search). Its own chunk, so
// its sections stay out of the main bundle the rest of the site loads.
// Nav and Footer come from app.jsx, as on every old-site page.

const OldHomePage = ({ heroLayout, headline, subhead }) => (
  <>
    <Hero layout={heroLayout} headline={headline} subhead={subhead} />
    <Features />
    <Pricing />
    <FAQ />
    <FinalCTA />
  </>
);

export default OldHomePage;
