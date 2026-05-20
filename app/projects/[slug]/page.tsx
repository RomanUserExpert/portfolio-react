import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Tag from '@/components/ui/Tag'
import SectionLabel from '@/components/ui/SectionLabel'
import Carousel from '@/components/project/Carousel'
import BackButton from '@/components/project/BackButton'
import ScrollToTop from '@/components/project/ScrollToTop'
import { projects, getProject } from '@/lib/projects'
import styles from './project.module.css'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.metaDescription,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  return (
    <section className={styles.page}>
      <ScrollToTop />
      <BackButton />

      <div className={styles.header}>
        <h1>{project.title}</h1>
        <div className={styles.tags}>
          {project.tags.map((t) => <Tag key={t} label={t} />)}
        </div>
      </div>

      <Carousel images={project.images} />

      <div className={styles.content}>
        {project.sections.map((section, i) => (
          <div key={section.label} className={styles.section}>
            <SectionLabel>{section.label}</SectionLabel>
            {section.paragraphs?.map((p, j) => <p key={j}>{p}</p>)}
            {section.list && (
              <ul>
                {section.list.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            )}
            {i === 0 && project.links && project.links.length > 0 && (
              <div className={styles.links}>
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener">{link.label}</a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
