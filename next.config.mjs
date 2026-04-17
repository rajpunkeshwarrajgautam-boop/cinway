/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
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
  // Required for Prisma edge compatibility on Vercel
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt']
  }
};

export default nextConfig;
