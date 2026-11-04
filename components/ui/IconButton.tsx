import styles from './IconButton.module.css'

type Props = {
  /** surface: Carousel arrows · surface-square: Carousel expand · overlay: Lightbox controls */
  variant: 'surface' | 'surface-square' | 'overlay'
  /** Icon-only button: the label is its only accessible name */
  'aria-label': string
  children: React.ReactNode
  /** Placement from the parent (position, offsets, z-index) */
  className?: string
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>

export default function IconButton({ variant, children, className, ...rest }: Props) {
  return (
    <button className={`${styles[variant]} ${className ?? ''}`.trim()} {...rest}>
      {children}
    </button>
  )
}
