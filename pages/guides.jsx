import React from 'react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/guides/guide.css';
import Nav from '../landing/Nav.jsx';
import { Footer } from '../components/site-chrome.jsx';
import { GUIDES_PATH, GUIDES_DESCRIPTION } from '../landing/guides/guidesMeta.js';
import { START_GUIDE_PATH, START_GUIDE_H1, START_GUIDE_LEDE } from '../landing/guides/startBusinessMeta.js';
import { CHOOSE_GUIDE_PATH, CHOOSE_GUIDE_H1, CHOOSE_GUIDE_LEDE } from '../landing/guides/chooseSoftwareMeta.js';
import { GUIDE_H1, GUIDE_LEDE } from '../landing/guides/raisePricesMeta.js';

// /guides: the guides' index, from the owner's brief of 2026-11-27. The guides' own template: the light nav
// over their hero (.gd-hero: eyebrow, h1, lede), then one card per guide (guide.css .gd-card, the switch
// page's No lock-in card), each its guide's title and the paragraph under its h1, read from the guide's
// meta file, so a card always says what its guide does. The whole card is the link. Structured data: the
// page as a collection of the three Articles, and its breadcrumb (Home, Guides), which the guides extend.

const ORIGIN = 'https://getpoolnautics.com';
const PAGE_URL = `${ORIGIN}${GUIDES_PATH}`;

export const GUIDES = [
  { href: START_GUIDE_PATH, title: START_GUIDE_H1, lede: START_GUIDE_LEDE },
  { href: CHOOSE_GUIDE_PATH, title: CHOOSE_GUIDE_H1, lede: CHOOSE_GUIDE_LEDE },
  { href: '/guides/how-to-raise-prices', title: GUIDE_H1, lede: GUIDE_LEDE },
];

export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: 'Guides',
    description: GUIDES_DESCRIPTION,
    inLanguage: 'en-US',
    isPartOf: { '@id': `${ORIGIN}/#website` },
    hasPart: GUIDES.map((g) => ({ '@id': `${ORIGIN}${g.href}#article` })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: PAGE_URL },
    ],
  },
];

export default function GuidesPage() {
  return (
    <div className="mktg guide-page relative min-h-screen font-sans antialiased">
      <Nav tone="light" overlay current={GUIDES_PATH} />
      <main>
        <header className="gd-hero">
          <div className="container">
            <p className="gd-eyebrow">Guides for pool companies</p>
            <h1>Guides</h1>
            <p className="gd-lede">
              Practical guides for running a pool service company, from starting your first route to choosing software and raising your
              prices.
            </p>
          </div>
        </header>
        <div className="container">
          <ul className="gd-cards">
            {GUIDES.map((g) => (
              <li key={g.href}>
                <a className="gd-card" href={g.href}>
                  <h2>{g.title}</h2>
                  <p>{g.lede}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
