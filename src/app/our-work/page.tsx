export const revalidate = 60;
import type { Metadata } from 'next';
import OurWorkPage from '@/views/OurWork';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { buildMetadata, getWordPressSEO, getWordPressMenu } from '@/lib/wordpress';
import { JsonLd } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getWordPressSEO("/our-work"), {
    path: "/our-work",
    title: "Custom Shopify Store Portfolio | Dreamy Codes",
    description: "View our Shopify portfolio. See how we help ecommerce brands scale with high-performance stores designed to boost conversions and revenue.",
  });
}

export default async function OurWork() {
  const [menuItems, seoData] = await Promise.all([
    getWordPressMenu(),
    getWordPressSEO("/our-work")
  ]);

  return (
    <main id="main-content" className="min-h-screen bg-[#fcfcfc] text-slate-900 font-sans selection:bg-[#3432c7] selection:text-white">
      <JsonLd schema={seoData?.schema} />
      <Navbar menuItems={menuItems} />
      <OurWorkPage />
      <Footer />
    </main>
  );
}