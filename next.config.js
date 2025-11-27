/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: [
        'localhost:3000',
        'localhost:3001',
        '127.0.0.1:3000',
        '127.0.0.1:3001',
        '127.0.0.1:49475',
        '127.0.0.1:49476',
        '127.0.0.1:49477',
        '127.0.0.1:49478',
        '127.0.0.1:49479',
      ],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig
