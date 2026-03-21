export const revalidate = 60;
import type { Metadata } from 'next';
import BlogPage from '@/views/Blog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchFromWordPress, getWordPressSEO, getWordPressMenu } from '@/lib/wordpress';
import { JsonLd } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getWordPressSEO("/blog");
  if (!seo) return { title: 'Journal | Dreamy Codes', description: 'Engineering, design, and conversion strategies for the modern D2C founder.' };

  return {
    title: seo.title,
    description: seo.description,
    alternates: seo.alternates,
    openGraph: seo.openGraph,
    twitter: seo.twitter,
  };
}

export default async function Blog() {
  const query = `
    query AllPosts {
      posts(first: 20) {
        nodes {
          title
          slug
          excerpt
          date
          featuredImage {
            node {
              sourceUrl
            }
          }
          categories {
            nodes {
              name
            }
          }
          author {
            node {
              name
            }
          }
        }
      }
    }
  `;

  const [data, menuItems, seoData] = await Promise.all([
    fetchFromWordPress(query),
    getWordPressMenu("primary"),
    getWordPressSEO("/blog")
  ]);

  const posts = data?.posts?.nodes || [];

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      <JsonLd schema={seoData?.schema} />
      <Navbar menuItems={menuItems} />
      <BlogPage posts={posts} />
      <Footer />
    </main>
  );
}