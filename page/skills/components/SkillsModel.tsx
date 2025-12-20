'use client'

import { useRef, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SkillsModelProps {
  modelPath?: string
}

// Earth Planet Component - Enhanced with real Earth texture map
function EarthPlanet() {
  const earthRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const nightLightsRef = useRef<THREE.Mesh>(null)

  // Create procedural Earth texture with detailed continents map
  const earthTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    
    // Seeded random for consistency
    let seed = 12345
    const getRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
    
    // Base ocean color (deep blue gradient)
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    oceanGradient.addColorStop(0, '#1E3A8A') // Dark blue at poles
    oceanGradient.addColorStop(0.5, '#3B82F6') // Medium blue at equator
    oceanGradient.addColorStop(1, '#1E3A8A') // Dark blue at poles
    ctx.fillStyle = oceanGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add ocean depth variation
    for (let i = 0; i < 50; i++) {
      const x = getRandom() * canvas.width
      const y = getRandom() * canvas.height
      const radius = 50 + getRandom() * 200
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, 'rgba(30, 58, 138, 0.8)')
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
    }
    
    // Detailed continent shapes (more realistic)
    ctx.fillStyle = '#10B981' // Green for land
    ctx.strokeStyle = '#059669' // Darker green for borders
    ctx.lineWidth = 2
    
    // Asia (largest continent)
    ctx.beginPath()
    ctx.ellipse(400, 200, 350, 180, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    // Europe/Africa
    ctx.beginPath()
    ctx.ellipse(500, 300, 200, 250, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    // North America
    ctx.beginPath()
    ctx.ellipse(200, 150, 180, 200, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    // South America
    ctx.beginPath()
    ctx.ellipse(250, 400, 120, 250, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    // Australia
    ctx.beginPath()
    ctx.ellipse(600, 500, 100, 80, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    // Greenland
    ctx.beginPath()
    ctx.ellipse(300, 80, 60, 100, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    // Add some islands
    ctx.fillStyle = '#10B981'
    for (let i = 0; i < 20; i++) {
      const x = getRandom() * canvas.width
      const y = getRandom() * canvas.height
      const size = 5 + getRandom() * 15
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Add mountain ranges (darker green)
    ctx.fillStyle = '#047857'
    ctx.beginPath()
    ctx.ellipse(400, 200, 300, 20, 0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(200, 150, 150, 15, 0.2, 0, Math.PI * 2)
    ctx.fill()
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.anisotropy = 16
    return texture
  }, [])

  // Create night lights texture (city lights)
  const nightLightsTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    
    // Black background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Seeded random for consistency
    let seed = 54321
    const getRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
    
    // City lights (yellow/white dots)
    ctx.fillStyle = '#FFD700'
    const cityRegions = [
      { x: 400, y: 200, count: 50 }, // Asia
      { x: 500, y: 300, count: 40 }, // Europe/Africa
      { x: 200, y: 150, count: 30 }, // North America
      { x: 250, y: 400, count: 20 }, // South America
      { x: 600, y: 500, count: 15 }, // Australia
    ]
    
    cityRegions.forEach(region => {
      for (let i = 0; i < region.count; i++) {
        const x = region.x + (getRandom() - 0.5) * 200
        const y = region.y + (getRandom() - 0.5) * 200
        const size = 1 + getRandom() * 3
        const brightness = 0.5 + getRandom() * 0.5
        
        ctx.globalAlpha = brightness
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
        
        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3)
        gradient.addColorStop(0, `rgba(255, 215, 0, ${brightness})`)
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, size * 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#FFD700'
      }
    })
    
    ctx.globalAlpha = 1
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [])

  // Rotate Earth with different speeds for each layer
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (earthRef.current) {
      earthRef.current.rotation.y = time * 0.3
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = time * 0.25
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = time * 0.15
    }
    if (nightLightsRef.current) {
      nightLightsRef.current.rotation.y = time * 0.3
    }
  })

  return (
    <group>
      {/* Earth Sphere - Main body with detailed texture map */}
      <mesh ref={earthRef} position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[1.5, 128, 128]} />
        <meshStandardMaterial
          map={earthTexture || null}
          color={earthTexture ? undefined : '#4A90E2'}
          roughness={0.8}
          metalness={0.1}
          emissive="#1E3A8A"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Night side city lights - using procedural night texture */}
      <mesh ref={nightLightsRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.501, 128, 128]} />
        <meshStandardMaterial
          map={nightLightsTexture || null}
          emissiveMap={nightLightsTexture || null}
          emissive="#FFD700"
          emissiveIntensity={1.5}
          transparent
          opacity={nightLightsTexture ? 0.9 : 0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Clouds layer with animation */}
      <mesh ref={cloudsRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.52, 64, 64]} />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          alphaTest={0.1}
        />
      </mesh>

      {/* Atmosphere glow - multiple layers */}
      <mesh ref={atmosphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshBasicMaterial
          color="#3B82F6"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer atmosphere glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.65, 64, 64]} />
        <meshBasicMaterial
          color="#FF5FA2"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Specular highlights */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.1}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// Stars Component - Enhanced with twinkling effect like real night sky
