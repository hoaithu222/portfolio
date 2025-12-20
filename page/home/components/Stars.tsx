'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Component tạo các ngôi sao bay bay
function Stars() {
  const ref = useRef<THREE.Points>(null)
  
  // Tạo 1000 ngôi sao với vị trí ngẫu nhiên
  const particles = useMemo(() => {
    const count = 1000
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      // Vị trí ngẫu nhiên trong không gian 3D
      positions[i * 3] = (Math.random() - 0.5) * 20     // X
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20 // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 // Z
      
      // Kích thước ngẫu nhiên cho mỗi ngôi sao
      sizes[i] = Math.random() * 2 + 0.5
    }
    
    return { positions, sizes }
  }, [])
  
  // Animation: làm ngôi sao di chuyển và nhấp nháy
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime
      
      // Di chuyển các ngôi sao theo hướng Z (về phía camera)
      const positions = ref.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < positions.length; i += 3) {
        // Di chuyển về phía trước
        positions[i + 2] += 0.01
        
        // Nếu ngôi sao đi quá xa, đặt lại phía sau
        if (positions[i + 2] > 10) {
          positions[i + 2] = -10
          positions[i] = (Math.random() - 0.5) * 20
          positions[i + 1] = (Math.random() - 0.5) * 20
        }
      }
      
      ref.current.geometry.attributes.position.needsUpdate = true
      
      // Xoay toàn bộ hệ thống ngôi sao
      ref.current.rotation.y = time * 0.05
    }
  })
  
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.sizes.length}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#FFFFFF"
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default Stars

