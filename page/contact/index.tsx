'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ContactInfo from './components/ContactInfo'
import ContactForm from './components/ContactForm'

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Floating Elements Component
function FloatingElements({ floatingElementsRef }: { floatingElementsRef: React.RefObject<HTMLDivElement | null> }) {
  const elements = useMemo(() => {
    let seed = 78901
    const getRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    return Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: getRandom() * 100,
      top: getRandom() * 100,
      width: getRandom() * 2.5 + 1.2,
      height: getRandom() * 2.5 + 1.2,
      opacity: getRandom() * 0.5 + 0.3,
      blur: getRandom() * 10 + 5,
      color: i % 3 === 0 ? '#E91E63' : i % 3 === 1 ? '#1976D2' : '#F48FB1',
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
            filter: `blur(${el.width * 0.3}px)`,
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
      backgroundPosition: '70px 70px',
      duration: 30,
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
          linear-gradient(rgba(233, 30, 99, 0.15) 1px, transparent 1px),
          linear-gradient(90deg, rgba(25, 118, 210, 0.15) 1px, transparent 1px)
        `,
        backgroundSize: '140px 140px',
      }}
    />
  )
}

export default function ContactPage() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const floatingElementsRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('profile')

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

    // Floating elements animation
    if (floatingElementsRef.current) {
      const elements = floatingElementsRef.current.querySelectorAll('.floating-element')
      elements.forEach((el) => {
        const delay = parseFloat(el.getAttribute('data-delay') || '0')
        
        gsap.to(el, {
          y: 'random(-30, 30)',
          x: 'random(-20, 20)',
          rotation: 'random(-15, 15)',
          scale: 'random(0.9, 1.1)',
          opacity: 'random(0.3, 0.6)',
          duration: 'random(6, 9)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: delay,
        })
      })
    }

    // Gradient orbs animation
    const gradientOrbs = sectionRef.current.querySelectorAll('.gradient-orb')
    gradientOrbs.forEach((orb, index) => {
      gsap.to(orb, {
        scale: 'random(1.2, 1.7)',
        x: 'random(-100, 100)',
        y: 'random(-100, 100)',
        opacity: 'random(0.1, 0.2)',
        duration: 'random(10, 15)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 2.5,
      })
    })
  }, { scope: sectionRef })

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen py-24 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top, rgba(233, 30, 99, 0.12) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(25, 118, 210, 0.12) 0%, transparent 50%)',
      }}
    >
      {/* Animated gradient orbs */}
      <div className="gradient-orb absolute top-0 left-1/4 w-[400px] h-[400px] bg-brand-pink-1/25 dark:bg-brand-pink-1/18 rounded-full blur-[100px]" />
      <div className="gradient-orb absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-blue-1/25 dark:bg-brand-blue-1/18 rounded-full blur-[100px]" />
      <div className="gradient-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-pink-1/15 dark:bg-brand-pink-1/10 rounded-full blur-[130px]" />

      {/* Floating decorative elements */}
      <FloatingElements floatingElementsRef={floatingElementsRef} />

      {/* Animated grid background */}
      <AnimatedGrid />

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/15 to-bg-primary/35 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 
            ref={titleRef}
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-brand-pink-1 via-brand-blue-1 via-brand-pink-1 to-brand-blue-1 bg-clip-text text-transparent bg-[length:200%_auto] opacity-100"
            style={{
              textShadow: '0 0 40px rgba(233, 30, 99, 0.4), 0 0 80px rgba(25, 118, 210, 0.3)',
              visibility: 'visible',
            }}
          >
            Liên hệ
          </h1>
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl lg:text-3xl text-text-secondary max-w-4xl mx-auto leading-relaxed font-light opacity-100"
            style={{
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)',
              visibility: 'visible',
            }}
          >
            Hãy liên hệ với tôi nếu bạn có bất kỳ câu hỏi hoặc cơ hội hợp tác nào
          </p>
        </div>

        {/* Contact Content */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 opacity-100" style={{ visibility: 'visible' }}>
          {/* Contact Info */}
          <div className="order-1 lg:order-1">
            <ContactInfo />
          </div>

          {/* Contact Form */}
          <div className="order-2 lg:order-2">
            <ContactForm />
          </div>
        </div>
      </div>

      {/* Gradient fades */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-bg-primary via-bg-primary/50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent pointer-events-none" />
    </section>
  )
}

