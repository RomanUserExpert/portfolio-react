import Button from '@/components/ui/Button'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <p className={styles.role}>Product Designer</p>
      <h1 className={styles.heading}>
        Roman<br />Ovcharenko
      </h1>
      <p className={styles.desc}>
        Turning complex systems into clear, usable products.<br />
        SaaS platforms, enterprise tools, data-heavy interfaces —<br />
        from first wireframe to production-ready Figma and post-launch support.<br />
        Open to discuss any project.
      </p>
      <div className={styles.actions}>
        <Button href="/#projects" variant="primary" className={styles.actionBtn}>View Work</Button>
        <Button href="/#contact" variant="ghost" className={styles.actionBtn}>Get in Touch</Button>
      </div>
    </section>
  )
}
