import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  experimental: {
    turbopackUseSystemTlsCerts: true,
=======
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
      // Redirect specific old high-performing keywords if they mapped to blog.html directly
      // Use temporary redirect for now to test
    ];
>>>>>>> becdbd8 (fix: redirect blog.html to resources)
  },
};

export default nextConfig;
