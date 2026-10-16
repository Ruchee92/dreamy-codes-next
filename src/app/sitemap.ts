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
    { route: '/contact-us', wpSlug: 'contact-us' },
    { route: '/blog', wpSlug: 'blog' },
    { route: '/privacy-policy', wpSlug: 'privacy-policy' },
    { route: '/refund-policy', wpSlug: 'refund-policy' },
    { route: '/terms-of-service', wpSlug: 'terms-of-service' },
];

type WpNode = { slug?: string; modified?: string; seo?: { metaRobotsNoindex?: string } };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://dreamycodes.com';

    // Fetch all blog posts and pages for sitemap
    let posts: WpNode[] = [];
    let wpPages: WpNode[] = [];
    try {
        const data = await fetchFromWordPress(`
      query GetSitemapData {
        posts(first: 100, where: { status: PUBLISH }) {
          nodes {
            slug
            modified
            seo { metaRobotsNoindex }
          }
        }
        pages(first: 100, where: { status: PUBLISH }) {
          nodes {
            slug
            modified
            seo { metaRobotsNoindex }
          }
        }
      }
    `);
        // Noindexed items (Yoast) stay out of the sitemap.
        const indexable = (n: WpNode) => n?.seo?.metaRobotsNoindex !== 'noindex';
        posts = (data?.posts?.nodes || []).filter(indexable);
        wpPages = (data?.pages?.nodes || []).filter(indexable);
    } catch (error) {
        console.error('Sitemap fetch error:', error);
    }

    // Real edit dates, not build time. Reporting `new Date()` told search
    // engines every page changed on every deploy, which devalues lastmod
    // entirely once they notice it never correlates with real changes.
    const modifiedBySlug = new Map<string, string>(
        wpPages.filter((page: WpNode) => page?.slug && page?.modified)
            .map((page: WpNode) => [page.slug as string, page.modified as string])
    );

    const staticPages = STATIC_ROUTES.map(({ route, wpSlug }) => {
        const modified = modifiedBySlug.get(wpSlug);
        return {
            url: `${baseUrl}${route}`,
            // Unknown (WordPress unreachable): omitted rather than "now".
            ...(modified ? { lastModified: new Date(modified) } : {}),
            changeFrequency: 'weekly' as const,
            priority: route === '' ? 1 : 0.8,
        };
    });

    const blogPosts = posts.map((post: WpNode) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.modified as string),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    const knownSlugs = new Set(STATIC_ROUTES.map(({ wpSlug }) => wpSlug));
    const dynamicPages = wpPages
        .filter((page: WpNode) => page?.slug && !knownSlugs.has(page.slug) && page.slug !== 'blog')
        .map((page: WpNode) => ({
            url: `${baseUrl}/${page.slug}`,
            lastModified: new Date(page.modified as string),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

    return [...staticPages, ...blogPosts, ...dynamicPages];
}
