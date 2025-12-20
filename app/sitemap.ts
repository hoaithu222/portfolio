import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hoaithu222.github.io'
  const locales = ['vi', 'en']
  const routes = ['', 'home', 'skills', 'experience', 'contact']
  
  const sitemapEntries: MetadataRoute.Sitemap = []
  
  // Generate sitemap entries for each locale and route
  locales.forEach((locale) => {
    routes.forEach((route) => {
      const url = route === '' 
        ? `${baseUrl}/${locale}`
        : `${baseUrl}/${locale}/${route}`
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'monthly' : 'weekly',
        priority: route === '' || route === 'home' ? 1 : 0.8,
        alternates: {
          languages: {
            vi: route === '' ? `${baseUrl}/vi` : `${baseUrl}/vi/${route}`,
            en: route === '' ? `${baseUrl}/en` : `${baseUrl}/en/${route}`,
          },
        },
      })
    })
  })
  
  return sitemapEntries
}