function StarsField() {
  const starsRef = useRef<THREE.Points>(null)
  const starsDataRef = useRef<{
    baseSizes: Float32Array
    twinkleSpeeds: Float32Array
    twinkleOffsets: Float32Array
  } | null>(null)

  const stars = useMemo(() => {
    const count = 3000 // More stars for realistic night sky
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const colors = new Float32Array(count * 3)
    const twinkleSpeeds = new Float32Array(count)
    const twinkleOffsets = new Float32Array(count)

    // Use seeded random for consistency
    let seed = 98765
    const getRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    for (let i = 0; i < count; i++) {
      // Random position in large sphere (distant stars)
      const radius = 15 + getRandom() * 35
      const theta = getRandom() * Math.PI * 2
      const phi = Math.acos(getRandom() * 2 - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Varied star sizes - most small, some larger
      const baseSize = getRandom() < 0.9 ? getRandom() * 0.8 + 0.3 : getRandom() * 2 + 1.5
      sizes[i] = baseSize

      // Realistic star colors - white, blue-white, yellow, red
      const colorChoice = getRandom()
      let r = 1, g = 1, b = 1
      if (colorChoice > 0.85) {
        // Blue-white stars (hot)
        r = 0.7
        g = 0.85
        b = 1
      } else if (colorChoice > 0.70) {
        // White stars (most common)
        r = 1
        g = 1
        b = 1
      } else if (colorChoice > 0.50) {
        // Yellow-white stars
        r = 1
        g = 0.95
        b = 0.8
      } else if (colorChoice > 0.30) {
        // Yellow stars
        r = 1
        g = 0.9
        b = 0.6
      } else {
        // Red-orange stars (cool)
        r = 1
        g = 0.7
        b = 0.5
      }

      colors[i * 3] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b

      // Twinkling parameters - each star twinkles at different speed
      twinkleSpeeds[i] = 0.5 + getRandom() * 2 // Speed of twinkling
      twinkleOffsets[i] = getRandom() * Math.PI * 2 // Phase offset
    }

    // Store data in ref for useFrame access
    starsDataRef.current = {
      baseSizes: sizes,
      twinkleSpeeds,
      twinkleOffsets
    }

    return { positions, sizes, colors }
  }, [])

  useFrame((state) => {
    if (starsRef.current && starsDataRef.current) {
      const time = state.clock.elapsedTime
      const points = starsRef.current
      const data = starsDataRef.current
      
      // Slow rotation of star field
      points.rotation.y = time * 0.01
      
      // Twinkling effect - modify sizes based on time
      const geometry = points.geometry
      const sizeAttribute = geometry.attributes.size
      const sizes = sizeAttribute.array as Float32Array
      
      for (let i = 0; i < sizes.length; i++) {
        const twinkle = Math.sin(time * data.twinkleSpeeds[i] + data.twinkleOffsets[i]) * 0.3 + 0.7
        sizes[i] = data.baseSizes[i] * (0.5 + twinkle * 0.5)
      }
      
      sizeAttribute.needsUpdate = true
    }
  })

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[stars.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[stars.sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[stars.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        vertexColors
        transparent
        opacity={1}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// Moon component
function Moon() {
  const moonRef = useRef<THREE.Mesh>(null)
  const moonGroupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (moonGroupRef.current) {
      const time = state.clock.elapsedTime
      // Orbit around Earth
      const orbitRadius = 4
      moonGroupRef.current.position.x = Math.cos(time * 0.2) * orbitRadius
      moonGroupRef.current.position.z = Math.sin(time * 0.2) * orbitRadius
    }
    if (moonRef.current) {
      // Rotate moon on its axis
      moonRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={moonGroupRef}>
      <mesh ref={moonRef} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#C0C0C0"
          emissive="#E0E0E0"
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>
      {/* Moon glow */}
      <mesh>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// Orbiting satellite component - Enhanced
function OrbitingElement({ 
  angle, 
  radius, 
  speed, 
  size, 
  color, 
  index 
}: { 
  angle: number
  radius: number
  speed: number
  size: number
  color: string
  index: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  const trailRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime
      const currentAngle = angle + time * speed
      ref.current.position.x = Math.cos(currentAngle) * radius
      ref.current.position.z = Math.sin(currentAngle) * radius
      ref.current.position.y = Math.sin(time * 2 + index) * 0.5
      ref.current.rotation.x += 0.02
      ref.current.rotation.y += 0.02
      ref.current.rotation.z += 0.01
    }
    if (trailRef.current) {
      const time = state.clock.elapsedTime
      const currentAngle = angle + time * speed
      trailRef.current.position.x = Math.cos(currentAngle) * radius
      trailRef.current.position.z = Math.sin(currentAngle) * radius
      trailRef.current.position.y = Math.sin(time * 2 + index) * 0.5
    }
  })

  return (
    <group>
      {/* Main satellite */}
      <mesh ref={ref}>
        <octahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.0}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      {/* Glow trail */}
      <mesh ref={trailRef}>
        <octahedronGeometry args={[size * 0.6, 0]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// Orbiting satellites/moons
function OrbitingElements() {
  const elements = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      angle: (i / 6) * Math.PI * 2,
      radius: 3 + (i % 2) * 0.5,
      speed: 0.3 + (i % 3) * 0.1,
      size: 0.1 + (i % 2) * 0.05,
      color: i % 2 === 0 ? '#FF5FA2' : '#3B82F6',
    }))
  }, [])

  return (
    <>
      {elements.map((element, i) => (
        <OrbitingElement
          key={i}
          angle={element.angle}
          radius={element.radius}
          speed={element.speed}
          size={element.size}
          color={element.color}
          index={i}
        />
      ))}
    </>
  )
}

// Floating particles component
function FloatingParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      angle: (i / 12) * Math.PI * 2,
      radius: 4 + (i % 3) * 0.3,
      speed: 0.2 + (i % 2) * 0.1,
      color: i % 3 === 0 ? '#FF5FA2' : i % 3 === 1 ? '#3B82F6' : '#FFB3D5',
    }))
  }, [])

  return (
    <>
      {particles.map((particle, i) => (
        <FloatingParticle
          key={`particle-${i}`}
          angle={particle.angle}
          radius={particle.radius}
          speed={particle.speed}
          color={particle.color}
          index={i}
        />
      ))}
    </>
  )
}

