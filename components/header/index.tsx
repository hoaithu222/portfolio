'use client'

import React from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAppStore } from '@/store/AppContext'
import { useTheme } from 'next-themes'

const Header = () => {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const { switchLanguage } = useAppStore()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Only render theme-dependent content after mount to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])


  const navItems = [
    { key: 'home', href: `/${locale}/home` },
    { key: 'skills', href: `/${locale}/skills` },
    { key: 'experience', href: `/${locale}/experience` },
    // { key: 'projects', href: `/${locale}/project` },
    { key: 'contact', href: `/${locale}/contact` },
  ]

  const isActive = (href: string) => {
    return pathname === href
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border-default">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
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

          {/* Navigation Menu */}
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

          {/* Theme & Language Switcher */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
              aria-label="Toggle theme"
              suppressHydrationWarning
            >
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

            {/* Language Switcher - Only show the inactive language */}
            <button
              onClick={() => switchLanguage(locale === 'vi' ? 'en' : 'vi')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors uppercase ${
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
    </header>
  )
}

export default React.memo(Header)
