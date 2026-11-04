import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import IconButton from './IconButton'

const expandIcon = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 5V1H5M9 1H13V5M13 9V13H9M5 13H1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const meta = {
  title: 'UI/IconButton',
  component: IconButton,
  args: { variant: 'surface', 'aria-label': 'Next', children: '→' },
  argTypes: { variant: { control: 'inline-radio', options: ['surface', 'surface-square', 'overlay'] } },
  parameters: {
    docs: { description: { component: 'surface: Carousel arrows · surface-square: Carousel expand · overlay: Lightbox controls. Look only; the parent positions it via className.' } },
  },
} satisfies Meta<typeof IconButton>
export default meta
type Story = StoryObj<typeof meta>

export const Surface: Story = {}
export const SurfaceSquare: Story = { args: { variant: 'surface-square', 'aria-label': 'View fullscreen', children: expandIcon } }
/** Overlay sits on the Lightbox scrim, so the story draws one behind it. */
export const Overlay: Story = {
  args: { variant: 'overlay', 'aria-label': 'Close', children: '✕' },
  decorators: [(Story) => <div style={{ background: 'var(--component-lightbox-scrim)', padding: 'var(--space-24)' }}><Story /></div>],
}

/** Every variant in default and hover, forced with storybook-addon-pseudo-states. Mirrors Figma IconButton `state`. */
export const States: Story = {
  parameters: { controls: { disable: true }, pseudo: { hover: ['.st-hover > *'] } },
  render: () => {
    const rows = [
      { variant: 'surface', label: 'Next', icon: '→' },
      { variant: 'surface-square', label: 'View fullscreen', icon: expandIcon },
      { variant: 'overlay', label: 'Close', icon: '✕' },
    ] as const
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: 'var(--space-16) var(--space-24)', alignItems: 'center' }}>
        <span />
        {['default', 'hover'].map((s) => <span key={s} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-fg-muted)' }}>{s}</span>)}
        {rows.map((r) => {
          const bg = r.variant === 'overlay' ? { background: 'var(--component-lightbox-scrim)', padding: 'var(--space-8)' } : undefined
          return [
            <span key={r.variant} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-fg-muted)' }}>{r.variant}</span>,
            <div key={r.variant + 'd'} style={bg}><IconButton variant={r.variant} aria-label={r.label}>{r.icon}</IconButton></div>,
            <div key={r.variant + 'h'} className="st-hover" style={bg}><IconButton variant={r.variant} aria-label={r.label}>{r.icon}</IconButton></div>,
          ]
        })}
      </div>
    )
  },
}
