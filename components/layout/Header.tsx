'use client'

import { useEffect, useState } from 'react'
import Logo from '@/components/ui/Logo'
import TextLink from '@/components/ui/TextLink'
import ThemeToggle from '@/components/ui/ThemeToggle'
import styles from './Header.module.css'

const navLinks = [
  { href: '/#projects', label: 'Work' },
  { href: '/#about', label: 'About' },
  { href: '/#process', label: 'Process' },
  { href: '/#contact', label: 'Get in Touch' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        <Logo className={styles.logo} />

        <ul className={styles.navLinks}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <TextLink variant="nav" href={link.href}>{link.label}</TextLink>
            </li>
          ))}
        </ul>

        <ThemeToggle />
      </nav>
    </header>
  )
}
