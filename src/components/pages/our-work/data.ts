// /our-work content (round 02). Titles: facts-check.md + D-048 (Succly 3.2x, Andalia
// without a number); filter mapping: plan.md §1 (editorial, Ruchi to OK at Gate B).
import { CASES, WORK } from '../../home/data';
import type { WorkCardItem } from '../../site/WorkCard';
import { CASE_SLUGS } from '../services/data';

export type WorkType = 'design' | 'cro' | 'custom';

export const FILTERS: { type: WorkType | 'all'; label: string }[] = [
  { type: 'all', label: 'All' },
  { type: 'design', label: 'Design & build' },
  { type: 'cro', label: 'Conversion optimization' },
  { type: 'custom', label: 'Custom development' },
];

export const isWorkType = (v: string | null): v is WorkType => v === 'design' || v === 'cro' || v === 'custom';

export type Project = {
  item: WorkCardItem;
  type: WorkType;
  domain: string;
  caseSlug?: string;
  /** The case's published headline result, shown in the meta line before "Case study" (CRO fix pass 2). */
  result?: string;
};

const work = (link: string) => WORK.find((w) => w.link === link)!;

// Same layer convention as home/data.ts `layers()` (v4 captures in public/home/work).
// The version is bumped per slug when a capture is redone (adovz v5: USD prices; modern-studio-supply v5: re-tint).
const layers = (slug: string, v = 4) => ({
  base: `/home/work/${slug}-base-v${v}.webp`,
  screen: `/home/work/${slug}-screen-v${v}.webp`,
  phone: `/home/work/${slug}-phone-v${v}.webp`,
  screenW: 736,
  screenH: 1577,
});

const caseSlug = (n: string) => CASE_SLUGS[n];

/** "175% sales growth": the first stat of a case, from CASES (one source per fact). */
const result = (n: string) => {
  const st = CASES.find((c) => c.number === n)!.stats[0];
  return `${st.final} ${st.label.toLowerCase()}`;
};

/** All twelve projects (D-058: +Veridfoods, +Modern Studio Supply), one 4:5-ish frame each (D-012). The 6 homepage items come from WORK unchanged. */
export const PROJECTS: Project[] = [
  { item: work('https://adovz.com/'), type: 'cro', domain: 'adovz.com' },
  { item: work('https://flowstastytreats.com/'), type: 'design', domain: 'flowstastytreats.com' },
  { item: work('https://succly.com/'), type: 'design', domain: 'succly.com', caseSlug: caseSlug('03') }, // no result: the title (D-048) already carries 3.2x
  { item: work('https://allstarterminals.com/'), type: 'design', domain: 'allstarterminals.com' },
  { item: work('https://newyorkwatchoutlet.com/'), type: 'custom', domain: 'newyorkwatchoutlet.com' },
  { item: work('https://andaliaheadspa.com/'), type: 'cro', domain: 'andaliaheadspa.com' },
  {
    item: { title: 'Premium Lifestyle Store For The Flake Homestead', category: 'Full Build', link: 'https://theflakehomestead.com/', ...layers('flake-homestead') },
    type: 'design',
    domain: 'theflakehomestead.com',
    caseSlug: caseSlug('01'),
    result: result('01'),
  },
  // D-058 (Ruchi): two new builds, right after Flake.
  {
    item: { title: 'Dairy-Free Ice Cream Mix Shopify Store With Waitlist Launch', category: 'Store Design & Development', link: 'https://veridfoods.com/', ...layers('veridfoods') },
    type: 'design',
    domain: 'veridfoods.com',
  },
  {
    item: { title: 'Salon & Studio Furniture Shopify Store With Build-Out Packages', category: 'Store Design & Development', link: 'https://modernstudiosupply.com/', ...layers('modern-studio-supply', 5) },
    type: 'design',
    domain: 'modernstudiosupply.com',
  },
  {
    item: { title: 'Mother of Macros Café Ordering System', category: 'Custom App Dev', link: 'https://motherofmacroscafe.com/', ...layers('mother-of-macros') },
    type: 'custom',
    domain: 'motherofmacroscafe.com',
    caseSlug: caseSlug('02'),
    result: result('02'),
  },
  {
    item: { title: 'For The Love of Golf Premium Storefront', category: 'UI/UX Design', link: 'https://www.fortheloveofgolfnaples.com/', ...layers('for-the-love-of-golf') },
    type: 'design',
    domain: 'fortheloveofgolfnaples.com',
    caseSlug: caseSlug('04'),
    result: result('04'),
  },
  {
    item: { title: 'High-Converting Shopify Revamp For Barber Brand', category: 'Store Revamp & CRO', link: 'https://modernbarbersupply.com/', ...layers('modern-barber-supply') },
    type: 'cro',
    domain: 'modernbarbersupply.com',
  },
];

