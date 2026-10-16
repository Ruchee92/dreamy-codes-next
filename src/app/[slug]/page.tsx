export const revalidate = 60;
// Catch-all for WordPress pages that have no dedicated route. They render inside
// the site chrome (Navbar, Footer) with simple, readable body styling.

import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { buildMetadata, fetchFromWordPress, getWordPressMenu, getWordPressSEO, rewriteContentLinks } from "@/lib/wordpress";
import { JsonLd } from "@/components/SEO";

// Next 15 hands `params` over as a promise. Reading .slug off it directly
// yields undefined, which used to throw inside getWordPressSEO and turn every
// unmatched URL into a 500 instead of a 404.
type PageParams = { params: Promise<{ slug: string }> };

// Slugs that are the WordPress front page / posts page or have their own route:
// never served from here (SEO audit M4; /home also 301s to / in next.config).
const RESERVED_SLUGS = new Set(["home", "blog"]);

// One request for metadata and page. An unreachable WordPress throws (error / last
// good ISR copy); only "no such page" is a 404.
const getPage = cache(async (slug: string) => {
  const data = await fetchFromWordPress(`
    query GetPageContent($slug: ID!) {
      page(id: $slug, idType: URI) {
        title
        content
      }
    }
  `, { slug });
  return data?.page ?? null;
});

const plain = (html: string | null | undefined) =>
  (html ?? "").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) notFound();
  const [page, seo] = await Promise.all([getPage(slug), getWordPressSEO(slug, "page")]);
  if (!page) notFound();
  const text = plain(page.content);
  return buildMetadata(seo, {
    path: `/${slug}`,
    title: `${plain(page.title)} | Dreamy Codes`,
    description: text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, "")}…` : text || `${plain(page.title)} at Dreamy Codes.`,
  });
}

export default async function WordPressPage({ params }: PageParams) {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) notFound();

  const [page, seo, menuItems] = await Promise.all([getPage(slug), getWordPressSEO(slug, "page"), getWordPressMenu()]);

  // If WordPress says the page doesn't exist, show the Next.js 404 page
  if (!page) {
    notFound();
  }

  return (
    <main id="main-content" className="min-h-screen bg-[#fcfcfc] text-slate-900 font-sans selection:bg-[#3432c7] selection:text-white">
      <JsonLd schema={seo?.schema} />
      <Navbar menuItems={menuItems} />
      <article className="max-w-3xl mx-auto px-5 md:px-8 pt-36 md:pt-44 pb-24 md:pb-32">
        <h1 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.95] mb-10 md:mb-14">
          {plain(page.title)}
        </h1>
        {/* WordPress HTML; site links rewritten to relative paths. */}
        <div
          className="prose-dc max-w-none text-gray-700 text-lg leading-relaxed [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-3xl [&_h2]:mt-12 [&_h2]:mb-6 [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-2xl [&_h3]:mt-10 [&_h3]:mb-4"
          dangerouslySetInnerHTML={{ __html: rewriteContentLinks(page.content) }}
        />
      </article>
      <Footer />
    </main>
  );
}
