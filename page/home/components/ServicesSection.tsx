'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useEffect, useMemo, useCallback, memo } from 'react'
import { useTranslations } from 'next-intl'
import { 
  FaLaptopCode, 
  FaChartLine, 
  FaBolt, 
  FaShoppingCart, 
  FaPaintBrush, 
  FaRocket 
} from 'react-icons/fa'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ServicesBackground from './ServicesBackground'
import { IconType } from 'react-icons'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const iconMap: Record<string, IconType> = {
  FaLaptopCode,
  FaChartLine,
  FaBolt,
  FaShoppingCart,
  FaPaintBrush,
  FaRocket,
}

interface FloatingIconProps {
  icon: IconType
  position: { top: string; left?: string; right?: string }
  delay: number
  color: string
}

const FloatingIcon = memo(function FloatingIcon({ icon: Icon, position, delay, color }: FloatingIconProps) {
  const iconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (iconRef.current) {
      const tl = gsap.timeline({ repeat: -1, yoyo: true })
      tl.to(iconRef.current, {
        y: -20,
        rotation: 360,
        duration: 3 + delay,
        ease: 'power1.inOut',
      })
      
      return () => {
        tl.kill()
      }
    }
  }, [delay])

  return (
    <div
      ref={iconRef}
      className="absolute opacity-20 dark:opacity-10 pointer-events-none"
      style={{
        ...position,
        animationDelay: `${delay}s`,
      }}
    >
      <Icon className={`text-6xl md:text-8xl ${color}`} />
    </div>
  )
})

