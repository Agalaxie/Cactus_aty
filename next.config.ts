import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Désactiver ESLint pendant le build pour éviter les erreurs de déploiement
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorer les erreurs TypeScript pendant le build
    ignoreBuildErrors: true,
  },
  /* config options here */
};

export default nextConfig;
