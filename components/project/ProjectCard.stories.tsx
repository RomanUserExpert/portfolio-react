import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import ProjectCard from './ProjectCard'
import { projects, getFeaturedProjects } from '@/lib/projects'

const [first] = projects
const meta = {
  title: 'Project/ProjectCard',
  component: ProjectCard,
  args: { slug: first.slug, title: first.title, tags: first.tags, description: first.description, cover: first.cover },
  decorators: [(Story) => <div style={{ width: 440 }}><Story /></div>],
} satisfies Meta<typeof ProjectCard>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const TwoTags: Story = { args: { tags: ['E-commerce', 'Branding'] } }
export const FeaturedGrid: Story = {
  decorators: [(Story) => <div style={{ width: 896 }}><Story /></div>],
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
      {getFeaturedProjects().map((p) => <ProjectCard key={p.slug} {...p} />)}
    </div>
  ),
}
