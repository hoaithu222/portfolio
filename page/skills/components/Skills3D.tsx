'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { memo } from 'react'

interface FloatingSkillIconProps {
  position: [number, number, number]
  color: string
  speed: number
}

const FloatingSkillIcon = memo(function FloatingSkillIcon({ 
  position, 
  color, 
  speed 
}: FloatingSkillIconProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const initialY = position[1]

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      meshRef.current.position.y = initialY + Math.sin(time * speed + position[0]) * 0.3
      meshRef.current.rotation.x += 0.005 * speed
      meshRef.current.rotation.y += 0.005 * speed
      meshRef.current.rotation.z += 0.002 * speed
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.15, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
})

function Skills3DScene() {
  const particles = useMemo(() => {
    const count = 25
    const positions: Array<[number, number, number]> = []
    const colors = ['#FF5FA2', '#3B82F6', '#FFB3D5', '#93C5FD']
    const speeds: number[] = []

    // Use seeded random for consistent results
    let seed = 12345
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    for (let i = 0; i < count; i++) {
      positions.push([
        (random() - 0.5) * 15,
        (random() - 0.5) * 10,
        (random() - 0.5) * 8 - 3,
      ])
      speeds.push(0.3 + random() * 0.4)
    }

    return { positions, colors, speeds }
  }, [])

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[8, 8, 8]} intensity={1.2} color="#FF5FA2" />
      <pointLight position={[-8, -8, -8]} intensity={1.2} color="#3B82F6" />
      {particles.positions.map((pos, i) => (
        <FloatingSkillIcon
          key={`skill-particle-${i}`}
          position={pos}
          color={particles.colors[i % particles.colors.length]}
          speed={particles.speeds[i]}
        />
      ))}
    </>
  )
}

export default memo(function Skills3D() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-20">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 75 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 2]}
      >
        <Skills3DScene />
      </Canvas>
    </div>
  )
})

