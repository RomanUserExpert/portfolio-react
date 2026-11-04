import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Dot from './Dot'

const meta = {
  title: 'UI/Dot',
  component: Dot,
  args: { active: false, 'aria-label': 'Slide 1' },
  parameters: { docs: { description: { component: 'Carousel slide indicator.' } } },
} satisfies Meta<typeof Dot>
export default meta
type Story = StoryObj<typeof meta>

export const Inactive: Story = {}
export const Active: Story = { args: { active: true } }
export const Row: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
      {[0, 1, 2, 3, 4].map((i) => <Dot key={i} active={i === 1} aria-label={`Slide ${i + 1}`} />)}
    </div>
  ),
}
