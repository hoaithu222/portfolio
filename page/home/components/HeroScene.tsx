import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import { Suspense } from 'react'
import PlanetsAndStars from './PlanetsAndStars'
import { Canvas,  } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import AvatarModel from './AvatarModel'
import { Environment, PerspectiveCamera } from '@react-three/drei'

export default function HeroScene() {
  return (
    <div className="w-full h-full relative">
      <Canvas shadows camera={{ position: [0, 1.0, 4.5], fov: 55 }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1.0, 4.5]} fov={55} />

          <PlanetsAndStars />

          {/* Lighting – tăng intensity cho bloom mạnh hơn */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 3, 3]} intensity={1.5} castShadow />
          <pointLight position={[-3, 2, 2]} intensity={1.0} color="#FF5FA2" />
          <pointLight position={[3, 2, -2]} intensity={1.0} color="#3B82F6" />

          <AvatarModel />

          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            target={[0, 0.8, 0]}
          />

          <Environment preset="night" /> {/* Đổi từ city sang night để background tối hơn, stars nổi bật */}

          {/* POST-PROCESSING – Đây là phần làm scene đẹp hẳn lên */}
          <EffectComposer>
            <Bloom 
              intensity={1.2}          // Độ mạnh glow
              luminanceThreshold={0.1} // Ngưỡng để phát sáng (thấp hơn = glow nhiều hơn)
              luminanceSmoothing={0.9}
              radius={0.8}
            />
            <Noise opacity={0.02} />   
            <Vignette offset={0.1} darkness={0.4} /> 
          </EffectComposer>
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30 pointer-events-none" />
    </div>
  )
}