import styles from './Tag.module.css'

type Props = {
  label: string
}

export default function Tag({ label }: Props) {
  return <span className={styles.tag}>{label}</span>
}
