import Link from 'next/link'
import SectionLabel from '@/components/ui/SectionLabel'
import styles from './About.module.css'

const domains = [
  'SaaS Dashboards & Admin Tools',
  'Enterprise Internal Tools',
  'Design Systems',
  'Fintech & Trading Products',
  'Landing Pages',
  'E-commerce',
]

const tools = ['Figma', 'Miro', 'Photoshop', 'Webflow', 'Atomic Design', 'Dev Handoff']

const profiles = [
  { label: 'Behance ↗', href: 'https://www.behance.net/romanovcharenko' },
  { label: 'Dribbble ↗', href: 'https://dribbble.com/Roman_Genjutsu' },
  { label: 'LinkedIn ↗', href: 'https://www.linkedin.com/in/roman-ovcharenko-a10066186/' },
  { label: 'GitHub ↗', href: 'https://github.com/RomanUserExpert' },
]

export default function About() {
  return (
    <section id="about">
      <SectionLabel>About</SectionLabel>
      <div className={styles.layout}>
        <div className={styles.text}>
          <p>I&apos;m a product designer based in Ukraine. Over the last 6 years I&apos;ve focused on B2B SaaS, enterprise tools, and design systems — products where complexity needs to be tamed, not hidden.</p>
          <p>I work from discovery and structure all the way through to a Figma file ready for development. I ask questions instead of making assumptions, and flag problems early rather than late.</p>
          <Link href="/cv" className={styles.cvLink}>View CV ↗</Link>
        </div>
        <div className={styles.sidebar}>
          <div className={styles.sidebarBlock}>
            <span className={styles.sidebarLabel}>Domains</span>
            <ul className={styles.sidebarList}>
              {domains.map((d) => <li key={d}>{d}</li>)}
            </ul>
          </div>
          <div className={styles.sidebarBlock}>
            <span className={styles.sidebarLabel}>Tools</span>
            <div className={styles.tagFlow}>
              {tools.map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>
          <div className={styles.sidebarBlock}>
            <span className={styles.sidebarLabel}>Profiles</span>
            <div className={styles.sidebarLinks}>
              {profiles.map((p) => (
                <a key={p.href} href={p.href} target="_blank" rel="noopener">{p.label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
