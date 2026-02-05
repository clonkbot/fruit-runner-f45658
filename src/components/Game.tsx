import { useRef, useEffect, useCallback, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { GameState } from '../App'
import Player from './Player'
import Obstacle from './Obstacle'
import Fruit from './Fruit'
import Temple from './Temple'

interface GameProps {
  gameState: GameState
  onScore: (points: number) => void
  onGameOver: (score: number) => void
  score: number
}

interface ObstacleData {
  id: number
  position: [number, number, number]
  type: 'pillar' | 'gap' | 'low' | 'high'
}

interface FruitData {
  id: number
  position: [number, number, number]
  type: 'apple' | 'orange' | 'watermelon' | 'banana'
  sliced: boolean
}

export default function Game({ gameState, onScore, onGameOver, score }: GameProps) {
  const { gl } = useThree()
  const playerRef = useRef<THREE.Group>(null)
  const [playerY, setPlayerY] = useState(1)
  const playerVelocity = useRef(0)
  const [obstacles, setObstacles] = useState<ObstacleData[]>([])
  const [fruits, setFruits] = useState<FruitData[]>([])
  const gameSpeed = useRef(0.15)
  const distance = useRef(0)
  const obstacleIdRef = useRef(0)
  const fruitIdRef = useRef(0)
  const isJumping = useRef(false)
  const lastObstacleZ = useRef(-30)
  const lastFruitZ = useRef(-15)
  const sliceStart = useRef<{ x: number; y: number } | null>(null)

  // Reset game state
  useEffect(() => {
    if (gameState === 'playing') {
      setPlayerY(1)
      playerVelocity.current = 0
      gameSpeed.current = 0.15
      distance.current = 0
      obstacleIdRef.current = 0
      fruitIdRef.current = 0
      lastObstacleZ.current = -30
      lastFruitZ.current = -15
      setObstacles([])
      setFruits([])
      isJumping.current = false
    }
  }, [gameState])

  // Jump/flap handler
  const handleJump = useCallback(() => {
    if (gameState !== 'playing') return
    if (playerY < 5) {
      playerVelocity.current = 0.25
      isJumping.current = true
    }
  }, [gameState, playerY])

  // Input handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        handleJump()
      }
    }

    const handlePointerDown = (e: PointerEvent) => {
      sliceStart.current = { x: e.clientX, y: e.clientY }
    }

    const handlePointerUp = (e: PointerEvent) => {
      if (sliceStart.current) {
        const dx = e.clientX - sliceStart.current.x
        const dy = e.clientY - sliceStart.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // If it's a swipe (slice), don't jump
        if (distance < 30) {
          handleJump()
        }
        sliceStart.current = null
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    gl.domElement.addEventListener('pointerdown', handlePointerDown)
    gl.domElement.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      gl.domElement.removeEventListener('pointerdown', handlePointerDown)
      gl.domElement.removeEventListener('pointerup', handlePointerUp)
    }
  }, [gl.domElement, handleJump])

  // Slice fruit handler
  const handleSliceFruit = useCallback((fruitId: number) => {
    setFruits(prev => prev.map(f =>
      f.id === fruitId ? { ...f, sliced: true } : f
    ))
    onScore(100)
  }, [onScore])

  // Spawn obstacles and fruits
  const spawnObstacle = useCallback(() => {
    const types: ObstacleData['type'][] = ['pillar', 'gap', 'low', 'high']
    const type = types[Math.floor(Math.random() * types.length)]
    const xOffset = (Math.random() - 0.5) * 4

    const newObstacle: ObstacleData = {
      id: obstacleIdRef.current++,
      position: [xOffset, type === 'high' ? 3 : 0, lastObstacleZ.current],
      type
    }
    lastObstacleZ.current -= 15 + Math.random() * 10
    setObstacles(prev => [...prev.slice(-8), newObstacle])
  }, [])

  const spawnFruit = useCallback(() => {
    const types: FruitData['type'][] = ['apple', 'orange', 'watermelon', 'banana']
    const type = types[Math.floor(Math.random() * types.length)]
    const xOffset = (Math.random() - 0.5) * 6
    const yOffset = 1 + Math.random() * 3

    const newFruit: FruitData = {
      id: fruitIdRef.current++,
      position: [xOffset, yOffset, lastFruitZ.current],
      type,
      sliced: false
    }
    lastFruitZ.current -= 8 + Math.random() * 8
    setFruits(prev => [...prev.slice(-12), newFruit])
  }, [])

  // Game loop
  useFrame((state, delta) => {
    if (gameState !== 'playing') return

    // Update distance and speed
    distance.current += gameSpeed.current
    gameSpeed.current = Math.min(0.35, 0.15 + distance.current * 0.0001)

    // Score based on distance
    if (Math.floor(distance.current) % 5 === 0 && Math.floor(distance.current) > 0) {
      onScore(1)
    }

    // Physics for player (gravity + flap)
    playerVelocity.current -= 0.012 // gravity
    const newY = Math.max(0.5, Math.min(6, playerY + playerVelocity.current))
    setPlayerY(newY)

    if (newY <= 0.5) {
      playerVelocity.current = 0
      isJumping.current = false
    }

    // Move obstacles and fruits toward player
    setObstacles(prev => {
      const updated = prev.map(o => ({
        ...o,
        position: [o.position[0], o.position[1], o.position[2] + gameSpeed.current] as [number, number, number]
      })).filter(o => o.position[2] < 15)

      // Collision detection
      for (const obs of updated) {
        if (obs.position[2] > 4 && obs.position[2] < 8) {
          const playerX = 0
          const hitX = Math.abs(obs.position[0] - playerX) < 1.2

          if (obs.type === 'pillar' && hitX && newY < 3) {
            onGameOver(score)
            return prev
          }
          if (obs.type === 'low' && hitX && newY < 2) {
            onGameOver(score)
            return prev
          }
          if (obs.type === 'high' && hitX && newY > 1.5 && newY < 4) {
            onGameOver(score)
            return prev
          }
        }
      }

      return updated
    })

    setFruits(prev => prev.map(f => ({
      ...f,
      position: [f.position[0], f.position[1], f.position[2] + gameSpeed.current] as [number, number, number]
    })).filter(f => f.position[2] < 15))

    // Spawn new obstacles and fruits
    if (lastObstacleZ.current > -50) {
      spawnObstacle()
    }
    if (lastFruitZ.current > -40) {
      spawnFruit()
    }

    // Move spawn points
    lastObstacleZ.current += gameSpeed.current
    lastFruitZ.current += gameSpeed.current

    // Update player ref position
    if (playerRef.current) {
      playerRef.current.position.y = newY
    }
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#ffe0f0"
      />
      <pointLight position={[-5, 5, -10]} intensity={0.8} color="#00ffff" />
      <pointLight position={[5, 3, -20]} intensity={0.6} color="#ff00aa" />

      {/* Environment */}
      <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />
      <Environment preset="night" />
      <fog attach="fog" args={['#1a0a2e', 10, 60]} />

      {/* Temple corridor background */}
      <Temple />

      {/* Player */}
      <group ref={playerRef} position={[0, playerY, 6]}>
        <Player isJumping={isJumping.current} />
      </group>

      {/* Obstacles */}
      {obstacles.map(obs => (
        <Obstacle key={obs.id} position={obs.position} type={obs.type} />
      ))}

      {/* Fruits */}
      {fruits.map(fruit => (
        <Fruit
          key={fruit.id}
          position={fruit.position}
          type={fruit.type}
          sliced={fruit.sliced}
          onSlice={() => handleSliceFruit(fruit.id)}
        />
      ))}

      {/* Ground plane with glow effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -20]} receiveShadow>
        <planeGeometry args={[20, 100]} />
        <meshStandardMaterial
          color="#1a0a2e"
          emissive="#ff00aa"
          emissiveIntensity={0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Neon grid lines on ground */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={`grid-${i}`} position={[0, 0.01, -i * 5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 0.05]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
        </mesh>
      ))}
    </>
  )
}
