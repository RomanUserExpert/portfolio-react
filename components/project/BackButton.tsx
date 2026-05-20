'use client'

import { useRouter } from 'next/navigation'
import styles from '@/app/projects/[slug]/project.module.css'

type Props = { fallback?: string }

export default function BackButton({ fallback = '/projects' }: Props) {
  const router = useRouter()

  const handleBack = () => {
    const from = document.referrer
    const isInternal = from && new URL(from).origin === window.location.origin
    if (isInternal) {
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
