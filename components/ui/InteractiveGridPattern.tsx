'use client'

import { useState } from 'react'
import styles from './InteractiveGridPattern.module.css'

interface Props {
  squareSize?: number
  cols?: number
  rows?: number
}

export default function InteractiveGridPattern({
  squareSize = 44,
  cols = 28,
  rows = 26,
}: Props) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={styles.svg}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="igp-grid"
          width={squareSize}
          height={squareSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${squareSize} 0 L 0 0 0 ${squareSize}`}
            fill="none"
            stroke="var(--grid-line)"
            strokeWidth={1}
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#igp-grid)" />

      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const idx = row * cols + col
          const isHovered = hovered === idx
          return (
            <rect
              key={idx}
              x={col * squareSize + 1}
              y={row * squareSize + 1}
              width={squareSize - 1}
              height={squareSize - 1}
              fill={isHovered ? 'var(--grid-hover)' : 'transparent'}
              style={{ transition: isHovered ? 'fill 0.08s ease' : 'fill 0.9s ease' }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            />
          )
        })
      )}
    </svg>
  )
}
