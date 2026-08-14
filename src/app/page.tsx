export const revalidate = 60;
import { cache } from 'react';
import type { Metadata } from 'next';
import HomePage from '@/views/Home';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getWordPressSEO, getWordPressMenu } from '@/lib/wordpress';
import { JsonLd } from '@/components/SEO';

// generateMetadata and the page body both need this. Next only de-duplicates
// GET fetches automatically and the WordPress client posts GraphQL, so without
// react/cache the same query is sent twice on every render.
const getHomeSEO = cache(() => getWordPressSEO("/"));

// Used when WordPress is unreachable. Without a full object here an outage
// would strip the homepage of its canonical, OG image and Twitter card.
const FALLBACK_TITLE = 'Dreamy Codes | Shopify Engineering for Scale';
const FALLBACK_DESCRIPTION = 'We engineer high-converting Shopify stores for D2C brands.';

const fallbackMetadata: Metadata = {
  title: FALLBACK_TITLE,
  description: FALLBACK_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: FALLBACK_TITLE,
    description: FALLBACK_DESCRIPTION,
    url: 'https://dreamycodes.com',
    siteName: 'Dreamy Codes',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/default-og.jpg', width: 1200, height: 630, alt: FALLBACK_TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: FALLBACK_TITLE,
    description: FALLBACK_DESCRIPTION,
    creator: '@dreamycodes',
    images: ['/default-og.jpg'],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomeSEO();
  if (!seo) return fallbackMetadata;

  return {
    title: seo.title,
    description: seo.description,
    alternates: seo.alternates,
    openGraph: seo.openGraph,
    twitter: seo.twitter,
    robots: seo.robots,
  };
}

export default async function Page() {
  const [menuItems, seoData] = await Promise.all([
    getWordPressMenu("primary"),
    getHomeSEO()
  ]);

  return (
    <main id="main-content" className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      <JsonLd schema={seoData?.schema} />
      <Navbar menuItems={menuItems} />
      <HomePage />
      <Footer />
    </main>
  );
}