'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useRef, useMemo, useState, useEffect } from 'react'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'


// OPTIMIZED: Giảm số lượng particles
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const count = 12 // Giảm xuống 12 để nhẹ hơn
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 5 + (i % 3) * 1.5 // Giảm radius
      const height = Math.sin(angle * 2) * 2 // Giảm height
      
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = height
      positions[i * 3 + 2] = Math.sin(angle) * radius
      
      const color = i % 2 === 0 ? new THREE.Color('#FF5FA2') : new THREE.Color('#3B82F6')
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    
    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05 // Chậm hơn
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08} // Giảm size
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// OPTIMIZED: Grid đơn giản hơn
function AnimatedGrid() {
  const gridRef = useRef<THREE.GridHelper>(null)
  
  useFrame((state) => {
    if (gridRef.current) {
      const material = gridRef.current.material as THREE.Material
      if ('opacity' in material) {
        material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
      }
    }
  })

  return (
    <gridHelper
      ref={gridRef}
      args={[20, 20, '#FF5FA2', '#3B82F6']}
      position={[0, -2, 0]}
    />
  )
}

// OPTIMIZED: Loading component
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#FF5FA2" wireframe />
    </mesh>
  )
}

export default function SkillsScene() {
  const [dpr, setDpr] = useState(1)

  // OPTIMIZED: Điều chỉnh DPR dựa trên kích thước màn hình - thấp hơn cho mobile
  useEffect(() => {
    const updateDpr = () => {
      if (window.innerWidth < 640) {
        setDpr(0.75) // XS: DPR rất thấp
      } else if (window.innerWidth < 768) {
        setDpr(1) // SM: DPR thấp
      } else if (window.innerWidth < 1024) {
        setDpr(1.25) // MD: DPR trung bình thấp
      } else {
        setDpr(Math.min(window.devicePixelRatio, 1.5)) // LG+: tối đa 1.5
      }
    }

    updateDpr()
    window.addEventListener('resize', updateDpr)
    return () => window.removeEventListener('resize', updateDpr)
  }, [])

  return (
    <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden border border-border-default bg-bg-card shadow-2xl relative group">
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-bg-card/60 via-transparent to-transparent opacity-40 z-10" />
      
      <Canvas 
        shadows 
        dpr={dpr}
        gl={{ 
          antialias: dpr > 1, // Chỉ bật antialias khi DPR cao
          powerPreference: 'high-performance',
          alpha: false,
        }}
        performance={{ min: 0.5 }} // Tự động giảm chất lượng khi lag
      >
        <Suspense fallback={<LoadingFallback />}>
          <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />

          {/* OPTIMIZED: Lighting đơn giản hơn */}
          <ambientLight intensity={0.6} />
          
          <directionalLight 
            position={[5, 8, 5]} 
            intensity={1} 
            castShadow
            shadow-mapSize-width={1024} // Giảm từ 2048
            shadow-mapSize-height={1024}
            shadow-camera-far={30}
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-8}
          />
          
          {/* Giảm số lượng point lights */}
          <pointLight 
            position={[-4, 4, 3]} 
            intensity={1} 
            color="#FF5FA2"
            distance={12}
          />
          <pointLight 
            position={[4, 4, -3]} 
            intensity={1} 
            color="#3B82F6"
            distance={12}
          />

          {/* Ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <shadowMaterial opacity={0.25} />
          </mesh>

          {/* Animated grid */}
          <AnimatedGrid />

          {/* Floating particles */}
          <FloatingParticles />

          

          <Environment preset="city" />

          {/* OPTIMIZED: Chỉ dùng Bloom, loại bỏ các effects nặng khác */}
          <EffectComposer multisampling={dpr > 1 ? 8 : 0}>
            <Bloom 
              intensity={1.2}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.7}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>

        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5} // Chậm hơn
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          maxDistance={8}
          minDistance={3}
          enableDamping
          dampingFactor={0.08}
          makeDefault
        />
      </Canvas>

      {/* Loading indicator */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
        <div className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-bg-card/80 backdrop-blur-sm border border-border-default text-xs text-text-secondary">
          <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-pink-1 mr-1.5 sm:mr-2 animate-pulse" />
          3D Scene
        </div>
      </div>
    </div>
  )
}