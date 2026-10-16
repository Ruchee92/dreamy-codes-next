// Homepage content. Every figure and quote here comes from the facts registry
// (agent-framework/knowledge/facts-registry.md); nothing is invented.

const WP = 'https://wp.dreamycodes.com/wp-content/uploads';

export const AVATARS = [
  `${WP}/2026/03/B9031D87-783F-403F-8E3D-CFFD27DFF404.jpeg`,
  `${WP}/2026/03/dfb535ea-8ab9-4efa-bcf0-978cb6e3a5c1.jpeg`,
  `${WP}/2026/03/07d658f9-c512-4850-9154-0f21cf891518.jpg`,
  `${WP}/2026/03/74b95bf9-4801-4714-bb25-4fe2ce9248da.jpeg`,
];

export const SHOPIFY_BADGE = `${WP}/2026/03/kindpng_1738320.png`;

// D-064: Flows Tasty Treats, Virginskin and MoreWoof added (white on transparent, same 140x64 frame).
export const LOGOS = [
  ...Array.from({ length: 9 }, (_, i) => `${WP}/2026/03/${i + 1}.png`),
  '/home/logos/flows-tasty-treats.png',
  '/home/logos/virginskin.png',
  '/home/logos/morewoof.png',
];

/** `final` is the only value a stat ever shows (it rolls in; it never counts). */
export const PROOF_STATS: { final: string; label: string }[] = [
  { final: '$2M+', label: 'Revenue lift attributed' },
  { final: '300+', label: 'Projects completed' },
  { final: '2.4x', label: 'Avg. ROI on CRO engagements' },
  { final: '4%', label: 'Avg. conversion rate' },
];

// D-043/D-045: art-directed mockups captured from each live store (public/home/work).
// Each card stacks three layers on the same 1600x1966 frame: `base` (tint + browser
// chrome), `screen` (tall desktop capture that scrolls inside the window) and
// `phone` (transparent, static mobile view on top).
const WORK_IMG = '/home/work';

/** The browser window's content area on every card frame, in % of the frame. */
export const WORK_WINDOW = { left: 7.5625, top: 18.2096, width: 84.875, height: 68.2096, ratio: 1341 / 1358 };

export type WorkItem = {
  title: string;
  category: string;
  link: string;
  base: string;
  screen: string;
  phone: string;
  screenW: number;
  screenH: number;
};

// The version suffix is bumped per slug when a capture is redone (adovz v5: USD prices).
const layers = (slug: string, v = 4) => ({
  base: `${WORK_IMG}/${slug}-base-v${v}.webp`,
  screen: `${WORK_IMG}/${slug}-screen-v${v}.webp`,
  phone: `${WORK_IMG}/${slug}-phone-v${v}.webp`,
  screenW: 736,
  screenH: 1577,
});

export const WORK: WorkItem[] = [
  { title: 'CRO Optimized Store For Natural Hair Product', category: 'Theme Dev & CRO', link: 'https://adovz.com/', ...layers('adovz', 5) },
  { title: 'Modern Shopify Store Redesign For Snack Brand', category: 'Full Site Redesign', link: 'https://flowstastytreats.com/', ...layers('flows-tasty-treats') },
  { title: 'Subscription Store Design With 3.2x Subscription Growth', category: 'Subscription Store Design', link: 'https://succly.com/', ...layers('succly') },
  { title: 'Wholesale Shopify Store For Payment Terminals', category: 'Store Design & Development', link: 'https://allstarterminals.com/', ...layers('all-star-terminals') },
  { title: 'Luxury Watch Shopify Store With Advanced Filtering', category: 'Custom Dev & UX', link: 'https://newyorkwatchoutlet.com/', ...layers('new-york-watch-outlet') },
  { title: 'Serene Booking-Led Redesign For A Head Spa', category: 'Store Redesign & CRO', link: 'https://andaliaheadspa.com/', ...layers('andalia-head-spa') },
];

export type CaseStat = { final: string; label: string };

