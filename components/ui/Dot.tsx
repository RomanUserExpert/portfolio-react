import styles from './Dot.module.css'

type Props = {
  active?: boolean
  'aria-label': string
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

export default function Dot({ active = false, ...rest }: Props) {
  return <button className={`${styles.dot} ${active ? styles.active : ''}`.trim()} {...rest} />
}
