'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import styles from './InteractiveGridPattern.module.css'

interface Props {
  squareSize?: number
  cols?: number
  rows?: number
}

interface Cell { x: number; y: number }
interface TrailCell extends Cell { id: number }

export default function InteractiveGridPattern({
  squareSize = 33,
  cols = 62,
  rows = 34,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const prevCell = useRef<Cell | null>(null)
  const idCounter = useRef(0)

  const [active, setActive] = useState<Cell | null>(null)
  const [trail, setTrail] = useState<TrailCell[]>([])

  const pushTrail = useCallback((cell: Cell) => {
    setTrail(t => [...t, { ...cell, id: idCounter.current++ }].slice(-60))
  }, [])

  const removeTrail = useCallback((id: number) => {
    setTrail(t => t.filter(c => c.id !== id))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const col = Math.floor(Math.random() * cols)
      const row = Math.floor(Math.random() * rows)
      pushTrail({ x: col * squareSize + 1, y: row * squareSize + 1 })
    }, 200)
    return () => clearInterval(interval)
  }, [squareSize, cols, rows, pushTrail])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const flush = () => {
      if (prevCell.current) {
        pushTrail(prevCell.current)
        prevCell.current = null
        setActive(null)
      }
    }

    const onMove = (e: MouseEvent) => {
      const r = svg.getBoundingClientRect()
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        flush()
        return
      }
      const col = Math.floor((e.clientX - r.left) / squareSize)
      const row = Math.floor((e.clientY - r.top) / squareSize)
      if (col < 0 || col >= cols || row < 0 || row >= rows) return

      const next: Cell = { x: col * squareSize + 1, y: row * squareSize + 1 }
      const prev = prevCell.current
      if (prev && (prev.x !== next.x || prev.y !== next.y)) pushTrail(prev)
      prevCell.current = next
      setActive(next)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', flush)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', flush)
    }
  }, [squareSize, cols, rows, pushTrail])

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      className={styles.svg}
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
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

      {trail.map(cell => (
        <rect
          key={cell.id}
          x={cell.x}
          y={cell.y}
          width={squareSize - 1}
          height={squareSize - 1}
          fill="var(--grid-hover)"
          className={styles.trailCell}
          onAnimationEnd={() => removeTrail(cell.id)}
        />
      ))}

      {active && (
        <rect
          x={active.x}
          y={active.y}
          width={squareSize - 1}
          height={squareSize - 1}
          fill="var(--grid-active)"
        />
      )}
    </svg>
  )
}
