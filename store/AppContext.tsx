'use client'

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react'
import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'

interface AppState {
  theme: string | undefined
  locale: string
  isLoading: boolean
}

interface AppContextType {
  state: AppState
  setTheme: (theme: string) => void
  switchLanguage: (newLocale: 'en' | 'vi') => void
  setIsLoading: (loading: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppStoreProvider({ 
  children, 
  locale: initialLocale 
}: { 
  children: ReactNode
  locale: string
}) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(false)

  // Derive locale from pathname
  const locale = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    return segments[0] && ['en', 'vi'].includes(segments[0]) ? segments[0] : initialLocale
  }, [pathname, initialLocale])

  const switchLanguage = (newLocale: 'en' | 'vi') => {
    if (newLocale === locale) return
    
    setIsLoading(true)
    
    // Replace the locale part of the pathname
    const segments = pathname.split('/').filter(Boolean)
    if (segments[0] && ['en', 'vi'].includes(segments[0])) {
      segments[0] = newLocale
    } else {
      segments.unshift(newLocale)
    }
    const newPath = '/' + segments.join('/')
    
    // Use router.push() to navigate without full page reload
    router.push(newPath)
    
    // Reset loading state after a short delay
    setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }

  const value = {
    state: {
      theme,
      locale,
      isLoading
    },
    setTheme,
    switchLanguage,
    setIsLoading
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppStore() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppStoreProvider')
  }
  return context
}
