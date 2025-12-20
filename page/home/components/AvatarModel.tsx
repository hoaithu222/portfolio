'use client'

import { useGLTF, useAnimations } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'



export default function AvatarModel() {
  // Tải model GLB từ Ready Player Me
  // Tham số thứ hai là true: cho phép tải cross-origin (CORS)
  const { scene, animations } = useGLTF(
    'https://models.readyplayer.me/694579420893b427eadc4005.glb',
    true
  )

  // Lấy các actions điều khiển animation từ model
  const { actions } = useAnimations(animations, scene)

  // Tính toán và căn giữa model để hiển thị đầy đủ từ đầu đến chân
  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      
      console.log('Model bounds:', {
        min: box.min,
        max: box.max,
        center: center,
        size: size
      })
      
      // Điều chỉnh scale để fit toàn bộ model trong view (bao gồm chân)
      // Ưu tiên fit theo chiều cao (Y) để đảm bảo thấy đầy đủ
      const targetHeight = 2.5 // Chiều cao mục tiêu để fit toàn bộ
      const scale = size.y > targetHeight ? targetHeight / size.y : 1
      
      scene.scale.setScalar(scale)
      
      // Căn giữa hoàn toàn - không nâng lên để thấy đầy đủ từ đầu đến chân
      scene.position.sub(center.multiplyScalar(scale))
      
      console.log('Model adjusted:', {
        scale: scale,
        position: scene.position,
        finalSize: {
          x: size.x * scale,
          y: size.y * scale,
          z: size.z * scale
        }
      })
    }
  }, [scene])

  // Effect chạy khi actions hoặc animations sẵn sàng - Tìm và phát animation vẫy tay
  useEffect(() => {
    if (!animations || !actions) return
 
    
    // Tìm tất cả các animation có thể là vẫy tay
    const waveKeywords = ['wave', 'Wave', 'hand', 'Hand', 'waving', 'Waving', 'hi', 'Hi', 'hello', 'Hello']
    
    // Ưu tiên 1: Tìm animation có tên chính xác "Wave"
    let waveAction = actions.Wave
    
    // Ưu tiên 2: Tìm animation có tên chứa từ khóa vẫy tay
    if (!waveAction) {
      const waveAnimations = Object.entries(actions).find(([name]) => 
        waveKeywords.some(keyword => name.includes(keyword))
      )
      if (waveAnimations && waveAnimations[1]) {
        waveAction = waveAnimations[1]
        console.log('Found wave animation:', waveAnimations[0])
      }
    }
    
    // Phát animation vẫy tay nếu tìm thấy
    if (waveAction) {
      console.log('Playing wave animation')
      waveAction
        .reset()
        .fadeIn(0.5)
        .setLoop(THREE.LoopRepeat, Infinity)
        .play()
    } 
    // Nếu không tìm thấy, thử phát animation đầu tiên
    else if (animations.length > 0) {
      const firstAction = Object.values(actions)[0]
      if (firstAction) {
        console.log('Playing first available animation:', animations[0].name)
        firstAction
          .reset()
          .fadeIn(0.5)
          .setLoop(THREE.LoopRepeat, Infinity)
          .play()
      }
    } else {
      console.warn('No animations found in model')
    }
  }, [actions, animations])

  return (
    <primitive 
      object={scene}   
      scale={[1.5, 1.5, 1.5]}                       // Tỷ lệ phóng to/thu nhỏ (1 = kích thước gốc)
      position={[0, 0, 0]}            // Căn giữa: không dịch chuyển
      rotation={[0, 0, 0]}            // Xoay theo trục X, Y, Z (đơn vị radian) - ở đây không xoay
    />
  )
}