function FloatingParticle({
  angle,
  radius,
  speed,
  color,
  index,
}: {
  angle: number
  radius: number
  speed: number
  color: string
  index: number
}) {
  const particleRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (particleRef.current) {
      const time = state.clock.elapsedTime
      const currentAngle = angle + time * speed
      particleRef.current.position.x = Math.cos(currentAngle) * radius
      particleRef.current.position.z = Math.sin(currentAngle) * radius
      particleRef.current.position.y = Math.sin(time * 3 + index) * 1
      particleRef.current.rotation.x += 0.02
      particleRef.current.rotation.y += 0.02
    }
  })

  return (
    <mesh ref={particleRef}>
      <octahedronGeometry args={[0.08, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

export default function SkillsModel({ modelPath = '/models/girl-typing.glb' }: SkillsModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  
  // Always render Earth and Stars scene
  // If you want to use a custom model, uncomment and add the model file
  // const gltf = useGLTF(modelPath, true)
  // const { scene, animations } = gltf
  // const { actions } = useAnimations(animations, groupRef)

  // Smooth rotation animation for group
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
  })

  // Earth and Stars Scene
  return (
    <group ref={groupRef}>
      {/* Stars field background */}
      <StarsField />

      {/* Earth Planet */}
      <EarthPlanet />

      {/* Moon */}
      <Moon />

      {/* Orbiting elements */}
      <OrbitingElements />

      {/* Additional floating particles */}
      <FloatingParticles />
    </group>
  )
}

