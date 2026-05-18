import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import CvPreview from './CvPreview'
import styles from './cv.module.css'

const PDF_PATH = '/CV%20%E2%80%94%20Roman%20Ovcharenko.pdf'

export const metadata: Metadata = {
  title: 'CV',
  description: 'CV of Roman Ovcharenko — Product Designer with 6+ years in B2B SaaS, enterprise tools, and design systems.',
}

export default function CvPage() {
  return (
    <section className={styles.page}>
      <Link href="/" className={styles.backLink}>← Back</Link>
      <div className={styles.header}>
        <h1>CV / Resume</h1>
        <Button href={PDF_PATH} variant="primary" download="CV — Roman Ovcharenko.pdf">
          Download PDF
        </Button>
      </div>
      <CvPreview pdfPath={PDF_PATH} />
    </section>
  )
}
