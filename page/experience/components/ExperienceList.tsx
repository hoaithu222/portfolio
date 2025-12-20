'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  FaBriefcase,
  FaCalendarAlt,
  FaLink,
  FaCode,
  FaRocket,
  FaChartLine,
  FaShoppingCart,
  FaLaptopCode
} from 'react-icons/fa'

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ExperienceCardProps {
  job: {
    id: string
    company: string
    position: string
    duration: string
    project: string
    description: string
    responsibilities: string[]
    tech_stack: string
    link?: string
  }
  index: number
  isLast: boolean
}

function ExperienceCard({ job, index, isLast }: ExperienceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Get icon based on project type
  const getProjectIcon = () => {
    const projectLower = job.project.toLowerCase()
    if (projectLower.includes('trading') || projectLower.includes('chứng khoán') || projectLower.includes('securities')) {
      return <FaChartLine className="text-4xl" />
    } else if (projectLower.includes('admin') || projectLower.includes('portal')) {
      return <FaLaptopCode className="text-4xl" />
    } else if (projectLower.includes('shop') || projectLower.includes('commerce') || projectLower.includes('thương mại')) {
      return <FaShoppingCart className="text-4xl" />
    } else if (projectLower.includes('techstore') || projectLower.includes('dashboard')) {
      return <FaRocket className="text-4xl" />
    }
    return <FaCode className="text-4xl" />
  }

  const gradientFrom = index % 2 === 0 ? '#FF5FA2' : '#3B82F6'
  const gradientTo = index % 2 === 0 ? '#3B82F6' : '#FF5FA2'

  useGSAP(() => {
    if (!cardRef.current) return

    const card = cardRef.current
    const iconEl = card.querySelector('.experience-icon')
    const timelineEl = card.querySelector('.timeline-dot')

    // Ensure card is visible
    gsap.set(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      visibility: 'visible',
    })

    // Card entrance animation
    gsap.fromTo(card, 
      {
        opacity: 0,
        y: 80,
        scale: 0.9,
        filter: 'blur(15px)',
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
        filter: 'blur(0px)',
        duration: 1,
        delay: index * 0.15,
        ease: 'power3.out',
      }
    )

    // Icon animation
    if (iconEl) {
      gsap.from(iconEl, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
        rotation: -180,
        scale: 0,
        duration: 0.8,
        delay: index * 0.15 + 0.2,
        ease: 'elastic.out(1, 0.6)',
      })
    }

    // Timeline dot animation
    if (timelineEl) {
      gsap.from(timelineEl, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
        scale: 0,
        opacity: 0,
        duration: 0.6,
        delay: index * 0.15 + 0.3,
        ease: 'back.out(2)',
      })
    }

    // Hover animations
    const handleMouseEnter = () => {
      setIsHovered(true)
      gsap.to(card, {
        scale: 1.02,
        y: -8,
        duration: 0.4,
        ease: 'power2.out',
      })
      gsap.to(iconEl, {
        rotation: 360,
        scale: 1.2,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      })
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.4,
      })
      gsap.to(iconEl, {
        rotation: 0,
        scale: 1,
        duration: 0.4,
      })
    }

    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, { scope: cardRef, dependencies: [index] })

  const techStackItems = useMemo(() => {
    return job.tech_stack.split(',').map((tech: string) => tech.trim()).filter(Boolean)
  }, [job.tech_stack])

  return (
    <div className="relative">
      {/* Timeline line */}
      {!isLast && (
        <div 
          className="absolute left-8 top-24 w-0.5 h-full bg-gradient-to-b from-brand-pink-1/30 via-brand-blue-1/30 to-transparent"
          style={{ height: 'calc(100% + 2rem)' }}
        />
      )}

      {/* Timeline dot */}
      <div 
        className="timeline-dot absolute left-6 top-6 w-4 h-4 rounded-full z-10"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          boxShadow: `0 0 20px ${gradientFrom}60, 0 0 40px ${gradientTo}40`,
        }}
      />

      <div
        ref={cardRef}
        className="group relative ml-16 mb-8 p-8 rounded-3xl overflow-hidden opacity-100"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${isHovered ? `${gradientTo}40` : 'rgba(255, 255, 255, 0.1)'}`,
          boxShadow: isHovered 
            ? `0 25px 70px ${gradientFrom}25, 0 0 50px ${gradientTo}20, inset 0 0 50px ${gradientFrom}10`
            : '0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          visibility: 'visible',
        }}
      >
        {/* Glow effect */}
        <div 
          className="absolute -inset-4 opacity-0 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"
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

        {/* Content */}
        <div className="relative z-10 text-text-secondary">
          {/* Header */}
          <div className="flex items-start gap-6 mb-6">
            {/* Icon */}
            <div 
              className="experience-icon p-5 rounded-2xl transition-all duration-500 relative overflow-hidden"
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
                className="relative z-10 text-text-secondary"
                style={{ color: isHovered ? gradientTo : gradientFrom }}
              >
                {getProjectIcon()}
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

            {/* Title and Company */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 
                  className="text-2xl font-bold transition-colors duration-300"
                  style={{ 
                    color: isHovered ? gradientTo : gradientFrom,
                    textShadow: isHovered ? `0 0 20px ${gradientTo}40` : 'none',
                  }}
                >
                  {job.position}
                </h3>
                {job.link && (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-pink-1 hover:text-brand-blue-1 transition-colors duration-300"
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, {
                        scale: 1.2,
                        rotation: 15,
                        duration: 0.3,
                      })
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, {
                        scale: 1,
                        rotation: 0,
                        duration: 0.3,
                      })
                    }}
                  >
                    <FaLink className="text-lg" />
                  </a>
                )}
              </div>
              <p className="text-xl text-text-primary font-semibold mb-1">{job.company}</p>
              <p className="text-text-secondary text-sm flex items-center gap-2">
                <FaCalendarAlt className="text-brand-pink-1" />
                {job.duration}
              </p>
            </div>
          </div>

          {/* Project */}
          <div className="mb-4">
            <p className="text-lg font-semibold text-brand-blue-1 mb-2 flex items-center gap-2">
              <FaBriefcase className="text-sm" />
              {job.project}
            </p>
            <p className="text-text-secondary leading-relaxed">{job.description}</p>
          </div>

          {/* Responsibilities */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">Trách nhiệm chính:</h4>
            <ul className="space-y-2">
              {job.responsibilities.map((responsibility, idx) => (
                <li 
                  key={idx}
                  className="text-text-secondary text-sm flex items-start gap-3 pl-4 relative"
                  style={{
                    borderLeft: `2px solid ${gradientFrom}30`,
                  }}
                >
                  <span 
                    className="absolute left-0 top-2 w-2 h-2 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                      boxShadow: `0 0 8px ${gradientFrom}60`,
                    }}
                  />
                  <span>{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">Công nghệ sử dụng:</h4>
            <div className="flex flex-wrap gap-2">
              {techStackItems.map((tech, techIdx) => (
                <span
                  key={techIdx}
                  className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer group/tech relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${gradientFrom}15, ${gradientTo}15)`,
                    border: `1px solid ${gradientFrom}30`,
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1.1,
                      y: -3,
                      duration: 0.2,
                      ease: 'back.out(2)',
                    })
                    gsap.to(e.currentTarget, {
                      boxShadow: `0 8px 25px ${gradientFrom}40, 0 0 15px ${gradientTo}30`,
                      borderColor: gradientTo,
                      duration: 0.2,
                    })
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      y: 0,
                      duration: 0.2,
                    })
                    gsap.to(e.currentTarget, {
                      boxShadow: 'none',
                      borderColor: `${gradientFrom}30`,
                      duration: 0.2,
                    })
                  }}
                >
                  <span className="relative z-10 text-text-secondary">{tech}</span>
                  {/* Shine effect */}
                  <div 
                    className="absolute inset-0 -translate-x-full group-hover/tech:translate-x-full transition-transform duration-700"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${gradientTo}50, transparent)`,
                      filter: 'blur(8px)',
                    }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative corner */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 opacity-30 group-hover:opacity-60 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at top right, ${gradientFrom}, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />
      </div>
    </div>
  )
}

export default function ExperienceList() {
  const t = useTranslations('experience')
  const sectionRef = useRef<HTMLDivElement>(null)
  const jobs = t.raw('jobs') as Array<{
    id: string
    company: string
    position: string
    duration: string
    project: string
    description: string
    responsibilities: string[]
    tech_stack: string
    link?: string
  }>

  useGSAP(() => {
    if (!sectionRef.current) return

    gsap.set(sectionRef.current, {
      opacity: 1,
      y: 0,
      visibility: 'visible',
    })

    gsap.from(sectionRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    })
  }, { scope: sectionRef })

  return (
    <div ref={sectionRef} className="space-y-0 opacity-100" style={{ visibility: 'visible' }}>
      {jobs.map((job, index) => (
        <ExperienceCard
          key={job.id}
          job={job}
          index={index}
          isLast={index === jobs.length - 1}
        />
      ))}
    </div>
  )
}


