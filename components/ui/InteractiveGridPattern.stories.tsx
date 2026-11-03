import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import InteractiveGridPattern from './InteractiveGridPattern'

const meta = {
  title: 'UI/InteractiveGridPattern',
  component: InteractiveGridPattern,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Hero background. Move the pointer over it; random cells light up every 200ms.' } },
  },
  decorators: [(Story) => <div style={{ position: 'relative', height: 600 }}><Story /></div>],
} satisfies Meta<typeof InteractiveGridPattern>
export default meta
export const Default: StoryObj<typeof meta> = {}
