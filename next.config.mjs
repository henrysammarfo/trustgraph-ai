/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {},
  // External packages that should be bundled with the server
  serverExternalPackages: ['@prisma/client', 'bcryptjs']
}

export default nextConfig
