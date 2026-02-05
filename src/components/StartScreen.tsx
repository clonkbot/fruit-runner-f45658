import { useState, useEffect } from 'react'

interface StartScreenProps {
  onStart: () => void
  highScore: number
}

export default function StartScreen({ onStart, highScore }: StartScreenProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center z-20 transition-all duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, rgba(26, 10, 46, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Animated title */}
      <div className="relative mb-8">
        <h1
          className="font-display text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text animate-pulse"
          style={{
            backgroundImage: 'linear-gradient(135deg, #ff00aa 0%, #ff6b35 25%, #ffeb3b 50%, #00ffcc 75%, #ff00aa 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradient 3s ease infinite, float 2s ease-in-out infinite',
            textShadow: '0 0 60px rgba(255, 0, 170, 0.5)',
          }}
        >
          FRUIT
        </h1>
        <h1
          className="font-display text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text"
          style={{
            backgroundImage: 'linear-gradient(135deg, #00ffcc 0%, #00ff88 50%, #ffeb3b 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradient 3s ease infinite reverse',
            textShadow: '0 0 60px rgba(0, 255, 200, 0.5)',
          }}
        >
          RUNNER
        </h1>

        {/* Decorative elements */}
        <div
          className="absolute -top-4 -left-4 w-8 h-8 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ff6b35 0%, transparent 70%)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full"
          style={{
            background: 'radial-gradient(circle, #00ffcc 0%, transparent 70%)',
            animation: 'pulse 1.5s ease-in-out infinite 0.5s',
          }}
        />
      </div>

      {/* Tagline */}
      <p className="font-body text-lg md:text-xl text-white/70 mb-8 text-center px-4">
        <span className="text-pink-400">Slice</span> fruits •{' '}
        <span className="text-cyan-400">Dodge</span> obstacles •{' '}
        <span className="text-orange-400">Survive</span>
      </p>

      {/* High score */}
      {highScore > 0 && (
        <div className="mb-6 text-center">
          <p className="font-body text-sm text-white/50 uppercase tracking-widest">Best Score</p>
          <p className="font-display text-3xl text-yellow-400" style={{ textShadow: '0 0 20px rgba(255, 200, 0, 0.5)' }}>
            {highScore}
          </p>
        </div>
      )}

      {/* Start button */}
      <button
        onClick={onStart}
        className="group relative font-display text-2xl md:text-3xl px-12 py-5 rounded-full overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #ff00aa 0%, #ff6b35 100%)',
          boxShadow: '0 0 40px rgba(255, 0, 170, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)',
        }}
      >
        <span className="relative z-10 text-white">PLAY</span>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #ffeb3b 100%)',
          }}
        />
      </button>

      {/* Controls hint */}
      <div className="mt-10 text-center">
        <p className="font-body text-xs md:text-sm text-white/40 mb-2">CONTROLS</p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <span className="font-body text-white/70 text-xs">SPACE</span>
            </div>
            <span className="font-body text-white/50 text-sm">/ Tap to Jump</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <span className="text-white/70 text-lg">↗</span>
            </div>
            <span className="font-body text-white/50 text-sm">Swipe to Slice</span>
          </div>
        </div>
      </div>

      {/* Animated fruit icons */}
      <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🍎</div>
      <div className="absolute top-20 right-16 text-3xl animate-bounce" style={{ animationDelay: '0.3s' }}>🍊</div>
      <div className="absolute bottom-32 left-16 text-3xl animate-bounce" style={{ animationDelay: '0.6s' }}>🍌</div>
      <div className="absolute bottom-20 right-10 text-4xl animate-bounce" style={{ animationDelay: '0.9s' }}>🍉</div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
