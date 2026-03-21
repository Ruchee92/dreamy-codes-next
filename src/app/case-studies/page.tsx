export const revalidate = 60;
import type { Metadata } from 'next';
import CaseStudiesPage from '@/views/CaseStudies';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getWordPressSEO, getWordPressMenu } from '@/lib/wordpress';
import { JsonLd } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getWordPressSEO("/case-studies");
  if (!seo) return { title: 'Case Studies | Dreamy Codes' };

  return {
    title: seo.title,
    description: seo.description,
    alternates: seo.alternates,
    openGraph: seo.openGraph,
    twitter: seo.twitter,
  };
}

export default async function CaseStudies() {
  const [menuItems, seoData] = await Promise.all([
    getWordPressMenu("primary"),
    getWordPressSEO("/case-studies")
  ]);

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      <JsonLd schema={seoData?.schema} />
      <Navbar menuItems={menuItems} />
      <CaseStudiesPage />
      <Footer />
    </main>
  );
}