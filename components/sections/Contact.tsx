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
          <a href="mailto:super.ovcharenko2017@gmail.com" className={styles.email}>
            super.ovcharenko2017@gmail.com
          </a>
          <span className={styles.dot}>
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="3" cy="3" r="3" fill="#E05F03" />
            </svg>
          </span>
          <a href="https://t.me/Romchics" target="_blank" rel="noopener" className={styles.email}>
            Telegram ↗
          </a>
        </div>
      </div>
    </section>
  )
}
