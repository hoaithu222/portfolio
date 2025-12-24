import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { AppStoreProvider } from '@/store/AppContext'
import { Geist, Geist_Mono } from "next/font/google";
import '../globals.css'
import { Metadata } from 'next';
import Header from '@/components/header'
import Footer from '@/components/footer'
import ScrollToTop from '@/components/common/ScrollToTop'
import PointerTrail from '@/components/common/PointerTrail'
import SmoothScroll from '@/components/common/SmoothScroll'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Generate metadata based on locale
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hoaithu222.github.io'
  const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@hoaithu222'
  
  const siteName = 'Vũ Thị Hoài Thu - Front-end Developer'
  const title = locale === 'vi' 
    ? 'Vũ Thị Hoài Thu - Lập trình viên Front-end | Portfolio'
    : 'Vu Thi Hoai Thu - Front-end Developer | Portfolio'
  const description = locale === 'vi'
    ? 'Portfolio của Vũ Thị Hoài Thu - Lập trình viên Front-end chuyên nghiệp. Chuyên phát triển ứng dụng web hiệu năng cao, dashboard tương tác với React, Next.js, TypeScript.'
    : 'Portfolio of Vu Thi Hoai Thu - Professional Front-end Developer. Specializing in high-performance web applications and interactive dashboards with React, Next.js, TypeScript.'
  const url = `${baseUrl}/${locale}`
  const imageUrl = process.env.NEXT_PUBLIC_OG_IMAGE_URL || `${baseUrl}/og-image.jpg`
  
  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: locale === 'vi'
      ? ['Front-end Developer', 'React', 'Next.js', 'TypeScript', 'Web Development', 'Portfolio', 'Lập trình viên', 'ReactJS', 'NextJS']
      : ['Front-end Developer', 'React', 'Next.js', 'TypeScript', 'Web Development', 'Portfolio', 'JavaScript', 'ReactJS', 'NextJS'],
    authors: [{ name: 'Vu Thi Hoai Thu' }],
    creator: 'Vu Thi Hoai Thu',
    publisher: 'Vu Thi Hoai Thu',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
      languages: {
        'vi': `${baseUrl}/vi`,
        'en': `${baseUrl}/en`,
        'x-default': `${baseUrl}/vi`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      url,
      siteName,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Add your verification codes here
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
      // bing: 'your-bing-verification-code',
    },
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // Validate locale
  if (!['en', 'vi'].includes(locale)) {
    notFound()
  }

  // Load messages directly for the current locale
  const messages = (await import(`../../messages/${locale}.json`)).default

  // Get base URL from environment variable
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hoaithu222.github.io'

  // Generate structured data (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: locale === 'vi' ? 'Vũ Thị Hoài Thu' : 'Vu Thi Hoai Thu',
    jobTitle: locale === 'vi' ? 'Lập trình viên Front-end' : 'Front-end Developer',
    email: 'thu601925@gmail.com',
    telephone: '+84382329310',
    address: {
      '@type': 'PostalAddress',
      addressLocality: locale === 'vi' ? 'Hà Nội' : 'Hanoi',
      addressRegion: locale === 'vi' ? 'Thanh Trì' : 'Thanh Tri',
      addressCountry: 'VN',
    },
    url: baseUrl,
    sameAs: [
      'https://github.com/hoaithu222',
      'https://www.linkedin.com/in/hoài-thu/',
      'https://www.facebook.com/vu.thi.hoai.thu.2',
    ],
    knowsAbout: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Front-end Development',
      'Web Development',
    ],
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Favicons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased pt-16 md:pt-20`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AppStoreProvider locale={locale}>
            <NextIntlClientProvider locale={locale} messages={messages}>
              {/* Header */}
              <Header />
              <ScrollToTop />
              <SmoothScroll />
              <PointerTrail />
              <main className="min-h-screen">
                {children}
              </main>
              {/* Footer */}
              <Footer />
            </NextIntlClientProvider>
          </AppStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
