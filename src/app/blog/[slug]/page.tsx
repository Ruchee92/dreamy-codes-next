export const revalidate = 60;
import { cache } from 'react';
import type { Metadata } from 'next';
import BlogPostPage from '@/views/BlogPost';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { buildMetadata, fetchFromWordPress, getWordPressSEO, getWordPressMenu, rewriteContentLinks } from '@/lib/wordpress';
import { JsonLd } from '@/components/SEO';

type Params = { params: Promise<{ slug: string }> };

// One request for metadata and page (react/cache, as getHomeSEO). fetchFromWordPress
// throws when WordPress is unreachable, so an outage is an error (ISR keeps serving
// the last good page) and only "WordPress answered: no such post" becomes a 404.
const getPost = cache(async (slug: string) => {
  const data = await fetchFromWordPress(`
    query GetPostBySlug($id: ID!) {
      post(id: $id, idType: SLUG) {
        title
        content
        date
        excerpt
        featuredImage {
          node { sourceUrl }
        }
        categories {
          nodes { name }
        }
        author {
          node {
            name
            description
            avatar {
              url
            }
          }
        }
      }
    }
  `, { id: slug });
  return data?.post ?? null;
});

// Published posts are pre-rendered (and regenerated every 60s), so they are ISR
// pages rather than per-request renders. Build-time failure just means none are
// pre-rendered; they still render on first request.
export async function generateStaticParams() {
  try {
    const data = await fetchFromWordPress(`
      query PostSlugs { posts(first: 100, where: { status: PUBLISH }) { nodes { slug } } }
    `);
    return (data?.posts?.nodes ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

const plain = (html: string | null | undefined) =>
  (html ?? '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const [post, seo] = await Promise.all([getPost(slug), getWordPressSEO(slug, 'post')]);
  if (!post) notFound();
  const excerpt = plain(post.excerpt);
  return buildMetadata(seo, {
    path: `/blog/${slug}`,
    title: `${plain(post.title)} | Dreamy Codes`,
    description: excerpt.length > 160 ? `${excerpt.slice(0, 157).replace(/\s+\S*$/, '')}…` : excerpt || 'An article from the Dreamy Codes journal.',
  });
}

export default async function BlogPost({ params }: Params) {
  const { slug } = await params;

  // Fetch current post, recent posts, SEO and Menu in parallel
  const [post, recentData, seoData, menuItems] = await Promise.all([
    getPost(slug),
    fetchFromWordPress(`
      query GetRecentPosts {
        posts(first: 6, where: { status: PUBLISH }) {
          nodes {
            title
            slug
            date
            featuredImage {
              node { sourceUrl }
            }
          }
        }
      }
    `),
    getWordPressSEO(slug, "post"),
    getWordPressMenu()
  ]);

  const relatedPosts = (recentData?.posts?.nodes || [])
    .filter((p: { slug: string }) => p.slug !== slug)
    .slice(0, 2);

  // notFound() rather than a "Post not found" screen: the latter answered 200,
  // so search engines indexed missing posts as real pages.
  if (!post) {
    notFound();
  }

  // A missing schema means the Yoast lookup failed, not that the post has no
  // SEO. It previously rendered as nothing at all, with no signal anywhere.
  if (!seoData?.schema) {
    console.warn(`[SEO] No Yoast schema returned for post "${slug}"`);
  }

  return (
    <main id="main-content" className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      <JsonLd schema={seoData?.schema} />
      <Navbar menuItems={menuItems} />
      <BlogPostPage post={{ ...post, content: rewriteContentLinks(post.content) }} relatedPosts={relatedPosts} />
      <Footer />
    </main>
  );
}
