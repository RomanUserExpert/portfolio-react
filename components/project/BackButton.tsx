'use client'

import { useRouter } from 'next/navigation'
import styles from '@/app/projects/[slug]/project.module.css'

export default function BackButton() {
  const router = useRouter()
  return (
    <button className={styles.backLink} onClick={() => router.back()}>
      ← Back
    </button>
  )
}
