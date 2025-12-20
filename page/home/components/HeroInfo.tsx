'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { getCVPath, getCVFileName } from '@/lib/utils/cv'
import { saveAs } from 'file-saver'

export default function HeroInfo() {
  const ref = useRef<HTMLDivElement>(null)
  const t = useTranslations('hero')
  const locale = useLocale()

  // Handle CV download
  const handleDownloadCV = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    try {
      const cvPath = getCVPath(locale)
      const fileName = getCVFileName(locale)
      
      // Fetch the PDF file
      const response = await fetch(cvPath)
      if (!response.ok) {
        throw new Error('Failed to fetch CV')
      }
      
      // Convert to blob
      const blob = await response.blob()
      
      // Download using file-saver
      saveAs(blob, fileName)
    } catch (error) {
      console.error('Error downloading CV:', error)
      // Fallback to direct link if download fails
      window.open(getCVPath(locale), '_blank')
    }
  }

  useGSAP(() => {
    // Hiệu ứng cho tiêu đề chính (greeting)
    gsap.from('.hero-greeting', {
      opacity: 0,
      y: 50,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.2
    })

    // Hiệu ứng cho emoji 👋 - scale và rotate
    gsap.from('.hero-emoji', {
      opacity: 0,
      scale: 0,
      rotation: -180,
      duration: 0.8,
      ease: 'back.out(1.7)',
      delay: 0.8
    })

    // Hiệu ứng cho headline - slide từ phải
    gsap.from('.hero-headline', {
      opacity: 0,
      x: 100,
      duration: 1,
      ease: 'power3.out',
      delay: 0.4
    })

    // Hiệu ứng cho sub headline - slide từ trái
    gsap.from('.hero-subheadline', {
      opacity: 0,
      x: -100,
      duration: 1,
      ease: 'power3.out',
      delay: 0.6
    })


  }, { scope: ref })

  return (
    <div ref={ref} className="space-y-6 md:space-y-8 w-full">
      <div className="space-y-4">
        <h1 className="hero-greeting text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          {t('greeting')} 
          <span className="hero-emoji text-brand-pink-1 animate-pulse inline-block">👋</span>
        </h1>
        <h2 className="hero-headline text-2xl md:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-brand-pink-1 via-brand-blue-1 to-brand-pink-1 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient leading-tight">
          {t('headline')}
        </h2>
        <p className="hero-subheadline text-base md:text-lg text-text-secondary max-w-2xl leading-relaxed">
          {t('sub_headline')}
        </p>
      </div>

      <div className="hero-buttons flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link
          href={`/${locale}/contact`}
          className="hero-button px-6 py-3 bg-gradient-to-r from-brand-pink-1 to-brand-blue-1 text-white rounded-lg font-medium hover:shadow-pink-glow transition-all duration-300 hover:scale-105 text-center"
          suppressHydrationWarning
        >
          {t('cta_primary')}
        </Link>
        <a
          href={getCVPath(locale)}
          onClick={handleDownloadCV}
          className="hero-button px-6 py-3 border-2 border-border-default text-text-primary rounded-lg font-medium hover:border-brand-pink-1 hover:text-brand-pink-1 transition-all duration-300 text-center"
          suppressHydrationWarning
        >
          {t('cta_secondary')}
        </a>
      </div>
    </div>
  )
}
