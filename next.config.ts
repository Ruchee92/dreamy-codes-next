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
    ];
  },
};

module.exports = nextConfig;