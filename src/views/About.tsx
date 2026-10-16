"use client";
import PageShell from '../components/site/PageShell';
import PageHero from '../components/site/PageHero';
import PageCTA from '../components/site/PageCTA';
import DnaHelix from '../components/pages/about/DnaHelix';
import Mission from '../components/pages/about/Mission';
import Plates from '../components/pages/about/Plates';
import Team from '../components/pages/about/Team';
import Values from '../components/pages/about/Values';
import { HERO_META } from '../components/pages/about/data';
import '../components/pages/about/about.css';

/**
 * /about, round 02: "Who will I work with?" Hero (the DNA helix under the
 * headline, D-051), the mission (black band, the page's one signature: it inks
 * in line by line), the work plates, the team with one repeat-client quote, how
 * we operate (home's three values) and the closing CTA into /our-work.
 * Design spec §6 + iteration-1 fixes.
 */
const About = () => (
  <PageShell className="ab-root">
    <PageHero
      lines={['What’s in', { text: 'our DNA?', outline: true }]}
      lede="Dreamy Codes is a Shopify design and engineering studio for D2C brands."
      cta={{ label: 'Book a free strategy call', href: '/contact-us' }}
      // Phones: the longer line fills ~96% of the column (cqi of the hero grid).
      fit="21.8cqi"
      slot={
        <>
          <DnaHelix />
          <ul className="h-label pg-hero-meta pg-a-meta ab-hero-meta">
            {HERO_META.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </>
      }
    />
    <Mission />
    <Plates />
    <Team />
    <Values />
    <PageCTA
      title={[{ text: 'Let’s build', br: 'mobile' }, 'yours.']}
      next={{ label: 'Our work', href: '/our-work', hint: 'See our work' }}
    />
  </PageShell>
);

export default About;
