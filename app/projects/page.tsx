import type { Metadata } from 'next'
import ProjectCard from '@/components/project/ProjectCard'
import BackButton from '@/components/project/BackButton'
import ScrollToTop from '@/components/project/ScrollToTop'
import { projects } from '@/lib/projects'
import styles from './projects.module.css'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Case studies by Roman Ovcharenko — Product Designer. AdTech SaaS dashboards, enterprise talent platforms, and e-commerce design.',
}

export default function ProjectsPage() {
  return (
    <section className={styles.page}>
      <ScrollToTop />
      <BackButton fallback="/" />
      <h1 className={styles.heading}>Projects</h1>
      <div className={styles.grid}>
        {projects.map((p) => (
          <ProjectCard
            key={p.slug}
            slug={p.slug}
            title={p.title}
            tags={p.tags}
            description={p.description}
            cover={p.cover}
          />
        ))}
      </div>
    </section>
  )
}
