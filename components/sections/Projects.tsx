import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'
import ProjectCard from '@/components/project/ProjectCard'
import { getFeaturedProjects } from '@/lib/projects'
import styles from './Projects.module.css'

export default function Projects() {
  const featured = getFeaturedProjects()
  return (
    <section id="projects">
      <SectionLabel>Projects</SectionLabel>
      <div className={styles.grid}>
        {featured.map((p) => (
          <ProjectCard key={p.slug} {...p} />
        ))}
      </div>
      <div className={styles.footer}>
        <Button href="/projects" variant="ghost">View All Projects →</Button>
      </div>
    </section>
  )
}
