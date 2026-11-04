import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import ThemeToggle from './ThemeToggle'

const meta = {
  title: 'UI/ThemeToggle',
  component: ThemeToggle,
  parameters: { docs: { description: { component: 'Reads and writes `html[data-theme]` and localStorage. Clicking it re-themes the whole preview.' } } },
} satisfies Meta<typeof ThemeToggle>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
/** Forced with storybook-addon-pseudo-states. Mirrors Figma ThemeToggle `state=hover`. */
export const Hover: Story = { parameters: { pseudo: { hover: true } } }
