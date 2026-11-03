import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HomePage from '@/app/page'

// The home page as app/layout.tsx renders it. The inner pages (/projects, /projects/[slug], /cv) are server pages
// with metadata and params; they are covered by their parts (ProjectCard, Carousel, Lightbox, sections).
const meta = { title: 'Pages', parameters: { layout: 'fullscreen' } } satisfies Meta
export default meta

export const Home: StoryObj<typeof meta> = {
  render: () => (
    <>
      <Header />
      <main>
        <HomePage />
      </main>
      <Footer />
    </>
  ),
}