export type CaseStudyData = {
  number: string;
  client: string;
  title: string;
  description: string;
  stats: CaseStat[];
  rows: { challenge: string; result: string }[];
  link: string;
  image: string;
};

export const CASES: CaseStudyData[] = [
  {
    number: '01',
    client: 'theflakehomestead.com',
    title: 'CRO-Optimized Shopify store for The Flake Homestead',
    description: 'A growing homestead lifestyle brand needed an e-commerce store that clearly presents its from-scratch cookbooks and natural living products while turning a large social media audience into loyal customers.',
    stats: [
      { final: '175%', label: 'Sales growth' },
      { final: '6%+', label: 'Conversion rate' },
    ],
    rows: [
      { challenge: 'Social traffic not converting', result: 'Optimized product purchase flow' },
      { challenge: 'Unclear product organization', result: 'Structured collections and bundles' },
      { challenge: 'Limited trust signals', result: 'Added reviews and credibility' },
    ],
    link: 'https://theflakehomestead.com/',
    image: `${WP}/2026/03/PR1-1.jpg`,
  },
  {
    number: '02',
    client: 'motherofmacroscafe.com',
    title: 'Conversion-Focused Website for Mother of Macros Café',
    description: 'A popular healthy meal prep company needed a website that clearly showcases its macro-balanced meals, simplifies online ordering, and helps busy customers choose nutritious meals quickly.',
    stats: [
      { final: '190%', label: 'Increase in orders' },
      { final: '5.6%', label: 'Conversion rate' },
    ],
    rows: [
      { challenge: 'Confusing meal plan choices', result: 'Clear meal comparison layout' },
      { challenge: 'Customers unclear about meals', result: 'Visual meal pack presentation' },
      { challenge: 'Friction during ordering', result: 'Simplified ordering navigation' },
    ],
    link: 'https://motherofmacroscafe.com/',
    image: `${WP}/2026/03/PR2.jpg`,
  },
  {
    number: '03',
    client: 'succly.com',
    title: 'High-Performing Subscription Store for Succly',
    description: 'A subscription-based plant brand needed a storefront that clearly explains its monthly succulent boxes while encouraging customers to start or manage their plant subscription easily.',
    stats: [
      { final: '3.2×', label: 'Subscription growth' },
      { final: '4%', label: 'Conversion rate' },
    ],
    rows: [
      { challenge: 'Subscription value unclear', result: 'Clear subscription value messaging' },
      { challenge: 'Complicated subscription selection', result: 'Streamlined subscription purchase flow' },
      { challenge: 'Weak plan differentiation', result: 'Structured subscription plan layout' },
    ],
    link: 'https://succly.com/',
    image: `${WP}/2026/03/PR3.jpg`,
  },
  {
    number: '04',
    client: 'fortheloveofgolfnaples.com',
    title: 'Premium Shopify Store for For The Love of Golf',
    description: 'A specialty golf retailer needed a modern online store that showcases its curated selection of stylish women’s golf apparel and accessories while improving product discovery and shopping experience.',
    stats: [
      { final: '250%', label: 'Revenue growth' },
      { final: '4.9%', label: 'Conversion rate' },
    ],
    rows: [
      { challenge: 'Outdated website design', result: 'Modern premium Shopify layout' },
      { challenge: 'Difficult product discovery', result: 'Organized collections and filters' },
      { challenge: 'Weak brand storytelling', result: 'Lifestyle driven brand sections' },
    ],
    link: 'https://www.fortheloveofgolfnaples.com/',
    image: `${WP}/2026/03/PR4.jpg`,
  },
];

