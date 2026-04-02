import type { NextConfig } from "next";

// Validate environment variables at startup
if (process.env.NODE_ENV === 'production') {
  try {
    const { validateEnvironmentVariables } = require('./lib/env-validation');
    validateEnvironmentVariables();
  } catch (error) {
    console.error('⚠️  Environment validation warning:', error);
  }
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: false,
  },
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
  experimental: {
    preloadEntriesOnStart: true,
  },
};

export default nextConfig;