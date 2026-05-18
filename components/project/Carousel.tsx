'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Lightbox from './Lightbox'
import styles from './Carousel.module.css'

type SlideImage = { src: string; alt: string }

type Props = {
  images: SlideImage[]
}

export default function Carousel({ images }: Props) {
  const [current, setCurrent] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const touchStartX = useRef(0)

  function goTo(idx: number) {
    setCurrent(((idx % images.length) + images.length) % images.length)
  }

  return (
    <>
      <div className={styles.carousel}>
        <div
          className={styles.track}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
          onTouchEnd={(e) => {
            const delta = e.changedTouches[0].clientX - touchStartX.current
            if (Math.abs(delta) > 40) goTo(delta < 0 ? current + 1 : current - 1)
          }}
        >
          {images.map((img, i) => (
            <div key={img.src} className={`${styles.slide} ${i === current ? styles.active : ''}`}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 960px"
                className={styles.slideImg}
              />
            </div>
          ))}
        </div>

        <button className={styles.prev} onClick={() => goTo(current - 1)} aria-label="Previous">←</button>
        <button className={styles.next} onClick={() => goTo(current + 1)} aria-label="Next">→</button>

        <div className={styles.dots}>
          {images.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <button className={styles.expand} onClick={() => setLightboxOpen(true)} aria-label="View fullscreen">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5V1H5M9 1H13V5M13 9V13H9M5 13H1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          startIndex={current}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setCurrent}
        />
      )}
    </>
  )
}
