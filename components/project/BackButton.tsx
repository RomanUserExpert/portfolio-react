'use client'

import { useRouter } from 'next/navigation'
import styles from '@/app/projects/[slug]/project.module.css'

type Props = { fallback?: string }

export default function BackButton({ fallback = '/projects' }: Props) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallback)
    }
  }

  return (
    <button className={styles.backLink} onClick={handleBack}>
      ← Back
    </button>
  )
}
