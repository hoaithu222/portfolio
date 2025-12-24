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
    // Ensure card is visible and only lightweight entrance
    gsap.set(card, {
      opacity: 1,
      y: 0,
      visibility: 'visible',
    })

    gsap.from(card, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    })
  }, { scope: cardRef, dependencies: [index] })

  const techStackItems = useMemo(() => {
    return job.tech_stack.split(',').map((tech: string) => tech.trim()).filter(Boolean)
  }, [job.tech_stack])

  return (
    <div className="relative">
      {/* Timeline line */}
      {!isLast && (
        <div 
          className="absolute left-6 sm:left-8 top-24 w-0.5 h-full bg-gradient-to-b from-brand-pink-1/30 via-brand-blue-1/30 to-transparent"
          style={{ height: 'calc(100% + 2rem)' }}
        />
      )}

      {/* Timeline dot */}
      <div 
        className="timeline-dot absolute left-4 sm:left-6 top-6 w-4 h-4 rounded-full z-10"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          boxShadow: `0 0 20px ${gradientFrom}60, 0 0 40px ${gradientTo}40`,
        }}
      />

      <div
        ref={cardRef}
        className="group relative ml-12 sm:ml-16 mb-6 sm:mb-8 p-6 sm:p-8 rounded-3xl overflow-hidden opacity-100 transition-transform duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${isHovered ? `${gradientTo}40` : 'rgba(255, 255, 255, 0.1)'}`,
          boxShadow: isHovered 
            ? `0 15px 40px ${gradientFrom}20, 0 0 30px ${gradientTo}15`
            : '0 6px 24px rgba(0, 0, 0, 0.28)',
          visibility: 'visible',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
            {/* Icon */}
            <div 
              className="experience-icon p-4 sm:p-5 rounded-2xl transition-all duration-300 relative overflow-hidden"
              style={{
                background: isHovered 
                  ? `linear-gradient(135deg, ${gradientFrom}30, ${gradientTo}30)`
                  : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${isHovered ? `${gradientTo}40` : 'rgba(255, 255, 255, 0.1)'}`,
                boxShadow: isHovered 
                  ? `0 8px 22px ${gradientFrom}25`
                  : '0 4px 12px rgba(0, 0, 0, 0.2)',
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
                  className="text-xl sm:text-2xl font-bold transition-colors duration-300"
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
              <p className="text-lg sm:text-xl text-text-primary font-semibold mb-1">{job.company}</p>
              <p className="text-text-secondary text-xs sm:text-sm flex items-center gap-2">
                <FaCalendarAlt className="text-brand-pink-1" />
                {job.duration}
              </p>
            </div>
          </div>

          {/* Project */}
          <div className="mb-4">
            <p className="text-base sm:text-lg font-semibold text-brand-blue-1 mb-2 flex items-center gap-2">
              <FaBriefcase className="text-sm" />
              {job.project}
            </p>
            <p className="text-text-secondary leading-relaxed text-sm sm:text-base">{job.description}</p>
          </div>

          {/* Responsibilities */}
          <div className="mb-6">
            <h4 className="text-xs sm:text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">Trách nhiệm chính:</h4>
            <ul className="space-y-2">
              {job.responsibilities.map((responsibility, idx) => (
                <li 
                  key={idx}
                  className="text-text-secondary text-sm sm:text-base flex items-start gap-3 pl-4 relative"
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
            <h4 className="text-xs sm:text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">Công nghệ sử dụng:</h4>
            <div className="flex flex-wrap gap-2">
              {techStackItems.map((tech, techIdx) => (
                <span
                  key={techIdx}
                  className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer group/tech relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${gradientFrom}15, ${gradientTo}15)`,
                    border: `1px solid ${gradientFrom}30`,
                    color: 'rgba(255, 255, 255, 0.9)',
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
    <div ref={sectionRef} className="space-y-4 sm:space-y-6 opacity-100" style={{ visibility: 'visible' }}>
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


