'use client'

import { useEffect, useState } from 'react'

const SPARKLE_COUNT = 16

interface Sparkle {
  readonly id: number
  readonly x: number
  readonly y: number
  readonly delay: number
  readonly size: number
}

function createSparkles(): readonly Sparkle[] {
  return Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 70,
    delay: 0.2 + Math.random() * 0.8,
    size: 20 + Math.random() * 20,
  }))
}

export function Confetti({ onDone }: { readonly onDone: () => void }) {
  const [sparkles] = useState(() => createSparkles())

  useEffect(() => {
    const timer = setTimeout(onDone, 2500)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/5 animate-celebration-bg" />
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-celebration-pop"
        style={{ fontSize: 'min(40vw, 40vh)' }}
      >
        👏
      </span>
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute animate-celebration-pop"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
            animationDelay: `${s.delay}s`,
          }}
        >
          ✨
        </span>
      ))}
    </div>
  )
}
