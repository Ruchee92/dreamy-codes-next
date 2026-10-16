/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve modern formats where the browser advertises support. AVIF first,
    // WebP as the fallback, original format last.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wp.dreamycodes.com',
        pathname: '/**',
      },
    ],
  },
  trailingSlash: false,
  // Next's own trailing-slash redirect runs before the redirects below, so
  // /blog/author/x/ took two hops (QA iter 7). It is switched off and re-created
  // as the last redirect, after the specific ones, so every case is one hop.
  skipTrailingSlashRedirect: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Lighthouse flags the absence of a frame-control policy as high
          // severity. Nothing here is meant to be embedded elsewhere.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.php',
        destination: '/',
        permanent: true,
      },
      // WordPress used to serve the sitemap, and its host still 301s these to
      // this domain, where they 404. Anything that still points at the old
      // paths -- Search Console, an old backlink -- lands on the real one.
      {
        source: '/sitemap_index.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/wp-sitemap.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
      // The WordPress front page is also reachable as /home; one URL only (SEO M4).
      {
        source: '/home{/}?',
        destination: '/',
        permanent: true,
      },
      // Yoast's Person schema names the WordPress author archive, which has no
      // front-end page; the people behind the site are on /about (SEO M6).
      {
        // {/}? : one hop for the trailing-slash form too (Yoast emits it).
        source: '/blog/author/:slug{/}?',
        destination: '/about',
        permanent: true,
      },
      // Search Console / GA4: Google still sends visitors to the post's old root URL (404 live).
      {
        source: '/shopify-traffic-but-no-sales{/}?',
        destination: '/blog/shopify-traffic-but-no-sales',
        permanent: true,
      },
      // trailingSlash: false, as one explicit hop (see skipTrailingSlashRedirect).
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;