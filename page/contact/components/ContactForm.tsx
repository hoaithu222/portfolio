'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useState, FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const t = useTranslations('contact.form')
  const tProfile = useTranslations('profile')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useGSAP(() => {
    if (!formRef.current) return

    // Ensure form is visible
    gsap.set(formRef.current, {
      opacity: 1,
      y: 0,
      visibility: 'visible',
    })

    // Form entrance animation
    gsap.from(formRef.current, {
      scrollTrigger: {
        trigger: formRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 50,
      scale: 0.95,
      duration: 1,
      ease: 'power3.out',
    })

    // Input fields animation
    const inputs = formRef.current.querySelectorAll('input, textarea')
    gsap.from(inputs, {
      scrollTrigger: {
        trigger: formRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      x: -30,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.3,
      ease: 'power2.out',
    })
  }, { scope: formRef })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
      return
    }
    
    // Get profile email from translations
    const profileEmail = tProfile('email')
    
    // Create mailto link with form data
    const subject = encodeURIComponent(formData.subject)
    const body = encodeURIComponent(
      `Tên: ${formData.name}\n` +
      `Email: ${formData.email}\n\n` +
      `Tin nhắn:\n${formData.message}`
    )
    
    const mailtoLink = `mailto:${profileEmail}?subject=${subject}&body=${body}`
    
    // Open mail client
    try {
      window.location.href = mailtoLink
      
      // Show success message
      setSubmitStatus('success')
      
      // Success animation
      if (formRef.current) {
        gsap.to(formRef.current, {
          scale: 1.02,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
        })
      }
      
      // Clear form after a delay
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' })
        setSubmitStatus('idle')
      }, 3000)
    } catch (error) {
      console.error('Error opening mail client:', error)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="group relative p-8 rounded-3xl overflow-hidden opacity-100"
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

      <div className="relative z-10 text-text-secondary">
        <h3 className="text-2xl font-bold text-brand-pink-1 mb-6 group-hover:text-brand-blue-1 transition-colors duration-300">
          {t('title')}
        </h3>

        {/* Name */}
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
            {t('name_label')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-bg-secondary/50 border border-border-default text-text-primary placeholder-text-secondary focus:outline-none focus:border-brand-pink-1 focus:ring-2 focus:ring-brand-pink-1/20 transition-all duration-300"
            placeholder={t('name_placeholder')}
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
            {t('email_label')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-bg-secondary/50 border border-border-default text-text-primary placeholder-text-secondary focus:outline-none focus:border-brand-blue-1 focus:ring-2 focus:ring-brand-blue-1/20 transition-all duration-300"
            placeholder={t('email_placeholder')}
          />
        </div>

        {/* Subject */}
        <div className="mb-6">
          <label htmlFor="subject" className="block text-sm font-medium text-text-secondary mb-2">
            {t('subject_label')}
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-bg-secondary/50 border border-border-default text-text-primary placeholder-text-secondary focus:outline-none focus:border-brand-pink-1 focus:ring-2 focus:ring-brand-pink-1/20 transition-all duration-300"
            placeholder={t('subject_placeholder')}
          />
        </div>

        {/* Message */}
        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-2">
            {t('message_label')}
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-bg-secondary/50 border border-border-default text-text-primary placeholder-text-secondary focus:outline-none focus:border-brand-blue-1 focus:ring-2 focus:ring-brand-blue-1/20 transition-all duration-300 resize-none"
            placeholder={t('message_placeholder')}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-brand-pink-1 to-brand-blue-1 text-white font-semibold flex items-center justify-center gap-3 hover:from-brand-blue-1 hover:to-brand-pink-1 transition-all duration-300 group/btn relative overflow-hidden"
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1.05,
              duration: 0.3,
              ease: 'power2.out',
            })
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1,
              duration: 0.3,
            })
          }}
        >
          <span className="relative z-10 flex items-center gap-3">
            <FaPaperPlane className="text-lg group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
            {t('submit')}
          </span>
          
          {/* Shine effect */}
          <div 
            className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            }}
          />
        </button>

        {/* Status Message */}
        {submitStatus === 'success' && (
          <div className="mt-4 p-4 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center gap-3 text-green-400">
            <FaCheckCircle className="text-xl" />
            <p>{t('success')}</p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-3 text-red-400">
            <FaExclamationCircle className="text-xl" />
            <p>{t('error')}</p>
          </div>
        )}
      </div>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-30 group-hover:opacity-60 transition-opacity duration-300 bg-gradient-to-br from-brand-pink-1 to-transparent" style={{ filter: 'blur(20px)' }} />
    </form>
  )
}


