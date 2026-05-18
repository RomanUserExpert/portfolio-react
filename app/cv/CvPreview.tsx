'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import styles from './cv.module.css'

type Props = { pdfPath: string }

export default function CvPreview({ pdfPath }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={styles.previewWrap}>
        <div className={styles.fallback}>
          <p>PDF preview is not available in this browser.</p>
          <Button href={pdfPath} variant="primary" download="CV — Roman Ovcharenko.pdf">
            Download CV
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.previewWrap}>
      <iframe
        src={pdfPath}
        title="CV — Roman Ovcharenko"
        className={styles.iframe}
        onError={() => setFailed(true)}
      />
    </div>
  )
}
