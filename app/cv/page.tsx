import type { Metadata } from 'next'
import Button from '@/components/ui/Button'
import CvPreview from './CvPreview'
import BackButton from '@/components/project/BackButton'
import ScrollToTop from '@/components/project/ScrollToTop'
import styles from './cv.module.css'

const PDF_PATH = '/CV%20%E2%80%94%20Roman%20Ovcharenko.pdf'

export const metadata: Metadata = {
  title: 'CV',
  description: 'CV of Roman Ovcharenko — Product Designer with 6+ years in B2B SaaS, enterprise tools, and design systems.',
}

export default function CvPage() {
  return (
    <section className={styles.page}>
      <ScrollToTop />
      <BackButton fallback="/" />
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
