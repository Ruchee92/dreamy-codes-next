export const revalidate = 60;
import type { Metadata } from 'next';
import PrivacyPolicyPage from '@/views/PrivacyPolicy';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { buildMetadata, getWordPressSEO, getWordPressMenu } from '@/lib/wordpress';
import { JsonLd } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getWordPressSEO("/privacy-policy"), {
    path: "/privacy-policy",
    title: "Privacy Policy | Dreamy Codes",
    description: "Read the Privacy Policy for Dreamy Codes. Learn how our Shopify Web Development Agency securely collects, uses, and protects your personal information.",
  });
}

export default async function PrivacyPolicy() {
  const [menuItems, seoData] = await Promise.all([
    getWordPressMenu(),
    getWordPressSEO("/privacy-policy")
  ]);

  return (
    <main id="main-content" className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      <JsonLd schema={seoData?.schema} />
      <Navbar menuItems={menuItems} />
      <PrivacyPolicyPage />
      <Footer />
    </main>
  );
}