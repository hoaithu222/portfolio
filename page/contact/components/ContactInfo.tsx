'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useEffect } from 'react'
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

  // Debug: Log socials to check if they're loaded
  useEffect(() => {
    console.log('Socials data from t.raw:', socialsData)
    console.log('Profile socials:', profile.socials)
    console.log('Socials length:', profile.socials?.length)
    console.log('Is array:', Array.isArray(socialsData))
  }, [socialsData, profile.socials])

  // Add CSS animation for rotating ring
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleId = 'avatar-ring-animation'
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style')
        style.id = styleId
        style.textContent = `
          @keyframes avatarRingSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .avatar-ring {
            animation: avatarRingSpin 3s linear infinite;
          }
        `
        document.head.appendChild(style)
      }
    }
  }, [])


  useGSAP(() => {
    if (!infoRef.current) return

    // Ensure content is visible
    gsap.set(infoRef.current, {
      opacity: 1,
      y: 0,
      visibility: 'visible',
    })

    // Avatar animation
    if (avatarRef.current) {
      gsap.from(avatarRef.current, {
        scrollTrigger: {
          trigger: infoRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)',
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
      y: 50,
      scale: 0.9,
      duration: 0.8,
      stagger: 0.1,
      delay: 0.3,
      ease: 'power3.out',
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
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.6,
        ease: 'elastic.out(1, 0.6)',
        immediateRender: false,
      })
    }
  }, { scope: infoRef })

  return (
    <div ref={infoRef} className="space-y-6 opacity-100" style={{ visibility: 'visible' }}>
      {/* Avatar Card */}
      <div className="group relative p-8 rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Glow effect */}
        <div className="absolute -inset-4 opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #FF5FA240, #3B82F620, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="text-center">
          <div 
            ref={avatarRef}
            className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 group/avatar"
            style={{
              borderColor: 'rgba(255, 95, 162, 0.4)',
              boxShadow: '0 0 40px rgba(255, 95, 162, 0.5), 0 0 80px rgba(59, 130, 246, 0.4), inset 0 0 40px rgba(255, 95, 162, 0.2)',
            }}
          >
            <Image
              src="/image/anh_the.jpg"
              alt={profile.name}
              fill
              className="object-cover group-hover/avatar:scale-110 transition-transform duration-500"
              priority
            />
            {/* Avatar glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-pink-1/30 to-brand-blue-1/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Rotating ring */}
            <div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500"
              style={{
                background: 'conic-gradient(from 0deg, #FF5FA2, #3B82F6, #FF5FA2)',
                padding: '4px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                animation: 'spin 3s linear infinite',
              }}
            />
          </div>
          
          <h2 className="text-3xl font-bold text-brand-pink-1 mb-2 group-hover:text-brand-blue-1 transition-colors duration-300">
            {profile.name}
          </h2>
          <p className="text-text-secondary text-lg">{profile.role}</p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="space-y-4">
        {/* Phone */}
        <div className="info-card group relative p-6 rounded-2xl overflow-hidden cursor-pointer"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1.02,
              y: -5,
              duration: 0.3,
              ease: 'power2.out',
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
        <div className="info-card group relative p-6 rounded-2xl overflow-hidden cursor-pointer"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1.02,
              y: -5,
              duration: 0.3,
              ease: 'power2.out',
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
        <div className="info-card group relative p-6 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
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
        <div className="info-card group relative p-6 rounded-2xl overflow-hidden cursor-pointer"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1.02,
              y: -5,
              duration: 0.3,
              ease: 'power2.out',
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
          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-brand-blue-1/20 to-brand-pink-1/20 border border-brand-blue-1/30">
              <FaGlobe className="text-2xl text-brand-blue-1" />
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">{tContact('website_label')}</p>
              <p className="text-text-primary font-semibold">{profile.website}</p>
            </div>
          </a>
        </div>
      </div>

      {/* Social Links */}
      <div className="group relative p-6 rounded-2xl overflow-hidden opacity-100 info-card"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          visibility: 'visible',
        }}
      >
        {/* Glow effect */}
        <div className="absolute -inset-4 opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #FF5FA240, #3B82F620, transparent 70%)',
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
                { from: '#FF5FA2', to: '#3B82F6' },
                { from: '#3B82F6', to: '#FF5FA2' },
                { from: '#FF5FA2', to: '#3B82F6' },
              ]
              const color = colors[index % colors.length]

              return (
                <a
                  key={`${social.platform}-${index}`}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon group/social relative p-4 rounded-xl overflow-hidden transition-all duration-300 opacity-100"
                  style={{
                    background: `linear-gradient(135deg, ${color.from}20, ${color.to}20)`,
                    border: `1px solid ${color.from}40`,
                    boxShadow: `0 5px 15px ${color.from}20`,
                    visibility: 'visible',
                  }}
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1.2,
                      rotation: 360,
                      y: -5,
                      duration: 0.5,
                      ease: 'elastic.out(1, 0.5)',
                    })
                    gsap.to(e.currentTarget, {
                      boxShadow: `0 10px 30px ${color.from}50, 0 0 20px ${color.to}40`,
                      borderColor: color.to,
                      duration: 0.3,
                    })
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      rotation: 0,
                      y: 0,
                      duration: 0.3,
                    })
                    gsap.to(e.currentTarget, {
                      boxShadow: `0 5px 15px ${color.from}20`,
                      borderColor: `${color.from}40`,
                      duration: 0.3,
                    })
                  }}
                >
                  {/* Icon glow */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover/social:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle, ${color.to}40, transparent 70%)`,
                      filter: 'blur(15px)',
                    }}
                  />
                  
                  <div className="text-3xl relative z-10 transition-colors duration-300" style={{ color: color.from }}>
                    <IconComponent />
                  </div>
                  
                  {/* Shine effect */}
                  <div 
                    className="absolute inset-0 -translate-x-full group-hover/social:translate-x-full transition-transform duration-700"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${color.to}50, transparent)`,
                      filter: 'blur(8px)',
                    }}
                  />
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

