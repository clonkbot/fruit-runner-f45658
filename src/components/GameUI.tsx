import { useState, useEffect } from 'react'

interface GameUIProps {
  score: number
}

export default function GameUI({ score }: GameUIProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const [scoreFlash, setScoreFlash] = useState(false)

  // Animated score counter
  useEffect(() => {
    if (score > displayScore) {
      setScoreFlash(true)
      const timer = setTimeout(() => setScoreFlash(false), 150)

      // Animate score counting up
      const increment = Math.ceil((score - displayScore) / 5)
      const countTimer = setTimeout(() => {
        setDisplayScore(prev => Math.min(score, prev + increment))
      }, 30)

      return () => {
        clearTimeout(timer)
        clearTimeout(countTimer)
      }
    }
  }, [score, displayScore])

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Score display */}
      <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2">
        <div
          className={`relative transition-all duration-150 ${scoreFlash ? 'scale-125' : 'scale-100'}`}
        >
          <p className="font-body text-xs md:text-sm text-white/50 text-center uppercase tracking-widest mb-1">
            SCORE
          </p>
          <p
            className="font-display text-4xl md:text-6xl text-white text-center"
            style={{
              textShadow: scoreFlash
                ? '0 0 40px rgba(255, 200, 0, 1), 0 0 80px rgba(255, 100, 0, 0.8)'
                : '0 0 20px rgba(255, 0, 170, 0.5)',
              color: scoreFlash ? '#ffeb3b' : '#ffffff',
            }}
          >
            {displayScore}
          </p>
        </div>
      </div>

      {/* Combo / Multiplier indicator placeholder */}
      <div className="absolute top-4 md:top-8 right-4 md:right-8">
        <div
          className="px-3 py-2 md:px-4 md:py-2 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 0, 170, 0.3) 0%, rgba(0, 255, 200, 0.3) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p className="font-body text-xs md:text-sm text-white/70">🍎 SLICE BONUS</p>
        </div>
      </div>

      {/* Speed indicator */}
      <div className="absolute bottom-16 md:bottom-20 left-4 md:left-8">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#00ffcc', boxShadow: '0 0 10px #00ffcc' }}
          />
          <p className="font-body text-xs text-white/40 uppercase tracking-wider">Running</p>
        </div>
      </div>

      {/* Touch/Jump indicator */}
      <div className="absolute bottom-16 md:bottom-20 right-4 md:right-8 flex items-center gap-2">
        <div
          className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <span className="text-white/30 text-xl">↑</span>
        </div>
      </div>

      {/* Vignette effect */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.4) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top gradient for better score visibility */}
      <div
        className="absolute top-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Scanline effect for retro feel */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.5) 2px, rgba(0, 0, 0, 0.5) 4px)',
        }}
      />
    </div>
  )
}
