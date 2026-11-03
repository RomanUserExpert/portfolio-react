import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Header from './Header'

const meta = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Sticky; floats with a border and shadow after 16px of scroll, and always below 768px.' } },
  },
} satisfies Meta<typeof Header>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Scrolled: Story = {
  decorators: [(Story) => <div style={{ height: 1200 }}><Story /></div>],
  play: async () => {
    window.scrollTo(0, 200)
    window.dispatchEvent(new Event('scroll'))
  },
}
export const Mobile: Story = { globals: { viewport: { value: 'mobile2', isRotated: false } } }
