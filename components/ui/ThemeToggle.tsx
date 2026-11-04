'use client'

import { useEffect, useState } from 'react'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') as 'light' | 'dark'
    setTheme(current ?? 'light')
  }, [])

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
    setTheme(next)
  }

  return (
    <button className={styles.toggle} onClick={toggleTheme} aria-label="Toggle color theme">
      <span className={styles.icon}>{theme === 'dark' ? '●' : '◐'}</span>
      <span className={styles.label}>{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  )
}
