'use client'

import HeroInfo from '@/page/home/components/HeroInfo'
import ServicesSection from '@/page/home/components/ServicesSection'
import Image from 'next/image'
import HorizontalTextScroll from '@/components/common/HorizontalTextScroll'
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

            {/* Right: Avatar Image */}
            <div className="order-1 lg:order-2 flex items-center justify-center">
              <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
                {/* Animated glow background */}
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-pink-1/40 via-brand-blue-1/40 to-brand-pink-1/40 rounded-full blur-2xl animate-pulse opacity-75" />
                
                {/* Pink glow effect */}
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-brand-pink-1/30 rounded-full blur-3xl animate-blob" />
                
                {/* Blue glow effect */}
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-brand-blue-1/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
                
                {/* Outer glowing border */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-pink-1 via-brand-blue-1 to-brand-pink-1 p-1 opacity-75 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, rgba(255, 95, 162, 0.8), rgba(59, 130, 246, 0.8), rgba(255, 95, 162, 0.8))' }} />
                
                {/* Main avatar container */}
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-2 border-border-default/60 bg-gradient-to-br from-bg-card/80 to-bg-secondary/50 backdrop-blur-md group">
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-pink-1/20 via-transparent to-brand-blue-1/20 rounded-full pointer-events-none" />
                  
                  {/* Avatar Image */}
                  <Image
                    src="/image/me.png"
                    alt="Avatar"
                    fill
                    className="object-cover object-center transition-transform duration-700 rounded-full"
                    priority
                    quality={90}
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-pink-1/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scrolling Text */}
      <HorizontalTextScroll />

      {/* Services Section */}
      <ServicesSection />
    </div>
  )
}

export default React.memo(HomePage)