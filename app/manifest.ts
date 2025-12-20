import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vũ Thị Hoài Thu - Front-end Developer Portfolio',
    short_name: 'Hoai Thu Portfolio',
    description: 'Professional Front-end Developer Portfolio - React, Next.js, TypeScript',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#FF5FA2',
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

