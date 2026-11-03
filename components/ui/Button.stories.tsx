import type { Meta, StoryObj } from '@storybook/nextjs-vite'
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
export const All: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-10)' }}>
      <Button href="/#projects" variant="primary">View Work</Button>
      <Button href="/#contact" variant="ghost">Get in Touch</Button>
    </div>
  ),
}
