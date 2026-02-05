import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useCallback } from 'react'
import Game from './components/Game'
import StartScreen from './components/StartScreen'
import GameUI from './components/GameUI'

export type GameState = 'menu' | 'playing' | 'gameOver'

export default function App() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('fruitRunnerHighScore')
    return saved ? parseInt(saved) : 0
  })

  const startGame = useCallback(() => {
    setScore(0)
    setGameState('playing')
  }, [])

  const endGame = useCallback((finalScore: number) => {
    if (finalScore > highScore) {
      setHighScore(finalScore)
      localStorage.setItem('fruitRunnerHighScore', finalScore.toString())
    }
    setGameState('gameOver')
  }, [highScore])

  const addScore = useCallback((points: number) => {
    setScore(prev => prev + points)
  }, [])

  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      {/* Animated background gradient overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(255, 0, 128, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0, 255, 200, 0.2) 0%, transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite alternate'
        }}
      />

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 2, 8], fov: 75 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: 'none' }}
      >
        <Suspense fallback={null}>
          <Game
            gameState={gameState}
            onScore={addScore}
            onGameOver={endGame}
            score={score}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlays */}
      {gameState === 'menu' && (
        <StartScreen onStart={startGame} highScore={highScore} />
      )}

      {gameState === 'playing' && (
        <GameUI score={score} />
      )}

      {gameState === 'gameOver' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
          <div className="text-center p-8 md:p-12">
            <h2 className="font-display text-4xl md:text-6xl text-white mb-4" style={{ textShadow: '0 0 40px rgba(255, 0, 128, 0.8)' }}>
              GAME OVER
            </h2>
            <p className="font-body text-2xl md:text-3xl text-cyan-300 mb-2">Score: {score}</p>
            <p className="font-body text-lg text-pink-400 mb-8">Best: {highScore}</p>
            <button
              onClick={startGame}
              className="font-display text-xl md:text-2xl px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full hover:scale-110 transition-transform active:scale-95 shadow-lg"
              style={{ boxShadow: '0 0 30px rgba(255, 100, 50, 0.5)' }}
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="absolute bottom-2 md:bottom-4 left-0 right-0 text-center z-10 pointer-events-none">
        <p className="font-body text-xs text-white/40">
          Requested by <span className="text-pink-400/60">@voidmode</span> · Built by <span className="text-cyan-400/60">@clonkbot</span>
        </p>
      </footer>

      {/* Global styles */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.2; transform: scale(1); }
          100% { opacity: 0.4; transform: scale(1.1); }
        }
        .font-display {
          font-family: 'Bangers', cursive;
          letter-spacing: 0.05em;
        }
        .font-body {
          font-family: 'Outfit', sans-serif;
        }
      `}</style>
    </div>
  )
}
