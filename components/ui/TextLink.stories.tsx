import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import TextLink from './TextLink'

const meta = {
  title: 'UI/TextLink',
  component: TextLink,
  args: { variant: 'nav', href: '/#projects', children: 'Work' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['nav', 'muted', 'accent'] },
    href: { control: 'text', description: 'Paths starting with / render next/link; anything else a plain <a>' },
  },
  parameters: { docs: { description: { component: 'Figma component «Link». nav: Header · muted: About profiles · accent: Contact email.' } } },
} satisfies Meta<typeof TextLink>
export default meta
type Story = StoryObj<typeof meta>

export const Nav: Story = {}
export const Muted: Story = { args: { variant: 'muted', href: 'https://www.behance.net/romanovcharenko', children: 'Behance ↗' } }
export const Accent: Story = { args: { variant: 'accent', href: 'mailto:super.ovcharenko2017@gmail.com', children: 'super.ovcharenko2017@gmail.com' } }

/** Every variant in default and hover, forced with storybook-addon-pseudo-states. Mirrors Figma Link `state`. */
export const States: Story = {
  parameters: { controls: { disable: true }, pseudo: { hover: ['.st-hover > *'] } },
  render: () => {
    const links = [
      { variant: 'nav', href: '/#projects', label: 'Work' },
      { variant: 'muted', href: 'https://www.behance.net/romanovcharenko', label: 'Behance ↗' },
      { variant: 'accent', href: 'mailto:super.ovcharenko2017@gmail.com', label: 'super.ovcharenko2017@gmail.com' },
    ] as const
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: 'var(--space-16) var(--space-24)', alignItems: 'center' }}>
        <span />
        {['default', 'hover'].map((s) => <span key={s} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-fg-muted)' }}>{s}</span>)}
        {links.map((l) => [
          <span key={l.variant} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-fg-muted)' }}>{l.variant}</span>,
          <span key={l.variant + 'd'}><TextLink variant={l.variant} href={l.href}>{l.label}</TextLink></span>,
          <span key={l.variant + 'h'} className="st-hover"><TextLink variant={l.variant} href={l.href}>{l.label}</TextLink></span>,
        ])}
      </div>
    )
  },
}
