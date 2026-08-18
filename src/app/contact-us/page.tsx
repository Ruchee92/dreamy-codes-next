export const revalidate = 60;
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactIntro, { ContactInclusions } from '@/components/ContactIntro';
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
      {/* ContactIntro clears the fixed navbar and carries the page's h1, so the
          contact block keeps its default h2. */}
      <ContactIntro />
      <ContactSection title="Tell us about your store" />
      {/* On phones the inclusions read better as a closing summary than as
          something to scroll past before reaching the form. Desktop renders
          them beside the copy, inside ContactIntro. */}
      <ContactInclusions className="lg:hidden max-w-screen-2xl mx-auto px-4 pt-8 pb-12" />
      <Footer />
    </main>
  );
}
