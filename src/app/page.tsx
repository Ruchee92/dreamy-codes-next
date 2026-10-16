export const revalidate = 60;
import { cache } from 'react';
import type { Metadata } from 'next';
import HomePage from '@/views/Home';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { buildMetadata, getWordPressSEO, getWordPressMenu } from '@/lib/wordpress';
import { JsonLd } from '@/components/SEO';

// generateMetadata and the page body both need this. Next only de-duplicates
// GET fetches automatically and the WordPress client posts GraphQL, so without
// react/cache the same query is sent twice on every render.
const getHomeSEO = cache(() => getWordPressSEO("/"));

// Used when WordPress is unreachable or a Yoast field is empty (buildMetadata).
// Not the Yoast description: that one carries claims still waiting on Ruchi (SEO W1).
const FALLBACK_TITLE = 'Dreamy Codes | Shopify Engineering for Scale';
const FALLBACK_DESCRIPTION = 'We engineer high-converting Shopify stores for D2C brands.';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getHomeSEO(), { path: '/', title: FALLBACK_TITLE, description: FALLBACK_DESCRIPTION });
}

export default async function Page() {
  const [menuItems, seoData] = await Promise.all([
    getWordPressMenu(),
    getHomeSEO()
  ]);

  return (
    <main id="main-content" className="min-h-screen bg-[#fcfcfc] text-slate-900 font-sans selection:bg-[#3432c7] selection:text-white">
      <JsonLd schema={seoData?.schema} />
      <Navbar menuItems={menuItems} />
      <HomePage />
      <Footer />
    </main>
  );
}