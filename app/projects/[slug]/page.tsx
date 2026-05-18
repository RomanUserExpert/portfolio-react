import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Tag from '@/components/ui/Tag'
import SectionLabel from '@/components/ui/SectionLabel'
import Carousel from '@/components/project/Carousel'
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
      <Link href="/projects" className={styles.backLink}>← Back</Link>

      <div className={styles.header}>
        <h1>{project.title}</h1>
        <div className={styles.tags}>
          {project.tags.map((t) => <Tag key={t} label={t} />)}
        </div>
      </div>

      <Carousel images={project.images} />

      <div className={styles.content}>
        {project.sections.map((section) => (
          <div key={section.label} className={styles.section}>
            <SectionLabel>{section.label}</SectionLabel>
            {section.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
            {section.list && (
              <ul>
                {section.list.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
