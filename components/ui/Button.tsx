import Link from 'next/link'
import styles from './Button.module.css'

type BaseProps = {
  variant?: 'primary' | 'ghost'
  /** Busy: spinner over the hidden label (the width stays), clicks are ignored */
  loading?: boolean
  children: React.ReactNode
  className?: string
}

type AsLink = BaseProps & { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>
type AsButton = BaseProps & { href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>

type Props = AsLink | AsButton

export default function Button({ variant = 'primary', loading = false, href, children, className, ...rest }: Props) {
  const cls = [styles[variant], loading && styles.loading, className].filter(Boolean).join(' ')

  // Not `disabled`: that would switch to the disabled look. Pointer events are off in CSS;
  // this also swallows keyboard activation (Enter / Space) while busy.
  const busy = loading
    ? { 'aria-busy': true, 'aria-disabled': true, onClick: (e: React.MouseEvent) => e.preventDefault() }
    : {}
  const content = loading ? (
    <>
      <span className={styles.label}>{children}</span>
      <span className={styles.spinner} aria-hidden="true" />
    </>
  ) : (
    children
  )

  if (href) {
    return (
      <Link href={href} className={cls} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)} {...busy}>
        {content}
      </Link>
    )
  }

  return (
    <button className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)} {...busy}>
      {content}
    </button>
  )
}
