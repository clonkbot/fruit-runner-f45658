import { useMemo } from 'react'
import * as THREE from 'three'

interface ObstacleProps {
  position: [number, number, number]
  type: 'pillar' | 'gap' | 'low' | 'high'
}

export default function Obstacle({ position, type }: ObstacleProps) {
  const color = useMemo(() => {
    const colors = ['#ff00aa', '#00ffcc', '#ff6b35', '#ffeb3b']
    return colors[Math.floor(Math.random() * colors.length)]
  }, [])

  if (type === 'pillar') {
    return (
      <group position={position}>
        {/* Main pillar */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 8, 1]} />
          <meshStandardMaterial
            color="#2a1a4a"
            emissive={color}
            emissiveIntensity={0.2}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Glowing edges */}
        <mesh position={[0, 0, 0.51]}>
          <boxGeometry args={[2.1, 8.1, 0.05]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
        {/* Warning stripes */}
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[0, -3 + i * 2, 0.52]}>
            <boxGeometry args={[2, 0.3, 0.02]} />
            <meshBasicMaterial color={color} />
          </mesh>
        ))}
      </group>
    )
  }

  if (type === 'low') {
    return (
      <group position={position}>
        {/* Low barrier - duck under */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[6, 1.5, 0.5]} />
          <meshStandardMaterial
            color="#1a3a4a"
            emissive="#00ffaa"
            emissiveIntensity={0.3}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        {/* Spikes on top */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[-2 + i, 1, 0]} castShadow>
            <coneGeometry args={[0.2, 0.5, 4]} />
            <meshStandardMaterial
              color="#00ffcc"
              emissive="#00ffaa"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>
    )
  }

  if (type === 'high') {
    return (
      <group position={position}>
        {/* Floating obstacle - fly under */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[6, 1, 1]} />
          <meshStandardMaterial
            color="#4a1a3a"
            emissive="#ff00aa"
            emissiveIntensity={0.3}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        {/* Hanging chains/vines */}
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[-1.5 + i, -1.5, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
            <meshStandardMaterial
              color="#ff6b35"
              emissive="#ff4500"
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>
    )
  }

  // Gap type - two pillars with space between
  return (
    <group position={position}>
      {/* Left pillar */}
      <mesh position={[-4, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 10, 1]} />
        <meshStandardMaterial
          color="#2a1a4a"
          emissive="#ff00aa"
          emissiveIntensity={0.15}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Right pillar */}
      <mesh position={[4, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 10, 1]} />
        <meshStandardMaterial
          color="#2a1a4a"
          emissive="#00ffcc"
          emissiveIntensity={0.15}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Glowing gate frame */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[6, 0.3, 0.3]} />
        <meshBasicMaterial color="#ffeb3b" />
      </mesh>
    </group>
  )
}
