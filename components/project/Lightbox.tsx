'use client'

import { useState, useEffect } from 'react'
import IconButton from '@/components/ui/IconButton'
import styles from './Lightbox.module.css'

type SlideImage = { src: string; alt: string }

type Props = {
  images: SlideImage[]
  startIndex: number
  onClose: () => void
  onNavigate: (idx: number) => void
}

export default function Lightbox({ images, startIndex, onClose, onNavigate }: Props) {
  const [idx, setIdx] = useState(startIndex)
  const [visible, setVisible] = useState(false)

  // Fade in on mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function goTo(i: number) {
    const next = ((i % images.length) + images.length) % images.length
    setIdx(next)
    onNavigate(next)
  }

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 250)
  }

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') goTo(idx - 1)
      if (e.key === 'ArrowRight') goTo(idx + 1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [idx])

  return (
    <div
      className={`${styles.lightbox} ${visible ? styles.open : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <IconButton variant="overlay" className={styles.close} onClick={handleClose} aria-label="Close">✕</IconButton>
      <IconButton variant="overlay" className={styles.prev} onClick={() => goTo(idx - 1)} aria-label="Previous">←</IconButton>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.img} src={images[idx].src} alt={images[idx].alt} />

      <IconButton variant="overlay" className={styles.next} onClick={() => goTo(idx + 1)} aria-label="Next">→</IconButton>
      <span className={styles.counter}>{idx + 1} / {images.length}</span>
    </div>
  )
}
