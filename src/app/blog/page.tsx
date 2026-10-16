export const revalidate = 60;
import type { Metadata } from 'next';
import BlogPage from '@/views/Blog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { buildMetadata, fetchFromWordPress, getWordPressSEO, getWordPressMenu } from '@/lib/wordpress';
import { JsonLd } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getWordPressSEO("/blog"), {
    path: "/blog",
    title: "Journal | Dreamy Codes",
    description: "Engineering, design, and conversion strategies for the modern D2C founder.",
  });
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
          seo {
            metaDesc
          }
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
    getWordPressMenu(),
    getWordPressSEO("/blog")
  ]);

  const posts = data?.posts?.nodes || [];

  return (
    <main id="main-content" className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      <JsonLd schema={seoData?.schema} />
      <Navbar menuItems={menuItems} />
      <BlogPage posts={posts} />
      <Footer />
    </main>
  );
}