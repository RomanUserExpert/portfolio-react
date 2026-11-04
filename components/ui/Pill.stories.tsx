import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Pill from './Pill'

const meta = {
  title: 'UI/Pill',
  component: Pill,
  args: { label: 'Figma' },
  parameters: { docs: { description: { component: 'Tool pills in the About sidebar.' } } },
} satisfies Meta<typeof Pill>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
/** Forced with storybook-addon-pseudo-states. Mirrors Figma Pill `state=hover`. */
export const Hover: Story = { parameters: { pseudo: { hover: true } } }
export const Row: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', width: 240 }}>
      {['Figma', 'Miro', 'Photoshop', 'Webflow', 'Atomic Design', 'Dev Handoff'].map((t) => <Pill key={t} label={t} />)}
    </div>
  ),
}
