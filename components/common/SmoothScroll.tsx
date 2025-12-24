'use client'

import { useEffect } from 'react'

export default function SmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (prefersReducedMotion) return

    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth'

    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  return null
}
