import Link from 'next/link'
import styles from './Logo.module.css'

type Props = {
  /** Placement from the parent (Header pushes the nav to the right with it) */
  className?: string
}

export default function Logo({ className }: Props) {
  return (
    <Link href="/" className={`${styles.logo} ${className ?? ''}`.trim()}>
      <span className={styles.icon}>
        <svg width="32" height="32" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 0L38.1027 21.8973L60 30L38.1027 38.1027L30 60L21.8973 38.1027L0 30L21.8973 21.8973L30 0Z" fill="currentColor" />
          <path d="M30 16L33.7813 26.2187L44 30L33.7813 33.7813L30 44L26.2187 33.7813L16 30L26.2187 26.2187L30 16Z" className={styles.accent} />
        </svg>
      </span>
      R.O.
    </Link>
  )
}
