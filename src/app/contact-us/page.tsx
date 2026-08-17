export const revalidate = 60;
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';
import { getWordPressSEO, getWordPressMenu } from '@/lib/wordpress';
import { JsonLd } from '@/components/SEO';

// This route takes precedence over the catch-all [slug], which previously
// rendered the WordPress page body here. The SEO still comes from that same
// WordPress page, so titles and descriptions stay editable in Yoast.
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getWordPressSEO("/contact-us");
  if (!seo) return { title: 'Contact Us | Dreamy Codes' };

  return {
    title: seo.title,
    description: seo.description,
    alternates: seo.alternates,
    openGraph: seo.openGraph,
    twitter: seo.twitter,
    robots: seo.robots,
  };
}

export default async function ContactUs() {
  const [menuItems, seoData] = await Promise.all([
    getWordPressMenu(),
    getWordPressSEO("/contact-us")
  ]);

  return (
    <main id="main-content" className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      <JsonLd schema={seoData?.schema} />
      <Navbar menuItems={menuItems} />
      {/* Offsets the fixed navbar, which the homepage handles with its hero. */}
      <div className="pt-28 md:pt-36">
        <ContactSection />
      </div>
      <Footer />
    </main>
  );
}
