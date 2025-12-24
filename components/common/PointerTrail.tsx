'use client'

import { useEffect, useRef } from 'react'

export default function HeartGradientTrail() {
  const trailRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches

    if (prefersReducedMotion || isCoarsePointer) return

    const trailCount = 20
    const positions = Array.from({ length: trailCount }, () => ({ x: -999, y: -999 }))

    let rafId = 0
    let renderId = 0

    const updatePosition = (x: number, y: number) => {
      positions.unshift({ x, y })
      if (positions.length > trailCount) positions.pop()
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        updatePosition(event.clientX, event.clientY)
        rafId = 0
      })
    }

    const handlePointerLeave = () => {
      positions.fill({ x: -999, y: -999 })
      trailRefs.current.forEach((trail) => {
        if (trail) trail.style.opacity = '0'
      })
    }

    const renderTrail = () => {
      trailRefs.current.forEach((trailEl, idx) => {
        if (!trailEl) return
        const pos = positions[idx]
        // Giữ nguyên logic hiệu ứng chuyển động cũ
        const opacity = Math.max(0, 1 - idx * 0.06)
        const scale = 1 - idx * 0.03
        
        trailEl.style.left = `${pos.x}px`
        trailEl.style.top = `${pos.y}px`
        trailEl.style.transform = `translate(-50%, -50%) scale(${scale})`
        trailEl.style.opacity = pos.x === -999 ? '0' : `${opacity}`
      })
      renderId = window.requestAnimationFrame(renderTrail)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)

    renderId = window.requestAnimationFrame(renderTrail)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      if (rafId) window.cancelAnimationFrame(rafId)
      if (renderId) window.cancelAnimationFrame(renderId)
    }
  }, [])

  // Định nghĩa hình trái tim dạng SVG để làm mặt nạ (mask)
  const heartPath = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
  const heartMask = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='${heartPath}' /></svg>")`;

  return (
    <>
      {[...Array(20)].map((_, idx) => {
        // Giữ nguyên logic kích thước và màu sắc cũ
        const size = 140 - idx * 5
        const opacityStart = 0.25 - idx * 0.01
        const opacityMid = 0.15 - idx * 0.007
        
        // LƯU Ý: Giảm độ blur xuống một chút so với bản gốc (từ 24px xuống 12px)
        // Vì nếu blur quá lớn, hình trái tim sẽ bị nhòe thành hình tròn
        const blurAmount = Math.max(0, 12 - idx * 0.5);

        return (
          <div
            key={idx}
            ref={(el) => { trailRefs.current[idx] = el }}
            className="pointer-events-none"
            style={{
              position: 'fixed',
              width: `${size}px`,
              height: `${size}px`,
              // Thay vì borderRadius, ta dùng mask-image để cắt hình trái tim
              maskImage: heartMask,
              WebkitMaskImage: heartMask,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
              
              // GIỮ NGUYÊN MÀU SẮC GỐC
              background: `radial-gradient(circle at center, 
                rgba(255, 95, 162, ${opacityStart}), 
                rgba(147, 51, 234, ${opacityMid}) 40%,
                rgba(59, 130, 246, ${opacityMid * 0.6}) 65%, 
                transparent 85%)`,
              
              filter: `blur(${blurAmount}px)`, // Blur nhẹ hơn để giữ dáng tim
              opacity: 0,
              transform: 'translate(-50%, -50%)',
              left: '0px',
              top: '0px',
              zIndex: 9999,
              mixBlendMode: 'screen',
              willChange: 'transform, opacity, left, top',
            }}
          />
        )
      })}
    </>
  )
}