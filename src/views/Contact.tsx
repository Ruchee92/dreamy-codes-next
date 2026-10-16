"use client";
import PageShell from '../components/site/PageShell';
import PageHero from '../components/site/PageHero';
import ContactBrief from '../components/pages/contact/ContactBrief';
import { INTRO } from '../components/pages/contact/data';
import '../components/pages/contact/contact.css';

/**
 * /contact-us ("Let's talk"), round 02: a compact typographic intro (smaller
 * H1 and one sentence, so the form starts early on phones), then the form with
 * its side panel; the footer follows (no closing CTA band). Design spec §7,
 * copy sweep D-059 (no bullets or ticks). D-074: no visible form heading (it repeated the intro);
 * D-075: no trust-facts row either (Ruchi).
 */
const Contact = () => (
  <PageShell className="ct-root">
    <PageHero
      size="l"
      lines={['Ready to scale', 'your Shopify', 'store?']}
      lede={INTRO}
    />
    <ContactBrief />
  </PageShell>
);

export default Contact;
