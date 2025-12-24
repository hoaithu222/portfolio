'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ExperienceList from './components/ExperienceList'

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Floating Elements Component
function FloatingElements({ floatingElementsRef }: { floatingElementsRef: React.RefObject<HTMLDivElement | null> }) {
  const elements = useMemo(() => {
    let seed = 54321
    const getRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    // Fewer elements for lighter render on low-end devices
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      left: getRandom() * 100,
      top: getRandom() * 100,
      width: getRandom() * 2 + 1,
      height: getRandom() * 2 + 1,
      opacity: getRandom() * 0.4 + 0.25,
      blur: getRandom() * 10 + 4,
      color: i % 3 === 0 ? '#FF5FA2' : i % 3 === 1 ? '#3B82F6' : '#FFB3D5',
    }))
  }, [])

  return (
    <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {elements.map((el) => (
        <div
          key={el.id}
          className="floating-element absolute"
          style={{
            left: `${el.left}%`,
            top: `${el.top}%`,
            width: `${el.width}px`,
            height: `${el.height}px`,
            background: el.color,
            borderRadius: '50%',
            opacity: el.opacity,
            boxShadow: `0 0 ${el.blur}px ${el.color}, 0 0 ${el.blur * 2}px ${el.color}40`,
            filter: `blur(${el.width * 0.35}px)`,
          }}
        />
      ))}
    </div>
  )
}

// Animated Grid Background
function AnimatedGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!gridRef.current) return

    gsap.to(gridRef.current, {
      backgroundPosition: '60px 60px',
      duration: 25,
      repeat: -1,
      ease: 'none',
    })
  }, {})

  return (
    <div 
      ref={gridRef}
      className="absolute inset-0 opacity-[0.02]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 95, 162, 0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: '120px 120px',
      }}
    />
  )
}

export default function ExperiencePage() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const floatingElementsRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('experience')

  useGSAP(() => {
    if (!sectionRef.current) return

    // Title animation
    if (titleRef.current) {
      gsap.set(titleRef.current, {
        opacity: 1,
        visibility: 'visible',
      })

      gsap.from(titleRef.current, {
        opacity: 0,
        y: -50,
        scale: 0.9,
        filter: 'blur(10px)',
        duration: 1,
        ease: 'power3.out',
      })

      // Continuous gradient animation
      gsap.to(titleRef.current, {
        backgroundPosition: '200% 0',
        duration: 5,
        repeat: -1,
        ease: 'none',
      })
    }

    // Subtitle animation
    if (subtitleRef.current) {
      gsap.set(subtitleRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
      })
      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.95,
        filter: 'blur(8px)',
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      })
    }
  }, { scope: sectionRef })

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top, rgba(255, 95, 162, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.08) 0%, transparent 50%)',
      }}
    >
      {/* Animated gradient orbs */}
      <div className="gradient-orb absolute top-0 left-1/4 w-[450px] h-[450px] bg-brand-pink-1/20 rounded-full blur-[110px]" />
      <div className="gradient-orb absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-brand-blue-1/20 rounded-full blur-[110px]" />
      <div className="gradient-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-pink-1/12 rounded-full blur-[140px]" />

      {/* Floating decorative elements */}
      <FloatingElements floatingElementsRef={floatingElementsRef} />

      {/* Animated grid background */}
      <AnimatedGrid />

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/15 to-bg-primary/35 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h1 
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-brand-pink-1 via-brand-blue-1 via-brand-pink-1 to-brand-blue-1 bg-clip-text text-transparent bg-[length:200%_auto] opacity-100"
            style={{
              textShadow: '0 0 40px rgba(255, 95, 162, 0.3), 0 0 80px rgba(59, 130, 246, 0.2)',
              visibility: 'visible',
            }}
          >
            {t('title')}
          </h1>
          <p 
            ref={subtitleRef}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-text-secondary max-w-4xl mx-auto leading-relaxed font-light opacity-100"
            style={{
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)',
              visibility: 'visible',
            }}
          >
            {t('subtitle')}
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="max-w-5xl mx-auto opacity-100" style={{ visibility: 'visible' }}>
          <ExperienceList />
        </div>
      </div>

      {/* Gradient fades */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-bg-primary via-bg-primary/50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent pointer-events-none" />
    </section>
  )
}


