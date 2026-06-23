'use client'

import { useState, useRef, useCallback } from 'react'
import styles from './InteractiveGridPattern.module.css'

interface Props {
  squareSize?: number
  cols?: number
  rows?: number
}

export default function InteractiveGridPattern({
  squareSize = 22,
  cols = 90,
  rows = 50,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [cell, setCell] = useState<{ x: number; y: number } | null>(null)
  const [visible, setVisible] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const col = Math.floor((e.clientX - rect.left) / squareSize)
    const row = Math.floor((e.clientY - rect.top) / squareSize)
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      setCell({ x: col * squareSize + 1, y: row * squareSize + 1 })
      setVisible(true)
    }
  }, [squareSize, cols, rows])

  const handleMouseLeave = useCallback(() => setVisible(false), [])

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      className={styles.svg}
      aria-hidden="true"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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

      {cell && (
        <rect
          x={cell.x}
          y={cell.y}
          width={squareSize - 1}
          height={squareSize - 1}
          fill="var(--grid-hover)"
          style={{
            opacity: visible ? 1 : 0,
            transition: visible ? 'opacity 0.08s ease' : 'opacity 1.6s ease',
          }}
        />
      )}
    </svg>
  )
}
