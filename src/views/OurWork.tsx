"use client";
import PageShell from '../components/site/PageShell';
import PageHero from '../components/site/PageHero';
import PageCTA from '../components/site/PageCTA';
import WorkFilter from '../components/pages/our-work/WorkFilter';
import ProjectGrid from '../components/pages/our-work/ProjectGrid';
import BrandIndex from '../components/pages/our-work/BrandIndex';
import '../components/pages/our-work/our-work.css';

/**
 * /our-work, round 02: "Built stores like mine?" Hero with the service filter
 * (the page's one signature: Flip re-flow + rolling count), the twelve projects,
 * the brand index and the closing CTA. Design spec §3.
 */
const OurWork = () => (
  <PageShell className="ow-root">
    <PageHero
      lines={[{ text: 'Our', br: 'mobile' }, 'work']}
      lede="Shopify stores we've designed, built or reworked for conversion."
      cta={{ label: 'Book a free strategy call', href: '/contact-us' }}
      slot={<WorkFilter />}
      fit="36cqi"
    />
    <ProjectGrid />
    <BrandIndex />
    <PageCTA
      title={['Show us', 'your store.']}
      next={{ label: 'Case studies', href: '/case-studies', hint: 'See the numbers' }}
    />
  </PageShell>
);

export default OurWork;
