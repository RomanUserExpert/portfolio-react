import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import ProcessRow from './ProcessRow'

const meta = {
  title: 'Sections/ProcessRow',
  component: ProcessRow,
  args: {
    num: '01',
    title: 'Discovery',
    description: 'Clarify goals, constraints, and what problem actually needs solving — before touching a single screen.',
  },
  parameters: { docs: { description: { component: 'One step of the Process section. Collapses to two columns below 768px.' } } },
  decorators: [(Story) => <div style={{ width: 896 }}><Story /></div>],
} satisfies Meta<typeof ProcessRow>
export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}
export const Mobile: Story = {
  decorators: [(Story) => <div style={{ width: 'auto' }}><Story /></div>],
  globals: { viewport: { value: 'mobile2', isRotated: false } },
}
