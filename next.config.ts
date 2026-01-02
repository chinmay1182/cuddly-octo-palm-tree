/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'upload.wikimedia.org',
      'www.jiomart.com',
      'www.amazon.in',
      'adminpanel.shreebandhu.com',  // ✅ Fixed domain
      'www.flipkart.com',
      'www.indiamart.com',
      'localhost',
    ],
    unoptimized: true,  // This disables Next.js image optimization
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript type errors.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
