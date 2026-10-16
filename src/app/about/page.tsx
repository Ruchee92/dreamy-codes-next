export const revalidate = 60;
import type { Metadata } from 'next';
import AboutPage from '@/views/About';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { buildMetadata, getWordPressSEO, getWordPressMenu } from '@/lib/wordpress';
import { JsonLd } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getWordPressSEO("/about"), {
    path: "/about",
    title: "About Us | Dreamy Codes",
    description: "We are a dedicated Shopify Web Development Agency. We focus exclusively on the Shopify ecosystem to deliver expert e-commerce solutions.",
  });
}

export default async function About() {
  const [menuItems, seoData] = await Promise.all([
    getWordPressMenu(),
    getWordPressSEO("/about")
  ]);

  return (
    <main id="main-content" className="min-h-screen bg-[#fcfcfc] text-slate-900 font-sans selection:bg-[#3432c7] selection:text-white">
      <JsonLd schema={seoData?.schema} />
      <Navbar menuItems={menuItems} />
      <AboutPage />
      <Footer />
    </main>
  );
}