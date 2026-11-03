import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Carousel from './Carousel'
import { projects } from '@/lib/projects'

const meta = {
  title: 'Project/Carousel',
  component: Carousel,
  args: { images: projects[0].images },
  parameters: { docs: { description: { component: 'Arrows, dots and swipe; the expand button opens Lightbox.' } } },
  decorators: [(Story) => <div style={{ width: 896 }}><Story /></div>],
} satisfies Meta<typeof Carousel>
export default meta
export const Default: StoryObj<typeof meta> = {}
