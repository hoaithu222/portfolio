'use client'

import React from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAppStore } from '@/store/AppContext'
import { useTheme } from 'next-themes'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
// 1. Import createPortal
import { createPortal } from 'react-dom'

const Header = () => {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const { switchLanguage } = useAppStore()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const mobileMenuRef = React.useRef<HTMLDivElement>(null)
  const mobileMenuOverlayRef = React.useRef<HTMLDivElement>(null)
  const hamburgerRef = React.useRef<HTMLButtonElement>(null)
  const scrollPositionRef = React.useRef<number>(0)

  // ... (Giữ nguyên các useEffect và logic khác của bạn) ...

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  React.useEffect(() => {
    if (isMobileMenuOpen) {
      scrollPositionRef.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPositionRef.current}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
    } else {
      const scrollY = scrollPositionRef.current
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
    return () => {
      if (isMobileMenuOpen) {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
      }
    }
  }, [isMobileMenuOpen])

  const navItems = [
    { key: 'home', href: `/${locale}/home` },
    { key: 'skills', href: `/${locale}/skills` },
    { key: 'experience', href: `/${locale}/experience` },
    { key: 'contact', href: `/${locale}/contact` },
  ]

  const isActive = (href: string) => {
    return pathname === href
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // ... (Giữ nguyên useGSAP) ...
  useGSAP(() => {
    if (!mobileMenuRef.current || !mobileMenuOverlayRef.current) return

    if (isMobileMenuOpen) {
      gsap.set(mobileMenuOverlayRef.current, { display: 'block', opacity: 0 })
      gsap.set(mobileMenuRef.current, { 
        x: '-100%',
        display: 'block',
        visibility: 'visible'
      })
      
      gsap.to(mobileMenuOverlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
      
      gsap.to(mobileMenuRef.current, {
        x: '0%',
        duration: 0.4,
        ease: 'power3.out',
        immediateRender: false,
      })

      // Hamburger animation logic
      if (hamburgerRef.current) {
         // ... (Giữ nguyên logic hamburger) ...
      }
    } else {
      // Close logic
      gsap.to(mobileMenuRef.current, {
        x: '-100%',
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          if (mobileMenuRef.current) {
            gsap.set(mobileMenuRef.current, { visibility: 'hidden' })
          }
        },
      })
      
      gsap.to(mobileMenuOverlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
            // Thêm check null cho chắc chắn
            if(mobileMenuOverlayRef.current) {
                gsap.set(mobileMenuOverlayRef.current, { display: 'none' })
            }
        },
      })

      // Reset hamburger logic
      if (hamburgerRef.current) {
          // ... (Giữ nguyên logic hamburger) ...
      }
    }
  }, { scope: mobileMenuRef, dependencies: [isMobileMenuOpen] })

  // 2. Tách phần Menu ra thành biến hoặc render trực tiếp trong createPortal
  const MobileMenuContent = (
    <>
      {/* Mobile Menu Overlay */}
      <div
        ref={mobileMenuOverlayRef}
        // Tăng z-index lên rất cao để đảm bảo đè được mọi thứ
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] md:hidden"
        style={{ display: 'none', touchAction: 'none' }}
        onClick={toggleMobileMenu}
        onTouchMove={(e) => e.preventDefault()}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer */}
      <div
        ref={mobileMenuRef}
        // Tăng z-index cao hơn overlay
        className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-bg-primary border-r border-border-default z-[9999] md:hidden shadow-2xl backdrop-blur-md"
        style={{ 
          transform: 'translateX(-100%)',
          visibility: 'hidden'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-default">
            <Link
              href={`/${locale}/home`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-bold bg-gradient-to-r from-brand-pink-1 to-brand-blue-1 bg-clip-text text-transparent"
            >
              Hoài Thu
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 overscroll-contain">
            <div className="space-y-2">
              {navItems.map((item, index) => {
                const translatedText = t(item.key)
                const active = isActive(item.href)
                
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      active
                        ? 'text-brand-pink-1 bg-brand-pink-5 dark:bg-brand-pink-1/20 shadow-lg'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                    }`}
                    style={{
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    {translatedText || item.key}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-border-default space-y-3">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
            >
               {/* Logic Theme Text/Icon cũ */}
               <span className="text-sm font-medium">
                {mounted && theme === 'dark' ? t('light_mode') : t('dark_mode')}
              </span>
               {mounted && theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => {
                switchLanguage(locale === 'vi' ? 'en' : 'vi')
                setIsMobileMenuOpen(false)
              }}
              className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors uppercase ${
                mounted 
                  ? 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary' 
                  : 'text-text-secondary'
              }`}
              disabled={!mounted}
            >
              {mounted ? (locale === 'vi' ? t('switch_to_english') : t('switch_to_vietnamese')) : locale.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border-default">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
           {/* ... Phần Logo và Nav Desktop giữ nguyên ... */}
           
           {/* Logo */}
          <Link 
            href={`/${locale}/home`} 
            className="flex items-center space-x-2"
            suppressHydrationWarning
          >
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-pink-1 to-brand-blue-1 bg-clip-text text-transparent">
             Hoài Thu
            </span>
          </Link>

          {/* Navigation Menu - Desktop */}
           <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const translatedText = t(item.key)
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-brand-pink-1 bg-brand-pink-5 dark:bg-brand-pink-1/20'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                  }`}
                  suppressHydrationWarning
                >
                  {translatedText || item.key}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center space-x-2">
            {/* Mobile Menu Button - Giữ nguyên */}
             <button
              ref={hamburgerRef}
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-6 h-5 flex flex-col justify-between relative">
                <span className="block w-full h-0.5 bg-current rounded absolute top-0 left-0 origin-center"></span>
                <span className="block w-full h-0.5 bg-current rounded absolute top-1/2 left-0 -translate-y-1/2"></span>
                <span className="block w-full h-0.5 bg-current rounded absolute bottom-0 left-0 origin-center"></span>
              </div>
            </button>
            
            {/* Theme & Language Switcher (Desktop) - Giữ nguyên */}
             <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors hidden md:block" // Thêm hidden md:block nếu muốn ẩn trên mobile để khỏi bị duplicate
              aria-label="Toggle theme"
              suppressHydrationWarning
            >
               {/* Icon Theme */}
               {mounted && theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
             <button
              onClick={() => switchLanguage(locale === 'vi' ? 'en' : 'vi')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors uppercase hidden md:block ${
                mounted 
                  ? 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary' 
                  : 'text-text-secondary'
              }`}
              suppressHydrationWarning
              disabled={!mounted}
            >
              {mounted ? (locale === 'vi' ? 'EN' : 'VI') : locale.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Render Menu bằng Portal gắn vào body */}
      {mounted && createPortal(MobileMenuContent, document.body)}
    </header>
  )
}

export default React.memo(Header)