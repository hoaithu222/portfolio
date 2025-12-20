'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useRef, useMemo } from 'react'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import SkillsModel from './SkillsModel'

// Floating particles around the scene
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const count = 50
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    // Generate positions and colors with deterministic pattern
    for (let i = 0; i < count; i++) {
      // Use index-based calculation for deterministic results
      const angle = (i / count) * Math.PI * 2
      const radius = 5 + (i % 3) * 2
      const height = Math.sin(angle * 2) * 3
      
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
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1
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
        size={0.1}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Animated grid floor
function AnimatedGrid() {
  const gridRef = useRef<THREE.GridHelper>(null)
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.material.opacity = 0.2 + Math.sin(state.clock.elapsedTime) * 0.1
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

export default function SkillsScene() {
  return (
    <div className="h-[500px] md:h-[600px] w-full rounded-2xl overflow-hidden border border-border-default bg-bg-card shadow-2xl relative group">
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-bg-card/80 via-transparent to-transparent opacity-50 z-10" />
      
      <Canvas shadows camera={{ position: [0, 1, 5], fov: 50 }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />

          {/* Modern lighting setup - neon vibe */}
          <ambientLight intensity={0.8} />
          
          {/* Main directional light with shadows */}
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={1.2} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          
          {/* Colored accent lights */}
          <pointLight 
            position={[-5, 5, 3]} 
            intensity={1.5} 
            color="#FF5FA2"
            distance={15}
            decay={2}
          />
          <pointLight 
            position={[5, 5, -3]} 
            intensity={1.5} 
            color="#3B82F6"
            distance={15}
            decay={2}
          />
          
          {/* Rim light for depth */}
          <pointLight 
            position={[0, 3, -5]} 
            intensity={0.8} 
            color="#FFFFFF"
            distance={12}
            decay={2}
          />

          {/* Ground plane for shadows */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <shadowMaterial opacity={0.3} />
          </mesh>

          {/* Animated grid */}
          <AnimatedGrid />

          {/* Floating particles */}
          <FloatingParticles />

          {/* Main model */}
          <SkillsModel />

          <Environment preset="city" />

          {/* Advanced post-processing */}
          <EffectComposer>
            <Bloom 
              intensity={1.8}
              luminanceThreshold={0.05}
              luminanceSmoothing={0.9}
              radius={0.9}
            />
            <DepthOfField 
              focusDistance={0}
              focalLength={0.02}
              bokehScale={4}
              height={480}
            />
            <ChromaticAberration
              offset={[0.001, 0.001]}
            />
            <Vignette 
              offset={0.1} 
              darkness={0.5}
            />
          </EffectComposer>
        </Suspense>

        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          maxDistance={8}
          minDistance={3}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Loading indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className="px-3 py-1.5 rounded-full bg-bg-card/80 backdrop-blur-sm border border-border-default text-xs text-text-secondary">
          <span className="inline-block w-2 h-2 rounded-full bg-brand-pink-1 mr-2 animate-pulse" />
          3D Scene
        </div>
      </div>
    </div>
  )
}
