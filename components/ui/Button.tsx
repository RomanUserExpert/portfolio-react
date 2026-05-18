import Link from 'next/link'
import styles from './Button.module.css'

type BaseProps = {
  variant?: 'primary' | 'ghost'
  children: React.ReactNode
  className?: string
}

type AsLink = BaseProps & { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>
type AsButton = BaseProps & { href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>

type Props = AsLink | AsButton

export default function Button({ variant = 'primary', href, children, className, ...rest }: Props) {
  const cls = `${styles[variant]} ${className ?? ''}`.trim()

  if (href) {
    return (
      <Link href={href} className={cls} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    )
  }

  return (
    <button className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
