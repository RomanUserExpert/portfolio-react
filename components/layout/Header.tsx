'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './Header.module.css'

const navLinks = [
  { href: '/#projects', label: 'Work' },
  { href: '/#about', label: 'About' },
  { href: '/#process', label: 'Process' },
  { href: '/#contact', label: 'Get in Touch' },
]

export default function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') as 'light' | 'dark'
    setTheme(current ?? 'light')
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
    setTheme(next)
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>
            <svg width="32" height="32" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 0L38.1027 21.8973L60 30L38.1027 38.1027L30 60L21.8973 38.1027L0 30L21.8973 21.8973L30 0Z" fill="currentColor" />
              <path d="M30 16L33.7813 26.2187L44 30L33.7813 33.7813L30 44L26.2187 33.7813L16 30L26.2187 26.2187L30 16Z" fill="#E05F03" />
            </svg>
          </span>
          R.O.
        </Link>

        <ul className={styles.navLinks}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>

        <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle color theme">
          <span className={styles.themeIcon}>{theme === 'dark' ? '●' : '◐'}</span>
          <span className={styles.themeLabel}>{theme === 'dark' ? 'Dark' : 'Light'}</span>
        </button>
      </nav>
    </header>
  )
}
