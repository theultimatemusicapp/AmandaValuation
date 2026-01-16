import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  async redirects() {
    return [
      {
        source: '/blog.html',
        destination: '/resources',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/resources',
        permanent: true,
      },
      {
        source: '/calculator',
        destination: '/',
        permanent: true,
      },
      {
        source: '/free-valuation',
        destination: '/',
        permanent: true,
      },
      {
        source: '/valuation-calculator',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
