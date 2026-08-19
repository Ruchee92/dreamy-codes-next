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
    ];
  },
};

module.exports = nextConfig;