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
    ];
  },
};

export default nextConfig;
