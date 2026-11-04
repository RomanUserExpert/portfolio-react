import styles from './Pill.module.css'

type Props = {
  label: string
}

export default function Pill({ label }: Props) {
  return <span className={styles.pill}>{label}</span>
}
