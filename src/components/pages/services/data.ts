// /services v2 "Into focus" (D-065, rounds/round-02/services-v2-spec.md).
// Copy: D-059 plain copy (copy-humanize.md). No proof stats on this page: the
// numbers live on home and /case-studies (Ruchi, 2026-10-15).
import { PROCESS } from '../../home/data';
import type { LineSpec } from '../../site/Lines';

/** Buying facts (price and time), not proof stats. */
export const HERO_META = ['Projects from $990 to $5,000', 'Most builds take 2–4 weeks'];

/** /case-studies chapter ids. Imported by /case-studies and /our-work; keep in sync. */
export const CASE_SLUGS: Record<string, string> = {
  '01': 'flake-homestead',
  '02': 'mother-of-macros',
  '03': 'succly',
  '04': 'for-the-love-of-golf',
};

const WP = 'https://wp.dreamycodes.com/wp-content/uploads';

/** A service image (D-072: Ruchi's 1536×1024 sources, shown up to 768 CSS px: sharp at 2x), always 3:2. */
export type ServiceImage = { src: string; alt: string; w: number; h: number; caption?: string; position?: string };

/** D-072: a proof screenshot shown with a service (an image of numbers; never restated in copy). */
export type ServiceProof = { src: string; alt: string; w: number; h: number; caption: string };

export type Service = {
  id: string;
  title: LineSpec[];
  /** Plain benefit line under the title (Ruchi, D-070: no tech or app names here). */
  tools: string[];
  rows: { title: string; body: string }[];
  image: ServiceImage;
  proof?: ServiceProof;
};

export const SERVICES: Service[] = [
  {
    id: 'design',
    title: ['Shopify design', '& development'],
    tools: ['Built for your brand', 'Fast on every phone', 'Easy for your team to update'],
    rows: [
      { title: 'Eye-catching Shopify websites', body: 'Custom, fast-loading storefronts built to turn visitors into buyers.' },
      { title: 'Design that fits your brand', body: 'Your brand’s look, on pages that are easy to shop.' },
      { title: 'Top conversion tactics', body: 'Tested changes to get more sales from the traffic you already have.' },
    ],
    image: {
      src: `${WP}/2026/10/The-Flake-Homestead-Digital-Showcase.png`,
      alt: 'Laptop and phone showing The Flake Homestead Shopify store',
      w: 1536,
      h: 1024,
      caption: 'The Flake Homestead',
    },
  },
  {
    id: 'cro',
    title: ['Conversion', 'optimization'],
    tools: ['See where shoppers drop off', 'Test changes before rolling them out'],
    rows: [
      { title: 'Every step to checkout', body: 'From first click to checkout, tested and improved.' },
      { title: 'Ads and pages that match', body: 'Your ads land on pages built for them, so ad spend goes further.' },
      { title: 'Ongoing improvements', body: 'Regular changes that keep raising your conversion rate.' },
    ],
    image: {
      src: `${WP}/2026/10/Cinematic-Smartphone-Sweater-Shopping.png`,
      alt: 'A hand holding a phone, choosing a sweater on a store product page',
      w: 1536,
      h: 1024,
    },
    proof: {
      src: `${WP}/2026/08/image-6.png`,
      alt: 'Shopify analytics dashboard showing sessions, total sales, orders and conversion rate rising week over week',
      w: 857,
      h: 399,
      caption: 'A client’s Shopify dashboard, week over week.',
    },
  },
  {
    id: 'integrations',
    title: ['E-commerce', 'integrations'],
    tools: ['Emails that bring buyers back', 'Subscriptions and loyalty', 'Your systems in sync'],
    rows: [
      { title: 'Customers who come back', body: 'Your store set up to bring buyers back for a second order.' },
      { title: 'Email flows that sell', body: 'Automated email flows that recover carts and bring buyers back.' },
      { title: 'Subscriptions & loyalty', body: 'Subscriptions, reviews and loyalty, connected to the systems you already use.' },
    ],
    image: {
      src: `${WP}/2026/10/Neon-E-Commerce-Workflow-Ecosystem.png`,
      alt: 'Laptop, phone, parcel and email linked by glowing lines around an online store',
      w: 1536,
      h: 1024,
    },
  },
];

/** The "Also" line: each opens its FAQ answer (#faq-<slug> in serviceFaqs). */
export const ALSO = [
  { label: 'Copywriting & SEO', slug: 'copywriting-seo' },
  { label: 'Branding & logo', slug: 'branding' },
  { label: 'Maintenance & support', slug: 'maintenance' },
  { label: 'Analytics & tracking', slug: 'analytics' },
];

/** PROCESS (published titles) + plain detail lines (D-059). */
export const STEPS = PROCESS.map((p, i) => ({
  number: p.number,
  title: p.title,
  details: [
    ['Onboarding first: your brand, your customers and what the store needs to do.'],
    ['A custom design, built to load fast and easy for your team to update.', 'Regular check-ins while we build.'],
    ['Tested on all major browsers and devices before launch.', 'After launch, you edit your own products, content and images.'],
  ][i],
}));