function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('services')

  const services = useMemo(() => {
    try {
      const items = t.raw('items')
      console.log('🔍 Raw items from translation:', items)
      
      if (!items) {
        console.warn('⚠️ Services items is null or undefined')
        return []
      }
      
      if (!Array.isArray(items)) {
        console.warn('⚠️ Services items is not an array:', typeof items, items)
        return []
      }
      
      if (items.length === 0) {
        console.warn('⚠️ Services items array is empty')
        return []
      }
      
      console.log('✅ Loaded services successfully:', items.length, 'items')
      const validItems = items.filter(item => 
        item && 
        typeof item === 'object' && 
        item.icon && 
        item.title && 
        item.description
      )
      
      if (validItems.length !== items.length) {
        console.warn('⚠️ Some items are invalid. Valid:', validItems.length, 'Total:', items.length)
      }
      
      return validItems as Array<{
        icon: string
        title: string
        description: string
      }>
    } catch (error) {
      console.error('❌ Error loading services:', error)
      return []
    }
  }, [t])

  // Memoize hover handlers
  const handleMouseEnter = useCallback((cardElement: HTMLElement) => {
    gsap.to(cardElement, {
      scale: 1.05,
      y: -10,
      boxShadow: '0 20px 40px rgba(255, 95, 162, 0.3)',
      duration: 0.3,
      ease: 'power2.out',
    })
    
    const icon = cardElement.querySelector('.service-icon')
    if (icon) {
      gsap.to(icon, {
        scale: 1.2,
        rotation: 360,
        duration: 0.5,
        ease: 'back.out(1.7)',
      })
    }
  }, [])

  const handleMouseLeave = useCallback((cardElement: HTMLElement) => {
    gsap.to(cardElement, {
      scale: 1,
      y: 0,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      duration: 0.3,
      ease: 'power2.out',
    })
    
    const icon = cardElement.querySelector('.service-icon')
    if (icon) {
      gsap.to(icon, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [])

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current || !cardsRef.current) return

    // Title animation - set initial state first
    gsap.set(titleRef.current.children, { opacity: 1, y: 0 })
    
    const titleAnimation = gsap.fromTo(titleRef.current.children,
      {
        opacity: 0,
        y: 50,
      },
      {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      }
    )

    // Cards animation - only animate if cards exist
    const cards = cardsRef.current.children
    let cardsAnimation: gsap.core.Tween | null = null
    
    if (cards.length > 0) {
      // Set initial state to visible first
      gsap.set(cards, { opacity: 1, y: 0, scale: 1 })
      
      // Then animate from hidden state
      cardsAnimation = gsap.fromTo(cards, 
        {
          opacity: 0,
          y: 80,
          scale: 0.8,
        },
        {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 75%',
            end: 'top 50%',
            toggleActions: 'play none none none',
          },
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: {
            amount: 0.6,
            from: 'random',
          },
          ease: 'back.out(1.7)',
        }
      )
    }

    // Hover animations for cards
    const cleanupFunctions: Array<() => void> = []
    if (cards.length > 0) {
      Array.from(cards).forEach((card: Element) => {
        const cardElement = card as HTMLElement
        
        const enterHandler = () => handleMouseEnter(cardElement)
        const leaveHandler = () => handleMouseLeave(cardElement)
        
        cardElement.addEventListener('mouseenter', enterHandler)
        cardElement.addEventListener('mouseleave', leaveHandler)
        
        cleanupFunctions.push(() => {
          cardElement.removeEventListener('mouseenter', enterHandler)
          cardElement.removeEventListener('mouseleave', leaveHandler)
        })
      })
    }

    // Cleanup function
    return () => {
      titleAnimation.kill()
      if (cardsAnimation) {
        cardsAnimation.kill()
      }
      cleanupFunctions.forEach(cleanup => cleanup())
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, { scope: sectionRef, dependencies: [handleMouseEnter, handleMouseLeave] })

  // Fix: Khi chuyển tab rồi quay lại, ScrollTrigger có thể không resume đúng → nội dung kẹt opacity 0.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return
      ScrollTrigger.refresh()
      const section = sectionRef.current
      const title = titleRef.current
      const cards = cardsRef.current
      if (!section || !title || !cards) return
      const rect = section.getBoundingClientRect()
      const inView = rect.top < window.innerHeight && rect.bottom > 0
      if (!inView) return
      gsap.set(title.children, { opacity: 1, y: 0 })
      gsap.set(cards.children, { opacity: 1, y: 0, scale: 1 })
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-bg-secondary overflow-hidden"
    >
      {/* Background floating icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingIcon
          icon={FaLaptopCode}
          position={{ top: '10%', left: '5%' }}
          delay={0}
          color="text-brand-pink-1"
        />
        <FloatingIcon
          icon={FaChartLine}
          position={{ top: '20%', right: '8%' }}
          delay={0.5}
          color="text-brand-blue-1"
        />
        <FloatingIcon
          icon={FaBolt}
          position={{ top: '50%', left: '3%' }}
          delay={1}
          color="text-brand-pink-1"
        />
        <FloatingIcon
          icon={FaShoppingCart}
          position={{ top: '60%', right: '5%' }}
          delay={1.5}
          color="text-brand-blue-1"
        />
        <FloatingIcon
          icon={FaPaintBrush}
          position={{ top: '80%', left: '10%' }}
          delay={2}
          color="text-brand-pink-1"
        />
        <FloatingIcon
          icon={FaRocket}
          position={{ top: '85%', right: '12%' }}
          delay={2.5}
          color="text-brand-blue-1"
        />
      </div>

      {/* Three.js Background */}
      <ServicesBackground />

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-pink-1/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-blue-1/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-pink-1 via-brand-blue-1 to-brand-pink-1 bg-clip-text text-transparent">
            {t('title')}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div 
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {services && services.length > 0 ? (
            services.map((service, index) => {
              if (!service || !service.icon || !service.title || !service.description) {
                console.warn('Service item missing data at index:', index, service)
                return null
              }
              
              const IconComponent = iconMap[service.icon] || FaLaptopCode
              
              return (
                <ServiceCard
                  key={`service-${service.icon}-${index}`}
                  service={service}
                  IconComponent={IconComponent}
                />
              )
            }).filter(Boolean)
          ) : (
            <div className="col-span-full text-center text-text-secondary py-8">
              <p>Đang tải thông tin...</p>
              <p className="text-sm mt-2">Services count: {services?.length || 0}</p>
              <p className="text-xs mt-1 text-text-secondary/60">
                Debug: {JSON.stringify(services?.slice(0, 1) || 'no data')}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Memoized Service Card component for better performance
const ServiceCard = memo(function ServiceCard({ 
  service, 
  IconComponent 
}: { 
  service: { icon: string; title: string; description: string }
  IconComponent: IconType
}) {
  return (
    <div className="group relative p-6 rounded-xl bg-bg-card border border-border-default hover:border-brand-pink-1/50 transition-all duration-300 cursor-pointer opacity-100">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-pink-1/0 via-brand-pink-1/0 to-brand-blue-1/0 group-hover:from-brand-pink-1/10 group-hover:via-brand-pink-1/5 group-hover:to-brand-blue-1/10 transition-all duration-500 opacity-0 group-hover:opacity-100" />
      
      {/* Icon */}
      <div className="service-icon mb-4 inline-block">
        <IconComponent className="text-4xl text-brand-pink-1 group-hover:text-brand-blue-1 transition-colors duration-300" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-3 text-brand-pink-1 group-hover:text-brand-blue-1 transition-colors duration-300">
        {service.title}
      </h3>
      <p className="text-text-secondary leading-relaxed relative z-10">
        {service.description}
      </p>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-brand-pink-1/20 rounded-tr-xl group-hover:border-brand-pink-1/50 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-brand-blue-1/20 rounded-bl-xl group-hover:border-brand-blue-1/50 transition-colors duration-300" />
    </div>
  )
})

export default memo(ServicesSection)

