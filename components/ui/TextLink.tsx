import Link from 'next/link'
import styles from './TextLink.module.css'

// Named TextLink, not Link, so it doesn't shadow next/link. Figma component: «Link».
type Props = {
  variant: 'nav' | 'muted' | 'accent'
  href: string
  children: React.ReactNode
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>

export default function TextLink({ variant, href, children, ...rest }: Props) {
  // In-site paths go through next/link; external, mailto: and tel: stay plain anchors
  if (href.startsWith('/')) {
    return <Link href={href} className={styles[variant]} {...rest}>{children}</Link>
  }
  return <a href={href} className={styles[variant]} {...rest}>{children}</a>
}
