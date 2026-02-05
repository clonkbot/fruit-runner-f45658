import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

interface PlayerProps {
  isJumping: boolean
}

export default function Player({ isJumping }: PlayerProps) {
  const wingRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Wing flapping animation
    if (wingRef.current) {
      const flapSpeed = isJumping ? 15 : 8
      wingRef.current.rotation.z = Math.sin(time * flapSpeed) * 0.4
    }

    // Glow pulsing
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.3 + Math.sin(time * 3) * 0.15
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        {/* Body - tropical bird shape */}
        <mesh castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="#ff6b35"
            emissive="#ff4500"
            emissiveIntensity={0.3}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Head */}
        <mesh position={[0, 0.35, 0.3]} castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color="#ffeb3b"
            emissive="#ffd700"
            emissiveIntensity={0.2}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Beak */}
        <mesh position={[0, 0.3, 0.55]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.12, 0.3, 8]} />
          <meshStandardMaterial color="#ff3366" emissive="#ff1493" emissiveIntensity={0.3} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.12, 0.45, 0.45]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.12, 0.45, 0.45]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.12, 0.45, 0.5]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh position={[0.12, 0.45, 0.5]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Wings */}
        <group ref={wingRef}>
          {/* Left wing */}
          <mesh position={[-0.5, 0.1, 0]} rotation={[0, 0, 0.5]} castShadow>
            <boxGeometry args={[0.5, 0.1, 0.4]} />
            <meshStandardMaterial
              color="#00ffcc"
              emissive="#00ff88"
              emissiveIntensity={0.4}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
          {/* Right wing */}
          <mesh position={[0.5, 0.1, 0]} rotation={[0, 0, -0.5]} castShadow>
            <boxGeometry args={[0.5, 0.1, 0.4]} />
            <meshStandardMaterial
              color="#00ffcc"
              emissive="#00ff88"
              emissiveIntensity={0.4}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        </group>

        {/* Tail feathers */}
        <mesh position={[0, 0, -0.5]} rotation={[0.5, 0, 0]} castShadow>
          <boxGeometry args={[0.3, 0.05, 0.4]} />
          <meshStandardMaterial
            color="#ff00aa"
            emissive="#ff0088"
            emissiveIntensity={0.4}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>

        {/* Glow effect */}
        <mesh ref={glowRef} scale={1.5}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial
            color="#ff6b35"
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    </Float>
  )
}
