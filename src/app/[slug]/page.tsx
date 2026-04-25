export const revalidate = 60;
// File: src/app/[slug]/page.tsx (or app/[slug]/page.tsx)

import { fetchFromWordPress, getWordPressSEO } from "@/lib/wordpress"; // Adjust path if you don't use 'src'
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/SEO";

// 1. This function handles the SEO (Title and Meta Description)
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const seo = await getWordPressSEO(params.slug, "page");

  if (!seo) return { title: "Page Not Found" };

  return {
    title: seo.title,
    description: seo.description,
    alternates: seo.alternates,
    openGraph: seo.openGraph,
    twitter: seo.twitter,
    robots: seo.robots,
  };
}

// 2. This function builds the actual page content
export default async function WordPressPage({ params }: { params: { slug: string } }) {
  // Ask WordPress for the page title and content based on the URL slug
  const [data, seo] = await Promise.all([
    fetchFromWordPress(`
      query GetPageContent($slug: ID!) {
        page(id: $slug, idType: URI) {
          title
          content
        }
      }
    `, { slug: params.slug }),
    getWordPressSEO(params.slug, "page")
  ]);

  // If WordPress says the page doesn't exist, show the Next.js 404 page
  if (!data?.page) {
    notFound();
  }

  // Render the page
  return (
    <main className="max-w-4xl mx-auto p-8">
      <JsonLd schema={seo?.schema} />
      <h1 className="text-4xl font-bold mb-8">{data.page.title}</h1>
      
      {/* dangerouslySetInnerHTML is required to render WordPress HTML blocks */}
      <div 
        className="prose lg:prose-xl"
        dangerouslySetInnerHTML={{ __html: data.page.content }} 
      />
    </main>
  );
}