import TextLink from '@/components/ui/TextLink'
import styles from './Contact.module.css'

export default function Contact() {
  return (
    <section id="contact" className={styles.contact}>
      <h2 className={styles.title}>Get in touch</h2>
      <div className={styles.layout}>
        <p className={styles.lead}>
          Have a project or idea you want to bring to life? Whether it&apos;s early thinking or already in motion — I&apos;m happy to jump in, ask the right questions, and help turn it into something that actually works.
        </p>
        <div className={styles.links}>
          <TextLink variant="accent" href="mailto:super.ovcharenko2017@gmail.com">
            super.ovcharenko2017@gmail.com
          </TextLink>
          <span className={styles.dot}>
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="3" cy="3" r="3" className={styles.dotFill} />
            </svg>
          </span>
          <TextLink variant="accent" href="https://t.me/Romchics" target="_blank" rel="noopener">
            Telegram ↗
          </TextLink>
        </div>
      </div>
    </section>
  )
}
