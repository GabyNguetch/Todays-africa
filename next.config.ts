import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'totayafrica.onrender.com', // Ton domaine backend
      },
      {
        protocol: 'http',
        hostname: 'localhost', // Pour les tests si backend local
      },
    ],
  },
  // Proxy pour contourner le CORS
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://totayafrica.onrender.com/api/v1/:path*',
      },
    ]
  },
};

export default nextConfig;