export const CAPABILITIES = [
  {
    index: '01',
    title: 'Shopify design & development',
    description: 'Branded Shopify stores designed to convert. Your type, colour and photography carry the brand; every layout decision is made around how your customers buy.',
    details: [
      'Visual design that looks unmistakably like your brand, from the homepage to the cart.',
      'Product pages, collections and checkout paths laid out to answer doubts and drive the sale.',
      'Built in custom Liquid or headless Hydrogen, and kept fast for Core Web Vitals.',
    ],
    meta: ['Brand-led visual design', 'Conversion-focused UX', 'Liquid or headless (Hydrogen + Oxygen)'],
  },
  {
    index: '02',
    title: 'Conversion optimization',
    description: 'We watch how shoppers actually use your store, then test fixes. Heatmaps, session recordings and A/B tests replace guesswork.',
    details: [
      'Heatmaps and session recordings show where visitors hesitate, stall or leave.',
      'A/B tests confirm a change works before it becomes the new default.',
      'CRO engagements typically yield a 20-40% lift in conversion rates.',
    ],
    meta: ['Heatmaps', 'Session recordings', 'A/B testing', '20–40% typical lift in conversion rates'],
  },
  {
    index: '03',
    title: 'E-commerce integrations',
    description: 'We wire your retention stack together: Klaviyo flows, Recharge subscriptions, Yotpo loyalty and ERP sync, so every tool works from the same data.',
    details: [
      'Klaviyo flows that trigger on what customers actually do in your store.',
      'Recharge subscriptions and Yotpo loyalty, set up to match your offer and your theme.',
      'ERP sync keeps orders and inventory consistent between your store and warehouse.',
    ],
    meta: ['Klaviyo flows', 'Recharge subscriptions', 'Yotpo loyalty', 'ERP sync'],
  },
];

/**
 * A client review. `image` is a local or WP photo; reviewers without one get a
 * monogram avatar (ReviewAvatar). `monogram` overrides the letters shown
 * (default: the name's first letter).
 */
export type Review = { name: string; role: string; excerpt: string; quote: string; image?: string; monogram?: string };

const T = `${WP}/2026/03`;

/** Reviews published on the original site. */
const SITE_A: Review[] = [
  { name: 'Kelly', role: 'Founder, Chickitty & ShaggyChic', image: `${T}/Kelly.jpeg`,
    excerpt: 'Ruchi is a superstar. He exemplifies professionalism, knowledge, and a work ethic that we can always count on…',
    quote: 'Ruchi is a superstar. He exemplifies professionalism, knowledge, and a work ethic that we can always count on to assist with any of our Shopify needs. He is always highly responsive to our needs and remains one of the top partners that we have worked with.' },
  { name: 'Mike', role: 'Founder, For The Love of Golf NP', image: `${T}/Mike.jpeg`,
    excerpt: 'Another Job Well Done!!! That guy never misses!! This is my 4th or 5th time working with Ruchi on a project…',
    quote: 'Another Job Well Done!!! That guy never misses!! This is my 4th or 5th time working with Ruchi on a project and I must say I wont even look anywhere else. Again, Thank you for believing in our business and putting in the heart and time to make sure that our site is top of the line.' },
  { name: 'Emily', role: 'Founder, Succly', image: `${T}/Emily.jpg`,
    excerpt: 'Ruchi is truly the best at what he does! He created an exceptional website for me…',
    quote: 'Ruchi is truly the best at what he does! He created an exceptional website for me, and when I needed a blog that had different categories, I knew he could deliver and of course, he did. The blog turned out beautifully, with perfectly sized photos (something we couldn’t get right before), clean drop down menus, and a professional, polished look. Ruchi is reliable, talented, and simply the best!!' },
  { name: 'Tatiana', role: 'Founder, Alejandra\'s Panaderia', image: `${T}/tatiana.jpg`,
    excerpt: 'The website Ruchi created for me was more than I ever could have imagined or even create for myself. It’s stunning and very easy to navigate.',
    quote: 'The website Ruchi created for me was more than I ever could have imagined or even create for myself. It’s stunning and very easy to navigate.' },
  { name: 'Kiro', role: 'Founder, Macedonian Treasures', image: `${T}/Kiro.jpg`,
    excerpt: 'I\'m a repeat customer of Ruchi\'s services. What I can say is that on every new order he is delivering better and better…',
    quote: 'I\'m a repeat customer of Ruchi\'s services. What I can say is that on every new order he is delivering better and better. Very knowledgeable, patient and supportive. He is giving proposals from his side but also listening and taking in consideration of our needs and proposals. We will definitely continue to use his services. Thank you Ruchi!' },
  { name: 'Albert', role: 'Founder, Modern Barber', image: `${T}/Albert.jpg`,
    excerpt: 'Ruchi, is very knowledge and is responsive and clear to all my questions. He understood the vision, and the results were terrific…',
    quote: 'Ruchi, is very knowledge and is responsive and clear to all my questions. He understood the vision, and the results were terrific. Much pleasure working with him and actually doing another project with Ruchi.' },
];

