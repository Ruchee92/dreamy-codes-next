export const revalidate = 60;
import type { Metadata } from 'next';
import ServicesPage from '@/views/Services';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { buildMetadata, getWordPressSEO, getWordPressMenu } from '@/lib/wordpress';
import { serviceFaqs } from '@/data/serviceFaqs';
import { JsonLd, FaqJsonLd } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getWordPressSEO("/services"), {
    path: "/services",
    title: "Shopify Design, CRO & Development Services | Dreamy Codes",
    description: "As a leading Web Development Agency, we offer custom theme design, SEO, CRO and site speed optimization for growing e-commerce brands.",
  });
}

export default async function Services() {
  const [menuItems, seoData] = await Promise.all([
    getWordPressMenu(),
    getWordPressSEO("/services")
  ]);

  return (
    <main id="main-content" className="min-h-screen bg-[#fcfcfc] text-slate-900 font-sans selection:bg-[#3432c7] selection:text-white">
      <JsonLd schema={seoData?.schema} />
      <FaqJsonLd items={serviceFaqs} />
      <Navbar menuItems={menuItems} />
      <ServicesPage />
      <Footer />
    </main>
  );
}