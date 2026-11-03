import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import SectionLabel from './SectionLabel'

const meta = { title: 'UI/SectionLabel', component: SectionLabel, args: { children: 'Projects' } } satisfies Meta<typeof SectionLabel>
export default meta
export const Default: StoryObj<typeof meta> = {}
