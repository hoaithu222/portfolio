'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function HorizontalTextScroll() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const text = containerRef.current.querySelector('.scroll-text')
    if (!text) return

    gsap.to(text, {
      xPercent: -50,
      duration: 20,
      repeat: -1,
      ease: 'none',
      modifiers: {
        xPercent: gsap.utils.wrap(-50, 0)
      }
    })
  }, { scope: containerRef })

  const skills = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS',
    'GSAP', 'Three.js', 'Node.js', 'Git', 'Responsive Design'
  ]

  return (
    <div 
      ref={containerRef}
      className="w-full py-8 overflow-hidden bg-gradient-to-r from-brand-pink-1/10 via-brand-blue-1/10 to-brand-pink-1/10 border-y border-border-default"
    >
      <div className="scroll-text flex gap-8 whitespace-nowrap">
        {[...skills, ...skills].map((skill, index) => (
          <span
            key={index}
            className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-brand-pink-1 to-brand-blue-1 bg-clip-text text-transparent"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
