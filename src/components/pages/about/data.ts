// /about content (round 02). Every line is PUBLISHED in the facts registry or
// comes from copy.md (round-02); shared facts are imported from home/data.ts.
import { VALUES, reviewBy } from '../../home/data';

const WP = 'https://wp.dreamycodes.com/wp-content/uploads';

/** D-051: the earlier /about imagery (600px sources: never shown wider than they are). */
const OLD = `${WP}/2026/03`;
export const PLATES = {
  portrait: { src: `${OLD}/s8-1.jpg`, alt: 'Woman in a ribbed knit dress leaning against a rock' },
  sites: { src: `${OLD}/s7-1.jpg`, alt: 'A spread of e-commerce storefront designs on a light background' },
  serum: { src: `${OLD}/s8.jpg`, alt: 'Amber dropper bottle of skin oil beside fern leaves' },
  glass: { src: `${OLD}/s8-2.jpg`, alt: 'Virginskin product seen through fluted glass' },
};

/** CRO: price and timezones next to the mid-page action (both PUBLISHED, same line as /contact-us). */
export const PRICE_LINE = 'Projects start at $990 · EST & GMT timezones';

/** CRO (iter 5): the founder promise leads the hero facts (D-053, VERIFIED). */
export const HERO_META = ['You’ll talk to Ruchi', 'Official Shopify Partners', '300+ projects completed', 'Building since 2023'];

/** One consistent set: the /2026/08/ About portraits (facts-check). */
export const TEAM = [
  { name: 'Ruchi', role: 'Founder & Lead Engineer', image: `${WP}/2026/08/founder-Ruchi.jpg` },
  { name: 'Sulakshi', role: 'Head of Operations', image: `${WP}/2026/08/Sulakshi.jpg` },
  { name: 'Ashen', role: 'Shopify Developer', image: `${WP}/2026/08/Ashen-Shopify-developer.jpg` },
  { name: 'Lahiru', role: 'UI/UX Designer', image: `${WP}/2026/08/Lahiru.jpg` },
];

export const MISSION =
  'Design and engineering happen in one team here, so how your store looks and how it sells are decided together. Then we keep improving it as you grow.';

/** Home's three values (D-048) with the longer /about bodies (copy.md). */
const BODIES: Record<string, string> = {
  Evolve: 'Shopify moves fast, and so do we. We learn new features as they ship.',
  Communicate: 'Regular, clear updates and a direct line to the people doing the work. No black boxes.',
  Ownership: 'We look past the brief to the problem behind it, and we own the fix from start to finish.',
};
export const ABOUT_VALUES = VALUES.map((v) => ({ ...v, body: BODIES[v.name] ?? v.body }));

const paul = reviewBy('Paul');
/**
 * D-055: Paul (MoreWoof) replaces Mike here (Mike stays on the Golf case chapter;
 * no reviewer repeats across inner pages). A verbatim fragment of his PUBLISHED quote.
 */
export const PULL_QUOTE = {
  text: '…Ruchi was completely invested in my project.',
  name: paul.name,
  role: paul.role,
  image: paul.image,
  monogram: paul.monogram,
};
