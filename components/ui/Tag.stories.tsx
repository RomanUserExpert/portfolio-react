import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Tag from './Tag'

const meta = { title: 'UI/Tag', component: Tag, args: { label: 'Fintech' } } satisfies Meta<typeof Tag>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Row: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
      {['Fintech', 'Enterprise SaaS', 'Interaction Design'].map((t) => <Tag key={t} label={t} />)}
    </div>
  ),
}
