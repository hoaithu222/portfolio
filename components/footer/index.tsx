'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

const Footer = () => {
  const t = useTranslations('footer')

  return (
    <footer className="w-full py-4 border-t border-border-default bg-bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-text-muted">
          {t('copyright') || '© 2025 Portfolio. All rights reserved.'}
        </p>
      </div>
    </footer>
  )
}

export default React.memo(Footer)
