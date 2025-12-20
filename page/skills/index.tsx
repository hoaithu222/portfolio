'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SkillsList from './components/SkillsList'

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Enhanced Floating Elements Component
function FloatingElements({ floatingElementsRef }: { floatingElementsRef: React.RefObject<HTMLDivElement | null> }) {
  const elements = useMemo(() => {
    let seed = 12345
    const getRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: getRandom() * 100,
      top: getRandom() * 100,
      width: getRandom() * 3 + 1.5,
      height: getRandom() * 3 + 1.5,
      opacity: getRandom() * 0.6 + 0.4,
      blur: getRandom() * 15 + 8,
      color: i % 3 === 0 ? '#FF5FA2' : i % 3 === 1 ? '#3B82F6' : '#FFB3D5',
      delay: getRandom() * 2,
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
            filter: `blur(${el.width * 0.5}px)`,
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
      backgroundPosition: '50px 50px',
      duration: 20,
      repeat: -1,
      ease: 'none',
    })
  }, {})

  return (
    <div 
      ref={gridRef}
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 95, 162, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px',
      }}
    />
  )
}

export default function SkillsPage() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const floatingElementsRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('skills')

  useGSAP(() => {
    if (!sectionRef.current) return

    // Enhanced title animation with gradient shift
    if (titleRef.current) {
      // Ensure title is visible first
      gsap.set(titleRef.current, {
        opacity: 1,
        visibility: 'visible',
      })

      // Continuous gradient animation
      gsap.to(titleRef.current, {
        backgroundPosition: '200% 0',
        duration: 5,
        repeat: -1,
        ease: 'none',
      })

      // Optional: Split text animation (commented out to ensure content shows)
      // if (titleRef.current.textContent && !titleRef.current.querySelector('span')) {
      //   const titleText = titleRef.current.textContent
      //   titleRef.current.innerHTML = ''
      //   
      //   titleText.split('').forEach((char, index) => {
      //     const span = document.createElement('span')
      //     span.textContent = char === ' ' ? '\u00A0' : char
      //     span.style.display = 'inline-block'
      //     span.style.opacity = '1'
      //     titleRef.current?.appendChild(span)
      //     
      //     gsap.from(span, {
      //       opacity: 0,
      //       y: 60,
      //       rotateX: 90,
      //       scale: 0.5,
      //       filter: 'blur(10px)',
      //       duration: 0.8,
      //       delay: index * 0.02,
      //       ease: 'back.out(2)',
      //     })
      //   })
      // }
    }

    // Enhanced subtitle animation
    if (subtitleRef.current) {
      gsap.set(subtitleRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
      })
      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.9,
        filter: 'blur(10px)',
        duration: 1.2,
        delay: 0.6,
        ease: 'power3.out',
      })
    }

    // Enhanced floating elements animation
    if (floatingElementsRef.current) {
      const elements = floatingElementsRef.current.querySelectorAll('.floating-element')
      elements.forEach((el) => {
        const delay = parseFloat(el.getAttribute('data-delay') || '0')
        
        gsap.to(el, {
          y: 'random(-40, 40)',
          x: 'random(-30, 30)',
          rotation: 'random(-20, 20)',
          scale: 'random(0.8, 1.2)',
          opacity: 'random(0.3, 0.8)',
          duration: 'random(4, 7)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: delay,
        })
      })
    }

    // Enhanced gradient orbs animation
    const gradientOrbs = sectionRef.current.querySelectorAll('.gradient-orb')
    gradientOrbs.forEach((orb, index) => {
      gsap.to(orb, {
        scale: 'random(1.2, 1.8)',
        x: 'random(-150, 150)',
        y: 'random(-150, 150)',
        opacity: 'random(0.15, 0.3)',
        duration: 'random(10, 15)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 2.5,
      })
    })

    // Parallax effect on scroll
    gsap.to(floatingElementsRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
      y: 100,
      ease: 'none',
    })
  }, { scope: sectionRef })

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen py-24 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top, rgba(255, 95, 162, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
      }}
    >
      {/* Enhanced animated gradient orbs */}
      <div className="gradient-orb absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-pink-1/25 rounded-full blur-[120px]" />
      <div className="gradient-orb absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-blue-1/25 rounded-full blur-[120px]" />
      <div className="gradient-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-pink-1/15 rounded-full blur-[150px]" />
      <div className="gradient-orb absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-brand-blue-1/20 rounded-full blur-[100px]" />

      {/* Floating decorative elements */}
      <FloatingElements floatingElementsRef={floatingElementsRef} />

      {/* Animated grid background */}
      <AnimatedGrid />

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/20 to-bg-primary/40 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Title Section */}
        <div className="text-center mb-24">
          <div className="inline-block mb-6">
            <h1 
              ref={titleRef}
              className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-brand-pink-1 via-brand-blue-1 via-brand-pink-1 to-brand-blue-1 bg-clip-text text-transparent bg-[length:200%_auto] opacity-100"
              style={{
                textShadow: '0 0 40px rgba(255, 95, 162, 0.3), 0 0 80px rgba(59, 130, 246, 0.2)',
                WebkitTextStroke: '1px transparent',
                visibility: 'visible',
              }}
            >
              {t('title')}
            </h1>
          </div>
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl lg:text-3xl text-text-secondary max-w-4xl mx-auto leading-relaxed font-light opacity-100"
            style={{
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)',
              visibility: 'visible',
            }}
          >
            {t('subtitle')}
          </p>
        </div>

        {/* Skills List */}
        <div className="max-w-7xl mx-auto opacity-100" style={{ visibility: 'visible' }}>
          <SkillsList />
        </div>
      </div>

      {/* Enhanced gradient fades */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-bg-primary via-bg-primary/50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent pointer-events-none" />
    </section>
  )
}
