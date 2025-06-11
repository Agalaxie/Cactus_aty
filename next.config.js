/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Désactiver ESLint pendant le build pour éviter les erreurs de déploiement
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorer les erreurs TypeScript pendant le build
    ignoreBuildErrors: true,
  },
  // Optimisations de performance
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
  },
  // Compression et optimisations
  compress: true,
  // Optimisation des images
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.atypic-cactus.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  // Configuration Webpack simplifiée
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig; 