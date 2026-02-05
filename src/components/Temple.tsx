import { useMemo } from 'react'
import * as THREE from 'three'

export default function Temple() {
  const pillarPositions = useMemo(() => {
    const positions: [number, number, number][] = []
    for (let z = 0; z > -100; z -= 10) {
      positions.push([-8, 0, z])
      positions.push([8, 0, z])
    }
    return positions
  }, [])

  const archPositions = useMemo(() => {
    const positions: number[] = []
    for (let z = 0; z > -100; z -= 20) {
      positions.push(z)
    }
    return positions
  }, [])

  return (
    <group>
      {/* Side pillars */}
      {pillarPositions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Main pillar */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 0.6, 8, 8]} />
            <meshStandardMaterial
              color="#1a1a3a"
              emissive="#ff00aa"
              emissiveIntensity={0.05}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Pillar top */}
          <mesh position={[0, 4.2, 0]} castShadow>
            <boxGeometry args={[1.2, 0.4, 1.2]} />
            <meshStandardMaterial
              color="#2a1a4a"
              emissive="#ff00aa"
              emissiveIntensity={0.1}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          {/* Pillar base */}
          <mesh position={[0, -3.8, 0]} castShadow>
            <boxGeometry args={[1.2, 0.4, 1.2]} />
            <meshStandardMaterial
              color="#2a1a4a"
              emissive="#00ffcc"
              emissiveIntensity={0.1}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          {/* Glowing rings on pillars */}
          {[...Array(3)].map((_, j) => (
            <mesh key={j} position={[0, -2 + j * 2, 0]}>
              <torusGeometry args={[0.55, 0.05, 8, 32]} />
              <meshBasicMaterial
                color={i % 2 === 0 ? '#ff00aa' : '#00ffcc'}
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Arches connecting pillars */}
      {archPositions.map((z, i) => (
        <group key={`arch-${i}`} position={[0, 4.5, z]}>
          {/* Arch beam */}
          <mesh>
            <boxGeometry args={[16, 0.5, 1]} />
            <meshStandardMaterial
              color="#1a1a3a"
              emissive="#00ffcc"
              emissiveIntensity={0.1}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          {/* Glowing underline */}
          <mesh position={[0, -0.3, 0.51]}>
            <boxGeometry args={[16, 0.1, 0.02]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#ff00aa' : '#00ffcc'} />
          </mesh>
          {/* Hanging decorations */}
          {[...Array(5)].map((_, j) => (
            <group key={j} position={[-6 + j * 3, -0.5, 0]}>
              <mesh>
                <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
                <meshStandardMaterial color="#ffd700" emissive="#ff6600" emissiveIntensity={0.3} />
              </mesh>
              <mesh position={[0, -0.5, 0]}>
                <octahedronGeometry args={[0.15, 0]} />
                <meshStandardMaterial
                  color="#ff6b35"
                  emissive="#ff4500"
                  emissiveIntensity={0.5}
                  metalness={0.5}
                  roughness={0.3}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Floating platforms / ruins */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={`platform-${i}`}
          position={[
            (Math.random() - 0.5) * 12,
            5 + Math.random() * 3,
            -10 - i * 12
          ]}
          rotation={[0, Math.random() * Math.PI, 0]}
        >
          <boxGeometry args={[2, 0.3, 2]} />
          <meshStandardMaterial
            color="#2a1a4a"
            emissive={i % 2 === 0 ? '#ff00aa' : '#00ffcc'}
            emissiveIntensity={0.15}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Wall panels with glowing patterns */}
      {[...Array(10)].map((_, i) => (
        <group key={`wall-left-${i}`} position={[-10, 2, -5 - i * 10]}>
          <mesh>
            <boxGeometry args={[0.5, 6, 8]} />
            <meshStandardMaterial
              color="#0a0a1a"
              emissive="#ff00aa"
              emissiveIntensity={0.03}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Glowing pattern */}
          <mesh position={[0.26, 0, 0]}>
            <boxGeometry args={[0.02, 4, 0.1]} />
            <meshBasicMaterial color="#ff00aa" transparent opacity={0.5} />
          </mesh>
          <mesh position={[0.26, 0, 2]}>
            <boxGeometry args={[0.02, 3, 0.1]} />
            <meshBasicMaterial color="#00ffcc" transparent opacity={0.5} />
          </mesh>
          <mesh position={[0.26, 0, -2]}>
            <boxGeometry args={[0.02, 3, 0.1]} />
            <meshBasicMaterial color="#00ffcc" transparent opacity={0.5} />
          </mesh>
        </group>
      ))}

      {[...Array(10)].map((_, i) => (
        <group key={`wall-right-${i}`} position={[10, 2, -5 - i * 10]}>
          <mesh>
            <boxGeometry args={[0.5, 6, 8]} />
            <meshStandardMaterial
              color="#0a0a1a"
              emissive="#00ffcc"
              emissiveIntensity={0.03}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Glowing pattern */}
          <mesh position={[-0.26, 0, 0]}>
            <boxGeometry args={[0.02, 4, 0.1]} />
            <meshBasicMaterial color="#00ffcc" transparent opacity={0.5} />
          </mesh>
          <mesh position={[-0.26, 0, 2]}>
            <boxGeometry args={[0.02, 3, 0.1]} />
            <meshBasicMaterial color="#ff00aa" transparent opacity={0.5} />
          </mesh>
          <mesh position={[-0.26, 0, -2]}>
            <boxGeometry args={[0.02, 3, 0.1]} />
            <meshBasicMaterial color="#ff00aa" transparent opacity={0.5} />
          </mesh>
        </group>
      ))}

      {/* Ceiling with lights */}
      <mesh position={[0, 8, -40]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 100]} />
        <meshStandardMaterial
          color="#0a0a1a"
          emissive="#1a0a2e"
          emissiveIntensity={0.1}
          metalness={0.9}
          roughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Distant temple silhouette */}
      <mesh position={[0, 10, -80]}>
        <coneGeometry args={[15, 25, 4]} />
        <meshStandardMaterial
          color="#1a0a2e"
          emissive="#ff00aa"
          emissiveIntensity={0.05}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  )
}
