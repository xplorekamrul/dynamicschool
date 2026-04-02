import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,

  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'schoolstorage.arrowheadit.net',
        pathname: '/**'
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: `https://schoolstorage.arrowheadit.net/:path*`,
      },
    ]
  },
};

export default nextConfig;