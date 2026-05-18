import Image from 'next/image'
import Link from 'next/link'
import Tag from '@/components/ui/Tag'
import styles from './ProjectCard.module.css'

type Props = {
  slug: string
  title: string
  tags: string[]
  description: string
  cover: string
}

export default function ProjectCard({ slug, title, tags, description, cover }: Props) {
  return (
    <Link href={`/projects/${slug}`} className={styles.card}>
      <div className={styles.thumb}>
        <Image src={cover} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className={styles.img} />
      </div>
      <div className={styles.body}>
        <div className={styles.top}>
          <h3 className={styles.title}>{title}</h3>
          <span className={styles.arrow}>↗</span>
        </div>
        <div className={styles.tags}>
          {tags.map((t) => <Tag key={t} label={t} />)}
        </div>
        <p className={styles.desc}>{description}</p>
      </div>
    </Link>
  )
}
