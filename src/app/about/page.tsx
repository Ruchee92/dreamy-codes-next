export const revalidate = 60;
import type { Metadata } from 'next';
import AboutPage from '@/views/About';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getWordPressSEO, getWordPressMenu } from '@/lib/wordpress';
import { JsonLd } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getWordPressSEO("/about");
  if (!seo) return { title: 'About Us | Dreamy Codes' };

  return {
    title: seo.title,
    description: seo.description,
    alternates: seo.alternates,
    openGraph: seo.openGraph,
    twitter: seo.twitter,
    robots: seo.robots,
  };
}

export default async function About() {
  const [menuItems, seoData] = await Promise.all([
    getWordPressMenu("primary"),
    getWordPressSEO("/about")
  ]);

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      <JsonLd schema={seoData?.schema} />
      <Navbar menuItems={menuItems} />
      <AboutPage />
      <Footer />
    </main>
  );
}