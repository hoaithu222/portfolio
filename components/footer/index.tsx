'use client'

import React, { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const Footer = () => {
  const t = useTranslations('footer')
  const footerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!footerRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.from(footerRef.current, {
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top bottom',
        toggleActions: 'play none none none',
      },
      y: 50,
      opacity: 0,
      duration: 0.6,
      ease: 'bounce.out',
    })
  }, { scope: footerRef })

  return (
    <footer ref={footerRef} className="w-full py-4 border-t border-border-default bg-bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-text-muted">
          {t('copyright') || '© 2025 Portfolio. All rights reserved.'}
        </p>
      </div>
    </footer>
  )
}

export default React.memo(Footer)
