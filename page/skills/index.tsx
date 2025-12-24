'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useMemo, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SkillsList from './components/SkillsList'

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// OPTIMIZED: Giảm số lượng floating elements và sử dụng will-change
function FloatingElements({ floatingElementsRef }: { floatingElementsRef: React.RefObject<HTMLDivElement | null> }) {
  const elements = useMemo(() => {
    let seed = 12345
    const getRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    // Giảm từ 50 xuống 20 elements để tăng hiệu suất
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: getRandom() * 100,
      top: getRandom() * 100,
      width: getRandom() * 3 + 1.5,
      height: getRandom() * 3 + 1.5,
      opacity: getRandom() * 0.4 + 0.3,
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
          className="floating-element absolute will-change-transform"
          style={{
            left: `${el.left}%`,
            top: `${el.top}%`,
            width: `${el.width}px`,
            height: `${el.height}px`,
            background: el.color,
            borderRadius: '50%',
            opacity: el.opacity,
            boxShadow: `0 0 ${el.blur}px ${el.color}`,
            filter: `blur(${el.width * 0.4}px)`,
          }}
        />
      ))}
    </div>
  )
}

// OPTIMIZED: Sử dụng transform thay vì backgroundPosition
function AnimatedGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!gridRef.current) return

    gsap.to(gridRef.current, {
      x: 50,
      y: 50,
      duration: 20,
      repeat: -1,
      ease: 'none',
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % 100),
        y: gsap.utils.unitize(y => parseFloat(y) % 100),
      }
    })
  }, {})

  return (
    <div 
      ref={gridRef}
      className="absolute inset-0 opacity-[0.03] will-change-transform"
      style={{
        backgroundImage: `
          linear-gradient(rgba(233, 30, 99, 0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(25, 118, 210, 0.2) 1px, transparent 1px)
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

  // OPTIMIZED: Cleanup ScrollTrigger instances
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  useGSAP(() => {
    if (!sectionRef.current) return

    // OPTIMIZED: Đơn giản hóa animation cho title
    if (titleRef.current) {
      gsap.set(titleRef.current, {
        opacity: 1,
        visibility: 'visible',
      })

      gsap.to(titleRef.current, {
        backgroundPosition: '200% 0',
        duration: 8, // Chậm hơn để giảm tải
        repeat: -1,
        ease: 'none',
      })
    }

    // OPTIMIZED: Giảm độ phức tạp của subtitle animation
    if (subtitleRef.current) {
      gsap.set(subtitleRef.current, {
        opacity: 1,
        y: 0,
      })
      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: 'power2.out',
      })
    }

    // OPTIMIZED: Giảm số lượng animations cho floating elements
    if (floatingElementsRef.current) {
      const elements = floatingElementsRef.current.querySelectorAll('.floating-element')
      
      // Chỉ animate một số elements ngẫu nhiên thay vì tất cả
      const elementsToAnimate = Array.from(elements).filter((_, i) => i % 2 === 0)
      
      elementsToAnimate.forEach((el) => {
        gsap.to(el, {
          y: 'random(-30, 30)',
          x: 'random(-20, 20)',
          duration: 'random(5, 8)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })
    }

    // OPTIMIZED: Giảm số lượng gradient orbs
    const gradientOrbs = sectionRef.current.querySelectorAll('.gradient-orb')
    gradientOrbs.forEach((orb, index) => {
      if (index % 2 === 0) { // Chỉ animate một nửa
        gsap.to(orb, {
          scale: 1.3,
          duration: 12,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 3,
        })
      }
    })

    // OPTIMIZED: Parallax với scrub cao hơn để mượt hơn
    if (floatingElementsRef.current) {
      gsap.to(floatingElementsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2, // Tăng từ 1 lên 2 để mượt hơn
        },
        y: 80,
        ease: 'none',
      })
    }
  }, { scope: sectionRef })

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen py-12 sm:py-16 md:py-24 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top, rgba(233, 30, 99, 0.12) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(25, 118, 210, 0.12) 0%, transparent 50%)',
      }}
    >
      {/* OPTIMIZED: Giảm số lượng gradient orbs từ 4 xuống 2 */}
      <div className="gradient-orb absolute top-0 left-1/4 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-brand-pink-1/30 dark:bg-brand-pink-1/20 rounded-full blur-[100px]" />
      <div className="gradient-orb absolute bottom-0 right-1/4 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-brand-blue-1/30 dark:bg-brand-blue-1/20 rounded-full blur-[100px]" />

      {/* Floating decorative elements */}
      <FloatingElements floatingElementsRef={floatingElementsRef} />

      {/* Animated grid background */}
      <AnimatedGrid />

      {/* Simplified overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/10 to-bg-primary/30 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* OPTIMIZED: Responsive title */}
        <div className="text-center mb-12 sm:mb-16 md:mb-24">
          <div className="inline-block mb-4 sm:mb-6">
            <h1 
              ref={titleRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-brand-pink-1 via-brand-blue-1 via-brand-pink-1 to-brand-blue-1 bg-clip-text text-transparent bg-[length:200%_auto] opacity-100 will-change-transform"
              style={{
                textShadow: '0 0 30px rgba(233, 30, 99, 0.35), 0 0 60px rgba(25, 118, 210, 0.25)',
                WebkitTextStroke: '0.5px transparent',
                visibility: 'visible',
              }}
            >
              {t('title')}
            </h1>
          </div>
          <p 
            ref={subtitleRef}
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-text-secondary max-w-4xl mx-auto leading-relaxed font-light opacity-100 px-4"
            style={{
              textShadow: '0 2px 15px rgba(0, 0, 0, 0.4)',
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

      {/* Simplified gradient fades */}
      <div className="absolute top-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-b from-bg-primary to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />
    </section>
  )
}