'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  FaReact, 
  FaCode, 
  FaPalette,
  FaUsers,
  FaLightbulb,
  FaDatabase
} from 'react-icons/fa'

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface SkillCategoryProps {
  title: string
  skills: string
  icon: React.ReactNode
  gradientFrom: string
  gradientTo: string
  delay: number
  index: number
}

function SkillCategory({ title, skills, icon, gradientFrom, gradientTo, delay }: SkillCategoryProps) {
  const categoryRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const skillItems = useMemo(() => {
    if (typeof skills === 'string') {
      const items = skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      console.log('Skill items parsed:', items, 'from:', skills)
      return items
    }
    console.warn('Skills is not a string:', skills)
    return []
  }, [skills])

  useGSAP(() => {
    if (!categoryRef.current) return

    const card = categoryRef.current
    const iconEl = card.querySelector('.skill-icon')
    const titleEl = card.querySelector('.skill-title')
    const skillsContainer = card.querySelector('.skills-container')
    const glowEl = card.querySelector('.card-glow')

    // Ensure card is visible initially - CRITICAL
    gsap.set(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      filter: 'blur(0px)',
      visibility: 'visible',
    })

    // Enhanced initial animation
    gsap.fromTo(card, 
      {
        opacity: 1, // Start visible
        y: 0,
        scale: 1,
        rotationX: 0,
        filter: 'blur(0px)',
      },
      {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        filter: 'blur(0px)',
        duration: 1.2,
        delay: delay * 0.12,
        ease: 'power4.out',
        immediateRender: true,
      }
    )

    // Enhanced icon animation
    if (iconEl) {
      gsap.from(iconEl, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
        rotation: -360,
        scale: 0,
        filter: 'blur(10px)',
        duration: 1,
        delay: delay * 0.12 + 0.3,
        ease: 'elastic.out(1, 0.6)',
      })
    }

    // Enhanced skills stagger animation
    if (skillsContainer) {
      const skillTags = skillsContainer.querySelectorAll('.skill-tag')
      
      // Ensure tags are visible first
      gsap.set(skillTags, {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0,
        rotation: 0,
        filter: 'blur(0px)',
        visibility: 'visible',
      })
      
      // Animate from hidden state
      gsap.from(skillTags, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        scale: 0,
        y: (i) => (i % 2 === 0 ? -30 : 30),
        x: (i) => (i % 3 === 0 ? -40 : i % 3 === 1 ? 40 : 0),
        rotation: (i) => (i % 2 === 0 ? -15 : 15),
        filter: 'blur(10px)',
        duration: 0.6,
        delay: delay * 0.12 + 0.5,
        stagger: {
          amount: 0.4,
          from: 'random',
        },
        ease: 'back.out(2)',
        immediateRender: false, // Don't render initial state immediately
      })
    }

    // Magnetic hover effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!card) return
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const moveX = (x - centerX) * 0.1
      const moveY = (y - centerY) * 0.1

      gsap.to(card, {
        x: moveX,
        y: moveY,
        duration: 0.5,
        ease: 'power2.out',
      })

      if (glowEl) {
        gsap.to(glowEl, {
          x: moveX * 2,
          y: moveY * 2,
          opacity: 0.6,
          duration: 0.5,
          ease: 'power2.out',
        })
      }
    }

    const handleMouseEnter = () => {
      setIsHovered(true)
      gsap.to(card, {
        scale: 1.03,
        duration: 0.4,
        ease: 'power2.out',
      })
      gsap.to(iconEl, {
        rotation: 360,
        scale: 1.3,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      })
      gsap.to(titleEl, {
        color: gradientTo,
        scale: 1.05,
        duration: 0.3,
      })
      if (glowEl) {
        gsap.to(glowEl, {
          opacity: 0.8,
          scale: 1.2,
          duration: 0.4,
        })
      }
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      gsap.to(card, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      })
      gsap.to(iconEl, {
        rotation: 0,
        scale: 1,
        duration: 0.4,
      })
      gsap.to(titleEl, {
        color: '',
        scale: 1,
        duration: 0.3,
      })
      if (glowEl) {
        gsap.to(glowEl, {
          x: 0,
          y: 0,
          opacity: 0,
          scale: 1,
          duration: 0.4,
        })
      }
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, { scope: categoryRef, dependencies: [delay] })

  return (
    <div
      ref={categoryRef}
      className="group relative p-10 rounded-3xl overflow-hidden opacity-100"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${isHovered ? `${gradientTo}40` : 'rgba(255, 255, 255, 0.1)'}`,
        boxShadow: isHovered 
          ? `0 20px 60px ${gradientFrom}20, 0 0 40px ${gradientTo}15, inset 0 0 40px ${gradientFrom}10`
          : '0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        visibility: 'visible',
      }}
    >
      {/* Enhanced glow effect */}
      <div 
        className="card-glow absolute -inset-4 opacity-0 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${gradientFrom}40, ${gradientTo}20, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Animated gradient border */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo}, ${gradientFrom})`,
          backgroundSize: '200% 200%',
          padding: '2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Shimmer effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `linear-gradient(110deg, transparent 30%, ${gradientTo}20 50%, transparent 70%)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s infinite',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center gap-6 mb-8">
          <div 
            className="skill-icon p-5 rounded-2xl transition-all duration-500 relative overflow-hidden"
            style={{
              background: isHovered 
                ? `linear-gradient(135deg, ${gradientFrom}30, ${gradientTo}30)`
                : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${isHovered ? `${gradientTo}40` : 'rgba(255, 255, 255, 0.1)'}`,
              boxShadow: isHovered 
                ? `0 10px 30px ${gradientFrom}30, inset 0 0 20px ${gradientTo}20`
                : '0 5px 15px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div 
              className="text-4xl relative z-10"
              style={{ color: isHovered ? gradientTo : gradientFrom }}
            >
              {icon}
            </div>
            {/* Icon glow */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle, ${gradientTo}40, transparent 70%)`,
                filter: 'blur(20px)',
              }}
            />
          </div>
          <h3 
            className="skill-title text-3xl font-bold transition-all duration-300"
            style={{ 
              color: isHovered ? gradientTo : gradientFrom,
              textShadow: isHovered ? `0 0 20px ${gradientTo}40` : 'none',
            }}
          >
            {title}
          </h3>
        </div>

        {/* Enhanced Skills Grid */}
        <div className="skills-container flex flex-wrap gap-4">
          {skillItems.length > 0 ? skillItems.map((skill: string, skillIndex: number) => (
            <span
              key={`${skill}-${skillIndex}`}
              className="skill-tag group/tag relative px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden cursor-pointer opacity-100"
              style={{
                background: `linear-gradient(135deg, ${gradientFrom}15, ${gradientTo}15)`,
                border: `1px solid ${gradientFrom}30`,
                color: 'rgba(255, 255, 255, 0.9)',
                visibility: 'visible',
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1.15,
                  y: -5,
                  rotation: 2,
                  duration: 0.3,
                  ease: 'back.out(2)',
                })
                gsap.to(e.currentTarget, {
                  boxShadow: `0 10px 30px ${gradientFrom}40, 0 0 20px ${gradientTo}30`,
                  borderColor: gradientTo,
                  duration: 0.3,
                })
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  y: 0,
                  rotation: 0,
                  duration: 0.3,
                })
                gsap.to(e.currentTarget, {
                  boxShadow: 'none',
                  borderColor: `${gradientFrom}30`,
                  duration: 0.3,
                })
              }}
            >
              {/* Hover gradient background */}
              <div 
                className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} opacity-0 group-hover/tag:opacity-30 transition-opacity duration-300`}
              />
              <span className="relative z-10">{skill}</span>
              
              {/* Enhanced shine effect */}
              <div 
                className="absolute inset-0 -translate-x-full group-hover/tag:translate-x-full transition-transform duration-1000"
                style={{
                  background: `linear-gradient(90deg, transparent, ${gradientTo}50, transparent)`,
                  filter: 'blur(10px)',
                }}
              />
            </span>
          )) : (
            <div className="text-text-secondary text-sm">No skills available</div>
          )}
        </div>
      </div>

      {/* Enhanced decorative corner accent */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 opacity-30 group-hover:opacity-60 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at top right, ${gradientFrom}, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />
    </div>
  )
}

export default function SkillsList() {
  const t = useTranslations('skills')
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    // Ensure content is visible initially
    gsap.set(sectionRef.current, {
      opacity: 1,
      y: 0,
    })

    // Section entrance animation
    gsap.from(sectionRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: 'power3.out',
    })
  }, { scope: sectionRef })

  return (
    <div ref={sectionRef} className="space-y-10 opacity-100" style={{ visibility: 'visible' }}>
      {/* Languages */}
      <SkillCategory
        title="Programming Languages"
        skills={t('languages')}
        icon={<FaCode />}
        gradientFrom="#FF5FA2"
        gradientTo="#3B82F6"
        delay={0}
        index={0}
      />

      {/* Frontend */}
      <SkillCategory
        title="Frontend Technologies"
        skills={t('frontend')}
        icon={<FaReact />}
        gradientFrom="#3B82F6"
        gradientTo="#FF5FA2"
        delay={1}
        index={1}
      />

      {/* UI Libraries */}
      <SkillCategory
        title="UI Libraries & Frameworks"
        skills={t('ui_libraries')}
        icon={<FaPalette />}
        gradientFrom="#FF5FA2"
        gradientTo="#3B82F6"
        delay={2}
        index={2}
      />

      {/* Backend */}
      <SkillCategory
        title="Backend Technologies"
        skills={t('backend')}
        icon={<FaDatabase />}
        gradientFrom="#3B82F6"
        gradientTo="#FF5FA2"
        delay={3}
        index={3}
      />

      {/* Enhanced Soft Skills */}
      <div className="group relative p-10 rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Glow effect */}
        <div className="absolute -inset-4 opacity-0 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #FF5FA240, #3B82F620, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Animated gradient border */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, #FF5FA2, #3B82F6, #FF5FA2)',
            backgroundSize: '200% 200%',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-8">
            <div className="p-5 rounded-2xl transition-all duration-500 relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <FaUsers className="text-4xl text-brand-pink-1 group-hover:text-brand-blue-1 transition-colors duration-300" />
            </div>
            <h3 className="text-3xl font-bold text-brand-pink-1 group-hover:text-brand-blue-1 transition-colors duration-300">
              Soft Skills
            </h3>
          </div>

          <div className="flex flex-wrap gap-4">
            {(t.raw('soft_skills') as string[]).map((skill, index) => (
              <div
                key={`soft-${index}`}
                className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden cursor-pointer group/skill"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 95, 162, 0.15), rgba(59, 130, 246, 0.15))',
                  border: '1px solid rgba(255, 95, 162, 0.3)',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1.15,
                    y: -5,
                    duration: 0.3,
                    ease: 'back.out(2)',
                  })
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                  })
                }}
              >
                <FaLightbulb className="inline-block mr-2 text-brand-pink-1 group-hover/skill:scale-125 transition-transform duration-300" />
                <span className="relative z-10">{skill}</span>
                
                {/* Shine effect */}
                <div 
                  className="absolute inset-0 -translate-x-full group-hover/skill:translate-x-full transition-transform duration-1000"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    filter: 'blur(10px)',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-30 group-hover:opacity-60 transition-opacity duration-300 bg-gradient-to-br from-brand-pink-1 to-transparent" style={{ filter: 'blur(20px)' }} />
      </div>
    </div>
  )
}
