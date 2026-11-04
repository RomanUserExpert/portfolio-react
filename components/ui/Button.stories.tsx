import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Fragment } from 'react'
import Button from './Button'

const meta = {
  title: 'UI/Button',
  component: Button,
  args: { children: 'View Work', variant: 'primary', href: '/#projects' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'ghost'] },
    href: { control: 'text', description: 'Renders next/link when set, <button> otherwise' },
  },
} satisfies Meta<typeof Button>
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
export const Ghost: Story = { args: { variant: 'ghost', children: 'Get in Touch' } }
export const AsButton: Story = { args: { href: undefined, children: 'Download PDF' } }
/** Only a <button> can be disabled: no href. */
export const Disabled: Story = { args: { href: undefined, disabled: true, children: 'Download PDF' } }
/** Spinner over the hidden label; the width stays, clicks are ignored. */
export const Loading: Story = { args: { href: undefined, loading: true, children: 'Download PDF' } }
export const All: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-10)' }}>
      <Button href="/#projects" variant="primary">View Work</Button>
      <Button href="/#contact" variant="ghost">Get in Touch</Button>
    </div>
  ),
}

/** Every CSS state side by side, forced with storybook-addon-pseudo-states. Mirrors Figma Button `state`. */
export const States: Story = {
  parameters: {
    controls: { disable: true },
    pseudo: { hover: ['.st-hover > *'], focusVisible: ['.st-focus > *'], active: ['.st-active > *'] },
  },
  render: () => {
    const states = ['default', 'hover', 'focus', 'active', 'disabled', 'loading'] as const
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(6, auto)', gap: 'var(--space-16) var(--space-24)', alignItems: 'center' }}>
        <span />
        {states.map((s) => <span key={s} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-fg-muted)' }}>{s}</span>)}
        {(['primary', 'ghost'] as const).map((v) => (
          <Fragment key={v}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-fg-muted)' }}>{v}</span>
            {states.map((s) => (
              <span key={`${v}-${s}`} className={`st-${s}`}>
                {s === 'disabled' || s === 'loading' ? (
                  <Button variant={v} disabled={s === 'disabled'} loading={s === 'loading'}>{v === 'primary' ? 'View Work' : 'Get in Touch'}</Button>
                ) : (
                  <Button href="/#projects" variant={v}>{v === 'primary' ? 'View Work' : 'Get in Touch'}</Button>
                )}
              </span>
            ))}
          </Fragment>
        ))}
      </div>
    )
  },
}
