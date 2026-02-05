import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

interface FruitProps {
  position: [number, number, number]
  type: 'apple' | 'orange' | 'watermelon' | 'banana'
  sliced: boolean
  onSlice: () => void
}

const fruitColors: Record<string, { main: string; emissive: string }> = {
  apple: { main: '#ff3366', emissive: '#ff1744' },
  orange: { main: '#ff9800', emissive: '#ff6d00' },
  watermelon: { main: '#4caf50', emissive: '#00c853' },
  banana: { main: '#ffeb3b', emissive: '#ffd600' },
}

export default function Fruit({ position, type, sliced, onSlice }: FruitProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [sliceParticles, setSliceParticles] = useState<THREE.Vector3[]>([])
  const { gl, raycaster, camera } = useThree()
  const lastPointerPos = useRef<THREE.Vector2 | null>(null)

  const colors = fruitColors[type]

  useEffect(() => {
    if (sliced) {
      // Create particle explosion
      const particles: THREE.Vector3[] = []
      for (let i = 0; i < 12; i++) {
        particles.push(new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ))
      }
      setSliceParticles(particles)
    }
  }, [sliced])

  // Slice detection via pointer movement
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (sliced || !groupRef.current) return

      const pointer = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      )

      // Check if moving fast (slicing motion)
      if (lastPointerPos.current) {
        const dx = pointer.x - lastPointerPos.current.x
        const dy = pointer.y - lastPointerPos.current.y
        const speed = Math.sqrt(dx * dx + dy * dy)

        if (speed > 0.02) { // Fast movement threshold
          raycaster.setFromCamera(pointer, camera)
          const intersects = raycaster.intersectObject(groupRef.current, true)

          if (intersects.length > 0) {
            onSlice()
          }
        }
      }

      lastPointerPos.current = pointer
    }

    gl.domElement.addEventListener('pointermove', handlePointerMove)
    return () => gl.domElement.removeEventListener('pointermove', handlePointerMove)
  }, [gl.domElement, raycaster, camera, sliced, onSlice])

  useFrame((state, delta) => {
    if (groupRef.current && !sliced) {
      groupRef.current.rotation.y += delta * 2
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.2
    }

    // Animate particles
    if (sliced && sliceParticles.length > 0) {
      setSliceParticles(prev => prev.map(p => {
        return new THREE.Vector3(
          p.x + (Math.random() - 0.5) * 0.1,
          p.y - 0.05,
          p.z + (Math.random() - 0.5) * 0.1
        )
      }))
    }
  })

  if (sliced) {
    return (
      <group position={position}>
        {/* Sliced halves */}
        <mesh position={[-0.3, 0, 0]}>
          <sphereGeometry args={[0.35, 16, 16, 0, Math.PI]} />
          <meshStandardMaterial
            color={colors.main}
            emissive={colors.emissive}
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[0.3, 0, 0]} rotation={[0, Math.PI, 0]}>
          <sphereGeometry args={[0.35, 16, 16, 0, Math.PI]} />
          <meshStandardMaterial
            color={type === 'watermelon' ? '#ff5252' : colors.main}
            emissive={colors.emissive}
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Juice particles */}
        {sliceParticles.map((p, i) => (
          <mesh key={i} position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color={colors.emissive} transparent opacity={0.8} />
          </mesh>
        ))}
        {/* Slice effect glow */}
        <mesh scale={2}>
          <ringGeometry args={[0.3, 0.5, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>
    )
  }

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
      <group
        ref={groupRef}
        position={position}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        onClick={onSlice}
      >
        {/* Main fruit body */}
        {type === 'banana' ? (
          <mesh castShadow>
            <capsuleGeometry args={[0.15, 0.6, 8, 16]} />
            <meshStandardMaterial
              color={isHovered ? '#ffffff' : colors.main}
              emissive={colors.emissive}
              emissiveIntensity={isHovered ? 0.8 : 0.4}
              metalness={0.2}
              roughness={0.5}
            />
          </mesh>
        ) : (
          <mesh castShadow>
            <sphereGeometry args={[type === 'watermelon' ? 0.5 : 0.35, 32, 32]} />
            <meshStandardMaterial
              color={isHovered ? '#ffffff' : colors.main}
              emissive={colors.emissive}
              emissiveIntensity={isHovered ? 0.8 : 0.4}
              metalness={0.2}
              roughness={0.5}
            />
          </mesh>
        )}

        {/* Stem for apple */}
        {type === 'apple' && (
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
            <meshStandardMaterial color="#8d6e63" />
          </mesh>
        )}

        {/* Leaf for apple */}
        {type === 'apple' && (
          <mesh position={[0.1, 0.45, 0]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.15, 0.08, 0.02]} />
            <meshStandardMaterial color="#4caf50" emissive="#00ff00" emissiveIntensity={0.3} />
          </mesh>
        )}

        {/* Watermelon stripes */}
        {type === 'watermelon' && (
          <>
            {[...Array(6)].map((_, i) => (
              <mesh key={i} rotation={[0, (i * Math.PI) / 3, 0]}>
                <torusGeometry args={[0.5, 0.02, 8, 32, Math.PI * 2]} />
                <meshBasicMaterial color="#2e7d32" />
              </mesh>
            ))}
          </>
        )}

        {/* Glow effect */}
        <mesh scale={isHovered ? 2 : 1.5}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial
            color={colors.emissive}
            transparent
            opacity={isHovered ? 0.4 : 0.2}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Sparkle particles around fruit */}
        {[...Array(4)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 2) * 0.6,
              Math.sin((i * Math.PI) / 2) * 0.6,
              0
            ]}
          >
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
    </Float>
  )
}
