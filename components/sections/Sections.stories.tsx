import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Hero from './Hero'
import Projects from './Projects'
import About from './About'
import Process from './Process'
import Contact from './Contact'

// Sections rely on `main > section` in globals.css for max-width, page padding and section padding.
const meta = {
  title: 'Sections',
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <main><Story /></main>],
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const HeroSection: Story = { name: 'Hero', render: () => <Hero /> }
export const ProjectsSection: Story = { name: 'Projects', render: () => <Projects /> }
export const AboutSection: Story = { name: 'About', render: () => <About /> }
export const ProcessSection: Story = { name: 'Process', render: () => <Process /> }
export const ContactSection: Story = { name: 'Contact', render: () => <Contact /> }
