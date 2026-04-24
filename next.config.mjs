/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Removed to support dynamic API routes for Prisma
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ]
  },
};

export default nextConfig;