const SITE_B: Review[] = [
  { name: 'Virginie', role: 'Founder, Motivink Tattoos', image: `${T}/Virginie.jpg`,
    excerpt: 'Ruchi was a dream to work with. He is Highly professional and was a pleasure to work with…',
    quote: 'Ruchi was a dream to work with. He is Highly professional and was a pleasure to work with! His turn around time was very fast! He communicates beautifully and explained everything very clearly. His work exceeded my expectations! Can\'t recommend him enough!!' },
  { name: 'Ife Thomas', role: 'Public Speaker', image: `${T}/Ife-Thomas.jpg`,
    excerpt: 'I’ve been working with Ruchi for what seems like years, and I must say, he is an absolutely incredible developer…',
    quote: 'I’ve been working with Ruchi for what seems like years, and I must say, he is an absolutely incredible developer. Not only is his skill set top-notch, but his easygoing nature makes him a pleasure to work with. Ruchi truly is the best-kept secret in my business!' },
  { name: 'Stacy', role: 'Founder, Be Seen By Stacy', image: `${T}/Stacy.jpg`,
    excerpt: 'I had an amazing experience working with Ruchi. His customer service was exceptional- he was patient, responsive and open to collaborating…',
    quote: 'I had an amazing experience working with Ruchi. His customer service was exceptional- he was patient, responsive and open to collaborating. Ruchi totally exceeded my expectations! He delivered a fabulous upgraded shop with a luxury feel. I’m sooooo excited to show it off! I highly recommend Ruchi and look forward to working with him again soon.' },
  { name: 'Ben', role: 'D2C Strategist', image: `${T}/Ben.jpeg`,
    excerpt: 'I was pleasantly surprised to wake up to my newly designed and built Shopify store…',
    quote: 'I was pleasantly surprised to wake up to my newly designed and built Shopify store. This is my second time using Ruchi in as many months. He did not disappoint! Very impressed with how he goes the extra mile to help me with any other queries I have about running my store. Thanks again my friend!' },
  { name: 'Chad', role: 'Founder, Nutrinoche', image: `${T}/Chad.jpeg`,
    excerpt: 'I love using Ruchi. He knows how to work on Shopify and has been doing it for years. Do not hesitate to work with him at all:)',
    quote: 'I love using Ruchi. He knows how to work on Shopify and has been doing it for years. Do not hesitate to work with him at all:)' },
];

/**
 * D-055: reviews from Ruchi's freelance profile (curated in rounds/round-02/reviews-new.md).
 * All 5 stars, quotes verbatim except the listed fixes (a member, every, beginning,
 * vision) and cuts. The marketplace is never named in anything displayed.
 * D-056: Ruchi supplied names/brands for Ali (Swedish Niche Perfume), Florence (Flows Tasty Treats),
 * Ami (WildBoard Snacks), Kuldeep (Style-on Eyewear) and Abdul (All Star Terminals). Sororitique stays LIKELY.
 */
