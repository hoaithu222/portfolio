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

    // Form entrance animation - simplified
    gsap.from(formRef.current, {
      scrollTrigger: {
        trigger: formRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 20,
      duration: 0.5,
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
      
      // Success animation - simplified
      if (formRef.current) {
        gsap.to(formRef.current, {
          scale: 1.01,
          duration: 0.2,
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
      className="group relative w-full p-6 sm:p-8 rounded-3xl overflow-hidden opacity-100 backdrop-blur-xl
        bg-white/60 border-2 border-border-default shadow-xl
        dark:bg-white/5 dark:border-white/10 dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)]
        transition-colors duration-300"
      style={{
        visibility: 'visible',
      }}
    >
      {/* Glow effect - reduced */}
      <div className="absolute -inset-4 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(233, 30, 99, 0.2), rgba(25, 118, 210, 0.1), transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative z-10 w-full">
        <h3 className="text-2xl font-bold text-brand-pink-1 mb-6 transition-colors duration-200">
          {t('title')}
        </h3>

        <div className="space-y-5">
          {/* Name */}
          <div>
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
              className="w-full px-4 py-3 rounded-xl 
                bg-white text-text-primary 
                dark:bg-bg-secondary/50
                placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-pink-1/20 transition-all duration-300"
              style={{
                border: '2px solid var(--border-default)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-pink-1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)'
              }}
              placeholder={t('name_placeholder')}
            />
          </div>

          {/* Email */}
          <div>
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
              className="w-full px-4 py-3 rounded-xl 
                bg-white text-text-primary 
                dark:bg-bg-secondary/50
                placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-blue-1/20 transition-all duration-300"
              style={{
                border: '2px solid var(--border-default)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-blue-1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)'
              }}
              placeholder={t('email_placeholder')}
            />
          </div>

          {/* Subject */}
          <div>
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
              className="w-full px-4 py-3 rounded-xl 
                bg-white text-text-primary 
                dark:bg-bg-secondary/50
                placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-pink-1/20 transition-all duration-300"
              style={{
                border: '2px solid var(--border-default)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-pink-1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)'
              }}
              placeholder={t('subject_placeholder')}
            />
          </div>

          {/* Message */}
          <div>
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
              className="w-full px-4 py-3 rounded-xl 
                bg-white text-text-primary 
                dark:bg-bg-secondary/50
                placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-blue-1/20 transition-all duration-300 resize-none"
              style={{
                border: '2px solid var(--border-default)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-blue-1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)'
              }}
              placeholder={t('message_placeholder')}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 px-6 py-4 rounded-xl bg-gradient-to-r from-brand-pink-1 to-brand-blue-1 text-white font-semibold flex items-center justify-center gap-3 hover:from-brand-blue-1 hover:to-brand-pink-1 transition-all duration-200 group/btn relative overflow-hidden shadow-lg hover:shadow-xl"
        >
          <span className="relative z-10 flex items-center gap-3">
            <FaPaperPlane className="text-lg" />
            {t('submit')}
          </span>
        </button>

        {/* Status Message */}
        {submitStatus === 'success' && (
          <div className="mt-4 p-4 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center gap-3 text-green-600 dark:text-green-400">
            <FaCheckCircle className="text-xl" />
            <p>{t('success')}</p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-3 text-red-600 dark:text-red-400">
            <FaExclamationCircle className="text-xl" />
            <p>{t('error')}</p>
          </div>
        )}
      </div>

    </form>
  )
}