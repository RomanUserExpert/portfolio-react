import styles from './SectionLabel.module.css'

type Props = {
  children: React.ReactNode
}

export default function SectionLabel({ children }: Props) {
  return <h2 className={styles.label}>{children}</h2>
}
