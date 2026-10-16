"use client";
import PageShell from '../components/site/PageShell';
import PageHero from '../components/site/PageHero';
import PageCTA from '../components/site/PageCTA';
import CaseChapters from '../components/pages/case-studies/CaseChapters';
import '../components/pages/case-studies/case-studies.css';

/**
 * /case-studies, round 02: "Did it make money?" Hero (Ruchi, fix pass 5: no results
 * index, the chapters carry the numbers), four chapters (sticky mockup + the ledger that strikes
 * through, the page's one signature) and the closing CTA. Design spec §4.
 */
const CaseStudies = () => (
  <PageShell className="cs-root">
    <PageHero
      lines={['Case', 'studies']}
      lede="What we changed on four client stores, and the results."
      cta={{ label: 'Book a free strategy call', href: '/contact-us' }}
      fit="26.4cqi"
    />
    <CaseChapters />
    <PageCTA
      title={['What’s your', 'bottleneck?']}
      next={{ label: 'Services', href: '/services', hint: 'What we do and how' }}
    />
  </PageShell>
);

export default CaseStudies;
