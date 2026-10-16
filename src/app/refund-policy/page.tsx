export const revalidate = 60;
import type { Metadata } from 'next';
import RefundPolicyPage from '@/views/RefundPolicy';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { buildMetadata, getWordPressSEO, getWordPressMenu } from '@/lib/wordpress';
import { JsonLd } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getWordPressSEO("/refund-policy"), {
    path: "/refund-policy",
    title: "Refund Policy | Dreamy Codes",
    description: "View the refund and cancellation policy for Dreamy Codes. Understand our billing terms as a premium Shopify Web Development Agency for e-commerce brands.",
  });
}

export default async function RefundPolicy() {
  const [menuItems, seoData] = await Promise.all([
    getWordPressMenu(),
    getWordPressSEO("/refund-policy")
  ]);

  return (
    <main id="main-content" className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      <JsonLd schema={seoData?.schema} />
      <Navbar menuItems={menuItems} />
      <RefundPolicyPage />
      <Footer />
    </main>
  );
}