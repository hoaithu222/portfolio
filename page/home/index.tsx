'use client'

import HeroInfo from '@/page/home/components/HeroInfo'
import HeroScene from '@/page/home/components/HeroScene'
import ServicesSection from '@/page/home/components/ServicesSection'
import React from 'react'

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary py-20">
        {/* Background Gradient Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-pink-1/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue-1/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Left: Hero Info */}
            <div className="order-2 lg:order-1 flex items-center">
              <div className="w-full">
                <HeroInfo />
              </div>
            </div>

            {/* Right: 3D Avatar Scene */}
            <div className="order-1 lg:order-2 h-[400px] md:h-[500px] lg:h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl border border-border-default bg-bg-card relative">
              <HeroScene />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />
    </div>
  )
}

export default React.memo(HomePage)