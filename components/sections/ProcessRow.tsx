import styles from './ProcessRow.module.css'

type Props = {
  num: string
  title: string
  description: string
}

export default function ProcessRow({ num, title, description }: Props) {
  return (
    <div className={styles.row}>
      <span className={styles.num}>{num}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
