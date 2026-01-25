'use client'

import { useRef, useMemo, memo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function VisibilityInvalidate() {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible') invalidate()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [invalidate])
  return null
}

const FloatingParticle = memo(function FloatingParticle({ 
  position, 
  color 
}: { 
  position: [number, number, number]
  color: string 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const initialY = position[1]

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      meshRef.current.position.y = initialY + Math.sin(time * 0.5 + position[0]) * 0.5
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.1, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
})

function ParticlesScene() {
  const particles = useMemo(() => {
    const count = 20 // Giảm số lượng particles để tối ưu performance
    const positions: Array<[number, number, number]> = []
    const colors = ['#FF5FA2', '#3B82F6']

    for (let i = 0; i < count; i++) {
      positions.push([
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10 - 5,
      ])
    }

    return { positions, colors }
  }, [])

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#FF5FA2" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#3B82F6" />
      {particles.positions.map((pos, i) => (
        <FloatingParticle
          key={`particle-${i}`}
          position={pos}
          color={particles.colors[i % particles.colors.length]}
        />
      ))}
    </>
  )
}

export default memo(function ServicesBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-30">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 2]} // Tối ưu DPR
      >
        <VisibilityInvalidate />
        <ParticlesScene />
      </Canvas>
    </div>
  )
})

