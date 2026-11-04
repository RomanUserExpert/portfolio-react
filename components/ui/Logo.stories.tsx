import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Logo from './Logo'

const meta = {
  title: 'UI/Logo',
  component: Logo,
  parameters: { docs: { description: { component: 'Spinning star mark + wordmark; links home. Used in Header.' } } },
} satisfies Meta<typeof Logo>
export default meta

export const Default: StoryObj<typeof meta> = {}
