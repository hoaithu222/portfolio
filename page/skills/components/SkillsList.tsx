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
  FaDatabase,
} from 'react-icons/fa'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const isMobile =
  typeof window !== 'undefined' && window.innerWidth < 768

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface SkillCategoryProps {
  title: string
  skills: string
  icon: React.ReactNode
  gradientFrom: string
  gradientTo: string
  delay: number
}

function SkillCategory({
  title,
  skills,
  icon,
  gradientFrom,
  gradientTo,
  delay,
}: SkillCategoryProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const skillItems = useMemo(
    () =>
      skills
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean) || [],
    [skills],
  )

  useGSAP(
    () => {
      if (!ref.current) return

      const card = ref.current
      const iconEl = card.querySelector('.skill-icon')
      const tags = card.querySelectorAll('.skill-tag')

      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
        },
        opacity: 0,
        y: 40,
        duration: prefersReducedMotion ? 0 : 0.8,
        ease: 'power2.out',
      })

      if (iconEl) {
        gsap.from(iconEl, {
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
          },
          scale: 0.9,
          opacity: 0,
          duration: prefersReducedMotion ? 0 : 0.5,
          delay: delay * 0.1,
        })
      }

      gsap.from(tags, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
        },
        opacity: 0,
        y: 20,
        scale: 0.95,
        stagger: 0.05,
        duration: prefersReducedMotion ? 0 : 0.4,
        ease: 'power2.out',
      })
    },
    { scope: ref, dependencies: [delay] },
  )

  return (
    <div
      ref={ref}
      className="group relative rounded-3xl overflow-hidden
        p-6 sm:p-8 lg:p-10"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${
          hovered ? `${gradientTo}40` : 'rgba(255,255,255,0.1)'
        }`,
        boxShadow: hovered
          ? `0 20px 40px ${gradientFrom}25`
          : '0 10px 30px rgba(0,0,0,.3)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div
          className="skill-icon p-2 sm:p-4 lg:p-5 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div
            className="text-xl sm:text-3xl lg:text-4xl"
            style={{ color: gradientFrom }}
          >
            {icon}
          </div>
        </div>

        <h3
          className="skill-title text-xl sm:text-2xl lg:text-3xl font-bold"
          style={{ color: gradientTo }}
        >
          {title}
        </h3>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
        {skillItems.map((skill, i) => (
          <span
            key={i}
            className="
              skill-tag
              px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3
              text-xs sm:text-sm
              rounded-lg sm:rounded-xl
              transition-transform duration-200
            "
            style={{
              background: `linear-gradient(135deg, ${gradientFrom}20, ${gradientTo}20)`,
              border: `1px solid ${gradientFrom}30`,
              color: 'rgba(255,255,255,.9)',
            }}
            onMouseEnter={(e) => {
              if (isMobile) return
              gsap.to(e.currentTarget, {
                scale: 1.08,
                y: -3,
                duration: 0.2,
              })
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1,
                y: 0,
                duration: 0.2,
              })
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function SkillsList() {
  const t = useTranslations('skills')
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current) return

      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 95%',
        },
        opacity: 0,
        y: 50,
        duration: prefersReducedMotion ? 0 : 1,
        ease: 'power2.out',
      })
    },
    { scope: sectionRef },
  )

  return (
    <div ref={sectionRef} className="space-y-8 sm:space-y-10">
      <SkillCategory
        title="Programming Languages"
        skills={t('languages')}
        icon={<FaCode />}
        gradientFrom="#E91E63"
        gradientTo="#1976D2"
        delay={0}
      />

      <SkillCategory
        title="Frontend Technologies"
        skills={t('frontend')}
        icon={<FaReact />}
        gradientFrom="#1976D2"
        gradientTo="#E91E63"
        delay={1}
      />

      <SkillCategory
        title="UI Libraries & Frameworks"
        skills={t('ui_libraries')}
        icon={<FaPalette />}
        gradientFrom="#E91E63"
        gradientTo="#1976D2"
        delay={2}
      />

      <SkillCategory
        title="Backend Technologies"
        skills={t('backend')}
        icon={<FaDatabase />}
        gradientFrom="#1976D2"
        gradientTo="#E91E63"
        delay={3}
      />

      {/* Soft Skills */}
      <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <FaUsers className="text-3xl text-brand-pink-1" />
          <h3 className="text-xl sm:text-2xl font-bold text-brand-pink-1">
            Soft Skills
          </h3>
        </div>

        <div className="flex flex-wrap gap-3">
          {(t.raw('soft_skills') as string[]).map((s, i) => (
            <div
              key={i}
              className="px-4 py-2 rounded-xl text-sm bg-white/10 border border-pink-400/30"
            >
              <FaLightbulb className="inline mr-2 text-pink-400" />
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
