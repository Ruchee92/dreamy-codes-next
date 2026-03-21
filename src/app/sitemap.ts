import { MetadataRoute } from 'next';
import { fetchFromWordPress } from '@/lib/wordpress';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://dreamycodes.com';

    // Base pages
    const staticPages = [
        '',
        '/about',
        '/services',
        '/our-work',
        '/case-studies',
        '/blog',
        '/privacy-policy',
        '/refund-policy',
        '/terms-of-service',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Fetch all blog posts and pages for sitemap
    let posts: any[] = [];
    let wpPages: any[] = [];
    try {
        const data = await fetchFromWordPress(`
      query GetSitemapData {
        posts(first: 100) {
          nodes {
            slug
            date
          }
        }
        pages(first: 100) {
          nodes {
            slug
            date
          }
        }
      }
    `);
        posts = data?.posts?.nodes || [];
        wpPages = data?.pages?.nodes || [];
    } catch (error) {
        console.error('Sitemap fetch error:', error);
    }

    const blogPosts = posts.map((post: any) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    const dynamicPages = wpPages
        .filter((page: any) => !['home', 'about', 'services', 'our-work', 'case-studies', 'blog', 'privacy-policy', 'refund-policy', 'terms-of-service'].includes(page.slug))
        .map((page: any) => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: new Date(page.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...staticPages, ...blogPosts, ...dynamicPages];
}
