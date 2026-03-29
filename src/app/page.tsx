export const revalidate = 60;
import type { Metadata } from 'next';
import HomePage from '@/views/Home';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getWordPressSEO, getWordPressMenu } from '@/lib/wordpress';
import { JsonLd } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getWordPressSEO("/");
  if (!seo) return { 
    title: 'Dreamy Codes', 
    description: 'We engineer e-commerce for scale.',
    openGraph: { images: ['https://dreamycodes.com/default-og.jpg'] },
    twitter: { card: 'summary_large_image', images: ['https://dreamycodes.com/default-og.jpg'] }
  };

  return {
    title: seo.title,
    description: seo.description,
    alternates: seo.alternates,
    openGraph: seo.openGraph,
    twitter: seo.twitter,
  };
}

export default async function Page() {
  const [menuItems, seoData] = await Promise.all([
    getWordPressMenu("primary"),
    getWordPressSEO("/")
  ]);

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      <JsonLd schema={seoData?.schema} />
      <Navbar menuItems={menuItems} />
      <HomePage />
      <Footer />
    </main>
  );
}