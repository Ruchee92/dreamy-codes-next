import { MetadataRoute } from 'next';
import { fetchFromWordPress } from '@/lib/wordpress';

// Front-end routes that render their own design rather than WordPress content.
// Each maps to the WordPress page whose modified date it should report.
const STATIC_ROUTES: { route: string; wpSlug: string }[] = [
    { route: '', wpSlug: 'home' },
    { route: '/about', wpSlug: 'about' },
    { route: '/services', wpSlug: 'services' },
    { route: '/our-work', wpSlug: 'our-work' },
    { route: '/case-studies', wpSlug: 'case-studies' },
    { route: '/blog', wpSlug: 'blog' },
    { route: '/privacy-policy', wpSlug: 'privacy-policy' },
    { route: '/refund-policy', wpSlug: 'refund-policy' },
    { route: '/terms-of-service', wpSlug: 'terms-of-service' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://dreamycodes.com';

    // Fetch all blog posts and pages for sitemap
    let posts: any[] = [];
    let wpPages: any[] = [];
    try {
        const data = await fetchFromWordPress(`
      query GetSitemapData {
        posts(first: 100, where: { status: PUBLISH }) {
          nodes {
            slug
            modified
          }
        }
        pages(first: 100, where: { status: PUBLISH }) {
          nodes {
            slug
            modified
          }
        }
      }
    `);
        posts = data?.posts?.nodes || [];
        wpPages = data?.pages?.nodes || [];
    } catch (error) {
        console.error('Sitemap fetch error:', error);
    }

    // Real edit dates, not build time. Reporting `new Date()` told search
    // engines every page changed on every deploy, which devalues lastmod
    // entirely once they notice it never correlates with real changes.
    const modifiedBySlug = new Map<string, string>(
        wpPages.filter((page: any) => page?.slug && page?.modified)
            .map((page: any) => [page.slug, page.modified])
    );

    const staticPages = STATIC_ROUTES.map(({ route, wpSlug }) => {
        const modified = modifiedBySlug.get(wpSlug);
        return {
            url: `${baseUrl}${route}`,
            lastModified: modified ? new Date(modified) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: route === '' ? 1 : 0.8,
        };
    });

    const blogPosts = posts.map((post: any) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.modified),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    const knownSlugs = new Set(STATIC_ROUTES.map(({ wpSlug }) => wpSlug));
    const dynamicPages = wpPages
        .filter((page: any) => page?.slug && !knownSlugs.has(page.slug))
        .map((page: any) => ({
            url: `${baseUrl}/${page.slug}`,
            lastModified: new Date(page.modified),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

    return [...staticPages, ...blogPosts, ...dynamicPages];
}
