export const revalidate = 60;
import type { Metadata } from 'next';
import TermsOfServicePage from '@/views/TermsOfService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { buildMetadata, getWordPressSEO, getWordPressMenu } from '@/lib/wordpress';
import { JsonLd } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getWordPressSEO("/terms-of-service"), {
    path: "/terms-of-service",
    title: "Terms of Service | Dreamy Codes",
    description: "Review the Terms of Service for Dreamy Codes. Read our client agreements and conditions for partnering with our expert Shopify Web Development Agency.",
  });
}

export default async function TermsOfService() {
  const [menuItems, seoData] = await Promise.all([
    getWordPressMenu(),
    getWordPressSEO("/terms-of-service")
  ]);

  return (
    <main id="main-content" className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      <JsonLd schema={seoData?.schema} />
      <Navbar menuItems={menuItems} />
      <TermsOfServicePage />
      <Footer />
    </main>
  );
}