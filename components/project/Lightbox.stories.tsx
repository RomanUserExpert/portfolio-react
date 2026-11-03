import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import Lightbox from './Lightbox'
import { projects } from '@/lib/projects'

const meta = {
  title: 'Project/Lightbox',
  component: Lightbox,
  args: { images: projects[0].images, startIndex: 0, onClose: fn(), onNavigate: fn() },
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, iframeHeight: 600 } } },
} satisfies Meta<typeof Lightbox>
export default meta
export const Open: StoryObj<typeof meta> = {}
