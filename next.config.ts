import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'standalone', // Pour Docker
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'totayafrica.onrender.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '194.163.175.53', // IP du serveur
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