export const countOf = (type: WorkType | 'all') => (type === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.type === type).length);

/** D-048: SignatureSigns stays out until Ruchi confirms its domain (signaturesynes.com). */
export const SHOW_SIGNATURE_SIGNS = false;

const WP = 'https://wp.dreamycodes.com/wp-content/uploads';

/** Logos carry an optional optical `scale` (their files have very different weights in the same box).
 * The published client index minus "Toilet me" (myshopify dev URL), D-048. */
export const BRANDS: { name: string; logo: string; link: string; scale?: number }[] = [
  { name: 'Urban Abseiler', scale: 0.82, logo: `${WP}/2026/03/UA_logo_rectangular_sm-1.png`, link: 'https://urbanabseiler.com.au/' },
  { name: 'Virginskin', logo: `${WP}/2026/03/Logo-new_e99cb488-5a32-47f5-8bc2-a2992ad35340.png`, link: 'https://virginskinbeauty.com/' },
  { name: 'ShaggyChic', logo: `${WP}/2026/03/Main-Logo_4dd4af09-4841-43a9-b338-56aebfa08329.png`, link: 'https://shaggychic.com/' },
  { name: 'Innovative Drinks', logo: `${WP}/2026/03/ID-Logo_f4b38cee-9a86-407d-8fcb-a21f5caba1bc_500x126-2.png`, link: 'https://innovativedrinks.de/' },
  { name: '7Seeds', scale: 1.15, logo: `${WP}/2026/03/logo-1.png`, link: 'https://7seeds.ca/' },
  { name: 'Halal Beats', logo: `${WP}/2026/04/hllbeats.png`, link: 'https://www.halalbeats.com/' },
  { name: 'VoodooSpirit Coffee', logo: `${WP}/2026/03/VDC_Stacked_Skull_VDS_DBLESHT_1C.png2_170x.png`, link: 'https://voodoospiritcoffee.com/' },
  ...(SHOW_SIGNATURE_SIGNS
    ? [{ name: 'SignatureSigns', logo: `${WP}/2026/03/1_fa8b36ca-8cd9-479b-838b-724b7dd125f2.png`, link: 'https://www.signaturesynes.com/' }]
    : []),
  { name: 'PeoBeo', scale: 1.2, logo: `${WP}/2026/03/Emblena_neagra_-_Format_PNG.png`, link: 'https://www.peobeo.com/' },
  { name: 'AllStar Terminals', logo: `${WP}/2026/03/Logo-new.png`, link: 'https://allstarterminals.com/' },
  { name: 'Griddle Guard', logo: `${WP}/2026/03/GriddleGuardLogo_04140ca1-e508-4f0d-817c-1e3085ad34c9_200x-1.png`, link: 'https://griddleguard.com/' },
  { name: 'Dimshade Co', scale: 1.1, logo: `${WP}/2026/03/DIM_SHADE_LOGO.png`, link: 'https://dimshadeco.com/' },
  { name: 'Motivink', logo: `${WP}/2026/04/Motivink.png`, link: 'https://motivink.com/' },
  { name: 'Nutrition Authority', scale: 0.9, logo: `${WP}/2026/04/Nutrition-Authority.png`, link: 'https://mynutritionauthority.com/' },
  { name: 'Mama healer', scale: 1.1, logo: `${WP}/2026/04/mama-healer.png`, link: 'https://mamahealer.com/' },
];