const R = '/home/reviews';
const NEW: Review[] = [
  { name: 'Paul', role: 'MoreWoof',
    excerpt: '…his responses were always timely, he came up with great ideas that enhanced the project and his work was of the highest quality.',
    quote: 'I retained Ruchi to redesign our website because he had outstanding 5star reviews. Now I know why. Ruchi’s professionalism, skill and responsiveness is extraordinary and by itself those qualities would merit the highest rating. But what stands out most for me was that Ruchi was completely invested in my project. In every way you can imagine, he made clear that it was as important to him as it was to me -- his responses were always timely, he came up with great ideas that enhanced the project and his work was of the highest quality. I feel truly grateful I had a chance to work with him and I am incredibly grateful for the product he delivered. I intend to keep working with Ruchi on an hourly basis and am looking forward to having him as a member of our team.' },
  { name: 'Scott', role: 'The Flake Homestead',
    excerpt: 'From the beginning he quickly understood what we wanted to do… delivered early, and the site had very few changes needed.',
    quote: 'From the beginning he quickly understood what we wanted to do and communicated with us through our total website rebuild. He made suggestions that indicated experience, delivered early, and the site had very few changes needed. If you have any needs around Shopify or eCommerce web design, Ruchi is your guy.' },
  { name: 'Ami', role: 'Owner, WildBoard Snacks',
    excerpt: 'Ruchi took my notes… and seamlessly turned them into the website i envisioned. I was hoping for and relying on his expertise, and he delivered…',
    quote: 'Ruchi took my notes that were detailed in terms of vision, but completely devoid of any understanding of how website development actually works and seamlessly turned them into the website i envisioned. I was hoping for and relying on his expertise, and he delivered, proactively sharing suggestions and…' },
  { name: 'Store owner', role: 'United Kingdom', monogram: 'UK',
    excerpt: 'He managed to make it look and behave exactly how I wanted - and it works well on all devices and screen resolutions.',
    quote: 'Very happy with the result. I gave Ruchi a detailed mockup of how I want my website to look - and it had several customisations (not a standard template). He managed to make it look and behave exactly how I wanted - and it works well on all devices and screen resolutions. I wasn’t expecting 100% of my customisations to be met so the result actually exceeded my expectations. I will definitely use Ruchi for future projects and would highly recommend him.' },
  { name: 'Ali', role: 'Swedish Niche Perfume, Sweden', image: `${R}/atroysalon.jpg`,
    excerpt: 'He is extremely professional, polite, and responsive, and the quality of his work is excellent.',
    quote: 'It was a pleasure working with him. He is extremely professional, polite, and responsive, and the quality of his work is excellent. I changed my mind and requested several revisions throughout the project, but he was always patient, understanding, and happy to accommodate every change with a positive attitude. I truly appreciate his professionalism and highly recommend him to anyone looking for high quality work and excellent service.' },
  { name: 'Kuldeep', role: 'Style-on Eyewear',
    excerpt: 'Very responsive to any issues I had… knows what is needed to create a converting shopify store.',
    quote: 'Ruchi is excellent at what he does. Very responsive to any issues I had. He got a deep understanding of the project right from the beginning and knows what is needed to create a converting shopify store. Will certainly be recommending and using Ruchi again.' },
  { name: 'Florence', role: 'Flows Tasty Treats',
    excerpt: 'I have worked with Ruchi for the past four years and each time, I am impressed with his level of professionalism and deep expertise.',
    quote: 'I have worked with Ruchi for the past four years and each time, I am impressed with his level of professionalism and deep expertise. He pays careful attention to every piece of the project and delivers an outcome that speaks nothing short of excellence.' },
  { name: 'Eunice', role: 'Shopify store owner, United States',
    excerpt: 'He was professional, quick to respond and went above and beyond in delivering my project.',
    quote: 'I absolutely love working with Ruchi. He was professional, quick to respond and went above and beyond in delivering my project. Will definitely recommend!' },
  { name: 'Roman', role: 'Shopify store owner, United States',
    excerpt: 'He also significantly improved my product hero images, even though that wasn’t part of the original package.',
    quote: 'Great experience working with Ruchi. The website was built exactly as I envisioned, using another brand’s site I liked as a reference. Ruchi was able to replicate the overall look and feel perfectly. He also significantly improved my product hero images, even though that wasn’t part of the original package. I’m very happy with how everything turned out.' },
  { name: 'Cameron', role: 'Shopify store owner, United States',
    excerpt: 'He is highly responsive, listens closely to your goals, and brings strong creative talent to your project.',
    quote: 'Working with Ruchi was a pleasure. He is highly responsive, listens closely to your goals, and brings strong creative talent to your project. His natural eye for branding added substantial value, and he made the process smooth and enjoyable. I look forward to working with him again.' },
  { name: 'Sororitique', role: 'Shopify store owner, United States',
    excerpt: 'This was an easy transition from start to finish.',
    quote: 'I gave a general description as to who I am and what my brand does and he took my vision and ran with it. This was an easy transition from start to finish. I am super excited about my new website!!!!' },
  // D-057: Ruchi supplied the attribution (Alyssa, owner, Mother of Macros). "Ruchihd" (a marketplace handle) reads "Ruchi".
  { name: 'Alyssa', role: 'Owner, Mother of Macros',
    excerpt: 'He delivered our project in a timely manner as promised… We couldn’t be happier with the outcome…',
    quote: 'Ruchi has been an absolute pleasure to work with. He is extremely knowledgeable, patient and his communication is responsive and thorough. He delivered our project in a timely manner as promised and although he was in charge of creating our content, he always made me feel as though my input was important and accommodated all our requests while providing his professional feedback. We couldn’t be happier with the outcome, and look forward to working with him for any future needs. We highly, highly recommend Ruchi and his services.' },
  { name: 'Abdul', role: 'All Star Terminals', image: `${R}/abdul.jpg`,
    excerpt: 'His attention to detail with my requirements always exceed my expectations',
    quote: 'Always a pleasure working with Ruchi! His attention to detail with my requirements always exceed my expectations' },
];

