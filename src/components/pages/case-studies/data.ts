// /case-studies content (round 02). Every figure comes from CASES (home/data.ts, PUBLISHED);
// chapter ids are CASE_SLUGS (/services and /our-work link to them). Copy: copy.md.
import { CASES, reviewBy, type CaseStudyData, type Review } from '../../home/data';
import { CASE_SLUGS } from '../services/data';

export type Quote = Review;

export type Chapter = CaseStudyData & {
  slug: string;
  /** Short client name for the hero index. */
  name: string;
  /** v4 card layers (public/home/work), shown static: no auto-scroll in this context. */
  media: { base: string; screen: string; phone: string };
  quote?: Review;
};

/** D-055: a quote sits in a chapter only if it is that client's own review. */
const review = (name: string) => reviewBy(name);

const media = (slug: string) => ({
  base: `/home/work/${slug}-base-v4.webp`,
  screen: `/home/work/${slug}-screen-v4.webp`,
  phone: `/home/work/${slug}-phone-v4.webp`,
});

// Chapter titles in sentence case (spec §4.2; fix pass 1). The homepage keeps CASES' published Title Case.
// D-059 (copy-humanize.md): plain titles and briefs. `description` overrides CASES' on this page only (home keeps its own).
const EXTRA: Record<string, { name: string; title: string; description?: string; quote?: Review }> = {
  '01': { name: 'The Flake Homestead', title: 'Shopify store for The Flake Homestead',
    description: 'A homestead brand selling from-scratch cookbooks and natural living products. It had a large social audience that wasn’t buying.',
    quote: review('Scott') },
  '02': { name: 'Mother of Macros', title: 'Ordering site for Mother of Macros Café',
    description: 'A meal prep café selling macro-balanced meals. Customers found the meal plans confusing and ordering awkward.',
    quote: review('Alyssa') },
  '03': { name: 'Succly', title: 'Subscription store for Succly',
    description: 'A plant brand selling monthly succulent boxes. Shoppers couldn’t tell the plans apart or see why they should subscribe.',
    quote: review('Emily') },
  '04': { name: 'For The Love of Golf', title: 'For The Love of Golf’s Shopify store',
    description: 'A specialty golf retailer selling women’s apparel and accessories. The old site looked dated and products were hard to find.',
    quote: review('Mike') },
};

export const CHAPTERS: Chapter[] = CASES.map((c) => ({
  ...c,
  slug: CASE_SLUGS[c.number],
  media: media(CASE_SLUGS[c.number]),
  ...EXTRA[c.number],
}));
