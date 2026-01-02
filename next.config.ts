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
  output: "standalone",
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },
};


export default nextConfig;