const EVERY = [...SITE_A, ...SITE_B, ...NEW];

/** One review by display name (and role, for the two unnamed "Store owner" reviewers). */
export const reviewBy = (name: string, role?: string): Review => {
  const r = EVERY.find((x) => x.name === name && (!role || x.role === role));
  if (!r) throw new Error(`Unknown review: ${name}`);
  return r;
};

/** Homepage marquee rows (D-055 mix, 7 + 7). */
export const REVIEWS_A: Review[] = [
  reviewBy('Kelly'), reviewBy('Paul'), reviewBy('Mike'), reviewBy('Ali'), reviewBy('Emily'), reviewBy('Scott'), reviewBy('Stacy'),
];
export const REVIEWS_B: Review[] = [
  reviewBy('Kiro'), reviewBy('Store owner', 'United Kingdom'), reviewBy('Virginie'), reviewBy('Kuldeep'), reviewBy('Ami'), reviewBy('Florence'), reviewBy('Eunice'),
];

/** Every review: the marquee 14 first, then the rest ("Read every review" shows all). */
export const ALL_REVIEWS: Review[] = [
  ...REVIEWS_A,
  ...REVIEWS_B,
  ...EVERY.filter((r) => !REVIEWS_A.includes(r) && !REVIEWS_B.includes(r)),
];

export const VALUES = [
  { index: '01', name: 'Evolve', body: 'Keep learning. Keep improving. Stay ahead.' },
  { index: '02', name: 'Communicate', body: 'Clear updates. Direct collaboration. No black boxes.' },
  { index: '03', name: 'Ownership', body: 'Find the real problem. Build the solution. Chase meaningful growth.' },
];

export const OBJECTIONS = [
  { label: 'Price', body: 'Projects start at $990' },
  { label: 'Founder-led', body: 'Ruchi, Founder & Lead Engineer' },
  { label: 'Based globally', body: 'EST & GMT overlap' },
];

export const FOUNDER_IMAGE = `${WP}/2026/08/Founder.jpg`;

/** The published three-step process (live /services, src/views/Services.tsx:85-100). */
export const PROCESS = [
  { number: '01', title: 'Strategy', description: 'We deep dive into your brand, audience, and goals to build a roadmap for growth.' },
  { number: '02', title: 'Design & Build', description: 'We engineer a high-converting Shopify storefront tailored to your unique brand identity.' },
  { number: '03', title: 'Launch & Scale', description: 'We launch your store and implement optimization tactics to ensure continuous growth.' },
];
