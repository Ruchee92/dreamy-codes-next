export const revalidate = 60;
import type { Metadata } from 'next';
import BlogPostPage from '@/views/BlogPost';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { fetchFromWordPress, getWordPressSEO, getWordPressMenu } from '@/lib/wordpress';
import { JsonLd } from '@/components/SEO';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const seo = await getWordPressSEO(slug, "post");
  if (!seo) return { title: 'Journal | Dreamy Codes' };

  return {
    title: seo.title,
    description: seo.description,
    alternates: seo.alternates,
    openGraph: seo.openGraph,
    twitter: seo.twitter,
    robots: seo.robots,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch current post, recent posts, SEO and Menu in parallel
  const [postData, recentData, seoData, menuItems] = await Promise.all([
    fetchFromWordPress(`
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
    `, { id: slug }),
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

  const post = postData?.post;
  const relatedPosts = (recentData?.posts?.nodes || [])
    .filter((p: any) => p.slug !== slug)
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
      <BlogPostPage post={post} relatedPosts={relatedPosts} />
      <Footer />
    </main>
  );
}