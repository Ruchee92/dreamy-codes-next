/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wp.dreamycodes.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;