"use client";
import PageShell from '../components/site/PageShell';
import PageHero from '../components/site/PageHero';
import PageCTA from '../components/site/PageCTA';
import ServicesStage from '../components/pages/services/ServicesStage';
import ToolLine from '../components/pages/services/ToolLine';
import Process from '../components/pages/services/Process';
import ServiceFaq from '../components/pages/services/ServiceFaq';
import { HERO_META } from '../components/pages/services/data';
import '../components/pages/services/services.css';

/**
 * /services v2, "Into focus" (D-065) + character pass (D-070): paper hero, the
 * three services on a black glass stage that clears as you read (with the "Also"
 * line at its foot), the kinetic tool line, the indigo process band, the FAQ
 * (same array as the FAQPage schema) and the closing band. No proof stats; hero and closing band are the only
 * primary CTAs.
 */
const Services = () => (
  <PageShell className="sv-root">
    <PageHero
      lines={['Shopify', { text: 'solutions', outline: true }, 'that scale']}
      // "THAT SCALE" is the longest line: 18.6cqi puts it at ~96% of the width on phones.
      fit="18.6cqi"
      lede="We design and build Shopify stores, raise their conversion rate and connect the apps behind them."
      cta={{ label: 'Book a free strategy call', href: '/contact-us' }}
      meta={HERO_META}
    />
    <ServicesStage />
    <ToolLine />
    <Process />
    <ServiceFaq />
    <PageCTA
      title={["Don't leave", 'conversions', 'on the table!']}
      next={{ label: 'About', href: '/about' }}
    />
  </PageShell>
);

export default Services;
