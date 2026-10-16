export const revalidate = 60;
import type { Metadata } from 'next';
import CaseStudiesPage from '@/views/CaseStudies';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { buildMetadata, getWordPressSEO, getWordPressMenu } from '@/lib/wordpress';
import { JsonLd } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getWordPressSEO("/case-studies"), {
    path: "/case-studies",
    title: "Shopify Case Studies & Success Stories | Dreamy Codes",
    description: "Read our top 4 e-commerce case studies. See how our Shopify Web Development Agency helps growing brands scale with custom design and optimization.",
  });
}

export default async function CaseStudies() {
  const [menuItems, seoData] = await Promise.all([
    getWordPressMenu(),
    getWordPressSEO("/case-studies")
  ]);

  return (
    <main id="main-content" className="min-h-screen bg-[#fcfcfc] text-slate-900 font-sans selection:bg-[#3432c7] selection:text-white">
      <JsonLd schema={seoData?.schema} />
      <Navbar menuItems={menuItems} />
      <CaseStudiesPage />
      <Footer />
    </main>
  );
}