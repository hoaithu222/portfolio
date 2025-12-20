'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function PlanetsAndStars() {
  const starsRef = useRef<THREE.Points>(null)
  const planetsRef = useRef<THREE.Group>(null)
  const ringsRef = useRef<THREE.Group>(null) // Group riêng cho rings xoay nhanh hơn
  const baseSizesRef = useRef<Float32Array | null>(null)

  // Ngôi sao: Tăng số lượng lên 1500, nhấp nháy đa dạng + có ngôi sao lớn (flare)
  const stars = useMemo(() => {
    const count = 300
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const baseSizes = new Float32Array(count)

    let seed = 12345
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    for (let i = 0; i < count; i++) {
      // Phân bố rộng hơn, sâu hơn
      const radius = random() * 30
      const theta = random() * Math.PI * 2
      const phi = Math.acos(random() * 2 - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5 // Làm phẳng Y nhẹ
      positions[i * 3 + 2] = -random() * 20 - 5 // Phía sau

      // Kích thước đa dạng: hầu hết nhỏ, vài cái lớn để tạo flare
      const baseSize = random() < 0.95 ? random() * 0.8 + 0.3 : random() * 3 + 2 // 5% ngôi sao lớn
      sizes[i] = baseSize
      baseSizes[i] = baseSize
    }

    return { positions, sizes, baseSizes }
  }, [])

  useEffect(() => {
    if (stars.baseSizes) baseSizesRef.current = stars.baseSizes
  }, [stars.baseSizes])

  // Hành tinh: Thêm orbit distance để di chuyển nhẹ
  const planets = useMemo(() => {
    return [
      { position: [-8, 3, -10], orbitRadius: 12, size: 0.9, color: '#FF6B9D' },
      { position: [7, -1, -12], orbitRadius: 14, size: 0.7, color: '#60A5FA' },
      { position: [-6, -4, -9], orbitRadius: 10, size: 0.6, color: '#FFB3D5' },
      { position: [9, 4, -15], orbitRadius: 16, size: 1.1, color: '#93C5FD' },
      { position: [0, 6, -18], orbitRadius: 20, size: 0.5, color: '#FF87BA' }, // Thêm 1 cái nữa cho vui
    ]
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Ngôi sao nhấp nháy đa tầng (nhanh + chậm) để sinh động
    if (starsRef.current && baseSizesRef.current) {
      const sizes = starsRef.current.geometry.attributes.size.array as Float32Array
      const baseSizes = baseSizesRef.current

      for (let i = 0; i < sizes.length; i++) {
        // Kết hợp 2 sóng sin khác tần số + offset riêng
        const fastTwinkle = Math.sin(time * 4 + i * 0.2) * 0.3
        const slowTwinkle = Math.sin(time * 0.8 + i * 0.05) * 0.2
        const twinkle = 0.7 + fastTwinkle + slowTwinkle // Từ ~0.4 đến 1.2
        sizes[i] = baseSizes[i] * twinkle
      }
      starsRef.current.geometry.attributes.size.needsUpdate = true
    }

    // Hành tinh: Xoay bản thân + orbit chậm + rings xoay nhanh riêng
    if (planetsRef.current && ringsRef.current) {
      planetsRef.current.children.forEach((planetGroup: any, index) => {
        const p = planets[index]
        // Orbit chậm quanh trục Y
        const orbitAngle = time * 0.1 + index * 1.5
        planetGroup.position.x = Math.sin(orbitAngle) * p.orbitRadius
        planetGroup.position.z = Math.cos(orbitAngle) * p.orbitRadius - 12 // Giữ phía sau

        // Xoay bản thân
        planetGroup.rotation.y = time * (0.3 + index * 0.1)
      })

      // Rings xoay nhanh hơn, ngược chiều
      ringsRef.current.children.forEach((ring: any, index) => {
        ring.rotation.z = time * (1.5 + index * 0.3) * -1
      })
    }
  })

  return (
    <group>
      {/* Ngôi sao - dùng AdditiveBlending + size lớn hơn để glow mạnh với Bloom */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={stars.positions.length / 3} array={stars.positions} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={stars.sizes.length} array={stars.sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          size={0.25} // Tăng size gốc để glow to hơn
          color="#FFFFFF"
          transparent
          opacity={0.95}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false} // Tránh z-fighting
        />
      </points>

      {/* Hành tinh group */}
      <group ref={planetsRef}>
        {planets.map((planet, index) => (
          <group key={index} position={[planet.position[0], planet.position[1], planet.position[2]]}>
            {/* Planet core - tăng emissive cho glow */}
            <mesh>
              <sphereGeometry args={[planet.size, 64, 64]} />
              <meshStandardMaterial
                color={planet.color}
                emissive={planet.color}
                emissiveIntensity={0.8} // Tăng mạnh để Bloom bắt glow
                metalness={0.4}
                roughness={0.5}
              />
            </mesh>

            {/* Atmosphere halo (glow ngoài) - rất đẹp với Bloom */}
            <mesh scale={[1.2, 1.2, 1.2]}>
              <sphereGeometry args={[planet.size, 32, 32]} />
              <meshBasicMaterial
                color={planet.color}
                transparent
                opacity={0.2}
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Rings - group riêng để xoay độc lập */}
            <group ref={ringsRef}>
              <mesh rotation={[Math.PI / 2.2, 0.2, 0.3]}> {/* Nghiêng rings cho sinh động */}
                <torusGeometry args={[planet.size * 1.6, 0.03, 16, 120]} />
                <meshStandardMaterial
                  color={planet.color}
                  emissive={planet.color}
                  emissiveIntensity={1.2}
                  transparent
                  opacity={0.8}
                  side={THREE.DoubleSide}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  )
}

export default PlanetsAndStars