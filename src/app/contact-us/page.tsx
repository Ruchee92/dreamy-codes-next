export const revalidate = 60;
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactPage from '@/views/Contact';
import { buildMetadata, getWordPressSEO, getWordPressMenu } from '@/lib/wordpress';
import { JsonLd } from '@/components/SEO';

// This route takes precedence over the catch-all [slug], which previously
// rendered the WordPress page body here. The SEO still comes from that same
// WordPress page, so titles and descriptions stay editable in Yoast.
export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getWordPressSEO("/contact-us"), {
    path: "/contact-us",
    title: "Contact Us | Dreamy Codes",
    description: "Ready to grow your Shopify store? Contact our Shopify web development agency and book a free strategy call for design, redesign, or optimization.",
  });
}

export default async function ContactUs() {
  const [menuItems, seoData] = await Promise.all([
    getWordPressMenu(),
    getWordPressSEO("/contact-us")
  ]);

  return (
    <main id="main-content" className="min-h-screen bg-[#fcfcfc] text-slate-900 font-sans selection:bg-[#3432c7] selection:text-white">
      <JsonLd schema={seoData?.schema} />
      <Navbar menuItems={menuItems} />
      {/* The view carries the page's h1 (intro) and the #contact form block. */}
      <ContactPage />
      <Footer />
    </main>
  );
}
