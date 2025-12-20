import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'models.readyplayer.me',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
