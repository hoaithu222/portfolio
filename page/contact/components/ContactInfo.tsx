'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { 
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGlobe,
  FaGithub,
  FaLinkedin,
  FaFacebook
} from 'react-icons/fa'

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaGithub: FaGithub,
  FaLinkedin: FaLinkedin,
  FaFacebook: FaFacebook,
}

export default function ContactInfo() {
  const infoRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('profile')
  const tContact = useTranslations('contact')
  
  // Get socials data
  const socialsData = t.raw('socials')
  const socials = Array.isArray(socialsData) ? socialsData : []
  
  const profile = {
    name: t('name'),
    role: t('role'),
    phone: t('phone'),
    email: t('email'),
    address: t('address'),
    website: t('website'),
    socials: socials as Array<{
      platform: string
      url: string
      icon: string
    }>
  }



  useGSAP(() => {
    if (!infoRef.current) return

    // Ensure content is visible
    gsap.set(infoRef.current, {
      opacity: 1,
      y: 0,
      visibility: 'visible',
    })

    // Avatar animation - simplified
    if (avatarRef.current) {
      gsap.from(avatarRef.current, {
        scrollTrigger: {
          trigger: infoRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
      })
    }

    // Info cards animation
    const cards = infoRef.current.querySelectorAll('.info-card')
    // Ensure cards are visible initially
    gsap.set(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      visibility: 'visible',
    })
    
    gsap.from(cards, {
      scrollTrigger: {
        trigger: infoRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.out',
      immediateRender: false,
    })

    // Social icons animation
    const socialIcons = infoRef.current.querySelectorAll('.social-icon')
    if (socialIcons.length > 0) {
      // Ensure icons are visible initially
      gsap.set(socialIcons, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        visibility: 'visible',
      })
      
      gsap.from(socialIcons, {
        scrollTrigger: {
          trigger: infoRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
        immediateRender: false,
      })
    }
  }, { scope: infoRef })

  return (
    <div ref={infoRef} className="space-y-6 opacity-100" style={{ visibility: 'visible' }}>
      {/* Avatar Card */}
      <div 
        className="group relative p-8 rounded-3xl overflow-hidden backdrop-blur-xl
        bg-white/60 border border-border-default shadow-xl
        dark:bg-white/5 dark:border-white/10 dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)]
        transition-colors duration-300"
      >
        {/* Glow effect - reduced */}
        <div className="absolute -inset-4 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(233, 30, 99, 0.2), rgba(25, 118, 210, 0.1), transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="text-center">
          <div 
            ref={avatarRef}
            className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 group/avatar"
            style={{
              borderColor: 'rgba(233, 30, 99, 0.5)',
              boxShadow: '0 0 20px rgba(233, 30, 99, 0.3), 0 0 40px rgba(25, 118, 210, 0.2)',
            }}
          >
            <Image
              src="/image/anh_the.jpg"
              alt={profile.name}
              fill
              className="object-cover group-hover/avatar:scale-105 transition-transform duration-300"
              priority
            />
            {/* Avatar glow - reduced */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-pink-1/20 to-brand-blue-1/20 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
          </div>
          
          <h2 className="text-3xl font-bold text-brand-pink-1 mb-2 transition-colors duration-200">
            {profile.name}
          </h2>
          <p className="text-text-secondary text-lg font-medium">{profile.role}</p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="space-y-4">
        {/* Phone */}
        <div 
          className="info-card group relative p-6 rounded-2xl overflow-hidden cursor-pointer backdrop-blur-xl
          bg-white/60 border border-border-default shadow-sm
          dark:bg-white/5 dark:border-white/10 dark:shadow-none
          transition-all duration-200 hover:shadow-md"
        >
          <a href={`tel:${profile.phone}`} className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-brand-pink-1/20 to-brand-blue-1/20 border border-brand-pink-1/30">
              <FaPhone className="text-2xl text-brand-pink-1" />
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">{tContact('phone_label')}</p>
              <p className="text-text-primary font-semibold">{profile.phone}</p>
            </div>
          </a>
        </div>

        {/* Email */}
        <div 
          className="info-card group relative p-6 rounded-2xl overflow-hidden cursor-pointer backdrop-blur-xl
          bg-white/60 border border-border-default shadow-sm
          dark:bg-white/5 dark:border-white/10 dark:shadow-none
          transition-all duration-200 hover:shadow-md"
        >
          <a href={`mailto:${profile.email}`} className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-brand-blue-1/20 to-brand-pink-1/20 border border-brand-blue-1/30">
              <FaEnvelope className="text-2xl text-brand-blue-1" />
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">{tContact('email_label')}</p>
              <p className="text-text-primary font-semibold">{profile.email}</p>
            </div>
          </a>
        </div>

        {/* Address */}
        <div 
          className="info-card group relative p-6 rounded-2xl overflow-hidden backdrop-blur-xl
          bg-white/60 border border-border-default shadow-sm
          dark:bg-white/5 dark:border-white/10 dark:shadow-none"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-brand-pink-1/20 to-brand-blue-1/20 border border-brand-pink-1/30">
              <FaMapMarkerAlt className="text-2xl text-brand-pink-1" />
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">{tContact('address_label')}</p>
              <p className="text-text-primary font-semibold">{profile.address}</p>
            </div>
          </div>
        </div>

        {/* Website */}
        <div 
          className="info-card group relative p-6 rounded-2xl overflow-hidden cursor-pointer backdrop-blur-xl
          bg-white/60 border border-border-default shadow-sm
          dark:bg-white/5 dark:border-white/10 dark:shadow-none
          transition-all duration-200 hover:shadow-md"
        >
          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-brand-blue-1/20 to-brand-pink-1/20 border border-brand-blue-1/30">
              <FaGlobe className="text-2xl text-brand-blue-1" />
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">{tContact('website_label')}</p>
              <p className="text-text-primary font-semibold truncate max-w-[200px] md:max-w-xs">{profile.website}</p>
            </div>
          </a>
        </div>
      </div>

      {/* Social Links */}
      <div 
        className="group relative p-6 rounded-2xl overflow-hidden opacity-100 info-card backdrop-blur-xl
        bg-white/60 border border-border-default shadow-sm
        dark:bg-white/5 dark:border-white/10 dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
        style={{ visibility: 'visible' }}
      >
        {/* Glow effect - reduced */}
        <div className="absolute -inset-4 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(233, 30, 99, 0.2), rgba(25, 118, 210, 0.1), transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <p className="text-sm font-semibold text-text-secondary mb-5 text-center uppercase tracking-wide">{tContact('connect_title')}</p>
        <div className="flex justify-center gap-4 flex-wrap">
          {profile.socials && profile.socials.length > 0 ? (
            profile.socials.map((social, index) => {
              const IconComponent = iconMap[social.icon]
              if (!IconComponent) {
                console.warn(`Icon not found: ${social.icon}`, social)
                return null
              }

              const colors = [
                { from: '#E91E63', to: '#1976D2' },
                { from: '#1976D2', to: '#E91E63' },
                { from: '#E91E63', to: '#1976D2' },
              ]
              const color = colors[index % colors.length]

              return (
                <a
                  key={`${social.platform}-${index}`}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon group/social relative p-4 rounded-xl overflow-hidden transition-all duration-300 opacity-100 border-2 dark:border"
                  style={{
                    background: `linear-gradient(135deg, ${color.from}20, ${color.to}20)`,
                    borderColor: `${color.from}`,
                    boxShadow: `0 5px 15px ${color.from}20`,
                    visibility: 'visible',
                  }}
                  onMouseEnter={(e) => {
                    const isDark = document.documentElement.classList.contains('dark')
                    gsap.to(e.currentTarget, {
                      scale: 1.05,
                      duration: 0.2,
                      ease: 'power2.out',
                    })
                    gsap.to(e.currentTarget, {
                      boxShadow: `0 8px 20px ${color.from}30`,
                      borderColor: color.to,
                      borderWidth: isDark ? '1px' : '2px',
                      duration: 0.2,
                    })
                  }}
                  onMouseLeave={(e) => {
                    const isDark = document.documentElement.classList.contains('dark')
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      duration: 0.2,
                    })
                    gsap.to(e.currentTarget, {
                      boxShadow: `0 5px 15px ${color.from}20`,
                      borderColor: color.from,
                      borderWidth: isDark ? '1px' : '2px',
                      duration: 0.2,
                    })
                  }}
                >
                  <div className="text-3xl relative z-10 transition-colors duration-200" style={{ color: color.from }}>
                    <IconComponent />
                  </div>
                </a>
              )
            })
          ) : (
            <p className="text-text-secondary text-sm">Đang tải thông tin mạng xã hội...</p>
          )}
        </div>
      </div>
    </div>
  )
}